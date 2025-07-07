"use server";

import { auth } from "@/auth";
import { DBCreateParams, DBRes } from "./types";
import { db } from "@/db/drizzle";
import { filamentLogTable, filamentTable } from "@/db/schema/filament";
import { eq, inArray } from "drizzle-orm";
import { Filament, FilamentLog } from "@/db/types";
import { addOrUpdateAnalyticEntry } from "./analytics";

export async function getAllFilaments(): Promise<DBRes<Filament[]>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: await db.select().from(filamentTable)
            .where(eq(filamentTable.userId, session.user.id!)),
    };
}

export async function getFilament(id: string): Promise<DBRes<Filament | null>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    let filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, id)))[0];

    if (!filament.shortId)
        filament = (await db.update(filamentTable).set({ shortId: crypto.randomUUID().slice(0, 8) })
            .where(eq(filamentTable.id, filament.id))
            .returning())[0];

    return {
        data: filament,
    };
}

export async function getFilamentByShortId(shortId: string): Promise<DBRes<Filament | null>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.shortId, shortId)))[0];

    if (filament.userId !== session.user.id!)
        return { error: "Not your filament" };

    return {
        data: filament,
    };
}

export async function createFilament(filament: DBCreateParams<Omit<Filament, "shortId">>): Promise<DBRes<Filament>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    if (filament.name.length > 32)
        return { error: "Filament name too long" };

    if (filament.brand.length > 32)
        return { error: "Filament brand name too long" };

    addOrUpdateAnalyticEntry(new Date(), {
        filamentCreated: 1,
    });

    // very hacky fix for duplicating filament
    if ((filament as Filament).id)
        delete (filament as Partial<Filament>).id;

    if ((filament as Filament).shortId)
        delete (filament as Partial<Filament>).shortId;

    return {
        data: (await db.insert(filamentTable).values({
            ...filament,
            userId: session.user.id!,
        })
            .returning())[0],
    };
}

export async function createMultipleFilament(filament: DBCreateParams<Omit<Filament, "shortId">>, amount: number)
: Promise<DBRes<Filament[]>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    if (filament.name.length > 32)
        return { error: "Filament name too long" };

    if (filament.brand.length > 32)
        return { error: "Filament brand name too long" };

    if (amount > 50)
        return { error: "You can only make up to 100 copies" };

    addOrUpdateAnalyticEntry(new Date(), {
        filamentCreated: amount,
    });

    const newFilament: Filament[] = [];

    for (let i = 0; i < amount; i++) {
        newFilament.push((await db.insert(filamentTable).values({
            ...filament,
            userId: session.user.id!,
        })
            .returning())[0]);
    }

    return {
        data: newFilament,
    };
}

export async function editFilament(filamentId: string, newData: Partial<DBCreateParams<Filament>>): Promise<DBRes<Filament>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const oldFilament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, filamentId)))[0];

    if (!oldFilament)
        return { error: "This filament does not exist." };

    if (oldFilament.userId !== session.user.id!)
        return { error: "This is not your filament." };

    return {
        data: (await db.update(filamentTable).set({
            ...newData,
        })
            .where(eq(filamentTable.id, filamentId))
            .returning())[0],
    };
}

export async function deleteFilament(filamentId: string): Promise<DBRes<void>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, filamentId)))[0];

    if (!filament)
        return { error: "That filament does not exist." };

    if (filament.userId !== session.user.id)
        return { error: "This is not your filament." };

    await db.delete(filamentTable).where(eq(filamentTable.id, filamentId));

    return {};
}

export async function deleteFilaments(filamentIds: string[]): Promise<DBRes<void>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const filaments = await db.select().from(filamentTable)
        .where(inArray(filamentTable.id, filamentIds));

    for (const filament of filaments) {
        if (filament.userId !== session.user.id)
            return { error: "Not your filament" };
    }

    await db.delete(filamentTable).where(inArray(filamentTable.id, filamentIds));

    return {};
}

export async function reorderFilament(newFilamentList: Filament[]): Promise<DBRes<Filament[]>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    for (const f of newFilamentList)
        if (f.userId !== session.user.id)
            return { error: "Not your filament " };

    const res = await Promise.all(newFilamentList.map(async f => (await db.update(filamentTable).set({
        index: f.index,
    })
        .where(eq(filamentTable.id, f.id))
        .returning())[0]));

    return {
        data: res,
    };
}

export async function getFilamentLogs(filamentId: string): Promise<DBRes<FilamentLog[]>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, filamentId)))[0];

    if (!filament)
        return { error: "That filament does not exist." };

    if (filament.userId !== session.user.id)
        return { error: "This is not your filament." };

    return {
        data: await db.select().from(filamentLogTable)
            .where(eq(filamentLogTable.filamentId, filamentId)),
    };
}

export async function createFilamentLog(log: DBCreateParams<FilamentLog>): Promise<DBRes<FilamentLog>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, log.filamentId)))[0];

    if (!filament)
        return { error: "That filament does not exist." };

    if (filament.userId !== session.user.id)
        return { error: "This is not your filament." };

    addOrUpdateAnalyticEntry(new Date(), {
        logsCreated: 1,
    });

    return {
        data: (await db.insert(filamentLogTable).values({
            ...log,
        })
            .returning())[0],
    };
}

export async function deleteFilamentLog(log: DBCreateParams<FilamentLog>): Promise<DBRes<undefined>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, log.filamentId)))[0];

    if (!filament)
        return { error: "That filament does not exist." };

    if (filament.userId !== session.user.id)
        return { error: "This is not your filament." };

    await db.delete(filamentLogTable).where(eq(filamentLogTable.time, log.time));

    return { };
}

export async function editFilamentLog(newLog: Partial<DBCreateParams<FilamentLog>>): Promise<DBRes<FilamentLog>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, newLog.filamentId!)))[0];

    if (!filament)
        return { error: "That filament does not exist." };

    if (filament.userId !== session.user.id)
        return { error: "This is not your filament." };

    return {
        data: (await db.update(filamentLogTable).set(newLog)
            .where(eq(filamentLogTable.time, newLog.time!))
            .returning())[0],
    };
}
