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
        <main className="flex flex-col-reverse md:flex-row w-screen md:bg-bg-light overflow-x-hidden">
            <Sidebar session={session} />

            {children}
        </main>
    </>);
}
