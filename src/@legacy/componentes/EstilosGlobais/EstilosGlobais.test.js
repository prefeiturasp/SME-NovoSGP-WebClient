import React from 'react';
import { render } from '@testing-library/react';
import { Linha } from './index';

describe('EstilosGlobais', () => {
  it('renderiza Linha sem erros', () => {
    render(<Linha />);
  });
});
