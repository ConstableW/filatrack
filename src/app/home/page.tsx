import { auth } from "@/auth";
import FilamentList from "@/components/filament/FilamentList";
import SidebarItem from "@/components/SidebarItem";
import { Cog } from "lucide-react";
import { redirect } from "next/navigation";
import { GiFilmSpool } from "react-icons/gi";

export default async function HomePage() {
    const session = await auth();

    if (!session || !session.user)
        redirect("/login");

    return <main className="flex flex-row w-screen h-screen bg-bg-light overflow-hidden">
        <div className="bg-bg-light h-full flex flex-col gap-1 p-2 pr-0 min-w-[175px]">
            <img src={session.user!.image!} className="rounded-full w-7 m-2 mb-1" />
            <SidebarItem href="home">
                <GiFilmSpool size={24} /> Filament
            </SidebarItem>
            <SidebarItem href="settings">
                <Cog /> Settings
            </SidebarItem>
        </div>
        <div className="bg-bg w-full rounded-lg m-2 p-4 pt-2">
            <h1>Your Filament</h1>
            <div className="flex flex-row gap-2 flex-wrap">
                <FilamentList allowAdd />
            </div>
            <h1>Empty Filament</h1>
            <div className="flex flex-row gap-2">
                <FilamentList isEmpty />
            </div>
        </div>
    </main>;
}
