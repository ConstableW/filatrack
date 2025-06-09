const errorMessages: Record<string, string> = {
};

export function getErrorMessage(code: string) {
    return errorMessages[code] ?? `Unknown Error ${code}. Please report to developers!`;
}
