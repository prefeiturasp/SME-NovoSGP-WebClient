import ServicoAcompanhamentoFechamento from './ServicoAcompanhamentoFechamento';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
}));

describe('ServicoAcompanhamentoFechamento', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar corretamente obterTurmas sem turmasId', async () => {
    const params = {
      anoLetivo: 2024,
      dreId: 1,
      ueId: 2,
      modalidadeId: 3,
      semestre: 1,
      situacaoFechamento: 'aberto',
      situacaoConselhoClasse: 'finalizado',
      bimestre: 2,
      numeroPagina: 1,
    };

    await ServicoAcompanhamentoFechamento.obterTurmas(params);

    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('anoLetivo=2024')
    );
  });

  it('deve chamar corretamente obterTurmas com turmasId', async () => {
    const params = {
      anoLetivo: 2024,
      dreId: 1,
      ueId: 2,
      modalidadeId: 3,
      semestre: 1,
      situacaoFechamento: 'aberto',
      situacaoConselhoClasse: 'finalizado',
      bimestre: 2,
      numeroPagina: 1,
      turmasId: ['A1', 'B2'],
    };

    await ServicoAcompanhamentoFechamento.obterTurmas(params);

    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('turmasId=A1&turmasId=B2')
    );
  });

  it('deve chamar corretamente obterFechamentos', async () => {
    await ServicoAcompanhamentoFechamento.obterFechamentos({
      turmaId: 123,
      bimestre: 2,
      situacaoFechamento: 'pendente',
    });

    expect(api.get).toHaveBeenCalledWith(
      '/v1/fechamentos/acompanhamentos/turmas/123/fechamentos/bimestres/2?situacaoFechamento=pendente'
    );
  });

  it('deve chamar corretamente obterConselhoClasse', async () => {
    await ServicoAcompanhamentoFechamento.obterConselhoClasse({
      turmaId: 321,
      bimestre: 1,
      situacaoConselhoClasse: 'concluido',
    });

    expect(api.get).toHaveBeenCalledWith(
      '/v1/fechamentos/acompanhamentos/turmas/321/conselho-classe/bimestres/1?situacaoConselhoClasse=concluido'
    );
  });

  it('deve chamar corretamente obterListaAlunosPorTurma', async () => {
    await ServicoAcompanhamentoFechamento.obterListaAlunosPorTurma(55, 2, 'em_andamento');

    expect(api.get).toHaveBeenCalledWith(
      '/v1/fechamentos/acompanhamentos/turmas/55/conselho-classe/bimestres/2/alunos?situacaoConselhoClasse=em_andamento'
    );
  });

  it('deve chamar corretamente obterDetalhamentoComponentesCurricularesAluno', async () => {
    await ServicoAcompanhamentoFechamento.obterDetalhamentoComponentesCurricularesAluno(88, 3, 999);

    expect(api.get).toHaveBeenCalledWith(
      '/v1/fechamentos/acompanhamentos/turmas/88/conselho-classe/bimestres/3/alunos/999/componentes-curriculares/detalhamento'
    );
  });

  it('deve chamar corretamente obterComponentesCurricularesFechamento', async () => {
    await ServicoAcompanhamentoFechamento.obterComponentesCurricularesFechamento(22, 4, 'fechado');

    expect(api.get).toHaveBeenCalledWith(
      '/v1/fechamentos/acompanhamentos/turmas/22/fechamento/bimestres/4/componentes-curriculares?situacaoFechamento=fechado'
    );
  });

  it('deve chamar corretamente obterDetalhesPendencias', async () => {
    await ServicoAcompanhamentoFechamento.obterDetalhesPendencias(999, 1, 10);

    expect(api.get).toHaveBeenCalledWith(
      '/v1/fechamentos/acompanhamentos/turmas/999/fechamento/bimestres/1/componentes-curriculares/10/pendencias'
    );
  });

  it('deve chamar obterDetalhePendencia com tipo 5 ou 6 (detalhamentos)', async () => {
    await ServicoAcompanhamentoFechamento.obterDetalhePendencia(5, 200);

    expect(api.get).toHaveBeenCalledWith(
      '/v1/fechamentos/acompanhamentos/turmas/pendencias/200/detalhamentos'
    );
  });

  it('deve chamar obterDetalhePendencia com tipo diferente (aulas/detalhamentos)', async () => {
    await ServicoAcompanhamentoFechamento.obterDetalhePendencia(1, 300);

    expect(api.get).toHaveBeenCalledWith(
      '/v1/fechamentos/acompanhamentos/turmas/pendencias/300/aulas/detalhamentos'
    );
  });
});
