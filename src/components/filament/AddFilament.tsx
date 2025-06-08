"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Modal, { ModalFooter } from "../Modal";
import Subtext from "../Subtext";
import Divider from "../Divider";
import Input from "../Input";
import Button, { ButtonStyles } from "../Button";
import PopoverColorPicker from "../ColorPicker";
import { createFilament } from "@/app/lib/filament";
import { useObjectState } from "@/app/lib/hooks";
import { Filament } from "../../../prisma/generated/prisma";
import { DBCreateParams } from "@/app/lib/types";
import MaterialPicker, { filamentMaterials } from "./MaterialPicker";
import MassPicker from "./MassPicker";

export default function AddFilament({ onAdd }: { onAdd?: (filament: Filament) => void }) {
    const [modalOpen, setModalOpen] = useState(false);

    const [step, setStep] = useState(0);

    const [filamentData, setFilamentData] = useObjectState<DBCreateParams<Filament>>({
        name: "",
        brand: "",
        color: "#09f",
        material: "PLA",
        note: "",

        currentMass: 1000,
        startingMass: 1000,

        isEmpty: false,

        lastUsed: new Date(0),
    });

    function reset() {
        setFilamentData({
            name: "",
            brand: "",
            color: "#09f",
            material: "PLA",
            note: "",

            currentMass: 1000,
            startingMass: 1000,

            isEmpty: false,

            lastUsed: new Date(0),
        });
        setStep(0);
    }

    const [error, setError] = useState("");
    const [requiredError, setRequiredError] = useState(false);
    const [loading, setLoading] = useState(false);

    async function addFilament() {
        setError("");
        setRequiredError(false);

        if (!filamentData.name || !filamentData.color || !filamentData.material) {
            setError("You must fill out all required fields");
            setRequiredError(true);
            return;
        }

        setLoading(true);

        const res = await createFilament(filamentData);

        if (res.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        setLoading(false);
        setModalOpen(false);

        onAdd?.(res.data!);
    }

    useEffect(() => {
        reset();
    }, [modalOpen]);

    return (<>
        <div
            className={`bg-bg-light rounded-lg p-2 flex flex-col gap-1 items-center justify-center relative w-[175px] 
                cursor-pointer transition-all border-2 border-transparent hover:border-primary min-h-[269px]`}
            onClick={() => setModalOpen(true)}
        >
            <Plus className="absolute-center text-gray-500" size={64} />
        </div>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Filament">
            <Subtext>Add a new filament to start tracking it's usage.</Subtext>
            <Divider />

            {step === 0 && <>
                <Input
                    label="Name"
                    value={filamentData.name}
                    onChange={e => setFilamentData({ name: e.target.value })}
                    error={(requiredError && !filamentData.name) && "This field is required"}
                />
                <Input
                    label="Brand"
                    value={filamentData.brand}
                    onChange={e => setFilamentData({ brand: e.target.value })}
                />

                <p>Color</p>
                <PopoverColorPicker color={filamentData.color} onChange={c => setFilamentData({ color: c })} />

                <Input label="Notes" value={filamentData.note} onChange={e => setFilamentData({ note: e.target.value })} />
            </>}

            {step === 1 && <>
                <p>Material</p>
                <MaterialPicker value={filamentData.material} onChange={m => setFilamentData({ material: m })} />
                <Input
                    placeholder="Other..."
                    className={filamentMaterials.includes(filamentData.material) ? "" : "!border-primary"}
                    value={filamentMaterials.includes(filamentData.material) ? "" : filamentData.material}
                    onChange={e => setFilamentData({ material: e.target.value })}
                    error={(requiredError && !filamentData.material) && "This field is required"}
                />
            </>}

            {step === 2 && <>
                <MassPicker values={filamentData} onChange={setFilamentData} />
            </>}

            <ModalFooter error={error}>
                <Button onClick={() => setStep(Math.max(0, step - 1))} look={ButtonStyles.secondary}>
                    Previous
                </Button>
                <Button onClick={() => (step === 2 ? addFilament() : setStep(step + 1))} loading={loading}>
                    {step === 2 ? "Add" : "Next"}
                </Button>
            </ModalFooter>
        </Modal>
    </>);
}
