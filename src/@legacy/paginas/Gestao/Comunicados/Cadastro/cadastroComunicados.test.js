import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import CadastroComunicados from './CadastroComunicados';
import { ROUTES } from '@/core/enum/routes';
import { setBreadcrumbManual, verificaSomenteConsulta } from '~/servicos';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock('~/servicos', () => ({
  setBreadcrumbManual: jest.fn(),
  verificaSomenteConsulta: jest.fn(),
}));
jest.mock('~/componentes', () => {
  const React = require('react');
  return {
    Card: ({ children }) =>
      React.createElement('div', { 'data-testid': 'card' }, children),
  };
});
jest.mock('~/componentes-sgp', () => {
  const React = require('react');
  return {
    Cabecalho: ({ children, pagina }) =>
      React.createElement(
        'div',
        { 'data-testid': 'cabecalho' },
        React.createElement('span', null, pagina),
        children
      ),
  };
});
jest.mock('./botoesAcoesCadastroComunicados', () => {
  const React = require('react');
  return props =>
    React.createElement(
      'div',
      { 'data-testid': 'botoes' },
      JSON.stringify(props)
    );
});
jest.mock('./Filtros/formCadastroComunicados', () => {
  const React = require('react');
  return props =>
    React.createElement(
      'div',
      { 'data-testid': 'form' },
      JSON.stringify(props)
    );
});
jest.mock('./loaderGeralComunicados', () => {
  const React = require('react');
  return ({ children }) =>
    React.createElement('div', { 'data-testid': 'loader' }, children);
});

describe('CadastroComunicados', () => {
  const mockLocation = { pathname: '/cadastro' };
  const mockParams = { id: '123' };
  const mockUsuario = {
    permissoes: {
      [ROUTES.ACOMPANHAMENTO_COMUNICADOS]: ['PERMISSAO'],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useLocation.mockReturnValue(mockLocation);
    useParams.mockReturnValue(mockParams);
    useSelector.mockImplementation(cb => cb({ usuario: mockUsuario }));
  });

  it('renderiza corretamente quando não é somente consulta', () => {
    verificaSomenteConsulta.mockReturnValue(false);

    const React = require('react');
    render(React.createElement(CadastroComunicados));

    expect(setBreadcrumbManual).toHaveBeenCalledWith(
      mockLocation.pathname,
      'Cadastro de comunicados',
      ROUTES.ACOMPANHAMENTO_COMUNICADOS
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByTestId('cabecalho')).toHaveTextContent(
      'Cadastro de comunicados'
    );
    expect(screen.getByTestId('botoes')).toHaveTextContent(
      '"somenteConsulta":false'
    );
    expect(screen.getByTestId('form')).toHaveTextContent(
      '"somenteConsulta":false'
    );
  });

  it('renderiza corretamente quando é somente consulta', () => {
    verificaSomenteConsulta.mockReturnValue(true);

    const React = require('react');
    render(React.createElement(CadastroComunicados));

    expect(verificaSomenteConsulta).toHaveBeenCalledWith(
      mockUsuario.permissoes[ROUTES.ACOMPANHAMENTO_COMUNICADOS]
    );
    expect(screen.getByTestId('botoes')).toHaveTextContent(
      '"somenteConsulta":true'
    );
    expect(screen.getByTestId('form')).toHaveTextContent(
      '"somenteConsulta":true'
    );
  });
});
