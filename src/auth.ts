import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/drizzle";
import { eq } from "drizzle-orm";
import { userSettingsTable } from "./db/schema/settings";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db),
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
        }),
    ],
    secret: process.env.AUTH_SECRET!,
    trustHost: true,
    debug: process.env.NODE_ENV !== "production",
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user, account, profile }): Promise<boolean> {
            const currentUserSettings = await db.select().from(userSettingsTable)
                .where(eq(userSettingsTable.userId, user.id!));

            if (currentUserSettings.length === 0)
                await db.insert(userSettingsTable).values({
                    userId: user.id!,
                });

            return true;
        },
    },
});
