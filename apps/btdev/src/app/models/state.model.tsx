import { createMemo, createSignal } from "solid-js";

// Create a reactive signal for 'view'
const [pageView, setPageView] = createSignal("home");
const [mobileView, setMobileView] = createSignal(false);
const [bodyScrollTop, setBodyScrollTop] = createSignal(0);
const scrollScale = createMemo(() => {
    if (!mobileView()) return 1;
    const maxScrollPixel = 100,
        minPct = 0.5;
    if (bodyScrollTop() > 100) return minPct;
    else return ((100 - bodyScrollTop()) * (1 - minPct)) / maxScrollPixel + minPct;
});

export { pageView, setPageView, mobileView, setMobileView, setBodyScrollTop, scrollScale };
