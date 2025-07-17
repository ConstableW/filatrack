import { app } from "@/lib/db";
import Button from "../Button";
import Divider from "../Divider";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";

export default function SearchTipsModal(props: ModalProps) {
    return (
        <Modal open={props.open} onClose={() => {
            app.settings.updateUserSettings({ seenSearchTips: true });
            props.onClose?.();
        }} title="Search Tips">
            <Subtext>Some shorthands for searching your filament.</Subtext>
            <Divider />

            <p>By default, the search will search for title. Prefix your search with any one of these to search a different field.</p>
            <p><code>b:</code> Brand</p>
            <p><code>m:</code> Material</p>

            <ModalFooter tip="This modal won't show again. If you want to see the tips again, go to Settings > Preferences.">
                <Button onClick={() => {
                    app.settings.updateUserSettings({ seenSearchTips: true });
                    props.onClose?.();
                }}>Ok</Button>
            </ModalFooter>
        </Modal>
    );
}
