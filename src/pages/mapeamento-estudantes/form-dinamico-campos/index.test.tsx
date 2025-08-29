import { render, screen, waitFor } from '@testing-library/react';
import { useAppDispatch, useAppSelector } from '@/core/hooks/use-redux';
import mapeamentoEstudantesService from '@/core/services/mapeamento-estudantes-service';
import { FormDinamicoMapeamentoEstudantesCampos } from './index';
import { setExibirLoaderMapeamentoEstudantes } from '~/redux/modulos/mapeamentoEstudantes/actions';
import '@testing-library/jest-dom';
import QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';

jest.mock('@/core/hooks/use-redux');
jest.mock('@/core/services/mapeamento-estudantes-service');
jest.mock('~/redux/modulos/mapeamentoEstudantes/actions', () => ({
  setExibirLoaderMapeamentoEstudantes: jest.fn(() => ({ type: 'SET_LOADER' })),
}));
jest.mock('~/componentes-sgp/QuestionarioDinamico/questionarioDinamico', () => (props: any) => (
  <div data-testid="questionario-dinamico">
    <button data-testid="onchange-btn" onClick={props.onChangeQuestionario}>
      Disparar onChange
    </button>
  </div>
));
jest.mock('@/components/sgp/auditoria', () => ({
  Auditoria: (props: any) => <div data-testid="auditoria">{JSON.stringify(props)}</div>,
}));

jest.mock('@ckeditor/ckeditor5-build-classic', () => ({
  __esModule: true,
  default: class {},
}));
jest.mock('@ckeditor/ckeditor5-build-classic/build/translations/pt-br', () => ({}));

jest.mock('@ckeditor/ckeditor5-react', () => ({
  __esModule: true,
  default: function MockCKEditor() {
    return <div data-testid="mock-ckeditor" />;
  },
}));
jest.mock('~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes', () => ({
  __esModule: true,
  default: {
    guardarSecaoEmEdicao: jest.fn(),
  },
}));

describe('FormDinamicoMapeamentoEstudantesCampos', () => {
  const dispatch = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(dispatch);
  });

  const baseState = {
    usuario: { turmaSelecionada: { id: 1 } },
    mapeamentoEstudantes: {
      dadosAlunoObjectCard: { codigoEOL: 123 },
      bimestreSelecionado: 1,
      desabilitarCamposMapeamentoEstudantes: false,
    },
  };

  it('não renderiza nada se questionario está vazio', async () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) => fn(baseState));
    (mapeamentoEstudantesService.obterQuestionario as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: [],
    });
    const secao = {
      id: 1,
      questionarioId: 2,
      nome: 'Secao Teste',
      concluido: 'false',
      etapa: 1,
      ordem: 1,
      obrigatoria: false,
      auditoria: {
        id: 1,
        criadoEm: '2023-01-01T00:00:00Z',
        criadoRF: '123456',
        alteradoEm: '2023-01-02T00:00:00Z',
        alteradoRF: '654321',
        criadoPor: 'user',
        alteradoPor: 'user2',
      },
      tipoQuestionario: 1,
      modalidadesCodigo: [],
    };
    const { container } = render(
      <FormDinamicoMapeamentoEstudantesCampos secao={secao} mapeamentoEstudanteId={10} />,
    );
    await waitFor(() => {
      expect(mapeamentoEstudantesService.obterQuestionario).toHaveBeenCalled();
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza QuestionarioDinamico e Auditoria quando há questões', async () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) => fn(baseState));
    (mapeamentoEstudantesService.obterQuestionario as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: [{ id: 99, texto: 'Questão' }],
    });
    const secao = {
      id: 1,
      questionarioId: 2,
      nome: 'Secao Teste',
      concluido: 'false',
      etapa: 1,
      ordem: 1,
      obrigatoria: false,
      auditoria: {
        id: 1,
        criadoEm: '2023-01-01T00:00:00Z',
        criadoRF: '123456',
        alteradoEm: '2023-01-02T00:00:00Z',
        alteradoRF: '654321',
        criadoPor: 'user',
        alteradoPor: 'user2',
      },
      tipoQuestionario: 1,
      modalidadesCodigo: [],
    };
    render(<FormDinamicoMapeamentoEstudantesCampos secao={secao} mapeamentoEstudanteId={10} />);
    expect(await screen.findByTestId('questionario-dinamico')).toBeInTheDocument();
    expect(await screen.findByTestId('auditoria')).toBeInTheDocument();
  });

  it('chama setExibirLoaderMapeamentoEstudantes ao montar e ao finalizar', async () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) => fn(baseState));
    (mapeamentoEstudantesService.obterQuestionario as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: [],
    });
    const secao = {
      id: 1,
      questionarioId: 2,
      nome: 'Secao Teste',
      concluido: 'false',
      etapa: 1,
      ordem: 1,
      obrigatoria: false,
      auditoria: {
        id: 1,
        criadoEm: '2023-01-01T00:00:00Z',
        criadoRF: '123456',
        alteradoEm: '2023-01-02T00:00:00Z',
        alteradoRF: '654321',
        criadoPor: 'user',
        alteradoPor: 'user2',
      },
      tipoQuestionario: 1,
      modalidadesCodigo: [],
    };
    render(<FormDinamicoMapeamentoEstudantesCampos secao={secao} mapeamentoEstudanteId={10} />);
    await waitFor(() => {
      expect(setExibirLoaderMapeamentoEstudantes).toHaveBeenCalledWith(true);
      expect(setExibirLoaderMapeamentoEstudantes).toHaveBeenCalledWith(false);
    });
  });

  it('não renderiza nada se resposta.sucesso for false', async () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) => fn(baseState));
    (mapeamentoEstudantesService.obterQuestionario as jest.Mock).mockResolvedValue({
      sucesso: false,
      dados: [{ id: 99, texto: 'Questão' }],
    });
    const secao = {
      id: 1,
      questionarioId: 2,
      nome: 'Secao Teste',
      concluido: 'false',
      etapa: 1,
      ordem: 1,
      obrigatoria: false,
      auditoria: {
        id: 1,
        criadoEm: '2023-01-01T00:00:00Z',
        criadoRF: '123456',
        alteradoEm: '2023-01-02T00:00:00Z',
        alteradoRF: '654321',
        criadoPor: 'user',
        alteradoPor: 'user2',
      },
      tipoQuestionario: 1,
      modalidadesCodigo: [],
    };
    const { container } = render(
      <FormDinamicoMapeamentoEstudantesCampos secao={secao} mapeamentoEstudanteId={10} />,
    );
    await waitFor(() => {
      expect(mapeamentoEstudantesService.obterQuestionario).toHaveBeenCalled();
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('chama guardarSecaoEmEdicao ao disparar onChangeQuestionario', async () => {
    (useAppSelector as jest.Mock).mockImplementation((fn) => fn(baseState));
    (mapeamentoEstudantesService.obterQuestionario as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: [{ id: 99, texto: 'Questão' }],
    });
    const secao = {
      id: 1,
      questionarioId: 2,
      nome: 'Secao Teste',
      concluido: 'false',
      etapa: 1,
      ordem: 1,
      obrigatoria: false,
      auditoria: {
        id: 1,
        criadoEm: '2023-01-01T00:00:00Z',
        criadoRF: '123456',
        alteradoEm: '2023-01-02T00:00:00Z',
        alteradoRF: '654321',
        criadoPor: 'user',
        alteradoPor: 'user2',
      },
      tipoQuestionario: 1,
      modalidadesCodigo: [],
    };
    render(<FormDinamicoMapeamentoEstudantesCampos secao={secao} mapeamentoEstudanteId={10} />);
    const btn = await screen.findByTestId('onchange-btn');
    btn.click();
    expect(QuestionarioDinamicoFuncoes.guardarSecaoEmEdicao).toHaveBeenCalledWith(secao.id);
  });
});
