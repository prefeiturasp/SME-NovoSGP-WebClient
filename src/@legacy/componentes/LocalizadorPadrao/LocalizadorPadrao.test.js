import React from 'react';
import { render } from '@testing-library/react';
import LocalizadorPadrao from './index';

describe('LocalizadorPadrao', () => {
  it('renderiza sem erros', () => {
    render(<LocalizadorPadrao />);
  });
});
