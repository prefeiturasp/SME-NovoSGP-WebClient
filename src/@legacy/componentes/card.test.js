import React from 'react';
import { render } from '@testing-library/react';
import Card from './card';
test('renders Card without crashing', () => {
  render(<Card>teste</Card>);
});
