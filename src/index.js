import React from 'react';
import { render as domRender } from 'react-dom';
import Particles from './Particles.jsx';

domRender(
  (<Particles color={0xcccccc} numPoints={144} />), document.getElementById('root'),
);
