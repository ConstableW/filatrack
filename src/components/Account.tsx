"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

function AccountOption({ open, onClick, children }: { open: boolean, onClick?: () => void } & React.PropsWithChildren) {
    return (
        <div
            className={`flex flex-row items-center gap-2 p-1 cursor-pointer hover:bg-bg-light transition-all rounded-lg
                ${open ? "fade-in" : "fade-out"}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export default function AccountCard({ session }: { session: Session }) {
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (open)
            setVisible(true);
    }, [open]);

    return (
        <div className="w-full flex flex-col">
            <div
                className={`w-full bg-bg p-1 flex flex-row rounded-lg items-center justify-between cursor-pointer transition-all
                    ${visible && "rounded-b-none"}`}
                onClick={() => setOpen(!open)}
            >
                <div className="flex flex-row gap-2 items-center">
                    <img src={session.user!.image!} className="rounded-full w-7" />
                    <p className="text-nowrap truncate">{session.user!.name!}</p>
                </div>
                <ChevronDown className={`text-gray-500 transition-all ${open && "rotate-180"}`} />
            </div>
            {visible && <div
                className={`w-full bg-bg p-1 flex flex-col gap-2 rounded-b-lg transition-all overflow-hidden
                    ${open ? "expand-down" : "expand-up"}`}
                onAnimationEnd={() => {
                    if (!open)
                        setVisible(false);
                }}
            >
                {visible && <>
                    <AccountOption open={open} onClick={signOut}><LogOut /> Log Out</AccountOption>
                </>}
            </div>}
        </div>
    );
}
