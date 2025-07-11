"use client";

import { sidebarWidth } from "@/app/lib/constants";
import { useDevice } from "@/app/lib/hooks";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import AddPrintModal from "@/components/prints/AddPrint";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function PrintsPage() {
    const [isMobile, width] = useDevice();

    const [openModal, setOpenModal] = useState("");

    return <>
        <div
            className={"bg-bg w-full p-4 pt-2 mb-[75px] md:mb-0 h-full pb-20"}
            style={{ marginLeft: (!width || isMobile) ? undefined : sidebarWidth }}
        >
            <div className="flex flex-row items-center justify-between mt-1">
                <h2>Your Prints</h2>
                <Button
                    onClick={() => setOpenModal("add")}
                >
                    <Plus size={32} />
                </Button>
            </div>

            <Divider />

            <div className="flex flex-col gap-2 w-full">
                <div
                    className={`relative w-full bg-bg-light border-2 border-transparent text-gray-500
                    hover:border-primary transition-all h-[100px] rounded-lg cursor-pointer`}
                    onClick={() => setOpenModal("add")}
                >
                    <Plus className="absolute-center" size={32} />
                </div>
            </div>
        </div>

        <AddPrintModal open={openModal === "add"} onClose={() => setOpenModal("")} />
    </>;
}
