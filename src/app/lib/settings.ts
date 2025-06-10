"use server";

import { auth } from "@/auth";
import { DBRes } from "./types";
import { userSettingsTable } from "@/db/schema/settings";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema/user";
import { UserSettings } from "@/db/types";

export async function getUserId(): Promise<DBRes<string>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return { data: session.user.id };
}

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

export async function getUserSettings(userId?: string): Promise<DBRes<UserSettings>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: (await db.select().from(userSettingsTable)
            .where(eq(userSettingsTable.userId, userId ?? session.user.id!)))[0],
    };
}

export async function setUserSettings(userId: string, newSettings: Partial<UserSettings>): Promise<DBRes<UserSettings>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const userSettings = (await db.select().from(userSettingsTable)
        .where(eq(userSettingsTable.userId, userId)))[0];

    if (!userSettings) {
        console.error("no user settings???");
        return { error: "No user settings (internal server error)" };
    }

    if (userSettings.userId !== session.user.id)
        return { error: "Not your user settings" };

    return {
        data: (await db.update(userSettingsTable).set(newSettings)
            .where(eq(userSettingsTable.userId, userId))
            .returning())[0],
    };
}

export async function deleteUser() {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    await db.delete(usersTable).where(eq(usersTable.id, session.user.id!));
}
