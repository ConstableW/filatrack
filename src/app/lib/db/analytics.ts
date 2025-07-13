"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { between, eq } from "drizzle-orm";
import { analyticsTable } from "@/db/schema/analytics";
import { filamentLogTable, filamentTable } from "@/db/schema/filament";
import { accountsTable, usersTable } from "@/db/schema/user";
import { DBRes } from "./types";
import { apiAuth } from "./helpers";

export type AnalyticEntry = typeof analyticsTable.$inferSelect;

/**
 * Gets the total number of users listed in the database.
 * @returns Number of users in database
 */
export async function getTotalUsers() {
    return {
        data: (await db.select().from(usersTable)).length,
    };
}

/**
 * Gets the total number of filament rolls listed in the database.
 * @returns Number of filament rolls in database
 */
export async function getTotalFilament() {
    return {
        data: (await db.select().from(filamentTable)).length,
    };
}

/**
 * Gets the total number of filament logs listed in the database.
 * @returns Number of logs in database
 */
export async function getTotalLogs() {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: (await db.select().from(filamentLogTable)).length,
    };
}

/**
 * Converts a standard date into a properly formatted SQL UTC date.
 * @param date The date in any timezone
 * @returns A UTC date properly formatted in SQL
 */
function toDbDate(date: Date) {
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    const monthStr = `${month < 10 ? 0 : ""}${month}`;
    const dayStr = `${day < 10 ? 0 : ""}${day}`;

    return `${date.getUTCFullYear()}-${monthStr}-${dayStr}`;
}

/**
 * Gets a single analytics entry by date
 * @param date The date to get the entry for
 * @returns The analytic entry
 */
export async function getAnalyticEntry(date: Date): Promise<DBRes<AnalyticEntry | undefined>> {
    const session = await apiAuth();

    if (!session)
        return { error: "Not authenticated" };

    if (session.user.id! !== process.env.ADMIN_USER_ID)
        return { error: "Unauthorized" };

    let entry = (await db.select().from(analyticsTable)
        .where(eq(analyticsTable.date, toDbDate(date))))[0];

    return {
        data: entry,
    };
}

/**
 * Gets many analytic entries at once in specified range (inclusive).
 * @param startDate The start date of range
 * @param endDate The end date of range
 * @returns All of the analytic entries in the range.
 */
export async function getBatchAnalyticEntries(startDate: Date, endDate: Date): Promise<DBRes<AnalyticEntry[] | undefined>> {
    const session = await apiAuth();

    if (!session)
        return { error: "Not authenticated" };

    if (session.user.id! !== process.env.ADMIN_USER_ID)
        return { error: "Unauthorized" };

    const start = toDbDate(startDate);
    const end = toDbDate(endDate);

    const entries = await db.select().from(analyticsTable)
        .where(between(analyticsTable.date, start, end));

    entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
        data: entries,
    };
}

/**
 * Adds or updates the analytic entry on a specific date.
 * @param date The date to add/update.
 * @param data What to increment any keys in the analytic entry by.
 * @returns The new/modified analytic entry
 */
export async function addOrUpdateAnalyticEntry(date: Date, data: Partial<Omit<AnalyticEntry, "date">>) {
    let entry = (await db.select().from(analyticsTable)
        .where(eq(analyticsTable.date, toDbDate(date))))[0];

    if (!entry) {
        entry = (await db.insert(analyticsTable).values(data)
            .returning())[0];
        console.log(`no entry for ${toDbDate(date)}, creating`);
    } else {
        const newData = data;

        for (const key in newData) {
            newData[key as keyof typeof data] = data[key as keyof typeof data]! + entry[key as keyof typeof data];
        }

        entry = (await db.update(analyticsTable).set(newData)
            .where(eq(analyticsTable.date, toDbDate(date)))
            .returning())[0];
    }

    return {
        data: entry,
    };
}

/**
 * Gets statistics for what authentication methods are used.
 * @returns Record of authentication type : number of users who used it
 */
export async function getAuthenticationMethodStats(): Promise<DBRes<Record<string, number>>> {
    const session = await apiAuth();

    if (!session)
        return { error: "Not authenticated" };

    if (session.user.id! !== process.env.ADMIN_USER_ID)
        return { error: "Unauthorized" };

    const allAccounts = await db.select().from(accountsTable);

    const providers: Record<string, number> = {};

    for (const acc of allAccounts)
        providers[acc.provider] = (providers[acc.provider] ?? 0) + 1;

    return {
        data: providers,
    };
}
