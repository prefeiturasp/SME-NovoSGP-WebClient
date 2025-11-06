import React from 'react';
import { render } from '@testing-library/react';
import LinhaTempo from './linhaTempo';
jest.mock('./linhaTempo.css', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

describe('LinhaTempo', () => {
  it('renderiza sem erros', () => {
    const listaDeStatus = [
      {
        titulo: 'Status 1',
        status: 2,
        timestamp: '10:00',
        rf: '123',
        nome: 'João',
      },
      {
        titulo: 'Status 2',
        status: 3,
        timestamp: '11:00',
        rf: '456',
        nome: 'Maria',
      },
    ];
    render(<LinhaTempo listaDeStatus={listaDeStatus} />);
  });
});
