import { kdTree } from 'kd-tree-javascript';
import '../styles/index.scss';

class App {
  constructor(numPoints, maxDistance) {
    this.points = [];
    this.numPoints = numPoints;
    this.maxDistance = Math.pow(maxDistance, 2);
    this.width = 1024;
    this.height = 768;

    let dataLength = numPoints;


    this.display = document.createElement('canvas');
    this.displayCtx = this.display.getContext('2d');
    document.body.appendChild(this.display);

    this.displayBuffer = document.createElement('canvas');
    this.displayBufferCtx = this.display.getContext('2d');
    this.displayBufferCtx.fillStyle = '#000';
    this.displayBufferCtx.lineWidth='1';

    this.display.width = this.width;
    this.display.height = this.height;

    this.displayBuffer.width = this.width;
    this.displayBuffer.height = this.height;


    // Iterate.
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

  distance(point1, point2) {
    return Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2);
  }

  clip(val, max) {
    const clipped = val % max;
    return clipped > 0 ? clipped : clipped + max;
  }

  draw() {
    // Render result, offscreen then transfer

    // erase what is on the canvas currently
    this.displayBufferCtx.clearRect(0, 0, this.width, this.height);

    // Compute kdTree
    const tree = new kdTree(this.points, this.distance, ['x', 'y']);

    // For each point
    this.points.forEach((point) => {

      // Find all the nearest points within a given radius -> `O(n log n)`
      const nearestSet = tree.nearest(point, this.numPoints, this.maxDistance);

      nearestSet.forEach(sibling => {
        this.displayBufferCtx.strokeStyle=`rgba(127, 127, 127, ${(1 - sibling[1] / this.maxDistance).toFixed(1)})`;
        this.displayBufferCtx.beginPath();
        this.displayBufferCtx.moveTo(point.x, point.y);
        this.displayBufferCtx.lineTo(sibling[0].x, sibling[0].y);
        this.displayBufferCtx.stroke();
      });

      this.displayBufferCtx.fillRect(point.x - 1, point.y - 1, 2, 2);
    });

    this.displayCtx.drawImage(this.displayBuffer, 0, 0);
  }

  render() {
    // Move points -> `O(n)`
    this.points = this.points.map(point => {
      return {
        x: this.clip(point.x + point.speed.x, this.width),
        y: this.clip(point.y + point.speed.y, this.height),
        speed: point.speed,
      };
    });


    // Then process deltas, and render result onscreen
    this.draw();
    window.requestAnimationFrame(this.render.bind(this));
  }
}

const app = new App(127, 100);
app.render();
