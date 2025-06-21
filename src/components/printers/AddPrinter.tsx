import { randomFrom, randomInt } from "@/app/lib/random";
import Divider from "../Divider";
import Input from "../Input";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import { useState } from "react";
import Button from "../Button";
import { useObjectState } from "@/app/lib/hooks";
import { Printer } from "@/app/lib/db/printers";
import { DBCreateParams } from "@/app/lib/db/types";
import { app } from "@/app/lib/db";

const randomPrinters = [
    {
        name: "P1S",
        model: "Bambu Lab P1S",
    },
    {
        name: "H2D",
        model: "Bambu Lab H2D",
    },
    {
        name: "Mini",
        model: "Prusa Mini",
    },
    {
        name: "MK3S",
        model: "Prusa MK3S",
    },
    {
        name: "Ender 3",
        model: "Creality Ender 3",
    },
    {
        name: "CR-10",
        model: "Creality CR-10",
    },
];

export default function AddPrinterModal({ onAdd, ...props }: { onAdd: (printer: Printer) => void } & ModalProps) {
    const [randomPrinter, setRandomPrinter] = useState({
        ...randomFrom(randomPrinters),
        hours: randomInt(10, 10000),
    });

    const [printerData, setPrinterData] = useObjectState<DBCreateParams<Printer>>({
        name: "",
        model: "",
        hours: 0,
        attributes: "",
        filamentSlots: 0,
        loadedFilament: [],
        lastUsed: new Date(0),
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function addPrinter() {
        setLoading(true);

        const res = await app.printers.addPrinter(printerData);

        if (res.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        onAdd(res.data!);
        setLoading(false);
        props.onClose();
    }

    function reset() {
        setPrinterData({
            name: "",
            model: "",
            hours: 0,
            attributes: "",
            filamentSlots: 0,
            loadedFilament: [],
            lastUsed: new Date(0),
        });
        setLoading(false);
        setError("");
    }

    return (
        <Modal {...props} onClose={() => {
            reset(); props.onClose();
        }} title="Add Printer">
            <Subtext>Add a printer to start tracking individual prints and where your filament is.</Subtext>
            <Divider />

            <p>Name</p>
            <Input
                placeholder={randomPrinter.name}
                value={printerData.name}
                onChange={e => setPrinterData({ name: e.target.value })}
            />

            <p>Model</p>
            <Input
                placeholder={randomPrinter.model}
                value={printerData.model}
                onChange={e => setPrinterData({ model: e.target.value })}
            />

            <p>Total Print Hours</p>
            <Input
                type="number"
                placeholder={`${randomPrinter.hours}`}
                value={printerData.hours}
                onChange={e => setPrinterData({ hours: parseInt(e.target.value) })}
            />

            <p>Filament Slots</p>
            <Subtext>
                How many filament rolls this printer can print with at once.
            </Subtext>
            <Input
                type="number"
                placeholder="1"
                value={printerData.filamentSlots}
                onChange={e => setPrinterData({ filamentSlots: parseInt(e.target.value) })}
            />

            <p>Details</p>
            <Subtext>Any key details about your printer and how it functions.</Subtext>
            <Input
                placeholder="0.2mm nozzle, Core XY, Multi-extruder..."
                value={printerData.attributes}
                onChange={e => setPrinterData({ attributes: e.target.value })}
            />

            <ModalFooter error={error}>
                <Button onClick={addPrinter} loading={loading}>Add</Button>
            </ModalFooter>
        </Modal>
    );
}
