"use client";

import { app } from "@/app/lib/db";
import { Printer } from "@/app/lib/db/printers";
import { useDevice } from "@/app/lib/hooks";
import { sidebarWidth } from "@/app/lib/random";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import AddPrinterModal from "@/components/printers/AddPrinter";
import { PrinterEntry } from "@/components/printers/Printer";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PrintersPage() {
    const [isMobile, width] = useDevice();

    const [addPrinterModal, setAddPrinterModal] = useState(false);

    const [printers, setPrinters] = useState<Printer[]>([]);

    useEffect(() => {
        app.printers.getPrinters().then(r => {
            if (r.error)
                toast.error(`Could not fetch printers: ${r.error}`);

            setPrinters(r.data!);
        });
    }, []);

    return (<>
        <div
            className="bg-bg w-full md:rounded-lg md:rounded-b-none md:m-2 p-4 pt-2 mb-[75px] md:mb-0 h-full"
            style={{ marginLeft: (!width || isMobile) ? undefined : sidebarWidth }}
        >
            <div className="flex flex-row justify-between items-center">
                <h1>Your Printers</h1>
                <Button onClick={() => setAddPrinterModal(true)}><Plus /></Button>
            </div>
            <Divider />
            <div className="grid grid-cols-2 gap-2">
                {printers.map(p => <PrinterEntry printer={p} key={p.id} />)}
            </div>
        </div>

        <AddPrinterModal open={addPrinterModal} onClose={() => setAddPrinterModal(false)} onAdd={p => setPrinters([...printers, p])} />
    </>);
}
