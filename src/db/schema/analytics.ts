import { date, integer, pgTable } from "drizzle-orm/pg-core";

export const analyticsTable = pgTable("analytics", {
    date: date().defaultNow()
        .unique()
        .notNull()
        .primaryKey(),

    signUps: integer().default(0)
        .notNull(),

    filamentCreated: integer().default(0)
        .notNull(),

    logsCreated: integer().default(0)
        .notNull(),

    boxesCreated: integer().default(0)
        .notNull(),
});
