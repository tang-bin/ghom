import { timeUtil } from "@btang/ts-lib";
import { createSignal } from "solid-js";

export default class Careers {
    private _jobNameRegex = /^##\s(.*)$/gi;
    private _jobAttrRegex = /^>\s(.*?):(.*)$/gi;
    private _jobFactRegex = /^\-\s(.*)$/gi;

    public jobs: any[] = [];

    constructor() {}

    public load(mdFilePath: string): Promise<Careers> {
        return fetch(mdFilePath)
            .then((res) => res.text())
            .then((text) => this._parseText(text))
            .catch((err) => {
                console.error(err);
                return Promise.resolve(this);
            });
    }

    private _parseText(text: string): Careers {
        let currentJob: any = {};

        String(text || "")
            .split("\n")
            .forEach((line) => {
                line = String(line || "").trim();
                if (!line) return;

                if (this._jobNameRegex.test(line)) {
                    const jobName = String(line.replace(this._jobNameRegex, "$1") || "").trim();
                    if (!jobName) return;
                    currentJob = this.jobs.find((j) => j.name === jobName);
                    if (!currentJob) {
                        currentJob = { facts: [] };
                        this.jobs.push(currentJob);
                    }
                } else if (this._jobAttrRegex.test(line)) {
                    if (!currentJob) return;
                    const attrName = String(line.replace(this._jobAttrRegex, "$1") || "").trim();
                    const attrVal = String(line.replace(this._jobAttrRegex, "$2") || "").trim();
                    if (attrName) currentJob[attrName] = attrVal;
                } else if (this._jobFactRegex.test(line)) {
                    if (!currentJob) return;
                    const fact = String(line.replace(this._jobFactRegex, "$1") || "").trim();
                    if (fact) currentJob.facts.push(fact);
                }
            });

        this.jobs.forEach((job) => {
            // # split did into array
            job.did = job.did
                .split(".")
                .map((line: string) => String(line || "").trim())
                .filter((v: string) => !!v);

            // # format date
            job.fromDate = new Date(job.from);
            job.fromDisplay = timeUtil.formatDate(job.fromDate.getTime(), "Mon, yyyy");

            if (job.to === "now") {
                job.toDate = new Date();
                job.toDisplay = "Present";
            } else {
                job.toDate = new Date(job.to);
                job.toDisplay = timeUtil.formatDate(job.toDate.getTime(), "Mon, yyyy");
            }

            // # format duration
            job.durationDisplay = timeUtil.formatDuring(job.toDate.getTime() - job.fromDate.getTime(), {
                useLabel: true,
                round: "mon",
                separator: "<br>",
            });

            // # add learn more toggle
            const [showMore, setShowMore] = createSignal(false);
            job.showMore = showMore;
            job.setShowMore = setShowMore;
        });

        return this;
    }
}
