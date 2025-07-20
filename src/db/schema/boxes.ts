import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { id } from "./columns.helpers";
import { usersTable } from "./user";

export const boxesTable = pgTable("boxes", {
    ...id,

    userId: text().notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),

    name: text().notNull(),

    index: integer().notNull()
        .default(0),

    filamentIds: text().array()
        .notNull()
        .default([]),
});
