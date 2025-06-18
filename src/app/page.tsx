import Button from "@/components/Button";
import RandomizedFilament from "@/components/filament/RandomizedFilament";
import Subtext from "@/components/Subtext";

export default async function Home() {
    // const session = await auth();

    // if (session)
    //     return redirect("/app");

    return (<main className="absolute-center">
        <div className="flex flex-row gap-2">
            <RandomizedFilament />
            <div>
                <h1>Filatrack</h1>
                <Subtext className="whitespace-pre-wrap">
                    Keep track of all your filament rolls in the simplest way possible.{"\n"}
                    Free, forever. No ads. All open-source.
                </Subtext>
                <a href="/login"><Button>Get Started</Button></a>
            </div>
        </div>
    </main>);
}
