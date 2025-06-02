import { render, screen, cleanup } from '@testing-library/react';
import { useAppSelector } from '@/core/hooks/use-redux';
import { MapeamentoEstudantes } from './index';
import { useDispatch } from 'react-redux';
import {
  setBimestreSelecionado,
  setDesabilitarCamposMapeamentoEstudantes,
  setEstudantesMapeamentoEstudantes,
  limparDadosMapeamentoEstudantes,
} from '~/redux/modulos/mapeamentoEstudantes/actions';
import {
  setLimparDadosQuestionarioDinamico,
  setListaSecoesEmEdicao,
} from '~/redux/modulos/questionarioDinamico/actions';
import { verificaSomenteConsulta, ehTurmaInfantil } from '~/servicos';
import { ROUTES } from '@/core/enum/routes';

jest.mock('@/components/sgp/alertas/sem-turma-selecionada', () => ({
  AlertaSemTurmaSelecionada: () => <div data-testid="alerta-sem-turma" />,
}));
jest.mock('~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil', () => ({
  __esModule: true,
  default: () => <div data-testid="alerta-infantil" />,
}));
jest.mock('./loader', () => ({
  LoaderMapeamentoEstudantes: ({ children }: any) => <div data-testid="loader-map">{children}</div>,
}));
jest.mock('~/componentes-sgp', () => ({
  Cabecalho: ({ children }: any) => <div data-testid="cabecalho">{children}</div>,
}));
jest.mock('./botoes-acoes', () => ({
  BotoesAcoesMapeamentoEstudantes: () => <div data-testid="botoes-acoes" />,
}));
let mockBimestresNull = false;
let mockDadosNull = false;

jest.mock('./bimestres', () => ({
  BimestresMapeamentoEstudantes: () => (mockBimestresNull ? null : <div data-testid="bimestres" />),
}));
jest.mock('./dados', () => ({
  DadosMapeamentoEstudantes: () => (mockDadosNull ? null : <div data-testid="dados" />),
}));
jest.mock('~/componentes', () => ({
  Base: {
    CinzaBordaCalendario: '#ccc',
  },
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
}));
// Mocks dos hooks e serviços
jest.mock('@/core/hooks/use-redux');
jest.mock('react-redux');
jest.mock('~/servicos/Validacoes/validacoesInfatil');
jest.mock('~/servicos');

describe('MapeamentoEstudantes', () => {
  let dispatchMock: jest.Mock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(dispatchMock);
    dispatchMock.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  function mockStore(usuarioReturn: any, modalidades: any) {
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      if (String(selector).includes('usuario')) {
        return { permissoes: {}, ...usuarioReturn };
      }
      if (String(selector).includes('filtro') && String(selector).includes('modalidades')) {
        return modalidades;
      }
      return undefined;
    });
  }

  it('chama setDesabilitarCamposMapeamentoEstudantes no useEffect com true quando sem permissão', () => {
    const permissoesTela = { podeAlterar: false, podeIncluir: false };
    mockStore(
      { turmaSelecionada: null, permissoes: { [ROUTES.MAPEAMENTO_ESTUDANTES]: permissoesTela } },
      [],
    );

    (verificaSomenteConsulta as jest.Mock).mockReturnValue(false);

    render(<MapeamentoEstudantes />);

    expect(verificaSomenteConsulta).toHaveBeenCalledWith(permissoesTela);
    expect(dispatchMock).toHaveBeenCalledWith(setDesabilitarCamposMapeamentoEstudantes(true));
  });

  it('chama setDesabilitarCamposMapeamentoEstudantes com false quando consulta-only ou com permissão', () => {
    const turma = { turma: 'TURMA1', modalidade: 'X' };
    const permissoesTela = { podeAlterar: true, podeIncluir: false };

    mockStore(
      { turmaSelecionada: turma, permissoes: { [ROUTES.MAPEAMENTO_ESTUDANTES]: permissoesTela } },
      ['algumaModalidade'],
    );
    (verificaSomenteConsulta as jest.Mock).mockReturnValue(true);

    render(<MapeamentoEstudantes />);
    expect(dispatchMock).toHaveBeenCalledWith(setDesabilitarCamposMapeamentoEstudantes(true));

    dispatchMock.mockClear();
    mockStore(
      { turmaSelecionada: turma, permissoes: { [ROUTES.MAPEAMENTO_ESTUDANTES]: permissoesTela } },
      ['algumaModalidade'],
    );
    (verificaSomenteConsulta as jest.Mock).mockReturnValue(false);

    render(<MapeamentoEstudantes />);
    expect(dispatchMock).toHaveBeenCalledWith(setDesabilitarCamposMapeamentoEstudantes(false));
  });

  it('não renderiza bimestres nem dados quando não há turmaSelecionada', () => {
    mockBimestresNull = true;
    mockDadosNull = true;

    const turma = { turma: 'TURMA1', modalidade: 'X' };
    const permissoesTela = { podeAlterar: true, podeIncluir: true };
    mockStore(
      { turmaSelecionada: turma, permissoes: { [ROUTES.MAPEAMENTO_ESTUDANTES]: permissoesTela } },
      ['algumaModalidade'],
    );
    (verificaSomenteConsulta as jest.Mock).mockReturnValue(false);

    render(<MapeamentoEstudantes />);

    expect(screen.queryByTestId('bimestres')).toBeNull();
    expect(screen.queryByTestId('dados')).toBeNull();

    mockBimestresNull = false;
    mockDadosNull = false;
  });

  it('renderiza bimestres e dados quando há turmaSelecionada e não é infantil', () => {
    const turma = { turma: 'TURMA1', modalidade: 'X' };
    const permissoesTela = { podeAlterar: true, podeIncluir: true };
    mockStore(
      { turmaSelecionada: turma, permissoes: { [ROUTES.MAPEAMENTO_ESTUDANTES]: permissoesTela } },
      ['algumaModalidade'],
    );
    (verificaSomenteConsulta as jest.Mock).mockReturnValue(false);
    (ehTurmaInfantil as jest.Mock).mockReturnValue(false);

    render(<MapeamentoEstudantes />);

    expect(screen.getByTestId('bimestres')).toBeInTheDocument();
    expect(screen.getByTestId('dados')).toBeInTheDocument();
  });

  it('não renderiza bimestres nem dados quando turmaSelecionada é infantil', () => {
    mockBimestresNull = true;
    mockDadosNull = true;

    const turma = { turma: 'TURMA2', modalidade: 'INFANTIL' };
    mockStore(
      {
        turmaSelecionada: turma,
        permissoes: { [ROUTES.MAPEAMENTO_ESTUDANTES]: { podeAlterar: true, podeIncluir: true } },
      },
      ['INFANTIL'],
    );
    (verificaSomenteConsulta as jest.Mock).mockReturnValue(false);
    (ehTurmaInfantil as jest.Mock).mockReturnValue(true);

    render(<MapeamentoEstudantes />);

    expect(screen.queryByTestId('bimestres')).toBeNull();
    expect(screen.queryByTestId('dados')).toBeNull();

    mockBimestresNull = false;
    mockDadosNull = false;
  });

  it('ao desmontar limpa dados via dispatch', () => {
    const turma = { turma: 'TURMA1', modalidade: 'X' };
    mockStore(
      {
        turmaSelecionada: turma,
        permissoes: { [ROUTES.MAPEAMENTO_ESTUDANTES]: { podeAlterar: true, podeIncluir: true } },
      },
      ['X'],
    );
    (verificaSomenteConsulta as jest.Mock).mockReturnValue(false);
    (ehTurmaInfantil as jest.Mock).mockReturnValue(false);

    const { unmount } = render(<MapeamentoEstudantes />);
    unmount();

    expect(dispatchMock).toHaveBeenCalledWith(setBimestreSelecionado(undefined));
    expect(dispatchMock).toHaveBeenCalledWith(setEstudantesMapeamentoEstudantes([]));
    expect(dispatchMock).toHaveBeenCalledWith(limparDadosMapeamentoEstudantes());
    expect(dispatchMock).toHaveBeenCalledWith(setListaSecoesEmEdicao([]));
    expect(dispatchMock).toHaveBeenCalledWith(setLimparDadosQuestionarioDinamico());
  });
});
