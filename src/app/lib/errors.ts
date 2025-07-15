import { toast } from "sonner";
import { ApiError as ApiErrorType, ApiRes } from "./db/types";

const AuthErrorMessages: Record<string, string> = {
    Configuration: "Internal server error. Please report to developers!",
    AccessDenied: "Access denied.",
    Verification: "This token has expired or already been used.",
    Default: "An unknown error occured. Please report to developers!",
};

export function getAuthErrorMessage(code: string) {
    return AuthErrorMessages[code] ?? `Unknown Error ${code}. Please report to developers!`;
}

export const ApiErrorMessages = {
    NotFound: {
        message: "Resource not found$:$.",
        code: 0,
    },
    NotAuthenticated: {
        message: "Not authenticated. Please log in and try again$:$.",
        code: 1,
    },
    NotAuthorized: {
        message: "You are not authorized to view this resouce$:$.",
        code: 2,
    },
    InvalidField: {
        message: "Invalid Field(s)$:$.",
        code: 3,
    },
    ServerError: {
        message: "Internal server error$:$. Please report!",
        code: 4,
    },
};

/**
 * Creates an error object for an API response.
 * @param k The error to use
 * @param info Additional information to go with the error.
 * @returns \{ error: { code, info } }
 */
export function ApiError(k: keyof typeof ApiErrorMessages, info?: string): ApiRes<any> {
    return {
        error: {
            code: ApiErrorMessages[k].code,
            info,
        },
    };
}

export function handleApiError(e: ApiErrorType, method: "toast" | "return" = "return") {
    const errorObj = Object.values(ApiErrorMessages).find(v => v.code === e.code);

    if (!errorObj) {
        const message = `Unknown error: ${e.code}${e.info ? `: ${e.info}` : ""}. Please report to developers!`;

        if (method === "toast")
            toast.error(message);

        return message;
    }

    const message = e.info ? errorObj.message.replace("$:$", `: ${e.info}`) : errorObj.message.replace("$:$", "");

    if (method === "toast")
        toast.error(message);

    return message;
}
