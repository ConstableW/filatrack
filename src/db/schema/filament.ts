import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { id, timestamps } from "./columns.helpers";
import { usersTable } from "./user";

export const filamentTable = pgTable("filament", {
    ...id,

    userId: text().notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),

    name: text().notNull(),
    brand: text().notNull(),
    color: text().notNull(),
    material: text().notNull(),
    note: text().notNull(),

    currentMass: integer().notNull(),
    startingMass: integer().notNull(),

    lastUsed: timestamp().default(new Date(0))
        .notNull(),

    ...timestamps,
});

export const filamentLogTable = pgTable("filamentLog", {
    ...id,

    filamentId: text().notNull()
        .references(() => filamentTable.id, { onDelete: "cascade" }),
    filamentUsed: integer().notNull(),
    previousMass: integer().notNull(),
    newMass: integer().notNull(),
    time: timestamp().defaultNow()
        .notNull(),
});
