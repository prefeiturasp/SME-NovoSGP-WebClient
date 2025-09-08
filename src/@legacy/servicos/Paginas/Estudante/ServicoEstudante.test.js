import ServicoEstudante from './ServicoEstudante';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
}));

describe('ServicoEstudante', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar corretamente obterDadosEstudante', async () => {
    await ServicoEstudante.obterDadosEstudante(123, 2025, 'TURMA001');

    expect(api.get).toHaveBeenCalledWith(
      'v1/estudante/123/anosLetivos/2025?codigoTurma=TURMA001'
    );
  });

  it('deve chamar corretamente obterInformacoesEscolaresDoAluno', async () => {
    await ServicoEstudante.obterInformacoesEscolaresDoAluno(456, 'TURMA002');

    expect(api.get).toHaveBeenCalledWith(
      'v1/estudante/informacoes-escolares?codigoAluno=456&codigoTurma=TURMA002'
    );
  });

  it('deve chamar corretamente obterGrauParentesco', async () => {
    await ServicoEstudante.obterGrauParentesco();

    expect(api.get).toHaveBeenCalledWith('v1/estudante/graus-parentesco');
  });

  it('deve chamar corretamente obterInformacoesAlunoPorCodigo', async () => {
    await ServicoEstudante.obterInformacoesAlunoPorCodigo(789);

    expect(api.get).toHaveBeenCalledWith('v1/estudante/789/informacoes');
  });

  it('deve chamar corretamente obterLocalAtividadeAluno com filtro true (padrão)', async () => {
    await ServicoEstudante.obterLocalAtividadeAluno(999, 2024);

    expect(api.get).toHaveBeenCalledWith(
      'v1/estudante/turmas-programa?codigoAluno=999&anoLetivo=2024&filtrarSituacaoMatricula=true'
    );
  });

  it('deve chamar corretamente obterLocalAtividadeAluno com filtro false', async () => {
    await ServicoEstudante.obterLocalAtividadeAluno(1000, 2023, false);

    expect(api.get).toHaveBeenCalledWith(
      'v1/estudante/turmas-programa?codigoAluno=1000&anoLetivo=2023&filtrarSituacaoMatricula=false'
    );
  });
});
