"use server";

import { db } from "@/db/drizzle";
import { eq, inArray } from "drizzle-orm";
import { ApiError } from "../errors";
import { apiAuth } from "./helpers";
import { ApiRes, DBObjectParams } from "./types";
import { Box, Filament } from "@/db/types";
import { boxesTable } from "@/db/schema/boxes";
import { addOrUpdateAnalyticEntry } from "./analytics";
import { filamentTable } from "@/db/schema/filament";

/**
 * Gets all boxes of the current user.
 * @returns All the boxes a user has created
 */
export async function getAllBoxes(): Promise<ApiRes<Box[]>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    return {
        data: await db.select().from(boxesTable)
            .where(eq(boxesTable.userId, session.user.id)),
    };
}

/**
 * Gets a box by its ID.
 * @returns The specified box
 */
export async function getBox(id: string): Promise<ApiRes<Box>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    const box = (await db.select().from(boxesTable)
        .where(eq(boxesTable.id, id)))[0];

    if (!box)
        return ApiError("NotFound");

    if (box.userId !== session.user.id)
        return ApiError("NotAuthorized");

    return {
        data: box,
    };
}

export async function createBox(data: DBObjectParams<Box>): Promise<ApiRes<Box>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    if (data.name.length > 48)
        return ApiError("InvalidField", "Name too long");

    if (data.name.length === 0)
        return ApiError("InvalidField", "You must name the box");

    addOrUpdateAnalyticEntry(new Date(), {
        boxesCreated: 1,
    });

    return {
        data: (await db.insert(boxesTable).values({
            ...data,
            userId: session.user.id,
        })
            .returning())[0],
    };
}

export async function editBox(boxId: string, data: Partial<DBObjectParams<Box>>): Promise<ApiRes<Box>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    if (data.name && data.name.length > 48)
        return ApiError("InvalidField", "Name too long");

    if (data.name && data.name.length === 0)
        return ApiError("InvalidField", "You must name the box");

    return {
        data: (await db.update(boxesTable).set({
            ...data,
            userId: session.user.id,
        })
            .where(eq(boxesTable.id, boxId))
            .returning())[0],
    };
}

export async function addFilament(boxId: string, filamentId: string): Promise<ApiRes<{ box: Box, filament: Filament }>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    const box = (await db.select().from(boxesTable)
        .where(eq(boxesTable.id, boxId)))[0];

    if (box.userId !== session.user.id)
        return ApiError("NotAuthorized");

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, filamentId)))[0];

    if (filament.userId !== session.user.id)
        return ApiError("NotAuthorized");

    return {
        data: {
            box: (await db.update(boxesTable).set({
                filamentIds: [...box.filamentIds, filamentId],
            })
                .where(eq(boxesTable.id, box.id))
                .returning())[0],

            filament: (await db.update(filamentTable).set({ box: box.id })
                .where(eq(filamentTable.id, filamentId))
                .returning())[0],
        },
    };
}

export async function addFilaments(boxId: string, filamentIds: string[]): Promise<ApiRes<{ box: Box, filament: Filament[] }>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    const box = (await db.select().from(boxesTable)
        .where(eq(boxesTable.id, boxId)))[0];

    if (box.userId !== session.user.id)
        return ApiError("NotAuthorized");

    const filaments = await db.select().from(filamentTable)
        .where(inArray(filamentTable.id, filamentIds));

    for (const f of filaments)
        if (f.userId !== session.user.id)
            return ApiError("NotAuthorized");

    return {
        data: {
            box: (await db.update(boxesTable).set({
                filamentIds: [...box.filamentIds, ...filamentIds],
            })
                .where(eq(boxesTable.id, box.id))
                .returning())[0],

            filament: await db.update(filamentTable).set({ box: box.id })
                .where(inArray(filamentTable.id, filamentIds))
                .returning(),
        },
    };
}

export async function removeFilament(boxId: string, filamentId: string): Promise<ApiRes<{ box: Box, filament: Filament }>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    const box = (await db.select().from(boxesTable)
        .where(eq(boxesTable.id, boxId)))[0];

    if (box.userId !== session.user.id)
        return ApiError("NotAuthorized");

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, filamentId)))[0];

    if (filament.userId !== session.user.id)
        return ApiError("NotAuthorized");

    if (filament.box !== box.id)
        return ApiError("InvalidField", "This filament isn't in this box");

    return {
        data: {
            box: (await db.update(boxesTable).set({
                filamentIds: box.filamentIds.filter(id => id !== filamentId),
            })
                .where(eq(boxesTable.id, box.id))
                .returning())[0],

            filament: (await db.update(filamentTable).set({ box: null })
                .where(eq(filamentTable.id, filament.id))
                .returning())[0],
        },
    };
}

export async function removeFilaments(boxId: string, filamentIds: string[]): Promise<ApiRes<{ box: Box, filament: Filament[] }>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    const box = (await db.select().from(boxesTable)
        .where(eq(boxesTable.id, boxId)))[0];

    if (box.userId !== session.user.id)
        return ApiError("NotAuthorized");

    const filaments = await db.select().from(filamentTable)
        .where(inArray(filamentTable.id, filamentIds));

    for (const f of filaments) {
        if (f.userId !== session.user.id)
            return ApiError("NotAuthorized");

        if (f.box !== box.id)
            return ApiError("InvalidField", "This filament isn't in this box");
    }

    return {
        data: {
            box: (await db.update(boxesTable).set({
                filamentIds: box.filamentIds.filter(id => !filamentIds.includes(id)),
            })
                .where(eq(boxesTable.id, box.id))
                .returning())[0],

            filament: await db.update(filamentTable).set({ box: null })
                .where(inArray(filamentTable.id, filamentIds))
                .returning(),
        },
    };
}

/**
 * Delete a box
 * @param boxId The box to delete
 * @returns Nothing if successful.
 */
export async function deleteBox(boxId: string): Promise<ApiRes<void>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    const box = (await db.select().from(boxesTable)
        .where(eq(boxesTable.id, boxId)))[0];

    if (box.userId !== session.user.id)
        return ApiError("NotAuthorized");

    await db.delete(boxesTable).where(eq(boxesTable.id, box.id));

    return {};
}

/**
 * Changes the `index` key of a list of boxes to match the order of the array.
 * @param newBoxList The new list of boxes in the new order.
 * @returns The new box list with `index` updated.
 */
export async function reorderBoxes(newBoxList: Box[]): Promise<ApiRes<Box[]>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    for (const b of newBoxList)
        if (b.userId !== session.user.id)
            return ApiError("NotAuthorized");

    const res = await Promise.all(newBoxList.map(async f => (await db.update(boxesTable).set({
        index: f.index,
    })
        .where(eq(boxesTable.id, f.id))
        .returning())[0]));

    return {
        data: res,
    };
}
