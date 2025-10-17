import React from 'react';
import { render } from '@testing-library/react';
import Label from './label';
describe('Label', () => {
  it('renders without crashing', () => {
    render(<Label>teste</Label>);
  });
});
