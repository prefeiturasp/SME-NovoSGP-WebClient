import React from 'react';
import { render } from '@testing-library/react';
import Checkbox from './checkbox';
test('renders Checkbox without crashing', () => {
  render(<Checkbox />);
});
