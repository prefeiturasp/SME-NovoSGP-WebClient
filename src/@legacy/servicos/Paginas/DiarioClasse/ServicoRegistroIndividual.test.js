import ServicoRegistroIndividual from './ServicoRegistroIndividual';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('ServicoRegistroIndividual', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter a lista de alunos', () => {
    const params = { componenteCurricularId: 1, turmaId: 2 };
    ServicoRegistroIndividual.obterListaAlunos(params);
    expect(api.get).toHaveBeenCalledWith(
      '/v1/registros-individuais/turmas/2/componentes-curriculares/1/alunos'
    );
  });

  it('deve obter registro individual por data', () => {
    const params = {
      alunoCodigo: 123,
      componenteCurricular: 456,
      data: '2023-05-10',
      turmaId: 789,
    };
    ServicoRegistroIndividual.obterRegistroIndividualPorData(params);
    expect(api.get).toHaveBeenCalledWith(
      '/v1/registros-individuais/turmas/789/alunos/123/componentes-curriculares/456/data/2023-05-10'
    );
  });

  it('deve obter registro individual por período', () => {
    const params = {
      alunoCodigo: 1,
      componenteCurricular: 2,
      dataInicio: '2023-01-01',
      dataFim: '2023-01-31',
      turmaCodigo: 3,
      numeroPagina: 1,
      numeroRegistros: 10,
    };
    ServicoRegistroIndividual.obterRegistroIndividualPorPeriodo(params);
    expect(api.get).toHaveBeenCalledWith(
      '/v1/registros-individuais/turmas/3/alunos/1/componentes-curriculares/2/dataInicio/2023-01-01/dataFim/2023-01-31?NumeroPagina=1&NumeroRegistros=10'
    );
  });

  it('deve obter registro individual por id', () => {
    ServicoRegistroIndividual.obterRegistroIndividualPorId({ id: 99 });
    expect(api.get).toHaveBeenCalledWith('/v1/registros-individuais/99');
  });

  it('deve salvar registro individual', () => {
    const payload = { conteudo: 'teste' };
    ServicoRegistroIndividual.salvarRegistroIndividual(payload);
    expect(api.post).toHaveBeenCalledWith('/v1/registros-individuais', payload);
  });

  it('deve editar registro individual', () => {
    const payload = { id: 10, conteudo: 'novo' };
    ServicoRegistroIndividual.editarRegistroIndividual(payload);
    expect(api.put).toHaveBeenCalledWith('/v1/registros-individuais/10', payload);
  });

  it('deve deletar registro individual', () => {
    ServicoRegistroIndividual.deletarRegistroIndividual({ id: 5 });
    expect(api.delete).toHaveBeenCalledWith('/v1/registros-individuais/5');
  });

  it('deve obter sugestão', () => {
    ServicoRegistroIndividual.obterSugestao('tema-x');
    expect(api.get).toHaveBeenCalledWith('/v1/registros-individuais/sugestoes-topicos/tema-x');
  });

  it('deve gerar relatório', () => {
    const params = { turmaId: 1 };
    ServicoRegistroIndividual.gerar(params);
    expect(api.post).toHaveBeenCalledWith('/v1/relatorios/registros-individuais', params);
  });
});
