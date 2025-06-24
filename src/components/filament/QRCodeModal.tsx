import { Filament } from "@/db/types";
import Divider from "../Divider";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";
import { app } from "@/app/lib/db";
import Button from "../Button";
import Input from "../Input";
import { useObjectState } from "@/app/lib/hooks";

export default function QRCodeModal({ filament, ...props }: { filament: Filament } & ModalProps) {
    useEffect(() => {
        if (filament.shortId || !props.open)
            return;

        app.filament.editFilament(filament.id, { shortId: crypto.randomUUID().slice(0, 8) });
    }, [props.open]);

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

            <QRCodeSVG
                value={`https://filatrack.vercel.app/app?f=${filament.shortId}`}
                imageSettings={{
                    src: "/filament-black.png",
                    width: 25,
                    height: 25,
                    excavate: true,
                }}
                level="M"
                marginSize={2}
                width={"100%"}
                height={200}
            />

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
                    href={`/qr?filament=${filament.shortId}&options=${
                        Object.keys(options).filter(o => !!options[o])
                            .join(",")
                    }`}
                    target="_blank"
                >
                    <Button>Print</Button>
                </a>
            </ModalFooter>
        </Modal>
    );
}
