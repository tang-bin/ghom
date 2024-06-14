import { Component, createSignal, onMount } from "solid-js";
import style from "./Article.module.less";
import { marked } from "marked";

const Article: Component<{ fileName: string }> = (prop) => {
    const [html, setHtml] = createSignal("");

    onMount(() => {
        loadMd(prop.fileName);
    });

    function loadMd(fileName: string): void {
        fileName = String(fileName || "").trim();
        if (!fileName) return;

        fetch("/articles/" + fileName + ".md")
            .then((res) => res.text())
            .then((text) => marked.parse(text))
            .then((html) => setHtml(html))
            .catch((err) => console.error(err));
    }

    return <div class={style.article} innerHTML={html()}></div>;
};

export default Article;
