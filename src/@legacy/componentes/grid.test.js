import React from 'react';
import { render } from '@testing-library/react';
import grid from './grid';

describe('grid', () => {
  it('should render without crashing', () => {
    render(React.createElement(grid));
  });
});
