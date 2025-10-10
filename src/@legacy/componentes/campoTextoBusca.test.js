import React from 'react';
import { render } from '@testing-library/react';
import CampoTextoBusca from './campoTextoBusca';
describe('CampoTextoBusca', () => {
  it('should render without crashing', () => {
    render(<CampoTextoBusca />);
  });
});
