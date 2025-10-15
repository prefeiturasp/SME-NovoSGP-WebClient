import React from 'react';
import { render } from '@testing-library/react';
import Collapse from './collapse';
describe('Collapse', () => {
  it('should render without crashing', () => {
    render(<Collapse />);
  });
});
