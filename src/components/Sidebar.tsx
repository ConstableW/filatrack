"use client";

import { GiFilmSpool } from "react-icons/gi";
import AccountCard from "./Account";
import SidebarItem from "./SidebarItem";
import { Cog, Heart } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Session } from "next-auth";
import { useEffect, useState } from "react";

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

    const isMobile = !width ? false : width <= 768;

    return (<>
        {!isMobile && <div className="bg-bg-light h-full flex flex-col gap-1 p-2 pr-0 md:min-w-[175px]">
            <AccountCard session={session} />
            <SidebarItem href="/app">
                <GiFilmSpool size={24} /> Filament
            </SidebarItem>
            <SidebarItem href="/app/settings">
                <Cog /> Settings
            </SidebarItem>
            <div className="mt-auto">
                <SidebarItem href="https://github.com/sponsors/mrdiamonddog/">
                    <Heart /> Support
                </SidebarItem>
                <SidebarItem href="https://github.com/mrdiamonddog/filatrack">
                    <FaGithub /> GitHub
                </SidebarItem>
            </div>
        </div>}

        {isMobile &&
        <div
            className={`bg-bg-light w-[95%] flex flex-row items-center justify-between 
                gap-1 p-2 absolute left-1/2 -translate-x-1/2 bottom-2 h-[75px] z-10 rounded-full shadow-lg`}
        >
            <SidebarItem href="/app">
                <GiFilmSpool size={48} />
            </SidebarItem>
            <SidebarItem href="/app/settings">
                <Cog size={48} />
            </SidebarItem>
            <AccountCard session={session} />
        </div>
        }
    </>);
}
