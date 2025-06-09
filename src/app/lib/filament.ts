"use server";

import { auth } from "@/auth";
import { DBCreateParams, DBRes } from "./types";
import { db } from "@/db/drizzle";
import { filamentLogTable, filamentTable } from "@/db/schema/filament";
import { eq } from "drizzle-orm";
import { Filament, FilamentLog } from "@/db/types";

export async function getAllFilaments(): Promise<DBRes<Filament[]>>  {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: await db.select().from(filamentTable)
            .where(eq(filamentTable.userId, session.user.id!)),
    };
}

export async function getFilament(id: string): Promise<DBRes<Filament | null>>  {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: (await db.select().from(filamentTable)
            .where(eq(filamentTable.id, id)))[0],
    };
}

export async function createFilament(filament: DBCreateParams<Filament>): Promise<DBRes<Filament>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: (await db.insert(filamentTable).values({
            ...filament,
            userId: session.user.id!,
        })
            .returning())[0],
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

export async function deleteFilament(filamentId: string): Promise<DBRes<Filament>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, filamentId)))[0];

    if (!filament)
        return { error: "That filament does not exist." };

    if (filament.userId !== session.user.id)
        return { error: "This is not your filament." };

    let error = undefined;

    await db.delete(filamentTable).where(eq(filamentTable.id, filamentId));

    return {
        error,
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

export async function logFilamentUse(log: DBCreateParams<FilamentLog>): Promise<DBRes<FilamentLog>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, log.filamentId)))[0];

    if (!filament)
        return { error: "That filament does not exist." };

    if (filament.userId !== session.user.id)
        return { error: "This is not your filament." };

    return {
        data: (await db.insert(filamentLogTable).values({
            ...log,
        }))[0],
    };
}
