import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

export default function Drawer({ label, ...props }: { label: string } & React.PropsWithChildren) {
    const [open, setOpen] = useState(false);

    return (<>
        <div className="flex flex-row gap-1 items-center cursor-pointer" onClick={() => setOpen(!open)}>
            {open ? <ChevronUp /> : <ChevronDown />} {label}
        </div>
        {open && <div className="ml-2 pl-2 border-l-2 border-bg-lightest">
            {props.children}
        </div>}
    </>);
}
