import QuestionarioDinamicoFuncoes from '@/@legacy/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import { store } from '@/core/redux';
import api from '~/servicos/api';
import ServicoRelatorioPAP, {
  normalizarSecoesRelatorioPAP,
} from './ServicoRelatorioPAP';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
}));

jest.mock('~/servicos/alertas', () => ({
  sucesso: jest.fn(),
  erros: jest.fn(),
}));

jest.mock('@/core/redux', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
}));

jest.mock(
  '@/@legacy/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes',
  () => ({
    mapearQuestionarios: jest.fn(),
  })
);

describe('ServicoRelatorioPAP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('normaliza seções repetidas priorizando a persistida mais recente', () => {
    const secoes = normalizarSecoesRelatorioPAP([
      {
        id: 3,
        papSecaoId: 10,
        auditoria: { criadoEm: '2026-08-13T09:54:40' },
      },
      {
        id: 3,
        papSecaoId: 11,
        auditoria: { criadoEm: '2026-08-13T10:05:40' },
      },
      { id: 4, papSecaoId: 12 },
    ]);

    expect(secoes).toHaveLength(2);
    expect(secoes.find(secao => secao.id === 3)?.papSecaoId).toBe(11);
  });

  it('salva com o papSecaoId carregado e recarrega as seções após sucesso', async () => {
    store.getState.mockReturnValue({
      questionarioDinamico: {
        questionarioDinamicoEmEdicao: true,
        listaSecoesEmEdicao: [{ secaoId: 3 }],
      },
      usuario: {
        turmaSelecionada: { id: 1, turma: 'T1' },
      },
      relatorioPAP: {
        dadosSecoesRelatorioPAP: {
          papTurmaId: 30,
          papAlunoId: 20,
          secoes: [{ id: 3, papSecaoId: 10, concluido: true }],
        },
        estudanteSelecionadoRelatorioPAP: {
          codigoEOL: '123',
          nome: 'Estudante',
        },
        periodoSelecionadoPAP: { periodoRelatorioPAPId: 47 },
        estudantesRelatorioPAP: [{ codigoEOL: '123', nome: 'Estudante' }],
      },
    });

    QuestionarioDinamicoFuncoes.mapearQuestionarios.mockResolvedValue({
      formsValidos: true,
      secoes: [
        {
          secaoId: 3,
          questoes: [
            {
              questaoId: 4,
              tipoQuestao: 1,
              resposta: 'Resposta',
            },
          ],
        },
      ],
    });

    api.post.mockResolvedValue({
      status: 200,
      data: { papTurmaId: 30, papAlunoId: 20, secoes: [] },
    });
    api.get.mockResolvedValue({
      data: {
        papTurmaId: 30,
        papAlunoId: 20,
        secoes: [{ id: 3, papSecaoId: 10 }],
      },
    });

    await ServicoRelatorioPAP.salvar();

    expect(api.post).toHaveBeenCalledWith(
      'v1/relatorios/pap/salvar',
      expect.objectContaining({
        secoes: [expect.objectContaining({ id: 10, secaoId: 3 })],
      })
    );
    expect(api.get).toHaveBeenCalledWith(
      'v1/relatorios/pap/turma/T1/aluno/123/periodo/47/secoes'
    );
  });
});
