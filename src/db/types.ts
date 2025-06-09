import { filamentLogTable, filamentTable } from "./schema/filament";

export type Filament = typeof filamentTable.$inferSelect
export type FilamentLog = typeof filamentLogTable.$inferSelect
