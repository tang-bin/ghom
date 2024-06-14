import { type Component, onMount } from "solid-js";

import style from "./Tech.module.less";
import { mobileView, setPageView } from "../models/state.model";

const Tech: Component = () => {
    onMount(() => {});

    return (
        <div class={style.tech} classList={{ [style.mobileTech]: mobileView() }}>
            <h1>Tech Stack</h1>
            <p>Coming soon...</p>
        </div>
    );
};

export default Tech;
