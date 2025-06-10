import { filamentLogTable, filamentTable } from "./schema/filament";
import { userSettingsTable } from "./schema/settings";

export type Filament = typeof filamentTable.$inferSelect
export type FilamentLog = typeof filamentLogTable.$inferSelect

export type UserSettings = typeof userSettingsTable.$inferSelect;
