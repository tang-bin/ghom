import { type Component, onMount, For, createSignal, Show } from "solid-js";

import style from "./Path.module.less";
import { mobileView } from "../models/state.model";
import Careers from "../models/Careers.model";

const Path: Component = () => {
    const [jobLen, setJobLen] = createSignal(0);
    const [jobs, setJobs] = createSignal<any[]>([]);

    onMount(() => {
        loadData();
    });

    function loadData(): void {
        new Careers().load("/articles/careers.md").then((careers) => {
            const jobs = careers.jobs;
            setJobs(jobs);
            setJobLen(jobs.length);
        });
    }

    return (
        <div class={style.path} classList={{ [style.mobilePath]: mobileView() }}>
            <Show when={mobileView()}>
                <h1 class={style.careersTitle}>Careers</h1>
            </Show>

            <For each={jobs()}>
                {(job, index) => (
                    <div
                        class={style.jobBlock}
                        classList={{
                            [style.firstJob]: index() === jobLen() - 1,
                            [style.lastJob]: index() === 0,
                            [style.mobileView]: mobileView(),
                        }}
                    >
                        <Show when={!mobileView()}>
                            <div class={style.timeTicker}>
                                {index() === 0 && <div>{job.toDisplay}</div>}
                                <div class={style.timeDuration} innerHTML={job.durationDisplay}></div>
                                <div>{job.fromDisplay}</div>
                            </div>
                            <div class={style.timeAxis}></div>
                        </Show>

                        <div class={style.jobContent} classList={{ [style.mobileView]: mobileView() }}>
                            <div class={style.jobCompany}>
                                <span class={style.jobTitle}>{job.title}</span>
                                <span>, </span>
                                <Show when={job.website}>
                                    <a href={job.website} target="_blank">
                                        {job.company}
                                    </a>
                                </Show>
                                <Show when={!job.website}>{job.company}</Show>
                            </div>

                            <Show when={mobileView()}>
                                <div class={style.inContentTime}>
                                    From <b>{job.fromDisplay}</b> to <b>{job.toDisplay}</b>
                                </div>
                            </Show>

                            <div class={style.jobUse}>{job.use}</div>
                            <ul class={style.jobDidList}>
                                <For each={job.did}>{(item) => <li class={style.jobDidItem}>{item}</li>}</For>
                            </ul>
                            <div>
                                <div class={style.factToggle} onClick={() => job.setShowMore(!job.showMore())}>
                                    <Show when={job.showMore()}>Hide</Show>
                                    <Show when={!job.showMore()}>Learn more...</Show>
                                </div>
                                <Show when={job.showMore()}>
                                    <ul class={style.factList}>
                                        <For each={job.facts}>{(fact) => <li class={style.factItem}>{fact}</li>}</For>
                                    </ul>
                                </Show>
                            </div>
                        </div>
                    </div>
                )}
            </For>
        </div>
    );
};

export default Path;
