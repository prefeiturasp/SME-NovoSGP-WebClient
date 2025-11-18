import React from 'react';
import { render } from '@testing-library/react';
import Button from './button';
test('renders Button without crashing', () => {
  render(<Button />);
});
