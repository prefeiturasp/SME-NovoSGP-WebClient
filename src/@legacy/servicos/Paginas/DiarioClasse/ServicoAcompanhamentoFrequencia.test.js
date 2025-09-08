import ServicoAcompanhamentoFrequencia from './ServicoAcompanhamentoFrequencia';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('ServicoAcompanhamentoFrequencia', () => {
  const turmaId = 1;
  const componenteCurricularId = 10;
  const bimestre = 2;
  const territorioSaber = true;
  const alunoCodigo = 100;
  const semestre = 1;
  const numeroPagina = 1;
  const numeroRegistros = 20;
  const params = { turmaId: 1, bimestre: 2 };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar obterAcompanhamentoFrequenciaPorBimestre corretamente', async () => {
    await ServicoAcompanhamentoFrequencia.obterAcompanhamentoFrequenciaPorBimestre(
      turmaId,
      componenteCurricularId,
      bimestre,
      territorioSaber
    );
    expect(api.get).toHaveBeenCalledWith(
      `/v1/frequencias/acompanhamentos?turmaId=${turmaId}&componenteCurricularId=${componenteCurricularId}&bimestre=${bimestre}&possuiTerritorio=${territorioSaber}`
    );
  });

  it('deve chamar obterJustificativaAcompanhamentoFrequencia corretamente', async () => {
    await ServicoAcompanhamentoFrequencia.obterJustificativaAcompanhamentoFrequencia(
      turmaId,
      componenteCurricularId,
      alunoCodigo,
      bimestre
    );
    expect(api.get).toHaveBeenCalledWith(
      `/v1/frequencias/acompanhamentos/turmas/${turmaId}/componentes-curriculares/${componenteCurricularId}/alunos/${alunoCodigo}/bimestres/${bimestre}/justificativas/`
    );
  });

  it('deve chamar obterJustificativaAcompanhamentoFrequenciaPaginacaoManual corretamente', () => {
    ServicoAcompanhamentoFrequencia.obterJustificativaAcompanhamentoFrequenciaPaginacaoManual(
      turmaId,
      componenteCurricularId,
      alunoCodigo,
      bimestre,
      semestre,
      numeroPagina,
      numeroRegistros
    );
    expect(api.get).toHaveBeenCalledWith(
      `/v1/frequencias/acompanhamentos/turmas/${turmaId}/componentes-curriculares/${componenteCurricularId}/alunos/${alunoCodigo}/bimestres/${bimestre}/justificativas/semestre/${semestre}?numeroPagina=${numeroPagina}&numeroRegistros=${numeroRegistros}`
    );
  });

  it('deve chamar obterFrequenciaDiariaAluno corretamente', () => {
    ServicoAcompanhamentoFrequencia.obterFrequenciaDiariaAluno(
      turmaId,
      componenteCurricularId,
      alunoCodigo,
      bimestre,
      semestre,
      numeroPagina,
      numeroRegistros
    );
    expect(api.get).toHaveBeenCalledWith(
      `/v1/frequencias/acompanhamentos/turma/${turmaId}/componente-curricular/${componenteCurricularId}/aluno/${alunoCodigo}/bimestre/${bimestre}/semestre/${semestre}?numeroPagina=${numeroPagina}&numeroRegistros=${numeroRegistros}`
    );
  });

  it('deve chamar obterInformacoesDeFrequenciaAlunoPorSemestre corretamente', () => {
    ServicoAcompanhamentoFrequencia.obterInformacoesDeFrequenciaAlunoPorSemestre(
      turmaId,
      semestre,
      alunoCodigo,
      componenteCurricularId
    );
    expect(api.get).toHaveBeenCalledWith(
      `/v1/frequencias/acompanhamentos/turmas/${turmaId}/semestres/${semestre}/alunos/${alunoCodigo}`,
      {
        params: { componenteCurricularId },
      }
    );
  });

  it('deve chamar gerar corretamente', () => {
    ServicoAcompanhamentoFrequencia.gerar(params);
    expect(api.post).toHaveBeenCalledWith(
      '/v1/relatorios/acompanhamento-frequencia',
      params
    );
  });
});
