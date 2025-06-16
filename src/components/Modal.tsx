import { Info, OctagonAlert, X } from "lucide-react";
import Divider from "./Divider";
import Subtext from "./Subtext";
import { useEffect, useState } from "react";
import Portal from "./Portal";

export type ModalProps = {
    open: boolean,
    onClose: () => void
}

export default function Modal({ children, title, open, onClose, level, danger }:
{ title: string, open: boolean, onClose: () => void, level?: number, danger?: boolean } & React.PropsWithChildren) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (open)
            setVisible(true);
    }, [open]);

    return (<Portal>
        {visible && <div
            className={`${open ? "fade-in-75" : "fade-out-75"} opacity-75 fixed inset-0 bg-black
            ${!level ? "" : "rounded-lg"}`}
            style={{ zIndex: (level ?? 0) + 1 }}
            onClick={onClose}
        />}

        {visible && <div
            className={`fixed top-1/2 left-1/2 bg-bg-light rounded-lg min-w-[200px] min-h-[100px] 
            border-2 ${danger ? "border-danger" : "border-primary"} px-4 py-3
            ${open ? "fade-in scale-in-center" : "fade-out scale-out-center"}`}
            style={{ zIndex: (level ?? 0) + 2 }}
            onAnimationEnd={() => {
                if (open)
                    return;
                onClose();
                setVisible(false);
            }}
        >
            <ModalTitle onClose={onClose}>{title}</ModalTitle>

            {children}
        </div>}
    </Portal>);
}

export function ModalTitle({ children, onClose }: { onClose: () => void } & React.PropsWithChildren) {
    return (<div className="flex flex-row gap-10 justify-between items-center">
        <h2 className="text-lg md:text-xl">{children}</h2>
        <X size={32} className="rounded-lg p-1 cursor-pointer transition-all hover:bg-bg-lighter" onClick={onClose} />
    </div>);
}

export function ModalFooter({ children, tip, error }: { tip?: string, error?: string } & React.PropsWithChildren) {
    return (<>
        <Divider />
        <div className="flex flex-col gap-2 md:flex-row justify-between w-full items-end">
            <div className="flex flex-col gap-2">
                {error && <Subtext className="text-xs flex flex-row gap-2 items-center">
                    <OctagonAlert className="text-danger min-w-[32px] min-h-[32px]" /> {error}
                </Subtext>}
                {tip && <Subtext className="text-xs flex flex-row gap-2 items-center md:min-w-0 min-w-[300px]">
                    <Info className="text-primary min-w-[32px] min-h-[32px]" /> {tip}
                </Subtext>}
            </div>
            <div className={`${tip ? "w-1/2" : "w-full"} flex flex-row gap-1 justify-end`}>
                {children}
            </div>
        </div>
    </>);
}
