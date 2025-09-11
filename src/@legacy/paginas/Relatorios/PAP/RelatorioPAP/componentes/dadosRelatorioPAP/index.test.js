import { render, waitFor } from '@testing-library/react';
import DadosRelatorioPAP from './index';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('~/componentes/colors', () => ({
  Colors: { Roxo: 'roxo' },
  Base: { CinzaBotao: '#ccc' },
}));
jest.mock('antd', () => ({
  Col: ({ children }) => <div data-testid="col">{children}</div>,
}));
jest.mock(
  '@/@legacy/componentes-sgp/QuestionarioDinamico/Componentes/ModalErrosQuestionarioDinamico/modalErrosQuestionarioDinamico',
  () => () => <div data-testid="modal-erros" />
);
jest.mock('../botaoOrdenarListaAlunosPAP', () => () => (
  <div data-testid="botao-ordenar" />
));
jest.mock('../objectCardRelatorioPAP', () => () => (
  <div data-testid="object-card" />
));
jest.mock('../secoes', () => () => <div data-testid="secoes" />);
jest.mock('../tabelaRetratilRelatorioPAP', () => ({ children, ...props }) => (
  <div data-testid="tabela-retratil">{children}</div>
));
jest.mock(
  '@/@legacy/servicos/Paginas/Relatorios/PAP/RelatorioPAP/ServicoRelatorioPAP',
  () => {
    const obterListaAlunos = jest.fn(() =>
      Promise.resolve({ data: [{ codigoEOL: 1 }] })
    );
    const salvar = jest.fn(() => Promise.resolve(true));
    return { __esModule: true, default: { obterListaAlunos, salvar } };
  }
);
jest.mock('~/servicos', () => ({
  ServicoCalendarios: {
    obterFrequenciaAluno: jest.fn(() => Promise.resolve({ data: 99 })),
  },
  erros: jest.fn(),
}));
jest.mock('@/@legacy/redux/modulos/relatorioPAP/actions', () => ({
  limparDadosRelatorioPAP: jest.fn(() => ({ type: 'LIMPAR' })),
  setEstudanteSelecionadoRelatorioPAP: jest.fn(() => ({
    type: 'SET_ESTUDANTE',
  })),
  setEstudantesRelatorioPAP: jest.fn(() => ({ type: 'SET_ESTUDANTES' })),
  setExibirLoaderRelatorioPAP: jest.fn(() => ({ type: 'SET_LOADER' })),
}));
jest.mock('@/@legacy/redux/modulos/questionarioDinamico/actions', () => ({
  setLimparDadosQuestionarioDinamico: jest.fn(() => ({ type: 'LIMPAR_QD' })),
  setListaSecoesEmEdicao: jest.fn(() => ({ type: 'LIMPAR_SECOES' })),
  setQuestionarioDinamicoEmEdicao: jest.fn(() => ({ type: 'SET_QD_EDICAO' })),
}));

import { useDispatch, useSelector } from 'react-redux';
import ServicoRelatorioPAP from '@/@legacy/servicos/Paginas/Relatorios/PAP/RelatorioPAP/ServicoRelatorioPAP';

describe('DadosRelatorioPAP', () => {
  let dispatch;
  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
  });

  function setup({
    periodoSelecionadoPAP = {
      periodoRelatorioPAP: true,
      periodoRelatorioPAPId: 1,
    },
    estudanteSelecionadoRelatorioPAP = { codigoEOL: 1 },
    turmaSelecionada = { turma: 'turma 1' },
  } = {}) {
    let selectorCalls = 0;
    useSelector.mockImplementation(fn => {
      selectorCalls++;
      if (selectorCalls === 1) return { turmaSelecionada };
      if (selectorCalls === 2) return estudanteSelecionadoRelatorioPAP;
      if (selectorCalls === 3) return periodoSelecionadoPAP;
      return undefined;
    });
    return render(<DadosRelatorioPAP />);
  }

  it('não renderiza nada se periodoSelecionadoPAP.periodoRelatorioPAP não existe', () => {
    const { container } = setup({ periodoSelecionadoPAP: {} });
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza botao ordenar, tabela e subcomponentes quando estudante selecionado', () => {
    const { getByTestId } = setup();
    expect(getByTestId('botao-ordenar')).toBeInTheDocument();
    expect(getByTestId('tabela-retratil')).toBeInTheDocument();
    expect(getByTestId('modal-erros')).toBeInTheDocument();
    expect(getByTestId('object-card')).toBeInTheDocument();
    expect(getByTestId('secoes')).toBeInTheDocument();
  });

  it('renderiza tabela sem subcomponentes se estudanteSelecionadoRelatorioPAP não tem codigoEOL', () => {
    const { getByTestId, queryByTestId } = setup({
      estudanteSelecionadoRelatorioPAP: {},
    });
    expect(getByTestId('tabela-retratil')).toBeInTheDocument();
    expect(queryByTestId('modal-erros')).toBeNull();
    expect(queryByTestId('object-card')).toBeNull();
    expect(queryByTestId('secoes')).toBeNull();
  });

  it('chama obterListaAlunos ao montar se periodoSelecionadoPAP.periodoRelatorioPAP existe', async () => {
    setup();
    await waitFor(() => {
      expect(ServicoRelatorioPAP.obterListaAlunos).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalled();
    });
  });
});
