import { redirect } from "next/navigation";

export function defineRedirectPage(href: string) {
    return function() {
        return redirect(href);
    };
}
