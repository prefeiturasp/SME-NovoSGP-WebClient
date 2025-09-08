import ServicoNotaConceito from './ServicoNotaConceito';
import api from '~/servicos/api';
import { store } from '@/core/redux';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
}));

jest.mock('@/core/redux', () => ({
  store: {
    getState: jest.fn(),
  },
}));

describe('ServicoNotaConceito', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar api.get em obterTodosConceitos com a data correta', () => {
    const data = '2023-07-29';
    ServicoNotaConceito.obterTodosConceitos(data);
    expect(api.get).toHaveBeenCalledWith(`v1/avaliacoes/notas/conceitos?data=${data}`);
  });

  it('deve chamar api.get em obterTodasSinteses com a data correta', () => {
    const data = '2023-07-29';
    ServicoNotaConceito.obterTodasSinteses(data);
    expect(api.get).toHaveBeenCalledWith(`v1/sinteses/${data}`);
  });

  it('deve chamar api.get em obterArredondamento com nota e data fornecidos', () => {
    const nota = 7.5;
    const data = '2023-07-29';
    ServicoNotaConceito.obterArredondamento(nota, data);
    expect(api.get).toHaveBeenCalledWith(`v1/avaliacoes/notas/${nota}/arredondamento?data=${data}`);
  });

  it('deve usar data atual caso data não seja passada em obterArredondamento', () => {
    const nota = 7.5;
    const fakeDate = '2023-07-29';
    // Mock do window.moment().format()
    global.window = Object.create(window);
    const mockMoment = jest.fn(() => ({ format: () => fakeDate }));
    window.moment = mockMoment;

    ServicoNotaConceito.obterArredondamento(nota);

    expect(api.get).toHaveBeenCalledWith(
      `v1/avaliacoes/notas/${nota}/arredondamento?data=${fakeDate}`
    );
  });

  it('deve chamar api.get em obterTipoNota com parametros corretos', () => {
    const turma = 123;
    const anoLetivo = 2023;
    const consideraHistorico = true;
    ServicoNotaConceito.obterTipoNota(turma, anoLetivo, consideraHistorico);
    expect(api.get).toHaveBeenCalledWith(
      `v1/avaliacoes/notas/turmas/${turma}/anos-letivos/${anoLetivo}/tipos?consideraHistorico=${consideraHistorico}`
    );
  });

  it('deve retornar modoEdicaoGeral do estado', () => {
    const modoEdicaoGeral = true;
    store.getState.mockReturnValue({ notasConceitos: { modoEdicaoGeral } });
    const result = ServicoNotaConceito.estaEmModoEdicaoGeral();
    expect(result).toBe(modoEdicaoGeral);
  });

  it('deve retornar modoEdicaoGeralNotaFinal do estado', () => {
    const modoEdicaoGeralNotaFinal = false;
    store.getState.mockReturnValue({ notasConceitos: { modoEdicaoGeralNotaFinal } });
    const result = ServicoNotaConceito.estaEmModoEdicaoGeralNotaFinal();
    expect(result).toBe(modoEdicaoGeralNotaFinal);
  });

  it('deve chamar api.get em obterNotasAvaliacoesPorTurmaBimestreAluno com parametros corretos', () => {
    const turmaId = 1;
    const periodoEscolarId = 2;
    const alunoCodigo = 3;
    const codigoComponenteCurricular = 4;
    ServicoNotaConceito.obterNotasAvaliacoesPorTurmaBimestreAluno(
      turmaId,
      periodoEscolarId,
      alunoCodigo,
      codigoComponenteCurricular
    );
    expect(api.get).toHaveBeenCalledWith(
      `v1/avaliacoes/notas/turmas/${turmaId}/periodo-escolar/${periodoEscolarId}/alunos/${alunoCodigo}/componentes-curriculares/${codigoComponenteCurricular}`
    );
  });
});
