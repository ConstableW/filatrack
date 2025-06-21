"use server";

import { auth } from "@/auth";
import { DBRes } from "./types";
import { userSettingsTable } from "@/db/schema/settings";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema/user";
import { UserSettings } from "@/db/types";

export async function setUsername(username: string): Promise<DBRes<undefined>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    if (username.length > 12)
        return { error: "Username too long" };

    await db.update(usersTable).set({ name: username })
        .where(eq(usersTable.id, session.user.id!));

    return {};
}

export async function getUserSettings(): Promise<DBRes<UserSettings>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: (await db.select().from(userSettingsTable)
            .where(eq(userSettingsTable.userId, session.user.id!)))[0],
    };
}

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

export async function deleteUser(): Promise<DBRes<void>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    await db.delete(usersTable).where(eq(usersTable.id, session.user.id!));

    return { };
}

export async function hasUserSeenDialog(id: string): Promise<DBRes<boolean>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const userSettings = await getUserSettings();

    if (userSettings.error)
        return { error: userSettings.error };

    return {
        data: (userSettings.data!.seenDialogs ?? []).includes(id),
    };
}

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
    });

    return { };
}
