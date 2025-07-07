/* eslint-disable indent */
import { Filament } from "@/db/types";
import Divider from "../Divider";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import Button from "../Button";
import Input from "../Input";
import { useObjectState } from "@/app/lib/hooks";

export function generateQrUrl(filament: Filament | Filament[], options: Record<string, boolean>) {
    const ids = Array.isArray(filament) ? filament.map(f => f.id).join(",") : filament.id;
    const optionsString = Object.keys(options).filter(o => !!options[o])
            .join(",");

    console.log(ids, optionsString);

    return `/qr?filament=${ids}&options=${optionsString}`;
}

export default function QRCodeModal({ filament, ...props }: { filament: Filament | Filament[] } & ModalProps) {
    const [options, setOptions] = useObjectState<Record<string, boolean>>({
        border: true,
        name: true,
        brand: true,
        mass: true,
        mat: true,
    });

    return (
        <Modal {...props} title="QR Code">
            <Subtext>Print this QR code to quickly open your filament to view, edit, or log it!</Subtext>
            <Divider />

            <Input
                label="Border"
                type="checkbox"
                checked={options.border}
                onChange={e => setOptions({ border: e.target.checked })}
            />
            <Input
                label="Show Name"
                type="checkbox"
                checked={options.name}
                onChange={e => setOptions({ name: e.target.checked })}
            />
            <Input
                label="Show Brand"
                type="checkbox"
                checked={options.brand}
                onChange={e => setOptions({ brand: e.target.checked })}
            />
            <Input
                label="Show Starting Mass"
                type="checkbox"
                checked={options.mass}
                onChange={e => setOptions({ mass: e.target.checked })}
            />
            <Input
                label="Show Material"
                type="checkbox"
                checked={options.mat}
                onChange={e => setOptions({ mat: e.target.checked })}
            />

            <ModalFooter tip="Print and attach this to your filament for super-quick access with your phone!">
                <a
                    href={generateQrUrl(filament, options)}
                    target="_blank"
                >
                    <Button>Print</Button>
                </a>
            </ModalFooter>
        </Modal>
    );
}
