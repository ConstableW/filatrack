import { Filament } from "@/db/types";
import FilamentIcon from "../icons/Filament";
import Subtext from "../Subtext";
import { Box, Clock, Weight } from "lucide-react";
import { toDateString } from "@/lib/date";
import { grams } from "@/lib/units";
import FilamentDetailsModal from "./FilamentDetails";
import { useState } from "react";

export default function SmallFilamentPreview({ filament, noInteraction, className }:
    { filament: Filament, noInteraction?: boolean, className?: string }) {
    const [openModal, setOpenModal] = useState("");

    return (<>
        <div
            className={`p-2 py-1 rounded-lg w-full flex justify-between items-center flex-wrap gap-2 ${className} 
                ${!noInteraction && "border-2 border-transparent transition-all hover:border-primary cursor-pointer"}`}
            onClick={e => {
                if (noInteraction)
                    return;
                e.stopPropagation();
                setOpenModal("details");
            }}
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
