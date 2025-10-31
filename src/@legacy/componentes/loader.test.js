import React from 'react';
import { render } from '@testing-library/react';
import loader from './loader';

describe('loader', () => {
  it('should render without crashing', () => {
    render(React.createElement(loader));
  });
});
