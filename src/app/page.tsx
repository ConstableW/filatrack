import Button from "@/components/Button";
import Subtext from "@/components/Subtext";

// eslint-disable-next-line
export const runtime = 'edge';

export default function Home() {
    return (<main className="absolute-center">
        <h1>Filatrack</h1>
        <Subtext>Keep track of all your filament rolls in the simplest way possible.</Subtext>
        <a href="/login"><Button>Get Started</Button></a>
    </main>);
}
