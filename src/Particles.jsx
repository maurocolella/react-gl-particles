import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GLParticles from './lib/GLParticles';

class Particles extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    static propTypes = {
        antialias: PropTypes.bool,
        color: PropTypes.number,
        background: PropTypes.number,
        numPoints: PropTypes.number,
        maxDistance: PropTypes.number,
        style: PropTypes.shape({}),
        className: PropTypes.string,
    };

    componentDidMount() {
        // eslint-disable-next-line react/prop-types
        const {
            antialias,
            color,
            background,
            numPoints,
            maxDistance,
        } = this.props;

        this.backend = new GLParticles({
            antialias: antialias !== undefined,
            canvas: this.canvasRef.current,
            color,
            background,
            numPoints: numPoints | 100,
            maxDistance: maxDistance | 100,
        });
        this.backend.run();
    }

    render() {
        const { style, className } = this.props;

        return <canvas
            ref={this.canvasRef}
            style={style}
            className={className}
        />;
    }

}

export default Particles;
