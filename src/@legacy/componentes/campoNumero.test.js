import React from 'react';
import { render } from '@testing-library/react';
import CampoNumero from './campoNumero';
describe('CampoNumero', () => {
  it('renders without crashing', () => {
    render(<CampoNumero />);
  });
});
