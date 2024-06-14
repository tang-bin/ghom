import { Accessor, Component, For, Setter, Show, Signal, createEffect, createSignal, onMount } from "solid-js";
import style from "./Menu.module.less";
import { setPageView, pageView, mobileView, scrollScale } from "../models/state.model";

import { Icon } from "solid-heroicons";
import { map, square_3Stack_3d, puzzlePiece, envelope } from "solid-heroicons/solid";

import homeImg from "../../assets/img/avatar_1.png";
import LinkedInIcon from "../display/linkedin";

const MENU_ITEMS = [
    ["path", "icon", "Career Path", "Throughout the years I have worked for…"],
    ["tech", "icon", "Tech Stack", "All the skills I have acquired or am acquiring…"],
    ["home", "img", "Bin Tang", "Living My Dev Life"],
    ["email", "icon", "Email", "catchall@ghom.io"],
    ["linkedin", "linkedin", "LinkedIn", "https://www.linkedin.com/in/bin-tang/"],
    ["playground", "icon", "Playground", "This page is used for testing"],
];

const icons: { [name: string]: any } = {
    path: map,
    tech: square_3Stack_3d,
    playground: puzzlePiece,
    email: envelope,
};

const images: { [name: string]: any } = {
    home: homeImg,
};

// reference to the menu div
let menuRef: HTMLDivElement;

let tileSize: number = 5;
let tileSmRate: number = 0.35;
let tileDiagonal: number = 17; // tileSize * 2 * 1.414
let tileGap: number = 1;

const Menu: Component = () => {
    // # prepare tile data
    const allTiles = MENU_ITEMS.map((d) => new TileData(d));

    onMount(() => {
        if (menuRef) {
            // # read css variable values to calculate tile size
            const styles = getComputedStyle(menuRef);
            tileSize = Number(styles.getPropertyValue("--tile-size").trim().replace("rem", ""));
            tileDiagonal = tileSize * 2 * 1.414;
            tileSmRate = Number(styles.getPropertyValue("--tile-sm-rate").trim());
        }
    });

    createEffect(() => {
        const homeTile = allTiles.find((tile) => tile.isHome);

        if (mobileView()) {
            setPageView("");
            setTilePosition();
            homeTile?.setScale(scrollScale());
            homeTile?.setTop(-7 * (1 - scrollScale()) + "rem");
        } else {
            if (!pageView()) setPageView("home");
            homeTile?.setScale(1);
            homeTile?.setTop("0");
            setTilePosition();
        }
    });

    // # set tile position
    function setTilePosition(): void {
        if (mobileView()) {
            allTiles.forEach((tile) => {
                tile.setTop("0");
                tile.setLeft("0");
            });
        } else {
            const totalLength = allTiles.reduce((d, tile) => d + tile.diagonal, 0) + tileGap * (allTiles.length - 1);
            let curSpot = -totalLength / 2;
            allTiles.forEach((tile) => {
                const top = curSpot + tile.diagonal / 2 + "rem";
                tile.setTop(top);
                curSpot += tile.diagonal + tileGap;
            });
        }
    }

    function onClickTile(tile: TileData) {
        switch (tile.name) {
            case "email":
                window.open("mailto:catchall@ghom.io");
                break;
            case "linkedin":
                window.open("https://www.linkedin.com/in/bin-tang/", "_blank");
                break;
            default:
                setPageView(tile.name);
                // # replace the URL to make it relavant to the view
                history.replaceState({ additionalInformation: "Replaced the URL" }, "", "/" + pageView());
                break;
        }
    }

    // # render
    return (
        <div class={style.menu} classList={{ [style.onMobile]: mobileView() }} ref={menuRef}>
            <For each={allTiles}>
                {(tile) => (
                    <Show when={!mobileView() || tile.isHome}>
                        <DiamondTile tile={tile} onClick={() => onClickTile(tile)} />
                    </Show>
                )}
            </For>
        </div>
    );
};

export default Menu;

const DiamondTile: Component<{ tile: TileData; onClick: (tile: TileData) => void }> = (prop) => {
    return (
        <div
            class={style.diamondTile}
            style={{
                top: prop.tile.top(),
                left: prop.tile.left(),
                transform: `scale(${prop.tile.scale()})`,
            }}
            onClick={() => prop.onClick(prop.tile)}
            classList={{ [style.active]: pageView() === prop.tile.name }}
        >
            <Show when={!mobileView()}>
                <div class={style.tileLabelBg}></div>
                <div class={style.tileLabel} classList={prop.tile.sizeClassList}>
                    {prop.tile.label}
                </div>
                <div class={style.tileInfo} classList={prop.tile.sizeClassList}>
                    {prop.tile.info}
                </div>
            </Show>
            <div class={style.tileBody} classList={prop.tile.sizeClassList}>
                <div class={style.tileBg}></div>
                <div class={style.tileFt}>
                    <div class={style.tileContainer}>
                        {prop.tile.iconType === "icon" && <Icon path={icons[prop.tile.name]} class={style.tileIcon} />}
                        {prop.tile.iconType === "img" && (
                            <img
                                src={images[prop.tile.name]}
                                class={style.tileImg}
                                classList={prop.tile.sizeClassList}
                            />
                        )}
                        {prop.tile.iconType === "linkedin" && <LinkedInIcon class={style.tileIcon} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

class TileData {
    public name: string = "";
    public iconType: string = "";
    public label: string = "";
    public info?: string;
    public diagonal: number = 0; // diagonal length when displayed as a diamond, in rem
    public sizeClassList = {};

    public get isHome(): boolean {
        return this.name === "home";
    }

    public top: Accessor<string>;
    public setTop: Setter<string>;

    public left: Accessor<string>;
    public setLeft: Setter<string>;

    public scale: Accessor<number>;
    public setScale: Setter<number>;

    constructor(d: any[]) {
        this.name = d[0];
        this.iconType = d[1];
        this.label = d[2];
        this.info = d[3] || "";

        [this.top, this.setTop] = createSignal("0");
        [this.left, this.setLeft] = createSignal("0");
        [this.scale, this.setScale] = createSignal(1);

        // calculate size (diagonal length)
        this.sizeClassList = {
            [style.smSize]: !this.isHome,
        };

        this.diagonal = tileDiagonal * (this.isHome ? 1 : tileSmRate);
    }
}
