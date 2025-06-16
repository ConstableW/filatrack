import { auth } from "@/auth";
import Button from "@/components/Button";
import Subtext from "@/components/Subtext";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await auth();

    if (session)
        return redirect("/app");

    return (<main className="absolute-center">
        <h1>Filatrack</h1>
        <Subtext>Keep track of all your filament rolls in the simplest way possible.</Subtext>
        <a href="/login"><Button>Get Started</Button></a>
    </main>);
}
