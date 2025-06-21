import React, { useEffect, useState } from "react";
import Divider from "../Divider";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Select from "../Select";
import Subtext from "../Subtext";
import Button from "../Button";
import FilamentEntry from "./Filament";
import { ArrowRight } from "lucide-react";
import { getPrinters, Printer } from "@/app/lib/db/printers";
import { toast } from "sonner";
import Spinner from "../Spinner";
import { MiniPrinterEntry } from "../printers/Printer";
import { Filament } from "@/db/types";
import { app } from "@/app/lib/db";

export default function LoadFilamentModal({ filament, onEdit, ...props }:
    { filament: Filament, onEdit?: (f: Filament) => void } & ModalProps) {
    const [printers, setPrinters] = useState<Printer[]>([]);
    const [selectedPrinter, setSelectedPrinter] = useState("");

    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        if (!props.open)
            return;

        getPrinters().then(r => {
            setLoading(false);

            if (r.error)
                return void toast.error(`Error while getting printers: ${r.error}`);

            setPrinters(r.data!);
        });
    }, [props.open]);

    async function loadFilament() {
        setButtonLoading(true);

        const res = await app.printers.loadFilament(selectedPrinter, filament.id);

        if (res.error) {
            setError(res.error);
            setButtonLoading(false);
            return;
        }

        props.onClose();
        setButtonLoading(false);
        setSelectedPrinter("");
        setError("");
        onEdit?.(res.data!);
    }

    return (
        <Modal {...props} title="Load Filament">
            <Subtext>Tell Filatrack that you've loaded this filament into a printer.</Subtext>
            <Divider />

            {loading && <Spinner />}
            {!loading && <div className="w-full flex flex-row gap-2 items-center">
                <FilamentEntry filament={filament} isPreview />

                <ArrowRight size={48} />

                <Select
                    className="w-full"
                    value={selectedPrinter}
                    onChange={setSelectedPrinter}
                    placeholder="Select a Printer"
                    options={printers.reduce((acc, printer) => {
                        acc[printer.id] = <MiniPrinterEntry printer={printer} />;
                        return acc;
                    }, {} as Record<string, React.ReactNode>)}
                />
            </div>}

            <ModalFooter error={error}>
                <Button loading={buttonLoading} onClick={loadFilament}>Load</Button>
            </ModalFooter>
        </Modal>
    );
}
