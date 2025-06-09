const authErrorMessages: Record<string, string> = {
    Configuration: "Internal server error. Please report to developers!",
    AccessDenied: "Access denied.",
    Verification: "This token has expired or already been used.",
    Default: "An unknown error occured. Please report to developers!",
};

export function getAuthErrorMessage(code: string) {
    return authErrorMessages[code] ?? `Unknown Error ${code}. Please report to developers!`;
}
