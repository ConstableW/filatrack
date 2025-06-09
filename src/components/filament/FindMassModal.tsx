import { useEffect, useState } from "react";
import Divider from "../Divider";
import Modal, { ModalFooter } from "../Modal";
import Subtext from "../Subtext";
import Input from "../Input";
import Button from "../Button";

const text = [
    "First, we need to find the mass of the spool itself, without any filament on it.",
    "This varies between brands, so the best option is to weigh an empty spool of the same brand if you have one.",
    "If you don't have one, there are many resources online that tell you how much they weigh. " +
    "Simply search \"Empty filament spool weight\" and you'll find a bunch of results.",
    "Once you've gotten the mass of your empty spool, All you need to do is " +
    "subtract it by the total mass of the whole spool (with filament).",
];

export default function FindMassModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    const [emptySpoolMass, setEmptySpoolMass] = useState("");
    const [totalSpoolMass, setTotalSpoolMass] = useState("");

    const [step, setStep] = useState(0);

    useEffect(() => {
        if (step < 0)
            setStep(0);
        if (step > text.length)
            setStep(text.length);
    }, [step]);

    return (
        <Modal open={open} title="Finding Filament Mass" onClose={onClose} level={2}>
            <Subtext className="min-w-[500px]">
                Use this tool if the spool you're adding has been used and you don't know how much filament is currently on it.
            </Subtext>
            <Divider />

            <p className="whitespace-pre-wrap">
                {text[step]}
            </p>

            {step === text.length && <>
                <div className="flex flex-row gap-2 w-full *:w-full">
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
                <p>The mass of the filament is {parseInt(totalSpoolMass ?? 0) - parseInt(emptySpoolMass ?? 0)}g</p>
            </>}

            <div className="flex flex-row gap-2 mt-2">
                <Button onClick={() => setStep(step - 1)} className="w-full">Back</Button>
                <Button onClick={() => setStep(step + 1)} className="w-full">Next</Button>
            </div>

            <ModalFooter>
                <Button onClick={onClose}>Done</Button>
            </ModalFooter>
        </Modal>
    );
}
