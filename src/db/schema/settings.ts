import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const userSettingsTable = pgTable("userSettings", {
    userId: text("userId")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" })
        .primaryKey(),

    additionalFilamentModifier: integer().default(0)
        .notNull(),

    timeFormat: text().default("12-hour")
        .notNull(),
    dateFormat: text().default("mm/dd/yyyy")
        .notNull(),

    defaultMaterial: text().default("PLA")
        .notNull(),
    defaultMass: integer().default(1000)
        .notNull(),

    seenSearchTips: boolean().default(false)
        .notNull(),
    seenDialogs: text().array()
        .default([]),
});
