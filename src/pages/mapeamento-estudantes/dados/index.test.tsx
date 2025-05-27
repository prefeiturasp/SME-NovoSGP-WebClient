import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useAppDispatch, useAppSelector } from '@/core/hooks/use-redux';
import mapeamentoEstudantesService from '@/core/services/mapeamento-estudantes-service';
import { DadosMapeamentoEstudantes } from './index';
import {
  setLimparDadosQuestionarioDinamico,
  setListaSecoesEmEdicao,
  setQuestionarioDinamicoEmEdicao,
} from '@/@legacy/redux/modulos/questionarioDinamico/actions';
import {
  limparDadosMapeamentoEstudantes,
  setDadosAlunoObjectCard,
  setEstudantesMapeamentoEstudantes,
} from '~/redux/modulos/mapeamentoEstudantes/actions';
import '@testing-library/jest-dom';

jest.mock('@/core/hooks/use-redux');
jest.mock('@/core/services/mapeamento-estudantes-service');
jest.mock('@/@legacy/redux/modulos/questionarioDinamico/actions', () => ({
  setLimparDadosQuestionarioDinamico: jest.fn(() => ({ type: 'LIMPAR_DADOS_QUESTIONARIO' })),
  setListaSecoesEmEdicao: jest.fn(() => ({ type: 'LIMPAR_SECOES_EDICAO' })),
  setQuestionarioDinamicoEmEdicao: jest.fn(() => ({ type: 'SET_EDICAO' })),
}));
jest.mock('~/redux/modulos/mapeamentoEstudantes/actions', () => ({
  limparDadosMapeamentoEstudantes: jest.fn(() => ({ type: 'LIMPAR_DADOS_MAPEAMENTO' })),
  setDadosAlunoObjectCard: jest.fn(() => ({ type: 'SET_DADOS_ALUNO' })),
  setEstudantesMapeamentoEstudantes: jest.fn(() => ({ type: 'SET_ESTUDANTES' })),
}));
jest.mock('../object-card', () => ({
  ObjectCardMapeamentoEstudantes: () => <div data-testid="object-card" />,
}));
jest.mock('../form-dinamico-secoes', () => ({
  FormDinamicoMapeamentoEstudantesSecoes: () => <div data-testid="form-dinamico-secoes" />,
}));
jest.mock('../tabela-retratil', () => ({
  TabelaRetratilMapeamentoEstudantes: ({
    children,
    onChangeAlunoSelecionado,
    permiteOnChangeAluno,
  }: any) => {
    return (
      <div data-testid="tabela-retratil">
        {children}
        <button
          data-testid="trocar-aluno"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            const codigoEOL = target.getAttribute('data-codigo-eol');
            onChangeAlunoSelecionado({ codigoEOL: codigoEOL ? Number(codigoEOL) : 999 });
          }}
        />
        <button data-testid="permite-troca" onClick={permiteOnChangeAluno} />
      </div>
    );
  },
}));
jest.mock(
  '~/componentes-sgp/QuestionarioDinamico/Componentes/ModalErrosQuestionarioDinamico/modalErrosQuestionarioDinamico',
  () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="modal-erros">{props.mensagem}</div>,
  }),
);

describe('DadosMapeamentoEstudantes', () => {
  const dispatch = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(dispatch);
  });

  const baseState = {
    usuario: { turmaSelecionada: { turma: 'turma', anoLetivo: 2024 } },
    mapeamentoEstudantes: {
      dadosAlunoObjectCard: { codigoEOL: 123 },
      bimestreSelecionado: 1,
    },
  };

  it('não renderiza nada se não houver bimestreSelecionado', () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) =>
      fn({
        ...baseState,
        mapeamentoEstudantes: { ...baseState.mapeamentoEstudantes, bimestreSelecionado: undefined },
      }),
    );
    const { container } = render(<DadosMapeamentoEstudantes />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza componentes principais quando há dados', () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) => fn(baseState));
    render(<DadosMapeamentoEstudantes />);
    expect(screen.getByTestId('tabela-retratil')).toBeInTheDocument();
    expect(screen.getByTestId('object-card')).toBeInTheDocument();
    expect(screen.getByTestId('modal-erros')).toBeInTheDocument();
    expect(screen.getByTestId('form-dinamico-secoes')).toBeInTheDocument();
  });

  it('não renderiza ModalErros e FormDinamico se não houver aluno selecionado', () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) =>
      fn({
        ...baseState,
        mapeamentoEstudantes: {
          ...baseState.mapeamentoEstudantes,
          dadosAlunoObjectCard: undefined,
        },
      }),
    );
    render(<DadosMapeamentoEstudantes />);
    expect(screen.queryByTestId('modal-erros')).not.toBeInTheDocument();
    expect(screen.queryByTestId('form-dinamico-secoes')).not.toBeInTheDocument();
  });

  it('chama obterEstudantes se turma, anoLetivo e bimestreSelecionado existem', () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) => fn(baseState));
    render(<DadosMapeamentoEstudantes />);
    expect(mapeamentoEstudantesService.obterEstudantes).toHaveBeenCalled();
  });

  it('chama setEstudantesMapeamentoEstudantes([]) se faltar turma ou anoLetivo', () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) =>
      fn({
        ...baseState,
        usuario: { turmaSelecionada: { turma: undefined, anoLetivo: undefined } },
      }),
    );
    render(<DadosMapeamentoEstudantes />);
    expect(setEstudantesMapeamentoEstudantes).toHaveBeenCalledWith([]);
  });

  it('ao trocar aluno, limpa dados e seta novo aluno', async () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) => fn(baseState));
    render(<DadosMapeamentoEstudantes />);
    const btn = screen.getByTestId('trocar-aluno');
    btn.click();
    await waitFor(() => {
      expect(limparDadosMapeamentoEstudantes).toHaveBeenCalled();
      expect(setLimparDadosQuestionarioDinamico).toHaveBeenCalled();
      expect(setListaSecoesEmEdicao).toHaveBeenCalled();
      expect(setQuestionarioDinamicoEmEdicao).toHaveBeenCalledWith(false);
      expect(setDadosAlunoObjectCard).toHaveBeenCalled();
    });
  });

  it('não troca aluno se o código EOL for igual', () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) => fn(baseState));
    render(<DadosMapeamentoEstudantes />);
    const btn = screen.getByTestId('trocar-aluno');
    btn.setAttribute('data-codigo-eol', '123');
    fireEvent.click(btn);
    expect(setDadosAlunoObjectCard).not.toHaveBeenCalled();
  });

  it('permiteOnChangeAluno chama mapeamentoEstudantesService.salvar', async () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) => fn(baseState));
    (mapeamentoEstudantesService.salvar as jest.Mock).mockResolvedValue(true);
    render(<DadosMapeamentoEstudantes />);
    const btn = screen.getByTestId('permite-troca');
    btn.click();
    await waitFor(() => {
      expect(mapeamentoEstudantesService.salvar).toHaveBeenCalledWith(false);
    });
  });
});
