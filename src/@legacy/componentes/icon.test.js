import React from 'react';
import { render } from '@testing-library/react';
import icon from './icon';

describe('icon', () => {
  it('should render without crashing', () => {
    render(React.createElement(icon));
  });
});
