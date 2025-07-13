"use client";

import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import Divider from "../Divider";
import Input from "../Input";
import { Filament, Print } from "@/db/types";
import Button, { ButtonStyles } from "../Button";
import { useObjectState } from "@/app/lib/hooks";
import { DBCreateParams } from "@/app/lib/db/types";
import { SelectMultiple } from "../Select";
import React, { useState } from "react";
import SmallFilamentPreview from "../filament/SmallFilamentPreview";
import { CornerDownRight } from "lucide-react";
import { app } from "@/app/lib/db";

export default function AddPrintModal({ onAdd, open, onClose, filament }:
    { onAdd?: (print: Print) => void, filament: Filament[] } & ModalProps) {
    const [printData, setPrintData] = useObjectState<DBCreateParams<Print>>({
        name: "",
        timeHours: 0,
        totalFilamentUsed: 0,
        filamentUsed: {},
    });
    const [selectedFilament, setSelectedFilament] = useState<Filament[]>([]);

    const [step, setStep] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function addPrint() {
        if (
            !printData.name ||
            !printData.timeHours ||
            !selectedFilament.length ||
            Object.keys(printData.filamentUsed).length !== selectedFilament.length
        ) {
            setError("Please fill out all fields");
            return;
        }

        for (const k in printData.filamentUsed) {
            if (printData.filamentUsed[k] <= 0 || Number.isNaN(printData.filamentUsed[k])) {
                setError("Invalid filament usage value(s)");
                return;
            }
        }

        setLoading(true);

        const res = await app.prints.addPrint(printData);

        if (res.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        onAdd?.(res.data!);
        onClose();

        setLoading(false);
        setError("");
    }

    return (<>
        <Modal open={open} onClose={onClose} title="Add Print">
            <Subtext>
                Log a print and what filament you used with it.
            </Subtext>

            <Divider />

            {step === 0 && <>
                <Input
                    label="Name"
                    value={printData.name}
                    onChange={e => setPrintData({ name: e.target.value })}
                />

                <Input
                    label="Time To Print (h)"
                    className="w-full"
                    type="number"
                    value={printData.timeHours}
                    onChange={e => setPrintData({ timeHours: parseFloat(e.target.value) })}
                />

                <p>Filament Used</p>
                <SelectMultiple
                    placeholder="Select at least 1 filament"
                    className="w-full"
                    options={{
                        ...filament.reduce<Record<string, React.ReactNode>>(
                            (acc, current) => {
                                acc[`${current.name}\n${current.id}`] = <SmallFilamentPreview filament={current} noInteraction />;
                                return acc;
                            },
                            {}
                        ),
                    }}
                    values={selectedFilament.map(f => `${f.name}\n${f.id}`)}
                    onChange={vals => setSelectedFilament(vals.map(v => filament.find(f => f.id === v.split("\n")[1])!))}
                    searchable
                />
            </>}

            {step === 1 &&
                selectedFilament.map(f => <div key={f.id}>
                    <SmallFilamentPreview filament={f} noInteraction className="bg-bg-lighter" />
                    <div className="flex gap-1 my-1">
                        <CornerDownRight size={32} className="ml-2 text-gray-500" />
                        <Input
                            placeholder="Filament Used (g)"
                            type="number"
                            value={printData.filamentUsed[f.id] ?? ""}
                            onChange={e => setPrintData({
                                filamentUsed: { ...printData.filamentUsed, [f.id]: parseInt(e.target.value) },
                            })}
                        />
                    </div>
                </div>)
            }

            <ModalFooter tip="Logging a print will also add logs to the filament that was used." error={error}>
                {step > 0 && <>
                    <Button onClick={() => setStep(Math.max(0, step - 1))} look={ButtonStyles.secondary}>
                        Previous
                    </Button>
                </>}
                <Button
                    onClick={() => (step === 1 ? addPrint() : setStep(step + 1))}
                    disabled={step === 0 && !printData.name || !printData.timeHours}
                    loading={loading}
                >
                    {step === 1 ? "Add" : "Next"}
                </Button>
            </ModalFooter>
        </Modal>
    </>);
}
