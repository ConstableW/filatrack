import { Box, Filament } from "@/db/types";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import { ExternalLink } from "lucide-react";
import Button, { ButtonStyles } from "../Button";
import Divider from "../Divider";
import { Select } from "../Select";
import Subtext from "../Subtext";
import { useState } from "react";
import { ApiRes } from "@/lib/db/types";
import { app } from "@/lib/db";
import { handleApiError } from "@/lib/errors";

export default function MoveFilamentModal({ filament, allBoxes, onMove, ...props }:
    { filament: Filament[], allBoxes: Box[], onMove: (filament: Filament[]) => void } & ModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [selectedBox, setSelectedBox] = useState("");

    async function onMoveConfirm() {
        if (!selectedBox)
            return;

        setError("");
        setLoading(true);

        let res: ApiRes<{ box: Box, filament: Filament[] }> | null = null;

        if (selectedBox === " ")
            res = await app.boxes.removeFilaments(filament[0].box!, filament.map(f => f.id));
        else
            res = await app.boxes.addFilaments(selectedBox, filament.map(f => f.id));

        if (res.error) {
            setError(handleApiError(res.error));
            setLoading(false);
            return;
        }

        onMove(res.data.filament);
        setLoading(false);
        props.onClose();
    }

    return (
        <Modal {...props} title="Move Filament">
            <Subtext>Change which box this filament is in.</Subtext>
            <Divider />

            <Select
                className="w-full"
                placeholder="Choose a box..."
                options={{
                    ...((filament[0]?.box ?? false) ? {
                        " ": <div className="flex gap-1 items-center">
                            <ExternalLink />
                            Remove from this box
                        </div>,
                    } : {}),

                    ...allBoxes.reduce<Record<string, React.ReactNode>>(
                        (acc, current) => {
                            if (filament[0]?.box === current.id)
                                return acc;

                            acc[current.id] = current.name;
                            return acc;
                        },
                        {}
                    ),
                }}
                value={selectedBox}
                onChange={setSelectedBox}
            />

            <ModalFooter
                error={error}
            >
                <Button look={ButtonStyles.secondary} onClick={props.onClose}>Cancel</Button>
                <Button onClick={onMoveConfirm} loading={loading}>Confirm</Button>
            </ModalFooter>
        </Modal>
    );
}
