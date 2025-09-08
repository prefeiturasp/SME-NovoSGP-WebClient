import { render, fireEvent, waitFor } from '@testing-library/react';
import BotoesAcoesRelatorioPAP from './index';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao', () => ({
  __esModule: true,
  default: ({ onClick }) => (
    <button data-testid="voltar" onClick={onClick}>
      Voltar
    </button>
  ),
}));
jest.mock('~/componentes/button', () => ({
  __esModule: true,
  default: ({ id, label, onClick, disabled }) => (
    <button data-testid={id || label} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
}));
jest.mock('~/componentes/colors', () => ({
  Colors: { Roxo: 'roxo' },
  Base: { CinzaBotao: '#ccc' },
}));
jest.mock('~/componentes-sgp', () => ({
  BotaoCopiarPAP: ({ disabled }) => (
    <button data-testid="copiar" disabled={disabled}>
      Copiar
    </button>
  ),
}));
jest.mock(
  '@/@legacy/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes',
  () => ({
    limparDadosOriginaisQuestionarioDinamico: jest.fn(),
  })
);
jest.mock('@/@legacy/redux/modulos/relatorioPAP/actions', () => ({
  setDesabilitarCamposRelatorioPAP: jest.fn(v => ({
    type: 'SET_DESABILITAR',
    payload: v,
  })),
}));
jest.mock('@/@legacy/servicos', () => ({
  confirmar: jest.fn(),
  verificaSomenteConsulta: jest.fn(),
}));
const salvarMock = jest.fn();
jest.mock(
  '@/@legacy/servicos/Paginas/Relatorios/PAP/RelatorioPAP/ServicoRelatorioPAP',
  () => {
    const salvar = jest.fn();
    const removerArquivo = jest.fn();
    return {
      __esModule: true,
      default: { salvar, removerArquivo },
      salvar,
      removerArquivo,
    };
  }
);
jest.mock('axios', () => ({
  HttpStatusCode: { Ok: 200 },
  CancelToken: { source: () => ({ token: 'token', cancel: jest.fn() }) },
  create: () => ({
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  }),
}));
jest.mock('~/servicos/Validacoes/validacoesInfatil', () => ({
  ehTurmaInfantil: jest.fn(),
}));
jest.mock('~/constantes/ids/button', () => ({
  SGP_BUTTON_CANCELAR: 'SGP_BUTTON_CANCELAR',
  SGP_BUTTON_SALVAR: 'SGP_BUTTON_SALVAR',
  SGP_BUTTON_COPIAR_PAP: 'SGP_BUTTON_COPIAR_PAP',
}));

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { confirmar, verificaSomenteConsulta } from '@/@legacy/servicos';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';

const defaultUsuario = {
  turmaSelecionada: { turma: 'turma 1' },
  permissoes: {
    RELATORIO_PAP: { podeAlterar: true, podeIncluir: true },
  },
};

describe('BotoesAcoesRelatorioPAP', () => {
  let dispatch, navigate;
  beforeEach(() => {
    jest.clearAllMocks();
    dispatch = jest.fn();
    navigate = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    useNavigate.mockReturnValue(navigate);
    useSelector.mockImplementation(fn => {
      if (fn.toString().includes('store => store.usuario'))
        return defaultUsuario;
      if (fn.toString().includes('store => store.filtro.modalidades'))
        return [];
      if (
        fn
          .toString()
          .includes('store => store.relatorioPAP.estudantesRelatorioPAP')
      )
        return [{}, {}];
      if (
        fn
          .toString()
          .includes('store => store.relatorioPAP.desabilitarCamposRelatorioPAP')
      )
        return false;
      if (
        fn
          .toString()
          .includes(
            'store => store.questionarioDinamico.questionarioDinamicoEmEdicao'
          )
      )
        return true;
      if (
        fn
          .toString()
          .includes('store => store.relatorioPAP.periodoSelecionadoPAP')
      )
        return { periodoAberto: true };
      if (
        fn
          .toString()
          .includes(
            'store => store.relatorioPAP.estudanteSelecionadoRelatorioPAP?.ehMatriculadoTurmaPAP'
          )
      )
        return true;
      return defaultUsuario;
    });
    ehTurmaInfantil.mockReturnValue(false);
    verificaSomenteConsulta.mockReturnValue(false);
  });

  it('renderiza todos os botões principais', () => {
    const { getByTestId } = render(<BotoesAcoesRelatorioPAP />);
    expect(getByTestId('voltar')).toBeInTheDocument();
    expect(getByTestId('SGP_BUTTON_CANCELAR')).toBeInTheDocument();
    expect(getByTestId('SGP_BUTTON_SALVAR')).toBeInTheDocument();
    expect(getByTestId('SGP_BUTTON_COPIAR_PAP')).toBeInTheDocument();
  });

  it('chama onClickVoltar e navega corretamente', async () => {
    confirmar.mockResolvedValue(false);
    const { getByTestId } = render(<BotoesAcoesRelatorioPAP />);
    fireEvent.click(getByTestId('voltar'));
    await waitFor(() => expect(navigate).toHaveBeenCalled());
  });

  it('desabilita botão cancelar se desabilitarCamposRelatorioPAP ou questionarioDinamicoEmEdicao for false', () => {
    useSelector.mockImplementation(fn => {
      if (fn.toString().includes('store => store.usuario'))
        return defaultUsuario;
      if (fn.toString().includes('store => store.filtro.modalidades'))
        return [];
      if (
        fn
          .toString()
          .includes('store => store.relatorioPAP.estudantesRelatorioPAP')
      )
        return [{}, {}];
      if (
        fn
          .toString()
          .includes('store => store.relatorioPAP.desabilitarCamposRelatorioPAP')
      )
        return true;
      if (
        fn
          .toString()
          .includes(
            'store => store.questionarioDinamico.questionarioDinamicoEmEdicao'
          )
      )
        return false;
      if (
        fn
          .toString()
          .includes('store => store.relatorioPAP.periodoSelecionadoPAP')
      )
        return { periodoAberto: true };
      if (
        fn
          .toString()
          .includes(
            'store => store.relatorioPAP.estudanteSelecionadoRelatorioPAP?.ehMatriculadoTurmaPAP'
          )
      )
        return true;
      return defaultUsuario;
    });
    const { getByTestId } = render(<BotoesAcoesRelatorioPAP />);
    expect(getByTestId('SGP_BUTTON_CANCELAR')).toBeDisabled();
  });

  it('desabilita botão salvar se turma for infantil', () => {
    ehTurmaInfantil.mockReturnValue(true);
    const { getByTestId } = render(<BotoesAcoesRelatorioPAP />);
    expect(getByTestId('SGP_BUTTON_SALVAR')).toBeDisabled();
  });

  it('desabilita botão copiar se turma for infantil', () => {
    useSelector.mockImplementation(fn => {
      if (fn.toString().includes('store => store.usuario'))
        return defaultUsuario;
      if (fn.toString().includes('store => store.filtro.modalidades'))
        return [];
      if (
        fn
          .toString()
          .includes('store => store.relatorioPAP.estudantesRelatorioPAP')
      )
        return [{}, {}];
      if (
        fn
          .toString()
          .includes('store => store.relatorioPAP.desabilitarCamposRelatorioPAP')
      )
        return false;
      if (
        fn
          .toString()
          .includes(
            'store => store.questionarioDinamico.questionarioDinamicoEmEdicao'
          )
      )
        return true;
      if (
        fn
          .toString()
          .includes('store => store.relatorioPAP.periodoSelecionadoPAP')
      )
        return { periodoAberto: true };
      if (
        fn
          .toString()
          .includes(
            'store => store.relatorioPAP.estudanteSelecionadoRelatorioPAP?.ehMatriculadoTurmaPAP'
          )
      )
        return true;
      return defaultUsuario;
    });
    ehTurmaInfantil.mockReturnValue(true);
    const { getByTestId } = render(<BotoesAcoesRelatorioPAP />);
    expect(getByTestId('SGP_BUTTON_COPIAR_PAP')).toBeDisabled();
  });
});
