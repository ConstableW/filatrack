"use client";

import { endpoints } from "@/app/lib/constants";
import { Dot } from "lucide-react";
import Modal, { ModalFooter } from "./Modal";
import { useState, version } from "react";
import Subtext from "./Subtext";
import Divider from "./Divider";
import { changelog } from "@/app/lib/changelog";
import Button from "./Button";

export default function Footer() {
    const [openModal, setOpenModal] = useState("");

    const [currentChangelog, setCurrentChangelog] = useState(0);

    return (<>
        <footer className={`hidden fixed bottom-2 left-1/2 -translate-x-1/2 bg-bg-light p-2 mt-10 w-1/2 rounded-lg drop-shadow-lg
            md:flex flex-row flex-wrap md:flex-nowrap gap-1 justify-center items-center border-2 border-bg-lightest`}>
            <a className="style" href="#" onClick={() => setOpenModal("version")}>{version}</a>
            <Dot />
            <a href={endpoints.github} className="style">GitHub</a>
            <Dot />
            <a href="https://mrdiamond.is-a.dev/support" className="style">Support</a>
            <Dot />
            <a href={endpoints.discord} className="style">Discord</a>
            <Dot />
            <a href={endpoints.privacyPolicy} className="style">Privacy Policy</a>
        </footer>

        <Modal title="Changelog" open={openModal === "version"} onClose={() => setOpenModal("")}>
            <Subtext>See what's new in Filatrack!</Subtext>
            <Divider />
            <b>{changelog[currentChangelog].version}</b>
            <Subtext>{changelog[currentChangelog].date}</Subtext>
            <p className="whitespace-pre-wrap">{changelog[currentChangelog].content}</p>

            <ModalFooter>
                {currentChangelog !== 0 && <Button>Next</Button>}
                {currentChangelog !== changelog.length - 1 && <Button>Previous</Button>}
            </ModalFooter>
        </Modal>
    </>);
}
