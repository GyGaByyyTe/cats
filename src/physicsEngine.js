import {catSizes} from "./constants.js";
import {dropCat} from "./catSprites.js";

export const engine = Matter.Engine.create();
export const runner = Matter.Runner.create();
export const world = engine.world;
const {Bodies, World} = Matter;

const THICKNESS = 10
const X = 400
const Y = 0
const WIDTH = 400
const HEIGHT = 600


function createBoundaryGraphics(boundary, index) {
    const graphics = new PIXI.Graphics();
    if (index === 0) {
        graphics.beginFill(0x111111);
    }
    if (index === 1) {
        graphics.beginFill(0xFF0000);
    }
    if (index === 2) {
        graphics.beginFill(0x00FF00);
    }
    if (index === 3) {
        graphics.beginFill(0x0000FF);
    }
    const x1 = boundary.bounds.min.x
    const y1 = boundary.bounds.min.y
    const x2 = boundary.bounds.max.x - boundary.bounds.min.x
    const y2 = boundary.bounds.max.y - boundary.bounds.min.y
    graphics.rect(x1, y1, x2, y2)
    graphics.endFill();

    return graphics;
}


export function setupBoundaries(app) {
    const wallX = WIDTH / 2
    const wallY = HEIGHT * 4 / 6
    const wallHeight = HEIGHT * 2 / 3
    const boundaries = [Bodies.rectangle(X, Y + HEIGHT - THICKNESS / 2, WIDTH, THICKNESS, {isStatic: true}), // Bottom
        Bodies.rectangle(X + wallX, Y + HEIGHT * 4 / 6, THICKNESS, wallHeight, {isStatic: true}), // Right
        Bodies.rectangle(X - wallX, Y + HEIGHT * 4 / 6, THICKNESS, wallHeight, {isStatic: true}), // Right
    ];
    World.add(world, boundaries);

    boundaries.forEach((boundary, index) => {
        const boundaryGraphics = createBoundaryGraphics(boundary, index);
        app.stage.addChild(boundaryGraphics);
    });
}

export function handleCollision(app) {
    return (event) => {
        const pairs = event.pairs;
        pairs.forEach(pair => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;
            if (bodyA.label === 'Circle Body' && bodyB.label === 'Circle Body') {
                if (bodyA.circleRadius === bodyB.circleRadius) {
                    console.log('bodyA.circleRadius', bodyA.circleRadius)
                    const newSizeIndex = catSizes.indexOf(bodyA.circleRadius / 10);
                    console.log('newSizeIndex', newSizeIndex)
                    if (newSizeIndex !== -1 && newSizeIndex < catSizes.length - 1) {
                        const newSize = catSizes[newSizeIndex + 1];
                        const newX = (bodyA.position.x + bodyB.position.x) / 2;
                        const newY = (bodyA.position.y + bodyB.position.y) / 2;

                        World.remove(world, [bodyA, bodyB]);
                        app.stage.removeChild(bodyA.sprite);
                        app.stage.removeChild(bodyB.sprite);
                        dropCat(engine, app, newSize, newX, newY);
                    }
                }
            }
        });
    }
}