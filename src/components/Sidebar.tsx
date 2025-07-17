"use client";

import { GiFilmSpool } from "react-icons/gi";
import AccountCard from "./Account";
import SidebarItem from "./SidebarItem";
import { Cog, Heart, Lock } from "lucide-react";
import { FaDiscord, FaGithub } from "react-icons/fa6";
import { Session } from "next-auth";
import { useDevice } from "@/app/lib/hooks";
import Divider from "./Divider";
import { baseUrl, endpoints, sidebarWidth } from "@/app/lib/constants";

export default function Sidebar({ session }: { session: Session }) {
    const [isMobile, width] = useDevice();

    return (<>
        {(!isMobile && !!width) && <div
            className="bg-bg-light h-full flex flex-col gap-1 p-2 fixed top-0 bottom-0 drop-shadow-lg"
            style={{ width: sidebarWidth }}
        >
            <a className="flex flex-row gap-1 items-center px-2 pt-2" href={baseUrl}>
                <img src="/filament.svg" width="32" height="32" />
                <p className="text-lg">Filatrack</p>
            </a>

            <Divider className="!my-1" />

            <AccountCard session={session} />

            <SidebarItem href={endpoints.app}>
                <GiFilmSpool size={24} /> Filament
            </SidebarItem>

            {/* <SidebarItem href={endpoints.prints}>
                <ScrollText /> Prints
            </SidebarItem> */}

            <SidebarItem href={endpoints.settings}>
                <Cog /> Settings
            </SidebarItem>

            <div className="mt-auto">
                {session.user?.id === process.env.NEXT_PUBLIC_ADMIN_USER_ID &&
                    <SidebarItem href="/admin">
                        <Lock /> Admin
                    </SidebarItem>
                }

                <SidebarItem href="https://mrdiamond.is-a.dev/support">
                    <Heart /> Support
                </SidebarItem>

                <SidebarItem href={endpoints.github}>
                    <FaGithub /> GitHub
                </SidebarItem>

                <SidebarItem href={endpoints.discord}>
                    <FaDiscord /> Discord
                </SidebarItem>
            </div>
        </div>}

        {(isMobile && !!width) &&
        <div
            className={`bg-bg-light w-[95%] flex flex-row items-center justify-between 
                gap-1 p-2 fixed left-1/2 -translate-x-1/2 bottom-4 h-[75px] z-[1] rounded-full shadow-xl`}
        >
            <SidebarItem href={endpoints.app}>
                <GiFilmSpool size={48} />
            </SidebarItem>

            {/* <SidebarItem href={endpoints.prints}>
                <ScrollText size={48} />
            </SidebarItem> */}

            <SidebarItem href={endpoints.settings}>
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
