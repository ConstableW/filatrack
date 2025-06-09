import { useState } from "react";
import Button from "../Button";
import Divider from "../Divider";
import Input from "../Input";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import FilamentEntry from "./Filament";
import { editFilament, logFilamentUse } from "@/app/lib/filament";
import { Filament } from "@/db/types";

export default function LogFilamentModal({ open, onClose, filament, onFinish }:
    { filament: Filament, onFinish: (newFilament: Filament) => void } & ModalProps) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [filamentUsed, setFilamentUsed] = useState(0);

    async function logFilament() {
        if (filamentUsed === 0) {
            setError("Last time I checked, you can't 3d print anything with 0 grams of filament.");
            return;
        }

        setLoading(true);
        setError("");

        const res = await logFilamentUse({
            filamentUsed,

            previousMass: filament.currentMass,
            newMass: filament.currentMass - filamentUsed,
            time: new Date(),

            filamentId: filament.id,
        });

        if (res.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        const editRes = await editFilament(filament.id, {
            currentMass: filament.currentMass - filamentUsed,
            lastUsed: new Date(),
        });

        if (editRes.error) {
            setError(editRes.error);
            setLoading(false);
            return;
        }

        setLoading(false);
        setError("");
        onClose();
        onFinish(editRes.data!);
    }

    return (
        <Modal open={open} onClose={onClose} title="Log Filament Use">
            <Subtext className="mb-2">
                    If you've used this filament, log how much was used so you'll know how much is left.
            </Subtext>
            <Divider />
            <div className="flex flex-row justify-between items-center gap-2">
                <Input
                    label="Filament Used (g)"
                    className="w-1/2"
                    type="number"
                    value={filamentUsed}
                    onChange={e => setFilamentUsed(parseInt(e.target.value))}
                />
                <FilamentEntry filament={filament} isPreview />
            </div>
            <p>
                This will leave{" "}
                {Math.max(0, filament.currentMass - (Number.isNaN(filamentUsed) ? 0 : filamentUsed))}g /{" "}
                {filament.startingMass / 1000}kg
                remaining.
            </p>

            {(filament.currentMass - (Number.isNaN(filamentUsed) ? 0 : filamentUsed)) <= 0 &&
                <span className="text-danger">This action will put your filament into your Empty Filament.</span>
            }
            <ModalFooter
                error={error}>
                <Button loading={loading} onClick={logFilament}>Confirm</Button>
            </ModalFooter>
        </Modal>
    );
}
