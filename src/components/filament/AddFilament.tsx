"use client";

import { useEffect, useState } from "react";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import Divider from "../Divider";
import Input from "../Input";
import Button, { ButtonStyles } from "../Button";
import { createFilament, editFilament } from "@/app/lib/filament";
import { useObjectState } from "@/app/lib/hooks";
import { DBCreateParams } from "@/app/lib/types";
import MaterialPicker from "./MaterialPicker";
import MassPicker from "./MassPicker";
import { Filament, UserSettings } from "@/db/types";
import { getUserSettings } from "@/app/lib/settings";
import Spinner from "../Spinner";
import FilamentColorPicker, { filamentColors } from "./ColorPicker";
import { randomFrom } from "@/app/lib/random";

export default function AddFilamentModal({ onAdd, currentFilament, open, onClose }:
    ModalProps & { currentFilament?: Filament, onAdd?: (filament: Filament) => void }) {
    const [step, setStep] = useState(-1);

    const [settings, setSettings] = useState<UserSettings>();

    const [filamentData, setFilamentData] = useObjectState<DBCreateParams<Filament>>(currentFilament ?? {
        name: "",
        brand: "",
        color: randomFrom(filamentColors),
        material: "PLA",
        note: "",

        currentMass: 1000,
        startingMass: 1000,

        lastUsed: new Date(0),
    });

    function reset() {
        setFilamentData({
            name: "",
            brand: "",
            color: randomFrom(filamentColors),
            material: settings?.defaultMaterial ?? "PLA",
            note: "",

            currentMass: settings?.defaultMass ?? 1000,
            startingMass: settings?.defaultMass ?? 1000,

            lastUsed: new Date(0),
        });
        setStep(0);
        setError("");
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

        const res = currentFilament ?
            await editFilament(currentFilament.id, filamentData) :
            await createFilament(filamentData);

        if (res.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        setLoading(false);
        onClose();

        onAdd?.(res.data!);
    }

    useEffect(() => {
        if (currentFilament)
            return;

        getUserSettings().then(r => {
            if (r.error)
                return;

            setSettings(r.data);
            reset();
        });
    }, []);

    useEffect(() => {
        reset();

        if (currentFilament)
            setFilamentData(currentFilament);
    }, [open]);

    return (<>
        <Modal open={open} onClose={onClose} title={`${currentFilament ? "Edit" : "Add"} Filament`}>
            <Subtext>
                {currentFilament ? "Edit this filament's properties." : "Add a new filament to start tracking it's usage."}
            </Subtext>
            <Divider />

            {step === -1 && <Spinner />}

            {step === 0 && <>
                <Input
                    label="Name"
                    value={filamentData.name}
                    onChange={e => setFilamentData({ name: e.target.value })}
                    error={(requiredError && !filamentData.name) && "This field is required"}
                    maxLength={32}
                />
                <Input
                    label="Brand"
                    value={filamentData.brand}
                    onChange={e => setFilamentData({ brand: e.target.value })}
                    maxLength={32}
                />

                <Input label="Notes" value={filamentData.note} onChange={e => setFilamentData({ note: e.target.value })} />

                <p>Color</p>
                <FilamentColorPicker value={filamentData.color} onChange={c => setFilamentData({ color: c })} />
            </>}

            {step === 1 && <>
                <p>Material</p>
                <MaterialPicker value={filamentData.material} onChange={m => setFilamentData({ material: m })} />
            </>}

            {step === 2 && <>
                <MassPicker values={filamentData} onChange={setFilamentData} />
            </>}

            <ModalFooter error={error}>
                {step >= 0 && <>
                    <Button onClick={() => setStep(Math.max(0, step - 1))} look={ButtonStyles.secondary}>
                        Previous
                    </Button>
                    <Button onClick={() => (step === 2 ? addFilament() : setStep(step + 1))} loading={loading}>
                        {step === 2 ? (currentFilament ? "Edit" : "Add") : "Next"}
                    </Button>
                </>}
            </ModalFooter>
        </Modal>
    </>);
}
