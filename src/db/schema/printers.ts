import { AnyPgColumn, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { id, timestamps } from "./columns.helpers";
import { usersTable } from "./user";
import { filamentLogTable, filamentTable } from "./filament";

export const printersTable = pgTable("printers", {
    ...id,

    userId: text().notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),

    name: text().notNull(),
    model: text().notNull(),
    hours: integer().notNull(),
    lastUsed: timestamp().notNull()
        .$defaultFn(() => new Date(0)),
    attributes: text().notNull(),

    filamentSlots: integer().notNull()
        .default(1),

    loadedFilament: text().references((): AnyPgColumn => filamentTable.id)
        .array()
        .notNull(),

    ...timestamps,
});

// Each print has a filament log, but each log doesn't need a print.
// Basically, prints are associated with printers, and logs are associated with filaments.
export const printsTable = pgTable("prints", {
    ...id,

    userId: text().notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),

    name: text().notNull(),
    timeMinutes: integer().notNull(),
    totalMass: integer().notNull(),

    printerId: text().notNull()
        .references((): AnyPgColumn => printersTable.id, { onDelete: "cascade" }),
    logs: text().references((): AnyPgColumn => filamentLogTable.id)
        .array()
        .notNull(),
    usedFilament: text().references((): AnyPgColumn => filamentTable.id)
        .array()
        .notNull(),
});
