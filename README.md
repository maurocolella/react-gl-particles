# Particle Network

Also known as distance field, distance graph, particle graph...
Uses PixiJS for rendering with WebGL, which further opens it up for use with custom shaders.



### Installation

```
npm install --save react-gl-particles
```

### Features:

As of version 1.0.2, the component supports the following properties:

| Property     | Type   | Default            | Use                                                         |
| ------------ | ------ | ------------------ | ----------------------------------------------------------- |
| antialias    | bool   | false              |                                                             |
| color        | number | 0xffffff           | Drawing color                                               |
| background   | number | None (transparent) | Background color                                            |
| numPoints    | number | 100                | Number of vertices                                          |
| maxDistance  | number | 100                | Maximum edge length (beyond which edges become transparent) |
| style        | object | None               | React style definitions                                     |
| className    | string | None               | React className                                             |

