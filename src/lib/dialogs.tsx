"use client";

import Button, { ButtonStyles } from "@/components/Button";
import Divider from "@/components/Divider";
import Input from "@/components/Input";
import Modal, { ModalProps } from "@/components/Modal";
import Subtext from "@/components/Subtext";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { randomFrom, randomInt } from "./random";
import { getUserSettings, setUserSeenDialog } from "./db/settings";
import { endpoints, lastPrivacyPolicyUpdate } from "./constants";

type Dialog = {
    toast: (openModal?: () => void, closeToast?: () => void) => number | string,
    modal?: (props: ModalProps) => React.ReactNode
}

export const dialogs: Record<string, Dialog> = {
    feedback: {
        toast: (openModal, closeToast) => toast.info("Feedback", {
            description: <div className="flex flex-col gap-2">
                <p>We're always looking for ways to improve Filatrack. Please give us some feedback!</p>
                <div className="flex flex-row gap-2">
                    <Button onClick={openModal} className="text-xs">Give Feedback</Button>
                    <Button onClick={() => {
                        setUserSeenDialog("feedback");
                        closeToast?.();
                    }} className="text-xs" look={ButtonStyles.secondary}>
                        Don't Show Again
                    </Button>
                </div>
            </div>,
            duration: 99999,
        }),
        modal: props => <Modal {...props} title="Give Feedback">
            <Subtext>Help us make Filatrack betterer!</Subtext>
            <Divider />
            <form onSubmit={async e => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);

                // * What are ya doin snoopin for access keys??
                // * Well, you can have this one. It's meant to be public anyway.
                formData.append("access_key", "dd6195d1-0709-4de6-88f7-c8d208e28183");

                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();

                if (data.success) {
                    (e.target as HTMLFormElement).reset();
                    toast.success("Submitted! Thanks for your input!");
                } else {
                    toast.error(`Error while submitting form! ${data.message}`);
                }

                props.onClose();
            }}>
                <Input type="text" name="name" required label="Name" />
                <Input type="email" name="email" required label="Email" />
                <Input multiline name="message" required label="Message" />

                <Button type="submit">Submit Form</Button>
            </form>
        </Modal>,
    },
    support: {
        toast: (_, closeToast) => toast.info("Support", {
            description: <div className="flex flex-col gap-2">
                <p>
                    Filatrack is entirely ad-free and makes no money by itself. It is entirely based on free software and
                    donations. If you would like to help Filatrack keep running, please consider supporting the project!
                </p>
                <div className="flex flex-row gap-2">
                    <a href="https://mrdiamond.is-a.dev/support" target="_blank"><Button className="text-xs">Support</Button></a>
                    <Button
                        onClick={() => {
                            setUserSeenDialog("support");
                            closeToast?.();
                        }}
                        className="text-xs"
                        look={ButtonStyles.secondary}
                    >
                        Don't Show Again
                    </Button>
                </div>
            </div>,
            duration: 99999,
        }),
    },
    discord: {
        toast: (_, closeToast) => toast.info("Discord", {
            description: <div className="flex flex-col gap-2">
                <p>
                    We have a Discord! Feel free to come chat or suggest stuff!
                </p>
                <div className="flex flex-row gap-2">
                    <a href={endpoints.discord} target="_blank"><Button className="text-xs">Join</Button></a>
                    <Button
                        onClick={() => {
                            setUserSeenDialog("discord");
                            closeToast?.();
                        }}
                        className="text-xs"
                        look={ButtonStyles.secondary}
                    >
                        Don't Show Again
                    </Button>
                </div>
            </div>,
            duration: 99999,
        }),
    },
};

const privacyPolicyUpdateDialog: Dialog = {
    toast: (_, closeToast) => toast.info("Privacy Policy", {
        description: <div className="flex flex-col gap-2">
            <p>
                We have updated our privacy policy.
            </p>
            <div className="flex flex-row gap-2">
                <Button
                    onClick={() => {
                        closeToast?.();
                        window.open(endpoints.privacyPolicy);
                    }}
                    className="text-xs"
                    look={ButtonStyles.primary}
                >
                    Open
                </Button>
            </div>
        </div>,
        duration: 9999999,
    }),
};

export function RandomDialogs() {
    const dialogIds = Object.keys(dialogs);

    const [selectedDialog, setSelectedDialog] = useState(randomFrom(dialogIds));
    const [modalOpen, setModalOpen] = useState(false);
    const [toastId, setToastId] = useState<number | string>();

    useEffect(() => {
        (async() => {
            const res = await getUserSettings();

            if (res.error || !res.data)
                return;

            const userSettings = res.data;

            const lastSeenPrivacyPolicy = userSettings.seenDialogs?.find(d => d.startsWith("privacy-policy:"));

            if (!lastSeenPrivacyPolicy) {
                setToastId(privacyPolicyUpdateDialog.toast(undefined, () => toast.dismiss(toastId)));
                setUserSeenDialog(`privacy-policy:${new Date()}`);
                return;
            }

            const lastSeenDate = lastSeenPrivacyPolicy.split(":")[1];

            if (new Date(lastSeenDate) < lastPrivacyPolicyUpdate) {
                setToastId(privacyPolicyUpdateDialog.toast(undefined, () => toast.dismiss(toastId)));
                setUserSeenDialog(`privacy-policy:${new Date()}`);
                return;
            }

            if (!selectedDialog)
                return;

            if (userSettings.seenDialogs?.includes(selectedDialog))
                return;

            if (randomInt(0, 100) < 60)
                return;

            setToastId(dialogs[selectedDialog].toast(() => setModalOpen(true), () => toast.dismiss(toastId)));
        })();
    }, [selectedDialog]);

    return dialogs[selectedDialog].modal?.({
        open: modalOpen,
        onClose: () => {
            setUserSeenDialog(selectedDialog);
            setModalOpen(false);
            toast.dismiss(toastId);
        },
    });
}
