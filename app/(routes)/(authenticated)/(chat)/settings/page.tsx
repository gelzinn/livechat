'use client'

import { useAuth } from "app/hooks/useAuth";
import { useDocumentSize } from "app/hooks/useDocumentSize";

const SettingsPage = () => {
    const { documentHeight } = useDocumentSize();

    console.log("dsasads")

    return (
        <main
            className="flex flex-col flex-1 overflow-hidden bg-zinc-950"
            style={{ height: documentHeight ? documentHeight : "100vh" }}
        >
            dsadsasa
        </main>
    )
}

export default SettingsPage;