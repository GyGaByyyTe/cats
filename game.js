import {loadResources} from './src/assetsLoader.js';
import {displayCurrentCircle, displayNextCat, dropCat, getRandomCatSize,} from './src/catSprites.js';
import {engine, handleCollision, runner, setupBoundaries} from './src/physicsEngine.js';

// Aliases
const Events = Matter.Events;
const Runner = Matter.Runner;

// Create PixiJS Application
const app = new PIXI.Application()
await app.init({
    width: 800, height: 600, backgroundColor: 0xffffff, // width: 800, height: 600,
});
document.body.appendChild(app.canvas);


let currentCatSize = getRandomCatSize();
let nextCatSize = getRandomCatSize();
console.log('first cat size', currentCatSize);
console.log('next cat size', nextCatSize);

async function setup() {
    await loadResources();
    setupBoundaries(app)
    Runner.run(runner, engine);
    displayCurrentCircle(app, currentCatSize);
    displayNextCat(app, nextCatSize);
    app.view.addEventListener('click', (event) => {
        let x = event.clientX;
        dropCat(engine, app, currentCatSize, x);
        currentCatSize = nextCatSize;
        nextCatSize = getRandomCatSize();
        displayCurrentCircle(app, currentCatSize);
        displayNextCat(app, nextCatSize);
    });
    Events.on(engine, 'collisionStart', handleCollision(app));
}

// Стабильный тик
app.ticker.add((delta) => {
    Matter.Engine.update(engine, delta * 16.666); // 16.666 миллисекунд для 60 кадров в секунду
});


setup();