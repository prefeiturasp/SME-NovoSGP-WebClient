import ServicoConselhoClasse from './ServicoConselhoClasse';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => {
  const get = jest.fn();
  const post = jest.fn();

  return {
    get,
    post,
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
  };
});


describe('ServicoConselhoClasse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter lista de alunos', async () => {
    const turmaCodigo = 123;
    const anoLetivo = 2025;
    const periodo = 1;

    await ServicoConselhoClasse.obterListaAlunos(turmaCodigo, anoLetivo, periodo);

    expect(api.get).toHaveBeenCalledWith(
      `v1/fechamentos/turmas/${turmaCodigo}/alunos/anos/${anoLetivo}/semestres/${periodo}`
    );
  });

  it('deve salvar recomendacoes do aluno/familia', async () => {
    const params = { exemplo: 'valor' };

    await ServicoConselhoClasse.salvarRecomendacoesAlunoFamilia(params);

    expect(api.post).toHaveBeenCalledWith('v1/conselhos-classe/recomendacoes', params);
  });

  it('deve gerar parecer conclusivo', async () => {
    const conselhoClasseId = 1;
    const fechamentoTurmaId = 2;
    const alunoCodigo = 3;

    await ServicoConselhoClasse.gerarParecerConclusivo(conselhoClasseId, fechamentoTurmaId, alunoCodigo);

    expect(api.post).toHaveBeenCalledWith(
      `v1/conselhos-classe/1/fechamentos/2/alunos/3/parecer`
    );
  });

  it('deve obter dados dos bimestres', async () => {
    const turmaId = 456;

    await ServicoConselhoClasse.obterDadosBimestres(turmaId);

    expect(api.get).toHaveBeenCalledWith(`/v1/conselhos-classe/turmas/${turmaId}/bimestres`);
  });

  it('deve conferir inconsistências', async () => {
    const turmaId = 123;
    const bimestre = 2;

    await ServicoConselhoClasse.conferirInconsistencias(turmaId, bimestre);

    expect(api.get).toHaveBeenCalledWith(
      `/v1/conselhos-classe/validar-inconsistencias/turma/${turmaId}/bimestre/${bimestre}`
    );
  });
});
