import React from 'react';
import { render } from '@testing-library/react';
import { Linha } from './EstilosGlobais/index';

describe('EstilosGlobais', () => {
  it('renderiza Linha sem erros', () => {
    render(<Linha />);
  });
});
