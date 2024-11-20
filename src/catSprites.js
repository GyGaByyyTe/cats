import {catSizes} from "./constants.js";

const {Bodies, World, Events} = Matter;
let currentCatSprite;
let nextCatSprite;

export function getRandomCatSize() {
    const randomIndex = Math.floor(Math.random() * (catSizes.length - 3));
    return catSizes[randomIndex];
}

export function getCatTexture(size) {
    /* if (size === catSizes[0]) return 'cat1';
     if (size === catSizes[1]) return 'cat2';
     return 'cat3';*/
    return `${size + 1}`
}

export function displayCurrentCircle(app, currentCircleSize) {
    if (currentCatSprite) {
        app.stage.removeChild(currentCatSprite);
    }
    const currentCircleGraphic = new PIXI.Graphics();
    currentCircleGraphic.beginFill(0x00FF00);
    currentCircleGraphic.drawCircle(0, 0, currentCircleSize * 10);
    currentCircleGraphic.endFill();
    currentCircleGraphic.y = currentCircleSize * 10; // Примерная позиция наверху по высоте
    app.stage.addChild(currentCircleGraphic);
    currentCatSprite = currentCircleGraphic;

    app.view.addEventListener('mousemove', (event) => {
        currentCircleGraphic.x = event.clientX - currentCircleSize / 2;
    });
}

export function displayNextCat(app, nextCatSize) {
    if (nextCatSprite) {
        app.stage.removeChild(nextCatSprite);
    }
    const nextCatTexture = getCatTexture(nextCatSize);
    const nextCatGraphic = new PIXI.Sprite(PIXI.Assets.get(nextCatTexture));
    // const nextCatGraphic = new PIXI.Graphics();
    nextCatGraphic.width = 2 * 10;
    nextCatGraphic.height = 2 * 10;
    // nextCatGraphic.beginFill(0x00FF00);
    // nextCatGraphic.drawCircle(0, 0, 15);
    // nextCatGraphic.endFill();
    nextCatGraphic.x = app.renderer.width - 100;
    nextCatGraphic.y = 50;
    app.stage.addChild(nextCatGraphic);
    nextCatSprite = nextCatGraphic;
}

export function dropCat(engine, app, size, x, y = 0) {
    // const catTexture = getCatTexture(size);
    const catBody = Bodies.circle(x, y, size * 10, {
        restitution: 0.1, friction: 0.5, frictionAir: 0.02, density: 0.01, label: 'Circle Body',
    });
    World.add(engine.world, catBody);
    // const catSprite = new PIXI.Sprite(PIXI.Assets.get(catTexture));
    const catSprite = new PIXI.Graphics();
    // catSprite.width = size * 20;
    // catSprite.height = size * 20;
    // catSprite.anchor.set(0.5);
    catSprite.beginFill(0x0000FF);
    catSprite.drawCircle(0, 0, size * 10);
    catSprite.endFill();
    catSprite.x = catBody.position.x;
    catSprite.y = catBody.position.y;
    // app.stage.addChild(catSprite);

    // New: Add a border for debugging
    const border = createDebugBorder(size, catBody);
    app.stage.addChild(border);
    catBody.sprite = border;

    Events.on(engine, 'afterUpdate', () => {
        catSprite.x = catBody.position.x;
        catSprite.y = catBody.position.y;
        catSprite.rotation = catBody.angle;
        border.x = catBody.position.x;
        border.y = catBody.position.y;
        border.rotation = catBody.angle;
    });
}

export function createDebugBorder(size, catBody) {
    const border = new PIXI.Graphics();
    border.lineStyle(1, 0xFF0000, 1);
    border.drawCircle(0, 0, size * 10);
    border.endFill();
    border.x = catBody.position.x;
    border.y = catBody.position.y;
    border.rotation = catBody.angle;
    return border;
}