import React from 'react';
import { render } from '@testing-library/react';
import Collapse from './collapse';
test('renders Collapse without crashing', () => {
  render(<Collapse />);
});
