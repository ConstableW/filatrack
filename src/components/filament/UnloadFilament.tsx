import React, { useEffect, useState } from "react";
import Divider from "../Divider";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import Button from "../Button";
import FilamentEntry from "./Filament";
import { ArrowRight } from "lucide-react";
import Spinner from "../Spinner";
import { MiniPrinterEntry } from "../printers/Printer";
import { Filament } from "@/db/types";
import { app } from "@/app/lib/db";
import { Printer } from "@/app/lib/db/printers";
import { toast } from "sonner";

export default function UnloadFilamentModal({ filament, onEdit, ...props }:
    { filament: Filament, onEdit?: (f: Filament) => void } & ModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [printer, setPrinter] = useState<Printer>();

    async function unloadFilament() {
        if (!filament.printer) {
            setError("This filament is not loaded.");
            setLoading(false);
            return;
        }

        setLoading(true);

        const res = await app.printers.unloadFilament(filament.printer!, filament.id);

        if (res.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        props.onClose();
        setLoading(false);
        setError("");
        onEdit?.(res.data!);
    }

    useEffect(() => {
        if (!props.open)
            return;

        app.printers.getPrinter(filament.printer!).then(r => {
            if (r.error)
                return void toast.error(`Error retrieving printer: ${r.error}`);

            setPrinter(r.data!);
        });
    }, [props.open]);

    return (
        <Modal {...props} title="Unload Filament">
            <Subtext>Unload this filament from a printer.</Subtext>
            <Divider />

            {!printer && <Spinner />}
            {printer && <div className="w-full flex flex-row gap-2 items-center">
                {printer && <MiniPrinterEntry printer={printer} />}
                <ArrowRight size={48} />
                <FilamentEntry filament={filament} isPreview />
            </div>}

            <ModalFooter error={error}>
                <Button loading={loading} onClick={unloadFilament}>Unload</Button>
            </ModalFooter>
        </Modal>
    );
}
