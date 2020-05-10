import React from 'react';
import { render as domRender } from 'react-dom';
import Particles from '../../src/Particles.jsx';

domRender(
  (<Particles color={0x777777} numPoints={144} antialias style={{ position: 'fixed' }} />), document.getElementById('root'),
);
