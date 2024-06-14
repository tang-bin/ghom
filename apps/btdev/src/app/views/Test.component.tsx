import { type Component, onMount } from "solid-js";

import style from "./Test.module.less";
import Article from "../components/Article.component";
import { setPageView } from "../models/state.model";

const Test: Component = () => {
    onMount(() => {});

    return (
        <div class={style.test}>
            <Article fileName="test" />
        </div>
    );
};

export default Test;
