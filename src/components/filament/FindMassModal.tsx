import { useState } from "react";
import Divider from "../Divider";
import Modal, { ModalFooter } from "../Modal";
import Subtext from "../Subtext";
import Input from "../Input";
import Button from "../Button";

export default function GetMassModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    const [emptySpoolMass, setEmptySpoolMass] = useState("");
    const [totalSpoolMass, setTotalSpoolMass] = useState("");

    return (
        <Modal open={open} title="Spool Mass Calculator" onClose={onClose} level={2}>
            <Subtext className="md:min-w-[500px]">
                Use this tool to calculate the current mass of a filament spool.
            </Subtext>
            <Divider />

            <div className="flex flex-col md:flex-row gap-2 w-full *:w-full">
                <Input
                    placeholder="Empty Spool Mass (g)"
                    type="number"
                    value={emptySpoolMass}
                    onChange={e => setEmptySpoolMass(e.target.value)}
                />
                <Input
                    placeholder="Total Spool Mass (g)"
                    type="number"
                    value={totalSpoolMass}
                    onChange={e => setTotalSpoolMass(e.target.value)}
                />
            </div>
            <p className="w-full text-center">
                The mass of the filament is {parseInt(totalSpoolMass || "0") - parseInt(emptySpoolMass || "0")}g
            </p>

            <ModalFooter tip={`To get the mass of an empty spool, the best way is to weigh one you have of the same brand.
                If you don't have one, search for it online.`}>
                <Button onClick={onClose}>Done</Button>
            </ModalFooter>
        </Modal>
    );
}
