import type { Component } from "solid-js";

import style from "./Home.module.css";

const Home: Component = () => {
    return (
        <>
            <div class={style.home}>
                <div class={style.container}>Green House on Melody</div>
                <div class={style.buttons}>
                    <a href="https://zimo.ghom.io">Zimo</a>
                    <a href="https://bintang.dev">Bin</a>
                </div>
                <div class={style.info}>Website is under construction...</div>
            </div>
        </>
    );
};

export default Home;
