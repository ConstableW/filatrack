"use server";

import { FilamentLog, Print } from "@/db/types";
import { DBCreateParams, DBRes } from "./types";
import { db } from "@/db/drizzle";
import { printsTable } from "@/db/schema/prints";
import { apiAuth } from "./helpers";
import { eq } from "drizzle-orm";
import { app } from ".";
import { getFilament } from "./filament";

export async function getAllPrints(): Promise<DBRes<Print[]>> {
    const session = await apiAuth();

    if (!session)
        return { error: "Not authenticated" };

    return {
        data: await db.select().from(printsTable)
            .where(eq(printsTable.userId, session.user.id)),
    };
}

export async function addPrint(data: DBCreateParams<Print>): Promise<DBRes<Print>> {
    const session = await apiAuth();

    if (!session)
        return { error: "Not authenticated" };

    if (data.name.length > 30)
        return { error: "Name too long (max 30 characters)" };

    if (data.timeHours <= 0)
        return { error: "Print time invalid (must be greater than 0)" };

    if (!Object.keys(data.filamentUsed).length || !!Object.values(data.filamentUsed).some(v => v <= 0))
        return { error: "Invalid/empty filament values (all usage values must be filled out and you must have at least 1 filament)" };

    const promises: Promise<DBRes<FilamentLog>>[] = [];
    for (const k in data.filamentUsed) {
        const filament = await getFilament(k);
        if (filament.error)
            return { error: `One or more filament do not exist: ${filament.error}` };

        promises.push(app.filament.createFilamentLog({
            filamentId: k,
            filamentUsed: data.filamentUsed[k],
            time: new Date(),
            previousMass: filament.data!.currentMass,
            newMass: filament.data!.currentMass - data.filamentUsed[k],
        }));
    }

    const logData = await Promise.all(promises);

    if (logData.some(log => log.error))
        return {
            error: `Error creating log: ${logData.map(log => log.error ?? "").filter(Boolean)
                .join(", ")}`,
        };

    return {
        data: (await db.insert(printsTable).values({
            ...data,
            userId: session.user!.id,
            totalFilamentUsed: Object.values(data.filamentUsed).reduce((prev, curr) => prev + curr),
        })
            .returning())[0],
    };
}

export async function deletePrint(id: string): Promise<DBRes<void>> {
    const session = await apiAuth();

    if (!session)
        return { error: "Not authenticated" };

    const print = (await db.select().from(printsTable)
        .where(eq(printsTable.id, id)))[0];

    if (print.userId !== session.user.id)
        return { error: "Not your print" };

    await db.delete(printsTable).where(eq(printsTable.id, id));

    return { };
}
