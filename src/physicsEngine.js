import {catSizes} from "./constants.js";
import {dropCat} from "./catSprites.js";

export const engine = Matter.Engine.create();
export const runner = Matter.Runner.create();
export const world = engine.world;
const {Bodies, World} = Matter;

export function setupBoundaries() {
    const boundaries = [Bodies.rectangle(400, 610, 800, 60, {isStatic: true}), // Bottom
        Bodies.rectangle(400, -10, 800, 60, {isStatic: true}), // Top
        Bodies.rectangle(810, 300, 60, 600, {isStatic: true}), // Right
        Bodies.rectangle(-10, 300, 60, 600, {isStatic: true}), // Left
    ];
    World.add(world, boundaries);
}

export function handleCollision(app) {
    return (event) => {
        const pairs = event.pairs;
        pairs.forEach(pair => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;
            if (bodyA.label === 'Circle Body' && bodyB.label === 'Circle Body') {
                if (bodyA.circleRadius === bodyB.circleRadius) {
                    console.log('bodyA.circleRadius',bodyA.circleRadius)
                    const newSizeIndex = catSizes.indexOf(bodyA.circleRadius / 10);
                    console.log('newSizeIndex',newSizeIndex)
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