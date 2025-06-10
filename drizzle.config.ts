import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/db/schema",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.NODE_ENV === "production" ? process.env.DATABASE_URL! : process.env.STAGING_DATABASE_URL!,
    },
    schemaFilter: ["public"],
    verbose: true,
    strict: true,
});
