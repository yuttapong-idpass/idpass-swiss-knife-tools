import { lazy } from "react";

const Editor = lazy(() => import("@monaco-editor/react"));



export default function JsonToTSInterface() {
    return (
        <main className="p-4 w-full">
            <p className="text-xl font-extrabold text-default-800 mb-2">
                JSON to Typescript Interface
            </p>
        </main>
    )
}