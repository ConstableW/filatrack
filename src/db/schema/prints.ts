import { doublePrecision, integer, pgTable, text } from "drizzle-orm/pg-core";
import { id, timestamps } from "./columns.helpers";
import { usersTable } from "./user";

export const printsTable = pgTable("prints", {
    ...id,

    userId: text().notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),

    name: text().notNull(),

    timeHours: doublePrecision().notNull(),

    totalFilamentUsed: integer().notNull(),

    filamentUsed: text().array()
        .notNull()
        .default([]),

    ...timestamps,
});
