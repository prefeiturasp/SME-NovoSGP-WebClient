import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardBuscaAtiva } from './index';
import { ROUTES } from '@/core/enum/routes';
import { useNavigate } from 'react-router-dom';

// Mock de componentes e hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('@/components/lib/header-page', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="header-page">{children}</div>,
}));

jest.mock('@/components/sgp/inputs/form/anoLetivo', () => ({
  __esModule: true,
  default: () => <div data-testid="select-ano-letivo" />,
}));

jest.mock('@/components/sgp/inputs/form/dre', () => ({
  __esModule: true,
  default: () => <div data-testid="select-dre" />,
}));

jest.mock('@/components/sgp/inputs/form/ue', () => ({
  __esModule: true,
  default: () => <div data-testid="select-ue" />,
}));

jest.mock('@/components/sgp/inputs/form/modalidade', () => ({
  __esModule: true,
  default: () => <div data-testid="select-modalidade" />,
}));

jest.mock('@/components/sgp/inputs/form/exibir-historico', () => ({
  __esModule: true,
  default: () => <div data-testid="checkbox-historico" />,
}));

jest.mock('@/components/lib/card-content', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="card-content">{children}</div>,
}));

describe('Componente DashboardBuscaAtiva', () => {
  const mockNavigate = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar todos os componentes principais', () => {
    render(<DashboardBuscaAtiva />);

    expect(screen.getByTestId('header-page')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
    expect(screen.getByTestId('select-ano-letivo')).toBeInTheDocument();
    expect(screen.getByTestId('select-dre')).toBeInTheDocument();
    expect(screen.getByTestId('select-ue')).toBeInTheDocument();
    expect(screen.getByTestId('select-modalidade')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox-historico')).toBeInTheDocument();
  });
});
