import ServicoFiltroRelatorio from './ServicoFiltroRelatorio';
import api from '~/servicos/api';
import { erros } from '~/servicos/alertas';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
}));

jest.mock('~/servicos/alertas', () => ({
  erros: jest.fn(),
}));

describe('ServicoFiltroRelatorio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar obterDres corretamente', () => {
    ServicoFiltroRelatorio.obterDres();
    expect(api.get).toHaveBeenCalledWith('v1/relatorios/filtros/dres');
  });

  it('deve chamar obterUes com os parâmetros corretos', () => {
    ServicoFiltroRelatorio.obterUes('123', true, 2024, true);
    expect(api.get).toHaveBeenCalledWith(
      'v1/relatorios/filtros/dres/123/ues?consideraNovasUEs=true&consideraHistorico=true&anoLetivo=2024'
    );
  });

  it('deve chamar obterModalidades com os parâmetros corretos', () => {
    ServicoFiltroRelatorio.obterModalidades('456', 2023, false, true);
    expect(api.get).toHaveBeenCalledWith(
      'v1/relatorios/filtros/ues/456/modalidades?anoLetivo=2023&consideraHistorico=false&consideraNovasModalidades=true'
    );
  });

  it('deve chamar obterModalidadesPorAbrangencia corretamente', () => {
    ServicoFiltroRelatorio.obterModalidadesPorAbrangencia('789', true);
    expect(api.get).toHaveBeenCalledWith(
      'v1/relatorios/filtros/ues/789/modalidades/abrangencias?consideraNovasModalidades=true'
    );
  });

  it('deve chamar obterModalidadesPorAbrangenciaHistorica corretamente', () => {
    ServicoFiltroRelatorio.obterModalidadesPorAbrangenciaHistorica(
      '999', false, true, 2022
    );
    expect(api.get).toHaveBeenCalledWith(
      'v1/relatorios/filtros/ues/999/modalidades/abrangencias?consideraNovasModalidades=false&consideraHistorico=true&anoLetivo=2022'
    );
  });

  it('deve chamar obterAnosEscolares corretamente', () => {
    ServicoFiltroRelatorio.obterAnosEscolares('abc', 'ef');
    expect(api.get).toHaveBeenCalledWith(
      'v1/relatorios/filtros/ues/abc/modalidades/ef/anos-escolares'
    );
  });

  it('deve chamar obterAnosEscolaresPorAbrangencia corretamente', () => {
    ServicoFiltroRelatorio.obterAnosEscolaresPorAbrangencia('med', 'c1');
    expect(api.get).toHaveBeenCalledWith(
      'v1/relatorios/filtros/modalidades/med/ciclos/c1/anos-escolares'
    );
  });

  it('deve chamar buscarCiclos corretamente', () => {
    ServicoFiltroRelatorio.buscarCiclos('ue123', 'fund');
    expect(api.get).toHaveBeenCalledWith(
      '/v1/relatorios/filtros/ues/ue123/modalidades/fund/ciclos?consideraAbrangencia=true'
    );
  });

  it('deve retornar dados em obterTurmasPorCodigoUeModalidadeSemestre com sucesso', async () => {
    api.get.mockResolvedValueOnce([{ turma: 'teste' }]);

    const resultado = await ServicoFiltroRelatorio.obterTurmasPorCodigoUeModalidadeSemestre(
      2024, 'ue123', 3, 1
    );

    expect(api.get).toHaveBeenCalledWith(
      'v1/relatorios/filtros/ues/ue123/anoletivo/2024/turmas?consideraNovosAnosInfantil=false&semestre=1&modalidade=3'
    );
    expect(resultado).toEqual([{ turma: 'teste' }]);
  });

  it('deve tratar erro em obterTurmasPorCodigoUeModalidadeSemestre', async () => {
    const erro = new Error('Erro simulado');
    api.get.mockRejectedValueOnce(erro);

    const resultado = await ServicoFiltroRelatorio.obterTurmasPorCodigoUeModalidadeSemestre(
      2024, 'ue123', 3, 1
    );

    expect(erros).toHaveBeenCalledWith(erro);
    expect(resultado).toEqual([]);
  });

  it('deve chamar obterComponetensCurriculares com anosEscolares corretamente', () => {
    ServicoFiltroRelatorio.obterComponetensCurriculares('ue123', 1, 2024, ['1', '2']);
    expect(api.get).toHaveBeenCalledWith(
      'v1/relatorios/filtros/componentes-curriculares/anos-letivos/2024/ues/ue123/modalidades/1/?anos=1&anos=2'
    );
  });

  it('deve chamar obterComponetensCurriculares sem anosEscolares', () => {
    ServicoFiltroRelatorio.obterComponetensCurriculares('ue123', 1, 2024);
    expect(api.get).toHaveBeenCalledWith(
      'v1/relatorios/filtros/componentes-curriculares/anos-letivos/2024/ues/ue123/modalidades/1'
    );
  });

  it('deve chamar obterTurmasEspecificas corretamente', () => {
    ServicoFiltroRelatorio.obterTurmasEspecificas('ue1', 2024, 2, 3, ['5', '6']);
    expect(api.get).toHaveBeenCalledWith(
      'v1/relatorios/filtros/turmas/ues/ue1/anoletivo/2024?semestre=2&modalidade=3&anos=5&anos=6'
    );
  });

  it('deve chamar obterBimestres corretamente', () => {
    ServicoFiltroRelatorio.obterBimestres({ modalidadeId: 3, opcaoTodos: true, opcaoFinal: false });
    expect(api.get).toHaveBeenCalledWith(
      'v1/relatorios/filtros/bimestres/modalidades/3?opcaoTodos=true&opcaoFinal=false'
    );
  });

  it('deve chamar obterSituacaoFechamento corretamente', () => {
    ServicoFiltroRelatorio.obterSituacaoFechamento(true);
    expect(api.get).toHaveBeenCalledWith(
      'v1/relatorios/filtros/acompanhamento-fechamento/fechamentos/situacoes?unificarNaoIniciado=true'
    );
  });

  it('deve chamar obterSituacaoConselhoClasse corretamente', () => {
    ServicoFiltroRelatorio.obterSituacaoConselhoClasse();
    expect(api.get).toHaveBeenCalledWith(
      'v1/relatorios/filtros/acompanhamento-fechamento/conselho-de-classe/situacoes'
    );
  });
});
