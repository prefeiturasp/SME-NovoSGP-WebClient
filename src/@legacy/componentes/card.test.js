import React from 'react';
import { render } from '@testing-library/react';
import Card from './card';
describe('Card', () => {
  it('renders without crashing', () => {
    render(<Card>teste</Card>);
  });
});