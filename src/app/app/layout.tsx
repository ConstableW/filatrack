import { auth } from "@/auth";
import AccountCard from "@/components/Account";
import SidebarItem from "@/components/SidebarItem";
import { Cog } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { GiFilmSpool } from "react-icons/gi";

export const metadata: Metadata = {
    title: "Filatrack App",
    description: "Super-simple tracking of all your 3d printing filaments",
};

export default async function AppLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await auth();

    if (!session || !session.user)
        redirect("/login");

    return (<>
        <main className="flex flex-row w-screen h-screen bg-bg-light overflow-hidden">
            <div className="bg-bg-light h-full flex flex-col gap-1 p-2 pr-0 min-w-[175px]">
                <AccountCard session={session} />
                <SidebarItem href="/app">
                    <GiFilmSpool size={24} /> Filament
                </SidebarItem>
                <SidebarItem href="/app/settings">
                    <Cog /> Settings
                </SidebarItem>
            </div>
            <div className="bg-bg w-full rounded-lg m-2 p-4 pt-2">{children}</div>
        </main>
    </>);
}
