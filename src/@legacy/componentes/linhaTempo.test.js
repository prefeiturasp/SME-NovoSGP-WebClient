import React from 'react';
import { render } from '@testing-library/react';
import LinhaTempo from './linhaTempo/linhaTempo';

jest.mock('./linhaTempo/linhaTempo.css', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

describe('LinhaTempo', () => {
  it('renderiza sem erros', () => {
    const listaDeStatus = [{ titulo: 'Status 1' }, { titulo: 'Status 2' }];
    render(<LinhaTempo listaDeStatus={listaDeStatus} />);
  });
});
