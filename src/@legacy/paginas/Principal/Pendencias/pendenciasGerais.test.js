import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PendenciasGerais from './pendenciasGerais';

jest.mock('~/componentes-sgp/cabecalho', () => () => (
  <div data-testid="cabecalho">Pendências</div>
));

jest.mock('~/componentes/select', () => {
  const React = require('react');

  return ({
    id,
    label,
    lista,
    valueOption,
    valueText,
    valueSelect,
    placeholder,
    onChange,
    labelRequired,
  }) => (
    <label>
      <span>
        {label}
        {labelRequired ? <span>*</span> : null}
      </span>
      <select
        data-testid={id}
        value={valueSelect || ''}
        onChange={event => onChange(event.target.value || undefined)}
      >
        <option value="">{placeholder}</option>
        {Array.isArray(lista) &&
          lista.map(item => (
            <option key={item[valueOption]} value={item[valueOption]}>
              {item[valueText]}
            </option>
          ))}
      </select>
    </label>
  );
});

jest.mock('~/servicos/Paginas/ServicoPendencias', () => ({
  buscarTurmas: jest.fn(),
  obterPendenciasListaPaginada: jest.fn(),
}));

jest.mock('~/servicos', () => ({
  __esModule: true,
  erros: jest.fn(),
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
    jest.clearAllMocks();

    const Servicos = require('~/servicos');
    Servicos.ServicoRelatorioPendencias.obterTipoPendenciasGrupos.mockResolvedValue(
      { data: [] }
    );
  });

  it('renderiza o título "Pendências"', async () => {
    const ServicoPendencias = require('~/servicos/Paginas/ServicoPendencias');
    ServicoPendencias.buscarTurmas.mockResolvedValue({ data: [] });

    renderWithProvider(<PendenciasGerais />);
    expect(await screen.findByTestId('cabecalho')).toHaveTextContent(
      'Pendências'
    );
  });

  it('mostra mensagem quando lista vazia depois de selecionar um tipo', async () => {
    const Servicos = require('~/servicos');
    const ServicoPendencias = require('~/servicos/Paginas/ServicoPendencias');
    Servicos.ServicoRelatorioPendencias.obterTipoPendenciasGrupos.mockResolvedValue(
      {
        data: [{ valor: 1, descricao: 'Frequência' }],
      }
    );
    ServicoPendencias.buscarTurmas.mockResolvedValue({ data: [] });
    ServicoPendencias.obterPendenciasListaPaginada.mockResolvedValue({
      data: { items: [], totalRegistros: 0 },
    });

    renderWithProvider(<PendenciasGerais />);

    await screen.findByText('Frequência');
    await waitFor(() => {
      expect(ServicoPendencias.buscarTurmas).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(await screen.findByTestId('SGP_SELECT_TIPO_PENDENCIA'), {
      target: { value: '1' },
    });

    await waitFor(() => {
      expect(
        ServicoPendencias.obterPendenciasListaPaginada
      ).toHaveBeenCalledWith(undefined, '1', '', undefined, undefined);
    });

    expect(
      await screen.findByText(
        'Não há pendências deste tipo a serem exibidas.'
      )
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
      screen.getByText('Para exibir as pendências selecione o Tipo desejado.')
    ).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('Tipo')).toBeInTheDocument();
  });
});
