import { useState } from "react";
import Button, { ButtonStyles } from "../Button";
import Divider from "../Divider";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import { FilamentSlotList } from "./Printer";
import { Filament, FilamentLog } from "@/db/types";
import FilamentEntry from "../filament/Filament";
import Input from "../Input";
import { Printer } from "@/app/lib/db/printers";
import { app } from "@/app/lib/db";
import { DBCreateParams } from "@/app/lib/db/types";

export default function LogPrintModal({ printer, onEdit, ...props }:
    { printer: Printer, onEdit?: (p: Printer) => void } & ModalProps) {
    const [printName, setPrintName] = useState("");
    const [printTime, setPrintTime] = useState("0");
    const [selectedFilament, setSelectedFilament] = useState<Filament[]>([]);
    const [filamentMasses, setFilamentMasses] = useState<Record<string, string>>({});

    const [step, setStep] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function logPrint() {
        setLoading(true);

        const logs: DBCreateParams<FilamentLog>[] = selectedFilament.map(f => ({
            filamentId: f.id,
            filamentUsed: parseInt(filamentMasses[f.id]),
            previousMass: f.currentMass,
            newMass: f.currentMass - parseInt(filamentMasses[f.id]),
            time: new Date(),
            print: null,
        } as FilamentLog));

        const res = await app.printers.logPrint({
            printerId: printer.id,
            name: printName,
            timeMinutes: Math.ceil(parseInt(printTime) * 60),
            totalMass: Object.values(filamentMasses).map(m => parseInt(m))
                .reduce((a, b) => a + b, 0),
            usedFilament: selectedFilament.map(f => f.id),
            logs,
        });

        if (res.error) {
            setError(`Error while creating print: ${res.error}`);
            setLoading(false);
            return;
        }

        props.onClose();
        // onEdit?.(res.data!);
    }

    return (
        <Modal {...props} title="Log Print">
            <Subtext>Log a print with this printer and the selected filament.</Subtext>
            <Divider />

            {step === 0 && <>
                <p>Select the filament used in this print</p>
                <FilamentSlotList
                    printer={printer}
                    selectable
                    values={selectedFilament}
                    onChange={setSelectedFilament}
                />
            </>}

            {step === 1 && <>
                <div className="flex flex-row gap-2">
                    {selectedFilament.map(f => (
                        <div className="flex flex-col gap-2 w-full items-center" key={f.id}>
                            <FilamentEntry filament={f} isPreview />
                            <Input
                                placeholder="Filament Used (g)"
                                type="number"
                                value={filamentMasses[f.id] ?? ""}
                                onChange={
                                    e => setFilamentMasses({ ...filamentMasses, [f.id]: e.target.value || "0" })
                                }
                            />
                        </div>
                    ))}
                </div>
            </>}

            {step === 2 && <>
                <Input label="Item Printed" value={printName} onChange={e => setPrintName(e.target.value)} />
                <Input label="Time To Print (hours)" type="number" value={printTime} onChange={e => setPrintTime(e.target.value)} />
            </>}

            <ModalFooter tip="Logging a print will also add history entries for each filament used in the print." error={error}>
                {step > 0 &&
                    <Button look={ButtonStyles.secondary} onClick={() => setStep(step - 1)}>Back</Button>
                }
                <Button
                    disabled={
                        (step === 2 && !printName || !printTime) ||
                        (step === 0 && !selectedFilament.length) ||
                        (step === 1 && (Object.values(filamentMasses).some(m => !m) || !Object.values(filamentMasses).length))
                    }
                    onClick={() => (step === 2 ? logPrint() : setStep(step + 1))}
                    loading={loading}
                >
                    {step === 2 ? "Log Print" : "Next"}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
