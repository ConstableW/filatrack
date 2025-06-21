"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Subtext from "@/components/Subtext";
import { toast } from "sonner";

export default function ContactPage() {
    return (<div className="absolute-center w-full flex items-center justify-center">
        <div className="w-[95%] md:w-2/3 bg-bg-light rounded-lg p-5">
            <h1>Contact</h1>
            <Subtext>Use this form to contact us about anything- legal or not.</Subtext>
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
            }}>
                <Input type="text" name="name" required label="Name" />
                <Input type="email" name="email" required label="Email" />
                <Input multiline name="message" required label="Message" />

                <Button type="submit">Submit Form</Button>
            </form>
        </div>
    </div>
    );
}
