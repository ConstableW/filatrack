const errorMessages: Record<string, string> = {
    P2025: "This object has been deleted.",
};

export function getErrorMessage(code: string) {
    return errorMessages[code] ?? `Unknown Error ${code}. Please report to developers!`;
}
