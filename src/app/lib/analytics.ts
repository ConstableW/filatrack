"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { between, eq } from "drizzle-orm";
import { analyticsTable } from "@/db/schema/analytics";
import { filamentLogTable, filamentTable } from "@/db/schema/filament";
import { usersTable } from "@/db/schema/user";

export async function getTotalUsers() {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: (await db.select().from(usersTable)).length,
    };
}

export async function getTotalFilament() {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

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

export async function getAnalyticEntry(date: Date) {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    if (session.user.id! !== process.env.ADMIN_USER_ID)
        return { error: "Unauthorized" };

    let entry = (await db.select().from(analyticsTable)
        .where(eq(analyticsTable.date, toDbDate(date))))[0];

    if (!entry) {
        entry = (await db.insert(analyticsTable).values({ date: toDbDate(date) })
            .returning())[0];
        console.log(`no entry for ${toDbDate(date)}, creating`);
    }

    return {
        data: entry,
    };
}

export async function getBatchAnalyticEntries(startDate: Date, endDate: Date) {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    if (session.user.id! !== process.env.ADMIN_USER_ID)
        return { error: "Unauthorized" };

    const start = toDbDate(startDate);
    const end = toDbDate(endDate);

    const exisitingEntries = await db.select().from(analyticsTable)
        .where(between(analyticsTable.date, start, end));

    const existingDates = new Set(exisitingEntries.map(entry => entry.date));

    const entries: typeof analyticsTable.$inferSelect[] = [];
    const entriesToInsert: Date[] = [];

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dbDate = toDbDate(currentDate);

        if (!existingDates.has(dbDate))
            entriesToInsert.push(currentDate);
        else
            entries.push(exisitingEntries.find(entry => entry.date === dbDate)!);

        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }

    if (entriesToInsert.length > 0) {
        console.log(`inserting ${entriesToInsert.length} new entries`);

        const newEntries = await db.insert(analyticsTable).values(entriesToInsert.map(date => ({ date: toDbDate(date) })))
            .returning();

        entries.push(...newEntries);
    }

    entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
        data: entries,
    };
}

export async function addOrUpdateAnalyticEntry(date: Date, data: Omit<typeof analyticsTable.$inferInsert, "date">) {
    data = {
        ...data,
        totalUsers: (await getTotalUsers()).data!,
        totalFilament: (await getTotalFilament()).data!,
        totalLogs: (await getTotalLogs()).data!,
    };

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
            .returning())[0];
    }

    return {
        data: entry,
    };
}
