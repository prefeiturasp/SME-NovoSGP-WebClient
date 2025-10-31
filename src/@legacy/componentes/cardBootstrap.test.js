import React from 'react';
import { render } from '@testing-library/react';
import CardBootstrap from './cardBootstrap';
test('renders CardBootstrap without crashing', () => {
  render(<CardBootstrap>teste</CardBootstrap>);
});
