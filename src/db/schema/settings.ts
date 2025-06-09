import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const userSettingsTable = pgTable("userSettings", {
    userId: text("userId")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),

    timeFormat: text().default("12-hour")
        .notNull(),
    dateFormat: text().default("mm/dd/yyyy")
        .notNull(),

    defaultMaterial: text().default("PLA")
        .notNull(),
    defaultMass: integer().default(1000)
        .notNull(),
});
