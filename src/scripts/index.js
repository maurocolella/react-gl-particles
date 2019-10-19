import { kdTree } from 'kd-tree-javascript';
import '../styles/index.scss';

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
    this.mousePoint = { x: 0, y: 0 };

    let dataLength = numPoints;


    this.display = document.createElement('canvas');
    this.displayCtx = this.display.getContext('2d');

    this.displayBuffer = document.createElement('canvas');
    this.displayBufferCtx = this.display.getContext('2d');

    this.display.addEventListener('mousemove', this.handleMousemove.bind(this));
    document.body.appendChild(this.display);

    window.addEventListener('resize', this.handleResize.bind(this));
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
  handleMousemove(event) {
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

    this.display.width = this.width;
    this.display.height = this.height;

    this.displayBuffer.width = this.width;
    this.displayBuffer.height = this.height;
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

    // Find all the nearest points within a given radius -> `O(n log n)`
    this.renderPoints = localPoints.map(point => {
      return {
        x: point.x,
        y: point.y,
        nearestSet: tree.nearest(point, this.numPoints + 1, this.maxDistance),
      };
    });

    // All: `O(n * (1 + log n))`
  }

  /**
   * Render updated points.
   */
  draw() {
    // Render result, offscreen then transfer

    // erase what is on the canvas currently
    this.displayBufferCtx.clearRect(0, 0, this.width, this.height);
    this.displayBufferCtx.lineWidth = 0.2;

    /* motion blur: this.displayBufferCtx.globalAlpha = 0.9;
    this.displayBufferCtx.fillStyle = 'rgba(0,0,0,0.1)';
    this.displayBufferCtx.fillRect(0, 0, this.width, this.height); */

    // For each point
    this.renderPoints.forEach((point) => {
      point.nearestSet.forEach(sibling => {
        this.displayBufferCtx.strokeStyle=`rgba(255, 255, 255, ${(1 - sibling[1] / this.maxDistance).toFixed(1)})`;
        this.displayBufferCtx.beginPath();
        this.displayBufferCtx.moveTo(point.x, point.y);
        this.displayBufferCtx.lineTo(sibling[0].x, sibling[0].y);
        this.displayBufferCtx.stroke();
      });

      // this.displayBufferCtx.fillRect(point.x - 1, point.y - 1, 2, 2);
    });

    this.displayCtx.drawImage(this.displayBuffer, 0, 0);
  }

  /**
   * Application main.
   */
  run() {
    // Process.
    this.update();

    // Render.
    this.draw();
    window.requestAnimationFrame(this.run.bind(this));
  }
}

const app = new App(144, 100);
app.run();
