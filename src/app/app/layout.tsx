import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";
import { Metadata } from "next";
import { redirect } from "next/navigation";

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
        <main className="flex flex-col-reverse md:flex-row w-screen h-screen md:bg-bg-light overflow-x-hidden md:overflow-y-hidden">
            <Sidebar session={session} />
            <div className="bg-bg w-full md:rounded-lg md:m-2 p-4 pt-2 mb-[200px] md:mb-0 h-full">{children}</div>
        </main>
    </>);
}
