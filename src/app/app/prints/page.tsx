"use client";

import { sidebarWidth } from "@/app/lib/constants";
import { app } from "@/app/lib/db";
import { useDevice } from "@/app/lib/hooks";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import Footer from "@/components/Footer";
import AddPrintModal from "@/components/prints/AddPrint";
import PrintEntry from "@/components/prints/Print";
import Skeleton from "@/components/Skeleton";
import { Filament, Print } from "@/db/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PrintsPage() {
    const [isMobile, width] = useDevice();

    const [openModal, setOpenModal] = useState("");

    const [allFilament, setAllFilament] = useState<Filament[]>([]);

    const [prints, setPrints] = useState<Print[]>();

    useEffect(() => {
        app.filament.getAllFilaments().then(res => {
            if (res.error)
                return void toast.error(`Failed to fetch filament: ${res.error}`);

            setAllFilament(res.data!);
        });

        app.prints.getAllPrints().then(res => {
            if (res.error)
                return void toast.error(`Failed to fetch prints: ${res.error}`);

            setPrints(res.data!);
        });
    }, []);

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
                {!prints ?
                    <>
                        <Skeleton height={150} />
                        <Skeleton height={150} />
                    </> :
                    prints.map(p => <PrintEntry
                        allFilament={allFilament}
                        print={p}
                        key={p.id}
                    />)
                }

                <div
                    className={`relative w-full bg-bg-light border-2 border-transparent text-gray-500
                    hover:border-primary transition-all h-[100px] rounded-lg cursor-pointer`}
                    onClick={() => setOpenModal("add")}
                >
                    <Plus className="absolute-center" size={32} />
                </div>
            </div>
        </div>

        {prints && <>
            <AddPrintModal
                open={openModal === "add"}
                onClose={() => setOpenModal("")}
                filament={allFilament}
                onAdd={p => setPrints([...prints, p])}
            />
        </>}

        <Footer />
    </>;
}
