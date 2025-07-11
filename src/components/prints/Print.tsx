import { Clock, Box, Calendar } from "lucide-react";
import Divider from "../Divider";
import { randomFilament } from "../filament/RandomizedFilament";
import SmallFilamentPreview from "../filament/SmallFilamentPreview";
import Subtext from "../Subtext";
import { Print } from "@/db/types";
import { grams } from "@/app/lib/units";
import { toDateString } from "@/app/lib/date";

export default function PrintEntry({ print }: { print: Print }) {
    return (
        <div className={`flex w-full bg-bg-light rounded-lg p-2 cursor-pointer
                     border-2 border-transparent transition-all hover:border-primary`}>
            <div className="w-full">
                <h3>{print.name}</h3>
                <div className="flex flex-col gap-1">
                    <Subtext className="flex gap-1 items-center">
                        <Clock /> {print.timeHours} hours {print.timeMinutes} minutes
                    </Subtext>
                    <Subtext className="flex gap-1 items-center">
                        <Box /> {grams(print.totalFilamentUsed)}
                    </Subtext>
                    <Subtext className="flex gap-1 items-center">
                        <Calendar /> {toDateString(new Date(print.createdAt))}
                    </Subtext>
                </div>
            </div>

            <Divider vertical />

            <div className="w-full flex flex-col gap-2">
                <SmallFilamentPreview filament={randomFilament()} />
            </div>
        </div>
    );
}
