import Input from "../Input";

export const filamentMaterials = [
    "PLA",
    "TPU",
    "ABS",
    "PETG",
    "ASA",
    "PC",
    "HIPS",
    "PVA",
];

export default function MaterialPicker({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    return (<>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-1 my-2">
            {filamentMaterials.map(f => <MaterialEntry key={f} selected={value === f} onClick={() => onChange(f)}>{f}</MaterialEntry>)}
        </div>

        <Input
            placeholder="Other..."
            className={filamentMaterials.includes(value) ? "" : "!border-primary"}
            value={filamentMaterials.includes(value) ? "" : value}
            onChange={e => onChange(e.target.value)}
            maxLength={32}
        />
    </>);
}

export function MaterialEntry({ children, selected, onClick }:
    { selected?: boolean, onClick?: () => void } & React.PropsWithChildren) {
    return (
        <div className={`rounded-full bg-bg-lighter px-2 py-1 text-center cursor-pointer transition-all
            border-2 border-transparent hover:border-primary ${selected && "!border-primary"} select-none`}
        onClick={onClick}
        >
            {children}
        </div>
    );
}
