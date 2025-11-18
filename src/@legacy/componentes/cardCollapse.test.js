import React from 'react';
import { render } from '@testing-library/react';
import CardCollapse from './cardCollapse';
test('renders CardCollapse without crashing', () => {
  render(<CardCollapse />);
});
