import { render, waitFor } from '@testing-library/react';
import { SecoesRelatorioPAP } from './index';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('@/@legacy/redux/modulos/relatorioPAP/actions', () => ({
  setDadosSecoesRelatorioPAP: jest.fn(() => ({ type: 'SET_DADOS_SECOES' })),
  setExibirLoaderRelatorioPAP: jest.fn(() => ({ type: 'SET_LOADER' })),
}));
jest.mock(
  '@/@legacy/servicos/Paginas/Relatorios/PAP/RelatorioPAP/ServicoRelatorioPAP',
  () => ({
    __esModule: true,
    default: {
      obterDadosSecoes: jest.fn(() =>
        Promise.resolve({ data: { secoes: [{ id: 1, nome: 'Secao 1' }] } })
      ),
    },
  })
);
jest.mock('~/servicos', () => ({ erros: jest.fn() }));
jest.mock('../dadosSecoesRelatorioPAP/collapseDadosSecaoRelatorioPAP', () => ({
  __esModule: true,
  default: ({ dados, index }) => (
    <div data-testid="collapse-secao" data-index={index}>
      {dados.nome}
    </div>
  ),
}));

import { useDispatch, useSelector } from 'react-redux';
import ServicoRelatorioPAP from '@/@legacy/servicos/Paginas/Relatorios/PAP/RelatorioPAP/ServicoRelatorioPAP';

describe('SecoesRelatorioPAP', () => {
  let dispatch;
  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
  });

  function setup({
    turmaSelecionada = { turma: 'T1' },
    estudanteSelecionadoRelatorioPAP = { codigoEOL: 123 },
    periodoSelecionadoPAP = { periodoRelatorioPAPId: 1 },
    dadosSecoesRelatorioPAP = { secoes: [{ id: 1, nome: 'Secao 1' }] },
  } = {}) {
    let selectorCalls = 0;
    useSelector.mockImplementation(() => {
      selectorCalls++;
      if (selectorCalls === 1) return { turmaSelecionada };
      if (selectorCalls === 2) return estudanteSelecionadoRelatorioPAP;
      if (selectorCalls === 3) return dadosSecoesRelatorioPAP;
      if (selectorCalls === 4) return periodoSelecionadoPAP;
      return undefined;
    });
    return render(<SecoesRelatorioPAP />);
  }

  it('não renderiza nada se dadosSecoesRelatorioPAP.secoes está vazio', () => {
    const { container } = setup({ dadosSecoesRelatorioPAP: { secoes: [] } });
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza CollapseDadosSecaoRelatorioPAP para cada secao', async () => {
    const { getAllByTestId } = setup();
    await waitFor(() => {
      const secoes = getAllByTestId('collapse-secao');
      expect(secoes).toHaveLength(1);
      expect(secoes[0]).toHaveTextContent('Secao 1');
    });
  });

  it('despacha setDadosSecoesRelatorioPAP([]) se estudanteSelecionadoRelatorioPAP não tem codigoEOL', () => {
    setup({ estudanteSelecionadoRelatorioPAP: {} });
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SET_DADOS_SECOES' })
    );
  });

  it('executa obterDadosSecoes e despacha corretamente quando estudanteSelecionadoRelatorioPAP tem codigoEOL', async () => {
    setup();
    await waitFor(() => {
      expect(ServicoRelatorioPAP.obterDadosSecoes).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'SET_DADOS_SECOES' })
      );
    });
  });

  it('não executa obterDadosSecoes se turmaSelecionada.turma não existir', async () => {
    setup({
      turmaSelecionada: {},
      estudanteSelecionadoRelatorioPAP: { codigoEOL: 123 },
    });

    await waitFor(() => {
      expect(ServicoRelatorioPAP.obterDadosSecoes).not.toHaveBeenCalled();
    });
  });

  it('despacha setDadosSecoesRelatorioPAP([]) quando retorno.data.secoes for undefined', async () => {
    ServicoRelatorioPAP.obterDadosSecoes.mockResolvedValueOnce({
      data: {},
    });
    setup();
    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'SET_DADOS_SECOES' })
      );
    });
  });

  it('despacha setExibirLoaderRelatorioPAP(true) e setExibirLoaderRelatorioPAP(false) ao buscar dados', async () => {
    setup();
    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'SET_LOADER' })
      );
    });
  });

  it('não renderiza nada se dadosSecoesRelatorioPAP for undefined', () => {
    let selectorCalls = 0;
    useSelector.mockImplementation(() => {
      selectorCalls++;
      if (selectorCalls === 1) return { turmaSelecionada: { turma: 'T1' } };
      if (selectorCalls === 2) return { codigoEOL: 123 };
      if (selectorCalls === 3) return undefined;
      if (selectorCalls === 4) return { periodoRelatorioPAPId: 1 };
      return undefined;
    });
    const { container } = render(<SecoesRelatorioPAP />);
    expect(container).toBeEmptyDOMElement();
  });
});
