import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PendenciasGerais from './pendenciasGerais';

jest.mock('~/componentes-sgp/cabecalho', () => () => (
  <div data-testid="cabecalho">Pendências</div>
));

jest.mock('~/servicos/Paginas/ServicoPendencias', () => ({
  buscarTurmas: jest.fn(),
  obterPendenciasListaPaginada: jest.fn(),
}));

jest.mock('~/servicos', () => ({
  __esModule: true,
  ServicoRelatorioPendencias: {
    obterTipoPendenciasGrupos: jest.fn(),
  },
}));

const store = configureStore({
  reducer: {
    usuario: () => ({ nome: 'Usuário Teste', rf: '123456' }),
  },
});

const renderWithProvider = ui =>
  render(<Provider store={store}>{ui}</Provider>);

describe('PendenciasGerais (teste simplificado)', () => {
  beforeEach(() => {
    const Servicos = require('~/servicos');
    Servicos.ServicoRelatorioPendencias.obterTipoPendenciasGrupos.mockResolvedValue(
      { data: [] }
    );
  });

  it('renderiza o título "Pendências"', async () => {
    const ServicoPendencias = require('~/servicos/Paginas/ServicoPendencias');
    ServicoPendencias.buscarTurmas.mockResolvedValue({ data: [] });

    renderWithProvider(<PendenciasGerais />);
    expect(await screen.findByText(/Pendências/i)).toBeInTheDocument();
  });

  it('mostra mensagem quando lista vazia', async () => {
    const ServicoPendencias = require('~/servicos/Paginas/ServicoPendencias');
    ServicoPendencias.buscarTurmas.mockResolvedValue({ data: [] });
    ServicoPendencias.obterPendenciasListaPaginada.mockResolvedValue({
      data: { items: [], totalRegistros: 0 },
    });

    renderWithProvider(<PendenciasGerais />);
    expect(
      await screen.findByText('Você não tem nenhuma pendência.')
    ).toBeInTheDocument();
  });

  it('não consulta pendências automaticamente sem tipo selecionado', async () => {
    const ServicoPendencias = require('~/servicos/Paginas/ServicoPendencias');
    ServicoPendencias.buscarTurmas.mockResolvedValue({ data: [] });
    ServicoPendencias.obterPendenciasListaPaginada.mockResolvedValue({
      data: {
        items: [],
        totalRegistros: 0,
      },
    });

    renderWithProvider(<PendenciasGerais />);

    await waitFor(() => {
      expect(ServicoPendencias.buscarTurmas).toHaveBeenCalledTimes(1);
    });

    expect(
      ServicoPendencias.obterPendenciasListaPaginada
    ).not.toHaveBeenCalled();
    expect(
      screen.getByText('Para exibir suas pendências selecione o Tipo desejado.')
    ).toBeInTheDocument();
    expect(screen.getByText('Tipo *')).toBeInTheDocument();
  });
});
