"use server";

import { FilamentLog, Print } from "@/db/types";
import { DBObjectParams, ApiRes } from "./types";
import { db } from "@/db/drizzle";
import { printsTable } from "@/db/schema/prints";
import { apiAuth } from "./helpers";
import { eq } from "drizzle-orm";
import { app } from ".";
import { getFilament } from "./filament";
import { ApiError, handleApiError } from "../errors";

export async function getAllPrints(): Promise<ApiRes<Print[]>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    return {
        data: await db.select().from(printsTable)
            .where(eq(printsTable.userId, session.user.id)),
    };
}

export async function addPrint(data: DBObjectParams<Print>): Promise<ApiRes<Print>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    if (data.name.length > 30)
        return ApiError("InvalidField", "Name too long");

    if (data.timeHours <= 0)
        return ApiError("InvalidField", "Print time must be >0");

    if (!Object.keys(data.filamentUsed).length || !!Object.values(data.filamentUsed).some(v => v <= 0))
        return ApiError("InvalidField", "Must have at least 1 filament used, and all filament needs usage >0.");

    const promises: Promise<ApiRes<FilamentLog>>[] = [];
    for (const k in data.filamentUsed) {
        const filament = await getFilament(k);
        if (filament.error)
            return ApiError("NotFound", "One or more filament was not found.");

        promises.push(app.filament.createFilamentLog({
            filamentId: k,
            filamentUsed: data.filamentUsed[k],
            time: new Date(),
            previousMass: filament.data!.currentMass,
            newMass: filament.data!.currentMass - data.filamentUsed[k],
        }));
    }

    const logData = await Promise.all(promises);

    if (logData.some(log => log.error))
        return ApiError("ServerError", `One or more logs could not be created: ${
            logData.map(log => log.error && handleApiError(log.error))
                .filter(Boolean)
                .join(", ")
        }`);

    return {
        data: (await db.insert(printsTable).values({
            ...data,
            userId: session.user!.id,
            totalFilamentUsed: Object.values(data.filamentUsed).reduce((prev, curr) => prev + curr),
        })
            .returning())[0],
    };
}

export async function deletePrint(id: string): Promise<ApiRes<void>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    const print = (await db.select().from(printsTable)
        .where(eq(printsTable.id, id)))[0];

    if (print.userId !== session.user.id)
        return ApiError("NotAuthorized");

    await db.delete(printsTable).where(eq(printsTable.id, id));

    return { };
}
