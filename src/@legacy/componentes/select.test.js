import React from 'react';
import { render } from '@testing-library/react';
import select from './select';

describe('select', () => {
  it('should render without crashing', () => {
    render(React.createElement(select));
  });
});
