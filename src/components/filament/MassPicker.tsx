import { useState } from "react";
import Input from "../Input";
import Subtext from "../Subtext";
import GetMassModal from "./FindMassModal";

type MassData = { currentMass: number, startingMass: number };

const presets: Record<string, number> = {
    ".2kg": 200,
    ".25kg": 250,
    ".5kg": 500,
    "1kg": 1000,
    "2kg": 2000,
};

export default function MassPicker({ values, onChange, noHelper }:
    { values: MassData, onChange: (massData: MassData) => void, noHelper?: boolean }) {
    const [infoModalOpen, setInfoModalOpen] = useState(false);

    return (<>
        <div className="flex flex-col md:flex-row gap-2 w-full *:w-full">
            <Input
                type="number"
                label="Current Mass (g)"
                value={values.currentMass}
                onChange={e => onChange({ ...values, currentMass: parseInt(e.target.value) })}
            />
            <Input
                type="number"
                label="Starting Mass (g)"
                value={values.startingMass}
                onChange={e => onChange({ ...values, startingMass: parseInt(e.target.value) })}
            />
        </div>

        <div className="flex flex-row gap-1 w-full flex-wrap mt-2 justify-center">
            {Object.keys(presets).map(k => (
                <div
                    className={`px-3 py-1 text-center rounded-full bg-bg-lighter cursor-pointer 
                        border-2 border-transparent hover:border-primary transition-all mb-2
                        ${values.startingMass === presets[k] && "!border-primary"}`}
                    onClick={() => onChange({ currentMass: presets[k], startingMass: presets[k] })}
                    key={k}
                >
                    {k}
                </div>
            ))}
        </div>

        {!noHelper && <Subtext className="text-tertiary cursor-pointer text-center w-full" onClick={() => setInfoModalOpen(true)}>
                Current Mass Calculator
        </Subtext>}

        {!noHelper && <GetMassModal open={infoModalOpen} onClose={() => setInfoModalOpen(false)} />}
    </>);
}
