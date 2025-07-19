import { pgTable, text } from "drizzle-orm/pg-core";
import { id } from "./columns.helpers";
import { usersTable } from "./user";

export const boxesTable = pgTable("boxes", {
    ...id,

    userId: text().notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),

    name: text().notNull(),

    filamentIds: text().array()
        .notNull()
        .default([]),
});
