"use server";

import { prisma } from "@/prisma";
import { Filament, FilamentLog } from "../../../prisma/generated/prisma";
import { auth } from "@/auth";
import { DBCreateParams, DBRes } from "./types";
import { getErrorMessage } from "./errors";

export async function getAllFilaments(): Promise<DBRes<Filament[]>>  {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: await prisma.filament.findMany({
            where: {
                userId: session.user.id!,
            },
        }),
    };
}

export async function getFilament(id: string): Promise<DBRes<Filament | null>>  {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: await prisma.filament.findFirst({
            where: {
                id,
            },
        }),
    };
}

export async function createFilament(filament: DBCreateParams<Filament>): Promise<DBRes<Filament>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: await prisma.filament.create({
            data: {
                ...filament,
                userId: session.user.id!,
            },
        }),
    };
}

export async function editFilament(filamentId: string, newData: Partial<DBCreateParams<Filament>>): Promise<DBRes<Filament>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const oldFilament = await prisma.filament.findFirst({
        where: {
            id: filamentId,
        },
    });

    if (!oldFilament)
        return { error: "This filament does not exist." };

    if (oldFilament.userId !== session.user.id!)
        return { error: "This is not your filament." };

    return {
        data: await prisma.filament.update({
            where: {
                id: filamentId,
            },
            data: {
                ...newData,
                userId: session.user.id!,
            },
        }),
    };
}

export async function deleteFilament(filamentId: string): Promise<DBRes<Filament>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    const filament = await prisma.filament.findFirst({
        where: {
            id: filamentId,
        },
    });

    if (!filament)
        return { error: "That filament does not exist." };

    if (filament.userId !== session.user.id)
        return { error: "This is not your filament." };

    let error = undefined;

    await prisma.filamentLog.deleteMany({
        where: {
            filamentId,
        },
    });

    await prisma.filament.delete({
        where: {
            id: filamentId,
            userId: session.user.id!,
        },
    }).catch(e => {
        console.log(JSON.stringify(e));
        error = getErrorMessage(e.code);
    });

    return {
        error,
    };
}

export async function getFilamentLogs(filamentId: string): Promise<DBRes<FilamentLog[]>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    return {
        data: await prisma.filamentLog.findMany({
            where: {
                filament: {
                    userId: session.user.id!,
                },
                filamentId,
            },
        }),
    };
}

export async function logFilamentUse(log: DBCreateParams<FilamentLog>): Promise<DBRes<FilamentLog>> {
    const session = await auth();

    if (!session || !session.user)
        return { error: "Not authenticated" };

    let error = "";
    const data = await prisma.filamentLog.create({
        data: {
            ...log,
        },
    }).catch(e => {
        console.log(JSON.stringify(e));
        error = getErrorMessage(e.code);
    });

    return {
        data: data ?? undefined,
        error,
    };
}
