"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { between, eq } from "drizzle-orm";
import { analyticsTable } from "@/db/schema/analytics";
import { filamentLogTable, filamentTable } from "@/db/schema/filament";
import { accountsTable, usersTable } from "@/db/schema/user";
import { DBRes } from "./types";

export type AnalyticEntry = typeof analyticsTable.$inferSelect;

export async function getTotalUsers() {
    return {
        data: (await db.select().from(usersTable)).length,
    };
}

export async function getTotalFilament() {
    return {
        data: (await db.select().from(filamentTable)).length,
    };
}

export async function getTotalLogs() {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: (await db.select().from(filamentLogTable)).length,
    };
}

function toDbDate(date: Date) {
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    const monthStr = `${month < 10 ? 0 : ""}${month}`;
    const dayStr = `${day < 10 ? 0 : ""}${day}`;

    return `${date.getUTCFullYear()}-${monthStr}-${dayStr}`;
}

export async function getAnalyticEntry(date: Date): Promise<DBRes<AnalyticEntry | undefined>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    if (session.user.id! !== process.env.ADMIN_USER_ID)
        return { error: "Unauthorized" };

    let entry = (await db.select().from(analyticsTable)
        .where(eq(analyticsTable.date, toDbDate(date))))[0];

    return {
        data: entry,
    };
}

export async function getBatchAnalyticEntries(startDate: Date, endDate: Date): Promise<DBRes<AnalyticEntry[] | undefined>> {
    const session = await auth();

    if (!session || !session.user)
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

export async function getAuthenticationMethodStats(): Promise<DBRes<Record<string, number>>> {
    const session = await auth();

    if (!session || !session.user)
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
