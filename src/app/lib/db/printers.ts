"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { printersTable, printsTable } from "@/db/schema/printers";
import { eq } from "drizzle-orm";
import { DBCreateParams, DBRes } from "./types";
import { Filament, FilamentLog } from "@/db/types";
import { filamentTable } from "@/db/schema/filament";
import { app } from ".";

export type Printer = typeof printersTable.$inferSelect;
export type Print = typeof printsTable.$inferSelect;

export async function getPrinter(id: string): Promise<DBRes<Printer>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: (await db.select().from(printersTable)
            .where(eq(printersTable.id, id)))[0],
    };
}

export async function getPrinters(): Promise<DBRes<Printer[]>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: await db.select().from(printersTable)
            .where(eq(printersTable.userId, session.user.id!)),
    };
}

export async function addPrinter(data: DBCreateParams<Printer>): Promise<DBRes<Printer>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: (await db.insert(printersTable).values({
            ...data,
            userId: session.user.id!,
        })
            .returning())[0],
    };
}

export async function getLoadedFilament(printerId: string): Promise<DBRes<Filament[]>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const printer = (await db.select().from(printersTable)
        .where(eq(printersTable.id, printerId)))[0];

    if (!printer)
        return { error: "This printer does not exist." };

    if (printer.userId !== session.user.id)
        return { error: "This is not your printer." };

    return {
        data: await db.select().from(filamentTable)
            .where(eq(filamentTable.printer, printerId)),
    };
}

export async function loadFilament(printerId: string, filamentId: string): Promise<DBRes<Filament>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const printer = (await db.select().from(printersTable)
        .where(eq(printersTable.id, printerId)))[0];

    if (!printer)
        return { error: "This printer does not exist." };

    if (printer.userId !== session.user.id)
        return { error: "This is not your printer." };

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, filamentId)))[0];

    if (!filament)
        return { error: "This filament does not exist." };

    if (filament.userId !== session.user.id)
        return { error: "This is not your filament." };

    const [_, newFilament] = await Promise.all([
        db.update(printersTable).set({ loadedFilament: [...printer.loadedFilament, filamentId] })
            .where(eq(printersTable.id, printerId)),
        db.update(filamentTable).set({ printer: printerId })
            .where(eq(filamentTable.id, filamentId))
            .returning(),
    ]);

    return { data: newFilament[0] };
}

export async function unloadFilament(printerId: string, filamentId: string): Promise<DBRes<Filament>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const printer = (await db.select().from(printersTable)
        .where(eq(printersTable.id, printerId)))[0];

    if (!printer)
        return { error: "This printer does not exist." };

    if (printer.userId !== session.user.id)
        return { error: "This is not your printer." };

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, filamentId)))[0];

    if (!filament)
        return { error: "This filament does not exist." };

    if (filament.userId !== session.user.id)
        return { error: "This is not your filament." };

    if (!filament.printer)
        return { error: "This filament is not loaded into a printer." };

    const newLoadedFilament = printer.loadedFilament.splice(printer.loadedFilament.indexOf(filamentId), 1);

    const [_, newFilament] = await Promise.all([
        db.update(printersTable).set({ loadedFilament: newLoadedFilament })
            .where(eq(printersTable.id, printerId)),
        db.update(filamentTable).set({ printer: null })
            .where(eq(filamentTable.id, filamentId))
            .returning(),
    ]);

    return { data: newFilament[0] };
}

export async function logPrint(data: DBCreateParams<Omit<Print, "logs">>
    & { logs: DBCreateParams<FilamentLog>[] }): Promise<DBRes<Print>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const printer = (await db.select().from(printersTable)
        .where(eq(printersTable.id, data.printerId)))[0];

    if (!printer)
        return { error: "This printer does not exist." };

    if (printer.userId !== session.user.id)
        return { error: "This is not your printer." };

    const print = (await db.insert(printsTable).values({
        ...data,
        logs: [],
        userId: session.user.id!,
    })
        .returning())[0];

    const logs = await Promise.all(data.logs.map(async log => app.filament.createFilamentLog({ ...log, print: print.id })));

    const errors = logs.map(l => l.error);
    if (errors.some(e => e)) {
        return { error: errors.filter(e => e).join(", ") };
    }

    const filament = await Promise.all(data.usedFilament.map(async fid => {
        const log = data.logs.find(l => l.filamentId === fid);
        if (!log)
            return { error: `Could not find filament log: ${fid}` };
        return await app.filament.editFilament(fid, {
            currentMass: log.newMass,
            lastUsed: new Date(),
        });
    }));

    const filamentEditErrors = filament.map(l => l.error);
    if (filamentEditErrors.some(e => e)) {
        return { error: filamentEditErrors.filter(e => e).join(", ") };
    }

    return {
        data: (await db.update(printsTable).set({ logs: logs.map(l => l.data!.id) })
            .where(eq(printsTable.id, print.id))
            .returning())[0],
    };
}
