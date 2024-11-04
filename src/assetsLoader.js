import {catSizes} from "./constants.js";

export async function loadResources() {
    await PIXI.Assets.init({
        manifest: {
            bundles: [{
                name: 'cats', assets: catSizes.reduce((acc, size) => {
                    acc[size] = `assets/${size}.png`;

                    return acc;
                }, {}),
            }]
        }
    });
    await PIXI.Assets.loadBundle('cats');
}

