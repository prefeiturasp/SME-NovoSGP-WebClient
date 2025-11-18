import React from 'react';
import { render } from '@testing-library/react';
import CampoTextoBusca from './campoTextoBusca';
test('renders CampoTextoBusca without crashing', () => {
  render(<CampoTextoBusca />);
});
