import { auth } from "@/auth";

export type ApiSession = {
    user: {
        id: string;
        name: string;
        email?: string | null;
        image?: string | null;
    };
    expires: string;
}

export async function apiAuth(): Promise<ApiSession | null> {
    const session = await auth();

    if (!session || !session.user || !session.user.id)
        return null;

    return session as ApiSession;
}
