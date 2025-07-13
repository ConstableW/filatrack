import { Print } from "@/db/types";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Divider from "../Divider";
import Subtext from "../Subtext";
import { toDateString } from "@/app/lib/date";
import { grams } from "@/app/lib/units";
import { Clock, Box, Calendar, Trash2 } from "lucide-react";
import Button, { ButtonStyles } from "../Button";
import { useState } from "react";
import { deletePrint } from "@/app/lib/db/prints";

export default function PrintDetailsModal({ print, ...props }: { print: Print } & ModalProps) {
    const [openModal, setOpenModal] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function onDeleteConfirm() {
        setLoading(true);
        setError("");

        const res = await deletePrint(print.id);

        if (res.error) {
            setLoading(false);
            setError(`Error deleting print: ${res.error}`);
        }

        setLoading(false);
        setOpenModal("");
        props.onClose();
    }

    return (<>
        <Modal {...props} title="Print Details">
            <Subtext>View and edit details for this print.</Subtext>
            <Divider />

            <h3>{print.name}</h3>
            <div className="flex flex-col gap-1">
                <Subtext className="flex gap-1 items-center">
                    <Clock /> {print.timeHours} hours
                </Subtext>
                <Subtext className="flex gap-1 items-center">
                    <Box /> {grams(print.totalFilamentUsed)}
                </Subtext>
                <Subtext className="flex gap-1 items-center">
                    <Calendar /> {toDateString(new Date(print.createdAt))}
                </Subtext>
            </div>

            <Divider />

            <div className="flex gap-1 w-full *:w-full">
                {/* <Button><Pencil /></Button> */}
                <Button look={ButtonStyles.danger} onClick={() => setOpenModal("delete")}><Trash2 /></Button>
            </div>
        </Modal>

        <Modal open={openModal === "delete"} onClose={() => setOpenModal("")} title="Delete Filament" level={1}>
            <Subtext className="mb-2">Removes this print from your log.</Subtext>
            <Divider />
            <p className="w-full text-center">Are you sure you want to delete this print?</p>
            <p className="w-full text-center">This will not delete associated logs on your filament.</p>
            <ModalFooter
                error={error}
            >
                <Button look={ButtonStyles.secondary} onClick={() => setOpenModal("")}>Cancel</Button>
                <Button look={ButtonStyles.danger} onClick={onDeleteConfirm} loading={loading}>Confirm</Button>
            </ModalFooter>
        </Modal>
    </>);
}
