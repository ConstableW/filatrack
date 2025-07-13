import { Clock, Box, Calendar } from "lucide-react";
import Divider from "../Divider";
import SmallFilamentPreview from "../filament/SmallFilamentPreview";
import Subtext from "../Subtext";
import { Filament, Print } from "@/db/types";
import { grams } from "@/app/lib/units";
import { toDateString } from "@/app/lib/date";
import { useState } from "react";
import PrintDetailsModal from "./PrintDetails";

export default function PrintEntry({ print, allFilament }: { print: Print, allFilament: Filament[] }) {
    const [openModal, setOpenModal] = useState("");

    return (<>
        <div
            className={`flex w-full bg-bg-light rounded-lg p-2 cursor-pointer
                     border-2 border-transparent transition-all hover:border-primary`}
        >
            <div
                className="w-full"
                onClick={() => setOpenModal("details")}
            >
                <h3>{print.name}</h3>
                <div className="flex flex-col gap-1">
                    <Subtext className="flex gap-1 items-center">
                        <Clock /> {print.timeHours} hours
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

            <div className="w-full flex flex-col gap-1">
                {Object.keys(print.filamentUsed).map(k => <SmallFilamentPreview
                    filament={allFilament.find(f => f.id === k)!}
                    key={k}
                    className="bg-bg-lighter"
                />)}
            </div>
        </div>

        <PrintDetailsModal
            open={openModal === "details"}
            onClose={() => setOpenModal("")}
            print={print}
        />
    </>);
}
