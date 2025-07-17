import { isProd } from "@/lib/constants";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/db/schema",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: isProd ? process.env.DATABASE_URL! : process.env.STAGING_DATABASE_URL!,
    },
    schemaFilter: ["public"],
    verbose: true,
    strict: true,
});
