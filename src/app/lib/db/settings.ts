"use server";

import { auth } from "@/auth";
import { DBRes } from "./types";
import { userSettingsTable } from "@/db/schema/settings";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema/user";
import { UserSettings } from "@/db/types";

/**
 * Sets the user's username.
 * @param username The new username.
 * @returns Nothing if successful.
 */
export async function setUsername(username: string): Promise<DBRes<void>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    if (username.length > 12)
        return { error: "Username too long" };

    await db.update(usersTable).set({ name: username })
        .where(eq(usersTable.id, session.user.id!));

    return {};
}

/**
 * Creates userSettings for a user.
 * @returns The new userSettings.
 */
export async function createUserSettings(): Promise<DBRes<UserSettings>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: (await db.insert(userSettingsTable).values({
            userId: session.user.id!,
        })
            .returning())[0],
    };
}

/**
 * Gets the user's userSettings.
 * @returns The user's userSettings.
 */
export async function getUserSettings(): Promise<DBRes<UserSettings>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    let settings = (await db.select().from(userSettingsTable)
        .where(eq(userSettingsTable.userId, session.user.id!)))[0];

    if (!settings)
        settings = (await createUserSettings()).data!;

    return {
        data: settings,
    };
}

/**
 * Updates a user's userSettings.
 * @param newSettings The modified settings data. If a key isn't specified, it won't be modified.
 * @returns The modified settings data.
 */
export async function updateUserSettings(newSettings: Partial<UserSettings>): Promise<DBRes<UserSettings>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const userSettings = (await db.select().from(userSettingsTable)
        .where(eq(userSettingsTable.userId, session.user.id!)))[0];

    if (!userSettings) {
        console.error("no user settings???");
        return { error: "No user settings (internal server error)" };
    }

    if (userSettings.userId !== session.user.id)
        return { error: "Not your user settings" };

    return {
        data: (await db.update(userSettingsTable).set(newSettings)
            .where(eq(userSettingsTable.userId, session.user.id!))
            .returning())[0],
    };
}

/**
 * Deletes a user and all of it's data from Filatrack.
 * @returns Nothing if successful.
 */
export async function deleteUser(): Promise<DBRes<void>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    await db.delete(usersTable).where(eq(usersTable.id, session.user.id!));

    return { };
}

/**
 * Quick method to set if a user has seen a dialog.
 * @param id The ID of the dialog.
 * @returns Nothing if successful.
 */
export async function setUserSeenDialog(id: string): Promise<DBRes<void>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const userSettings = await getUserSettings();

    if (userSettings.error)
        return { error: userSettings.error };

    if ((userSettings.data?.seenDialogs ?? []).includes(id))
        return { };

    await db.update(userSettingsTable).set({
        seenDialogs: [...(userSettings.data!.seenDialogs ?? []), id],
    })
        .where(eq(userSettingsTable.userId, session.user.id!));

    return { };
}
