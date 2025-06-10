import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/drizzle";
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
        error: "/login",
    },
    callbacks: {
    },
    events: {
        async signIn({ user, account, profile, isNewUser }) {
            if (isNewUser)
                await db.insert(userSettingsTable).values({
                    userId: user.id!,
                });
        },
    },
});
