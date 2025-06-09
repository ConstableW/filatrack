import { text, timestamp } from "drizzle-orm/pg-core";

export const id = {
    id: text().primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
};

export const timestamps = {
    updatedAt: timestamp(),
    createdAt: timestamp().defaultNow()
        .notNull(),
};
