import { createEffect, createMemo, onMount, type Component } from "solid-js";

import { mobileView, pageView, scrollScale, setBodyScrollTop, setMobileView, setPageView } from "./models/state.model";

import style from "./Main.module.less";
import Menu from "./layouts/Menu.component";
import Home from "./views/Home.component";
import Test from "./views/Test.component";
import Path from "./views/Path.component";
import Tech from "./views/Tech.component";
import { scale } from "solid-heroicons/solid";

const Main: Component = () => {
    onMount(() => {
        const view: string = String(window.location.pathname.split("/").pop()).trim();
        if (!view) setPageView("home");
        else if (["path", "tech", "playground"].includes(view)) setPageView(view || "home");

        checkMobileView();
        window.addEventListener("resize", checkMobileView);
    });

    createEffect(() => {});

    const barHeight = createMemo(() => {
        if (mobileView()) return `calc(7rem * ${scrollScale()})`;
        else return "100vh";
    });

    function checkMobileView(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;
        setMobileView(width < 1000);
    }

    function onScrollBody(event: Event) {
        const target = event.target as HTMLElement;
        setBodyScrollTop(target.scrollTop || 0);
    }

    return (
        <>
            <div class={style.mainBody} classList={{ [style.mobileMainBody]: mobileView() }} onScroll={onScrollBody}>
                {(mobileView() || pageView() === "home") && <Home />}
                {(mobileView() || pageView() === "path") && <Path />}
                {(mobileView() || pageView() === "tech") && <Tech />}
                {pageView() === "playground" && <Test />}
            </div>
            <div
                classList={{ [style.sidebar]: !mobileView(), [style.banner]: mobileView() }}
                style={{ height: barHeight() }}
            ></div>
            <Menu />
        </>
    );
};

export default Main;
