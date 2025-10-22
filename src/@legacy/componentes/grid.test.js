import React from 'react';
import { render } from '@testing-library/react';
import Grid from './grid';
test('renders Grid without crashing', () => {
  render(<Grid>teste</Grid>);
});
