import React from 'react';
import { render } from '@testing-library/react';
import TabelaRetratil from './index';

describe('TabelaRetratil', () => {
  it('renderiza sem erros', () => {
    render(<TabelaRetratil />);
  });
});
