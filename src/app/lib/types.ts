export type DBRes<T> = {
    data?: T;
    error?: string;
};

export type DBCreateParams<T> = Omit<T, "id" | "createdAt" | "updatedAt" | "userId">
