/* @refresh reload */
import { render } from "solid-js/web";

import "./index.less";
import Main from "./app/Main.component";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error("Root element not found.");
}

render(() => <Main />, root!);
