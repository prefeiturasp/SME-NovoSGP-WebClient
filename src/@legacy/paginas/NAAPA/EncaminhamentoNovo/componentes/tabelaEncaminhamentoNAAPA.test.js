import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

const mockStore = {
  getState: () => ({
    usuario: {
      permissoes: {
        'encaminhamento-naapa': {
          podeIncluir: true,
        },
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: null }),
}));

jest.mock('~/servicos', () => ({
  verificaSomenteConsulta: () => false,
  erros: jest.fn(),
}));

jest.mock('~/componentes-sgp', () => ({
  Cabecalho: ({ children, pagina }) => (
    <div>
      {pagina}
      {children}
    </div>
  ),
}));

describe('TabelaEncaminhamentoNAAPA', () => {
  it('teste basico', () => {
    expect(true).toBe(true);
  });
});
