import * as PIXI from './pixi.js';

class GLParticles {
    /**
     * Constructor.
     * @param {*} numPoints
     * @param {*} maxDistance - maximum distance at which to draw connecting lines.
     */
    constructor({
        canvas,
        color,
        background,
        numPoints,
        maxDistance,
        antialias,
    }) {
        // PIXI initialization.
        const pixi = new PIXI.Application({
            antialias,
            transparent: background === undefined,
            backgroundColor: background,
            resizeTo: canvas,
            view: canvas,
            width: screen.width,
            height: screen.height,
        });

        const container = new PIXI.Container();
        container.interactive = true;
        container.interactiveChildren = false;
        container.sortDirty = false;
        pixi.stage.addChild(container);

        this.graphics = new PIXI.Graphics();
        container.addChild(this.graphics);

        this.color = color !== undefined ? color : 0xffffff;
        this.background = background !== undefined ? background : 0x000000;
        this.points = [];
        this.renderPoints = [];
        this.numPoints = numPoints;
        this.maxDistance = Math.pow(maxDistance, 2);
        this.invMaxDistance = 1 / this.maxDistance;
        this.mousePoint = { x: 0, y: 0 };

        let dataLength = numPoints;

        this.run = this.run.bind(this);
        this.handleMousemove = this.handleMousemove.bind(this);
        this.handleResize = this.handleResize.bind(this);

        container.on('pointermove', this.handleMousemove);

        window.addEventListener('resize', this.handleResize);
        this.handleResize();

        // Populate point array.
        while (dataLength-- > 0) {
            this.points.push(
                {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    speed: {
                        x: (Math.random() + 0.1) * Math.sign((Math.random() + 0.51) - 1) * 0.5,
                        y: (Math.random() + 0.1) * Math.sign((Math.random() + 0.51) - 1) * 0.5,
                    }
                }
            );
        }
    }

    /**
     * Distance calculation function for KD tree. Simplified: we compare to h pow 2 directly.
     * @param {*} point1
     * @param {*} point2
     */
    calculateDistance(point1, point2) {
        return Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2);
    }

    /**
     * Clip a value to a 0-n interval.
     * @param {*} val
     * @param {*} max
     */
    clipValue(val, max) {
        const clipped = val % max;
        return clipped > 0 ? clipped : clipped + max;
    }

    /**
     *
     * @param {*} event
     */
    handleMousemove() {
        this.mousePoint = {
            x: event.clientX,
            y: event.clientY,
        };
    }

    /**
     *
     * @param {*} event
     */
    handleResize() {
        this.width = window.innerWidth; // / window.devicePixelRatio;
        this.height = window.innerHeight; // / window.devicePixelRatio;
    }

    /**
     * Update all point offsets.
     */
    update() {
        // Move points -> `O(n)`
        this.points = this.points.map(point => {
            return {
                x: this.clipValue(point.x + point.speed.x, this.width),
                y: this.clipValue(point.y + point.speed.y, this.height),
                speed: point.speed,
            };
        });

        const localPoints = [this.mousePoint, ...this.points];

        // Find all the nearest points within a given radius -> `O(n log n)`
        this.renderPoints = localPoints.map((point, index) => {
            const otherPoints = this.renderPoints.slice();
            otherPoints.splice(index, 1);

            return {
                x: point.x,
                y: point.y,
                nearestSet: otherPoints
                    .map((sibling) => [sibling, this.calculateDistance(point, sibling)])
                    .filter((sibling) => sibling[1] < this.maxDistance),
            };
        });
    }

    /**
     * Render updated points.
     */
    draw() {
        // Render result
        // erase what is on the canvas currently
        this.graphics.clear();

        // For each point
        this.renderPoints.forEach((point) => {
            point.nearestSet.forEach(sibling => {
                this.graphics.lineStyle(1, this.color, 0.4 * (1 - sibling[1] * this.invMaxDistance), 0.5, true)
                    .moveTo(point.x, point.y)
                    .lineTo(sibling[0].x, sibling[0].y);
            });
        });
    }

    /**
     * Application main.
     */
    run() {
        // Process.
        this.update();

        // Render.
        this.draw();
        window.requestAnimationFrame(this.run);
    }
}

export default GLParticles;
