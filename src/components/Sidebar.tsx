"use client";

import { GiFilmSpool } from "react-icons/gi";
import AccountCard from "./Account";
import SidebarItem from "./SidebarItem";
import { Cog, Heart, Lock } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { sidebarWidth } from "@/app/lib/random";

export default function Sidebar({ session }: { session: Session }) {
    const [width, setWidth] = useState(0);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        setWidth(window.innerWidth);
        window.addEventListener("resize", handleWindowSizeChange);
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };
    }, []);

    const isMobile = width <= 768;

    return (<>
        {(!isMobile && !!width) && <div
            className="bg-bg-light h-full flex flex-col gap-1 p-2 fixed top-0 bottom-0"
            style={{ width: sidebarWidth }}
        >
            <AccountCard session={session} />
            <SidebarItem href="/app">
                <GiFilmSpool size={24} /> Filament
            </SidebarItem>
            <SidebarItem href="/app/settings">
                <Cog /> Settings
            </SidebarItem>
            <div className="mt-auto">
                {session.user?.id === process.env.NEXT_PUBLIC_ADMIN_USER_ID &&
                    <SidebarItem href="/admin">
                        <Lock /> Admin
                    </SidebarItem>
                }
                <SidebarItem href="https://github.com/sponsors/mrdiamonddog/">
                    <Heart /> Support
                </SidebarItem>
                <SidebarItem href="https://github.com/mrdiamonddog/filatrack">
                    <FaGithub /> GitHub
                </SidebarItem>
            </div>
        </div>}

        {(isMobile && !!width) &&
        <div
            className={`bg-bg-light w-[95%] flex flex-row items-center justify-between 
                gap-1 p-2 fixed left-1/2 -translate-x-1/2 bottom-2 h-[75px] z-10 rounded-full shadow-xl`}
        >
            <SidebarItem href="/app">
                <GiFilmSpool size={48} />
            </SidebarItem>
            <SidebarItem href="/app/settings">
                <Cog size={48} />
            </SidebarItem>
            {session.user?.id === process.env.NEXT_PUBLIC_ADMIN_USER_ID &&
                <SidebarItem href="/admin">
                    <Lock size={48} />
                </SidebarItem>
            }
            <AccountCard session={session} />
        </div>
        }
    </>);
}
