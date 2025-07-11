import { Filament } from "@/db/types";
import FilamentIcon from "../icons/Filament";
import Subtext from "../Subtext";
import { Box, Clock, Weight } from "lucide-react";
import { toDateString } from "@/app/lib/date";
import { grams } from "@/app/lib/units";
import FilamentDetailsModal from "./FilamentDetails";
import { useState } from "react";

export default function SmallFilamentPreview({ filament, noInteraction }: { filament: Filament, noInteraction?: boolean }) {
    const [openModal, setOpenModal] = useState("");

    return (<>
        <div
            className={`bg-bg-lighter p-2 py-1 rounded-lg w-full flex justify-between items-center flex-wrap gap-2
                ${!noInteraction && "border-2 border-transparent transition-all hover:border-primary cursor-pointer"}`}
            onClick={() => setOpenModal("details")}
        >
            <div className="flex gap-1 items-center">
                <FilamentIcon size={32} filament={filament} />
                <h4>{filament.name}</h4>
            </div>

            <Subtext>{filament.brand}</Subtext>

            <Subtext className="text-xs flex flex-row gap-1 items-center">
                <Weight size={16} /> {grams(filament.currentMass)} / {grams(filament.startingMass)}
            </Subtext>
            <Subtext className="text-xs flex flex-row gap-1 items-center">
                <Box size={16} /> {filament.material}
            </Subtext>
            <Subtext className="text-xs flex flex-row gap-1 items-center">
                <Clock size={16} />
                {filament.lastUsed.getTime() === 0 ? "Never" : toDateString(filament.lastUsed)}
            </Subtext>
        </div>

        <FilamentDetailsModal open={openModal === "details"} onClose={() => setOpenModal("")} filament={filament} />
    </>);
}
