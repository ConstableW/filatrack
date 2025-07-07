import Button from "@/components/Button";
import Divider from "@/components/Divider";
import RandomizedFilament from "@/components/filament/RandomizedFilament";
import Subtext from "@/components/Subtext";
import { ChevronDown, CircleDollarSign, Code, Dot, GlobeLock, QrCode, ScrollText, Smartphone } from "lucide-react";
import { getTotalFilament, getTotalUsers } from "./lib/db/analytics";

function LandingCard({ children }: React.PropsWithChildren) {
    return (
        <div className="bg-bg-light p-3 rounded-lg border-2 border-transparent hover:border-primary transition-all">
            {children}
        </div>
    );
}

function LandingCardHeader({ children }: React.PropsWithChildren) {
    return (
        <div className="flex flex-row gap-1 items-center">
            {children}
        </div>
    );
}

export default async function Home() {
    return (<>
        <main className="absolute-center">
            <div className="flex flex-col md:flex-row gap-2">
                <RandomizedFilament />
                <div>
                    <h1>Filatrack</h1>
                    <Subtext className="whitespace-pre-wrap mb-2">
                    Keep track of all your filament rolls in the simplest way possible.{"\n"}
                    Free, forever. No ads. All open-source.
                    </Subtext>
                    <a href="/login">
                        <Button>Get Started</Button>
                    </a>
                </div>
            </div>
        </main>

        <div className="mt-[100vh] md:mt-[75vh] w-full flex justify-center">
            <div className="bg-bg-light rounded-lg p-4">
                <div className="flex flex-row gap-2">
                    <div>
                        <Subtext className="text-xl">Users</Subtext>
                        <h2>{(await getTotalUsers()).data!}</h2>
                    </div>
                    <Divider vertical />
                    <div>
                        <Subtext className="text-xl">Filament</Subtext>
                        <h2>{(await getTotalFilament()).data!}</h2>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <ChevronDown className="bounce w-full text-center mt-15" size={48} />

            <h1 className="w-full text-center">About Filatrack</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:w-1/2 mx-auto overflow-hidden">
                <LandingCard>
                    <LandingCardHeader>
                        <Code size={32} />
                        <p className="text-md md:text-xl">Open Source</p>
                    </LandingCardHeader>
                    <Subtext>
                    Filatrack is completely free open source software. We are welcome to bug reports and contributions as well!
                    </Subtext>
                </LandingCard>
                <LandingCard>
                    <LandingCardHeader>
                        <QrCode size={32} />
                        <p className="text-md md:text-xl">QR Codes</p>
                    </LandingCardHeader>
                    <Subtext>
                    Print out QR codes that point directly to your filament in Filatrack!
                    </Subtext>
                </LandingCard>
                <LandingCard>
                    <LandingCardHeader>
                        <ScrollText size={32} />
                        <p className="text-md md:text-xl">Log Usage</p>
                    </LandingCardHeader>
                    <Subtext>
                    A core part of Filatrack is logging actual filament usage.
                    Simply type in how much you used and it does all the work for you!
                    </Subtext>
                </LandingCard>
                <LandingCard>
                    <LandingCardHeader>
                        <CircleDollarSign size={32} />
                        <p className="text-md md:text-xl">Free & ad-free</p>
                    </LandingCardHeader>
                    <Subtext>
                    We are committed to being <b>completely free to use and ad-free forever</b>. No rugpulls here.
                    We rely on community donations to keep running.
                    </Subtext>
                </LandingCard>
                <LandingCard>
                    <LandingCardHeader>
                        <Smartphone size={32} />
                        <p className="text-md md:text-xl">Mobile Support</p>
                    </LandingCardHeader>
                    <Subtext>
                    You can add Filatrack as an app on your phone to quickly check filament.
                    Go to 'Share' &gt; 'Add to home screen'. (or just use the website on your phone)
                    </Subtext>
                </LandingCard>
                <LandingCard>
                    <LandingCardHeader>
                        <GlobeLock size={32} />
                        <p className="text-md md:text-xl">Complete Privacy</p>
                    </LandingCardHeader>
                    <Subtext>
                    No data is sold or shared with any third-parties. No identifying analytics are gathered by Filatrack. View our{" "}
                        <a href="/about/privacy-policy" className="style">privacy policy</a> for more info.
                    </Subtext>
                </LandingCard>
            </div>

            <Divider className="my-4" />

            <img src="/app_example.png" className="md:w-1/2 mx-auto border-2 border-primary rounded-lg" />

            <Divider className="my-4" />

            <h3 className="w-full text-center">
                Want to learn more? Join the <a href="/discord" className="style">Discord server</a>!
            </h3>

            <footer className="bg-bg-light p-2 mt-10 flex flex-row flex-wrap md:flex-nowrap gap-1 justify-center items-center">
                <a href="https://mrdiamond.is-a.dev/support" className="style">Support</a>
                <Dot />
                <a href="https://github.com/mrdiamonddog/filatrack" className="style">GitHub</a>
                <Dot />
                <a href="/discord" className="style">Discord</a>
                <Dot />
                <a href="/about/privacy-policy" className="style">Privacy Policy</a>
            </footer>
        </div>
    </>);
}
