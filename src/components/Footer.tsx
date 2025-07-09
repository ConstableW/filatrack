import { endpoints } from "@/app/lib/constants";
import { Dot } from "lucide-react";

export default function Footer() {
    return (
        <footer className={`hidden fixed bottom-2 left-1/2 -translate-x-1/2 bg-bg-light p-2 mt-10 w-1/2 rounded-lg drop-shadow-lg
            md:flex flex-row flex-wrap md:flex-nowrap gap-1 justify-center items-center border-2 border-bg-lightest`}>
            <a href="https://mrdiamond.is-a.dev/support" className="style">Support</a>
            <Dot />
            <a href={endpoints.github} className="style">GitHub</a>
            <Dot />
            <a href={endpoints.discord} className="style">Discord</a>
            <Dot />
            <a href={endpoints.privacyPolicy} className="style">Privacy Policy</a>
        </footer>
    );
}
