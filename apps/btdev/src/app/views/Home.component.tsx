import { createSignal, type Component, For, onMount, createEffect, onCleanup, Show } from "solid-js";

import style from "./Home.module.less";
import { bars_4, rectangleStack } from "solid-heroicons/solid";
import { Icon } from "solid-heroicons";
import { mobileView, setPageView } from "../models/state.model";

const TAGLINE_LIST = [
    "Hi, I am *Bin* , | a *front-end* *developer* | working for | a cybersecurity company.",
    "---",
    "This *website* is my portfolio, | showcasing my [skills](/tech) | and [projects](/path) | I have worked on.",
    "It is built using [SolidJS](https://www.solidjs.com) , |  [ViteJs](https://itejs.dev) , and [HeroIcons](https://heroicons.com) , | and hosted on | [Cloudflare](https://www.cloudflare.com) .",
    "---",
    "With two decades of | *experience* , | I have a deep passion | for *programming* .",
    "I am currently *seeking* | new *opportunities* | to join a great team | to build amazing products.",
    "---",
    "-This website is still *under construction*. If you *don't find* what you are looking for, please [contact me](mailto:catchall@ghom.io) or *check back later*.",
];

const TAGLINE_INTERVAL = 8;

const Home: Component = () => {
    const allTaglines: Tagline[] = TAGLINE_LIST.filter((v) => !v.startsWith("-")).map((v) => new Tagline(v));
    const [tagline, setTagline] = createSignal<Tagline>();
    const [lineIndex, setLineIndex] = createSignal(0);
    const [process, setProcess] = createSignal(0);
    const [showSinglePage, setShowSinglePage] = createSignal(false);
    const [singePageHTML, setSinglePageHTML] = createSignal("");

    let taglineTimer: number;
    let processTimer: number;

    onMount(() => {
        parseSinglePageContent();
        loadNextTagline();
    });

    createEffect(() => {
        tagline()?.rows.forEach((row: TaglineWord[]) => {
            row.forEach((word: TaglineWord) => setTimeout(() => word.setVisible(true), 600 * Math.random()));
        });

        if (mobileView()) {
            if (!showSinglePage()) setShowSinglePage(true);
        }
    });

    function parseSinglePageContent(): void {
        setSinglePageHTML(
            TAGLINE_LIST.map((line) =>
                line
                    .replaceAll("|", " ")
                    .replace(/\*(.*?)\*/gi, "<b>$1</b>")
                    .replace(/\[(.*?)\]\((.*?)\)/gi, "<a href='$2' target='_blank'>$1</a>")
                    .replace(/\s+(,|\.)\s+/gi, "$1 ")
                    .replace(/\s\s+/gi, " ")
                    .replaceAll("---", "<br><br>")
                    .replace(/^-+(.*)$/, "$1")
                    .trim()
            ).join(" ")
        );
    }

    function loadNextTagline(index?: number) {
        if (index !== undefined && index >= 0 && index < allTaglines.length) setLineIndex(index);
        else if (lineIndex() >= allTaglines.length) setLineIndex(0);

        setTagline(allTaglines[lineIndex()]);
        setLineIndex(lineIndex() + 1);
        updateProcess(true);

        if (taglineTimer) clearTimeout(taglineTimer);
        taglineTimer = setTimeout(loadNextTagline, TAGLINE_INTERVAL * 1000);
    }

    function updateProcess(reset?: boolean) {
        // Stop timer if it's running
        if (processTimer) clearTimeout(processTimer);

        // reset to 0 or increase by 1 second
        if (reset) setProcess(0);

        // Increase by 1 second
        setTimeout(() => setProcess(process() + 10 / TAGLINE_INTERVAL));

        // Set new timer
        processTimer = setTimeout(updateProcess, 100);
    }

    function onClickIndicator(index: number) {
        setLineIndex(index);
        loadNextTagline();
    }

    function onChangeDisplayMode(): void {
        setShowSinglePage(!showSinglePage());
        if (showSinglePage()) {
            clearTimeout(taglineTimer);
            clearTimeout(processTimer);
            setTagline(undefined);
        } else {
            loadNextTagline(0);
        }
    }

    return (
        <div class={style.home} classList={{ [style.mobileHome]: mobileView() }}>
            <div class={style.taglineBody}>
                <div class={style.taglineContainer}>
                    <Show when={!showSinglePage()}>
                        <For each={tagline()?.rows} fallback={<div>Loading...</div>}>
                            {(row) => <TaglineRow row={row} />}
                        </For>
                    </Show>
                    <Show when={showSinglePage()}>
                        <div class={style.taglineSinglePage} innerHTML={singePageHTML()}></div>
                    </Show>
                </div>
            </div>
            <Show when={!mobileView()}>
                <div class={style.taglineFooter}>
                    <Show when={!showSinglePage()}>
                        <div class={style.footerProgressBar}>
                            <For each={allTaglines}>
                                {(tagline, index) => (
                                    <div
                                        class={style.footerIndicator}
                                        classList={{ [style.active]: index() === lineIndex() - 1 }}
                                        onClick={() => onClickIndicator(index())}
                                    >
                                        {index() === lineIndex() - 1 && (
                                            <div class={style.indicatorSlider} style={{ width: process() + "%" }}></div>
                                        )}
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>
                    <div class={style.footerExtraBar} onClick={() => onChangeDisplayMode()}>
                        <Show when={showSinglePage()}>
                            <Icon class={style.footerExtraIcon} path={rectangleStack} />
                            <span>Display one message at a time</span>
                        </Show>
                        <Show when={!showSinglePage()}>
                            <Icon class={style.footerExtraIcon} path={bars_4} />
                            <span>Show all messages</span>
                        </Show>
                    </div>
                </div>
            </Show>
        </div>
    );
};

export default Home;

const TaglineRow: Component<{ row: TaglineWord[] }> = (props) => {
    return (
        <div class={style.taglineRow}>
            <For each={props.row} fallback={<div>??</div>}>
                {(word) => <TaglineBlock word={word} />}
            </For>
        </div>
    );
};

const TaglineBlock: Component<{ word: TaglineWord }> = (props) => {
    onCleanup(() => {
        props.word.setVisible(false);
    });

    function onClickLink(link: string): void {
        if (link) window.open(link, "_blank");
    }

    return (
        <div
            class={style.taglineBlock}
            classList={{
                [style.highlight]: props.word.highlight,
                [style.link]: props.word.isLink,
                [style.invisible]: !props.word.visible(),
            }}
            onClick={() => props.word.isLink && onClickLink(props.word.link)}
        >
            {props.word.text}
        </div>
    );
};

class Tagline {
    public sentence: string = "";
    public rows: TaglineWord[][] = [];

    constructor(sentence: string) {
        this.sentence = sentence;
        this.rows = this._parseText();
    }

    private _parseText(): any[] {
        const letterCount = this.sentence.length;
        const fontSize = 5 - ((letterCount - 70) * 0.5) / 70;

        return this.sentence
            .split("|")
            .map((v) => String(v).trim())
            .filter((v) => v)
            .map((row) => {
                return row
                    .split(" ")
                    .map((v) => String(v).trim())
                    .filter((v) => v)
                    .map((text) => new TaglineWord(text));
            });
    }
}

class TaglineWord {
    public text: string = "";
    public state: string = "ready";

    public highlight: boolean = false;
    public link: string = "";
    public isLink: boolean = false;

    public visible: () => boolean;
    public setVisible: (v: boolean) => number;

    public constructor(text?: string) {
        [this.visible, this.setVisible] = createSignal(false);
        if (text) this.setText(text);
    }

    public setText(str: string): void {
        str = String(str).trim();

        const hlReg = /^\*(.*)\*$/gi,
            linkReg = /^\[(.*)\]\((.*)\)$/gi,
            linkTestReg = /[\.|\/]/gi;

        if (hlReg.test(str)) {
            this.highlight = true;
            this.text = str.replace(hlReg, "$1");
        } else if (linkReg.test(str)) {
            this.text = str.replace(linkReg, "$1");
            this.link = str.replace(linkReg, "$2");

            // if link doesn't contain "." and "/", add "/" at the beginning (consider a local link)
            if (!linkTestReg.test(this.link)) this.link = "/" + this.link;

            // if it's a local link, add the domain. (/tech -> https://bintang.dev/tech)
            if (this.link.startsWith("/")) this.link = window.location.origin + this.link;

            this.isLink = !!this.link;
        } else {
            this.text = str;
        }
    }
}
