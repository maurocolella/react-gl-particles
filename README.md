# Distance field animation (with/without KD-Trees)

Forked from: "a lightweight foundation for your next webpack based frontend project."
[https://github.com/wbkd/webpack-starter.git](https://github.com/wbkd/webpack-starter.git)

Someone on the issue tracker of particles.js mentioned using KD-Trees. Someone mentioned
using webgl. ~~Both of these made a lot of sense.~~

**EDIT: Nope. Not. All things considered, due to the dynamic nature of the render, it hasn't proved trivial to maintain a kd-tree updated all along.**

I am still providing the code. As an experiment, along with a reference implementation that just renders distances between dots in *O(N^2)*.


### Installation

```
npm install
```

### Start Dev Server

```
npm start
```

### Build Prod Version

```
npm run build
```

### Features:

* ES6 Support via [babel](https://babeljs.io/) (v7)
* SASS Support via [sass-loader](https://github.com/jtangelder/sass-loader)
* Linting via [eslint-loader](https://github.com/MoOx/eslint-loader)

When you run `npm run build` we use the [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) to move the css to a separate file. The css file gets included in the head of the `index.html`.
