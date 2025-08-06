import ServicoCompensacaoAusencia from './ServicoCompensacaoAusencia';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('ServicoCompensacaoAusencia', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar buscarLista com os parâmetros corretos', () => {
    const params = { turmaId: 1, bimestre: 2 };
    ServicoCompensacaoAusencia.buscarLista(params);
    expect(api.get).toHaveBeenCalledWith('/v1/compensacoes/ausencia', { params });
  });

  it('deve chamar salvar com POST quando não há id', async () => {
    const compensacao = { aluno: 1 };
    await ServicoCompensacaoAusencia.salvar(null, compensacao);
    expect(api.post).toHaveBeenCalledWith('/v1/compensacoes/ausencia', compensacao);
  });

  it('deve chamar salvar com PUT quando há id', async () => {
    const compensacao = { aluno: 1 };
    const id = 123;
    await ServicoCompensacaoAusencia.salvar(id, compensacao);
    expect(api.put).toHaveBeenCalledWith('/v1/compensacoes/ausencia/123', compensacao);
  });

  it('deve chamar obterPorId com a URL correta', async () => {
    await ServicoCompensacaoAusencia.obterPorId(456);
    expect(api.get).toHaveBeenCalledWith('/v1/compensacoes/ausencia/456');
  });

  it('deve chamar deletar com os parâmetros corretos', async () => {
    const ids = [1, 2, 3];
    await ServicoCompensacaoAusencia.deletar(ids);
    expect(api.delete).toHaveBeenCalledWith('/v1/compensacoes/ausencia', { data: ids });
  });

  it('deve chamar obterAlunosComAusencia com a URL correta', async () => {
    await ServicoCompensacaoAusencia.obterAlunosComAusencia(1, 2, 3);
    expect(api.get).toHaveBeenCalledWith(
      '/v1/calendarios/frequencias/ausencias/turmas/1/disciplinas/2/bimestres/3'
    );
  });

  it('deve chamar obterStatusCalculoFrequencia com a URL correta', async () => {
    await ServicoCompensacaoAusencia.obterStatusCalculoFrequencia(1, 2, 3);
    expect(api.get).toHaveBeenCalledWith(
      '/v1/processos/executando/calculo/frequencias/turma/1/disciplina/2/bimestres/3'
    );
  });

  it('deve chamar obterTurmasCopia com a URL correta', async () => {
    await ServicoCompensacaoAusencia.obterTurmasCopia(789);
    expect(api.get).toHaveBeenCalledWith('v1/compensacoes/ausencia/copiar/turmas/789');
  });

  it('deve chamar copiarCompensacao corretamente', async () => {
    const params = { turmaOrigem: 1, turmaDestino: 2 };
    await ServicoCompensacaoAusencia.copiarCompensacao(params);
    expect(api.post).toHaveBeenCalledWith('v1/compensacoes/ausencia/copiar', params);
  });

  it('deve chamar verificarSePodeAlterarNoPeriodo corretamente', () => {
    ServicoCompensacaoAusencia.verificarSePodeAlterarNoPeriodo(1, 2);
    expect(api.get).toHaveBeenCalledWith('/v1/compensacoes/ausencia/turmas/1/bimestres/2/aberto');
  });

  it('deve chamar obterDatasFaltasNaoCompensadas corretamente', () => {
    const params = { alunoId: 1 };
    ServicoCompensacaoAusencia.obterDatasFaltasNaoCompensadas(params);
    expect(api.get).toHaveBeenCalledWith(
      '/v1/frequencias/acompanhamentos/faltas-nao-compensadas',
      { params }
    );
  });

  it('deve ordenar corretamente as datas em ordenarDataAusenciaMenorParaMaior', () => {
    // Simulando moment no window
    global.window.moment = date => ({
      valueOf: () => new Date(date).getTime(),
    });

    const dados = [
      { dataAula: '2023-10-03' },
      { dataAula: '2023-08-01' },
      { dataAula: '2023-09-15' },
    ];

    const resultado = ServicoCompensacaoAusencia.ordenarDataAusenciaMenorParaMaior(dados);

    expect(resultado).toEqual([
      { dataAula: '2023-08-01' },
      { dataAula: '2023-09-15' },
      { dataAula: '2023-10-03' },
    ]);
  });
});
