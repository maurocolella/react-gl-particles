import { kdTree } from 'kd-tree-javascript';
import memoize from 'memoizee';
import * as PIXI from './pixi.js';
import '../styles/index.scss';

// PIXI initialization.
const pixi = new PIXI.Application({
  // width: 1024,
  // height: 768,
  antialias: true,
  transparent: true,
  resizeTo: window,
});
document.body.appendChild(pixi.view);

const container = new PIXI.Container();
container.interactive = true;
pixi.stage.addChild(container);

const graphics = new PIXI.Graphics();
container.addChild(graphics);

let nearest = null;


class App {
  /**
   * Constructor.
   * @param {*} numPoints
   * @param {*} maxDistance - maximum distance at which to draw connecting lines.
   */
  constructor(numPoints, maxDistance) {
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

    container.on('mousemove', this.handleMousemove);

    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    // Populate point array.
    while(dataLength-- > 0) {
      this.points.push(
        {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          speed: {
            x: (Math.random() + 0.1) * Math.sign((Math.random() + 0.51) - 1),
            y: (Math.random() + 0.1) * Math.sign((Math.random() + 0.51) - 1),
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
  handleMousemove(mouseData) {
    this.mousePoint = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  /**
   *
   * @param {*} event
   */
  handleResize(event) {
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

    const localPoints = [ this.mousePoint, ...this.points ];

    // Compute kdTree
    const tree = new kdTree(localPoints, this.calculateDistance, ['x', 'y']);
    nearest = memoize(tree.nearest, {
      normalizer: function (args) {
          return [JSON.stringify(args[0]), args[1], args[2]];
      }
    });

    // Find all the nearest points within a given radius -> `O(n log n)`
    this.renderPoints = localPoints.map(point => {
      return {
        x: point.x,
        y: point.y,
        nearestSet: nearest(point, this.numPoints + 1, this.maxDistance),
      };
    });

    // All: `O(n * (1 + log n))`
  }

  /**
   * Render updated points.
   */
  draw() {
    // Render result
    // erase what is on the canvas currently
    graphics.clear();

    // For each point
    this.renderPoints.forEach((point) => {
      point.nearestSet.forEach(sibling => {
        graphics.lineStyle(0.7, 0xffffff, 1 - sibling[1] * this.invMaxDistance)
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

const app = new App(100, 100);
app.run();
