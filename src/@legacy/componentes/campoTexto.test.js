import React from 'react';
import { render } from '@testing-library/react';
import CampoTexto from './campoTexto';
test('renders CampoTexto without crashing', () => {
  render(<CampoTexto />);
});
