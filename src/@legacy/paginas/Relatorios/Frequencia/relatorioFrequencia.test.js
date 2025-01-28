import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RelatorioFrequencia from './relatorioFrequencia';
import { BrowserRouter } from 'react-router-dom';

beforeAll(() => {
  global.matchMedia =
    global.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      };
    };
});

const mockStore = configureStore({
  reducer: {
    usuario: (state = { id: 1, nome: 'Test User' }) => state,
  },
});

const sucesso = {
  sucesso: true,
  mensagem: 'Relatório gerado com sucesso',
};

jest.mock('~/servicos/Paginas/FiltroRelatorio/ServicoFiltroRelatorio', () => ({
  obterModalidadesPorAbrangencia: jest
    .fn()
    .mockResolvedValue([{ valor: 'M1', descricao: 'Modalidade 1' }]),
}));

jest.mock(
  '~/servicos/Paginas/Relatorios/Frequencia/ServicoRelatorioFrequencia',
  () => ({
    gerarRelatorio: jest.fn().mockResolvedValue(sucesso),
  })
);

describe('RelatorioFrequencia Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar corretamente o componente', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <RelatorioFrequencia />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Tipo de relatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Frequência/i)).toBeInTheDocument();

    expect(screen.getAllByText(/Ano Letivo/i)[0]).toBeInTheDocument();
    expect(
      screen.getAllByText(/Diretoria Regional de Educação \(DRE\)/i)[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Unidade Escolar \(UE\)/i)[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Diretoria Regional de Educação \(DRE\)/i)[0]
    ).toBeInTheDocument();
  });
});
