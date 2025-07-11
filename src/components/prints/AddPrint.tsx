"use client";

import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import Divider from "../Divider";
import Input from "../Input";
import { Filament, Print } from "@/db/types";
import Button from "../Button";
import { useObjectState } from "@/app/lib/hooks";
import { DBCreateParams } from "@/app/lib/db/types";
import { SelectMultiple } from "../Select";
import React from "react";

export default function AddPrintModal({ onAdd, open, onClose, filament }:
    { onAdd?: (print: Print) => void, filament: Filament[] } & ModalProps) {
    const [printData, setPrintData] = useObjectState<DBCreateParams<Print>>({
        name: "",
        timeHours: 0,
        totalFilamentUsed: 0,
        filamentUsed: [],
    });

    return (<>
        <Modal open={open} onClose={onClose} title="Add Print">
            <Subtext>
                Log a print and what filament you used with it.
            </Subtext>

            <Divider />

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
                options={{
                    ...filament.reduce<Record<string, React.ReactNode>>(
                        (acc, current) => {
                            acc[current.id] = <p>test</p>;
                            return acc;
                        },
                        {}
                    ),
                }}
                values={printData.filamentUsed}
                onChange={vals => setPrintData({ filamentUsed: vals })}
            />

            <ModalFooter tip="Logging a print will also add logs to the filament that was used.">
                <Button>Add</Button>
            </ModalFooter>
        </Modal>
    </>);
}
