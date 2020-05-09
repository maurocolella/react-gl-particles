import React, { Component } from 'react';
import GLParticles from './lib/GLParticles';

class Particles extends Component {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        // eslint-disable-next-line react/prop-types
        const { color, background, numPoints, maxDistance } = this.props;

        this.backend = new GLParticles({
            canvas: this.canvasRef.current,
            color,
            background,
            numPoints: numPoints | 100,
            maxDistance: maxDistance | 100,
        });
        this.backend.run();
    }

    render() {
        return <canvas ref={this.canvasRef} style={{ width: '100%', height: '100%' }} />;
    }

}

export default Particles;
