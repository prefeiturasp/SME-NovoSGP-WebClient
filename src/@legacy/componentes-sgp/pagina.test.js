import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('~/componentes-sgp/navbar/navbar', () => () => (
  <div data-testid="navbar" />
));
jest.mock('@/components/sgp/sider', () => () => <div data-testid="sider" />);
jest.mock('./captura-erros', () => ({ children }) => (
  <div data-testid="captura">{children}</div>
));
jest.mock('./conteudo', () => () => <div data-testid="conteudo" />);
jest.mock('~/paginas/FilaEspera/fila-espera', () => () => (
  <div data-testid="fila" />
));

jest.mock('react-router-dom', () => ({ useNavigate: () => jest.fn() }));
jest.mock('react-redux', () => ({ useSelector: jest.fn() }));

import Pagina from './pagina';
import { useSelector } from 'react-redux';

const mockUseSelector = values => {
  let i = 0;
  useSelector.mockImplementation(() => {
    const val = values[i % values.length];
    i++;
    return val;
  });
};

beforeEach(() => {
  jest.resetAllMocks();
});

test('renderiza Sider e Conteudo quando não está bloqueado', () => {
  mockUseSelector([false, { perfis: [] }, false, {}]);

  render(<Pagina />);

  expect(screen.getByTestId('navbar')).toBeInTheDocument();
  expect(screen.getByTestId('sider')).toBeInTheDocument();
  expect(screen.getByTestId('conteudo')).toBeInTheDocument();
});

test('renderiza FilaEspera quando bloqueado e não é administrador', () => {
  mockUseSelector([
    true,
    { perfis: [] },
    false,
    { administradorSuporte: { login: '' } },
  ]);

  render(<Pagina />);

  expect(screen.getByTestId('fila')).toBeInTheDocument();
  expect(screen.queryByTestId('conteudo')).toBeNull();
});

test('não renderiza FilaEspera quando bloqueado mas usuário é administrador', () => {
  mockUseSelector([
    true,
    { perfis: [{ codigoPerfil: '5be1e074-37d6-e911-abd6-f81654fe895d' }] },
    false,
    {},
  ]);

  render(<Pagina />);

  expect(screen.getByTestId('conteudo')).toBeInTheDocument();
  expect(screen.queryByTestId('fila')).toBeNull();
});

test('pressionar F5 chama confirm e recarrega quando confirmado', () => {
  mockUseSelector([false, { perfis: [] }, false, {}]);

  const originalLocation = window.location;
  try {
    delete window.location;
  } catch (e) {}
  window.location = { reload: jest.fn() };

  const confirmSpy = jest
    .spyOn(window, 'confirm')
    .mockImplementation(() => true);

  render(<Pagina />);

  fireEvent.keyDown(window, { key: 'F5' });

  expect(confirmSpy).toHaveBeenCalled();
  expect(window.location.reload).toHaveBeenCalled();

  confirmSpy.mockRestore();
  window.location = originalLocation;
});

test('pressionar F5 não recarrega quando confirmação é cancelada', () => {
  mockUseSelector([false, { perfis: [] }, false, {}]);

  const originalLocation = window.location;
  try {
    delete window.location;
  } catch (e) {}
  window.location = { reload: jest.fn() };

  const confirmSpy = jest
    .spyOn(window, 'confirm')
    .mockImplementation(() => false);

  render(<Pagina />);

  fireEvent.keyDown(window, { key: 'F5' });

  expect(confirmSpy).toHaveBeenCalled();
  expect(window.location.reload).not.toHaveBeenCalled();

  confirmSpy.mockRestore();
  window.location = originalLocation;
});
