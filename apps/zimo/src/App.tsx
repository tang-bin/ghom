import type { Component } from "solid-js";

import styles from "./App.module.css";
import img1 from "./assets/img1.png";

const App: Component = () => {
    return (
        <>
            <div class={styles.retangle}></div>
            <div class={styles.text}>
                <h1>About me</h1>
                <p class={styles.aboutme}>
                    Hi! I am Zimo Tang, a 12 year old (human) living in the US (on Earth). My hobbies are chess,
                    programming, Legos, and air hockey. I hope to one day become an FM in chess and an engineer.
                    "Believe in yourself as if your life depends on it. Because it does." ~ Anonymous{" "}
                </p>
                <img src={img1} class={styles.image} />
                <h1>Achievements :)</h1>
                <h1>Stuff I've made :D</h1>
                <h2>Cooking Show (School Project)</h2>
                <video width="470" height="260" controls>
                    <source src="" type="video/mp4" />
                </video>
                <h2>Game</h2>
                <a href="game.html">
                    <img src={img1} class={styles.image} alt="Placeholder Image" />
                </a>
            </div>
        </>
    );
};

export default App;
