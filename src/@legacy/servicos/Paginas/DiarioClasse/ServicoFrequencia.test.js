import ServicoFrequencia from './ServicoFrequencia';
import api from '~/servicos/api';
import { store } from '@/core/redux';
import {
  setExibirLoaderFrequenciaPlanoAula,
  setListaDadosFrequencia,
  setTemEstudanteAlteradoComCompensacao,
  setTemPeriodoAbertoFrequenciaPlanoAula,
} from '~/redux/modulos/frequenciaPlanoAula/actions';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock('@/core/redux', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(),
  },
}));

jest.mock('~/redux/modulos/frequenciaPlanoAula/actions', () => ({
  setExibirLoaderFrequenciaPlanoAula: jest.fn(val => ({ type: 'EXIBIR_LOADER', payload: val })),
  setListaDadosFrequencia: jest.fn(val => ({ type: 'LISTA_DADOS_FREQUENCIA', payload: val })),
  setTemEstudanteAlteradoComCompensacao: jest.fn(val => ({ type: 'ESTUDANTE_COMPENSACAO', payload: val })),
  setTemPeriodoAbertoFrequenciaPlanoAula: jest.fn(val => ({ type: 'PERIODO_ABERTO', payload: val })),
}));

describe('ServicoFrequencia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obterDisciplinas', () => {
    it('deve chamar api.get com a url correta', () => {
      ServicoFrequencia.obterDisciplinas(10);
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('v1/calendarios/frequencias/turmas/10/disciplinas'));
    });
  });

  describe('obterListaFrequencia', () => {
    it('deve despachar ações básicas corretamente quando aulaId está presente', async () => {
      const fakeState = {
        frequenciaPlanoAula: {
          aulaId: 123,
          componenteCurricular: { id: 0, codigoComponenteCurricular: 'abc' },
        },
        usuario: {
          turmaSelecionada: {
            modalidade: 'M',
            anoLetivo: 2023,
          },
        },
      };
      store.getState.mockReturnValue(fakeState);

      api.get.mockImplementation((url) => {
        if (url.includes('v1/calendarios/frequencias/tipos')) {
          return Promise.resolve({ data: [] });
        }
        if (url.includes('v1/calendarios/frequencias')) {
          return Promise.resolve({
            data: {
              auditoria: {
                criadoEm: undefined,
                criadoPor: undefined,
                criadoRF: undefined,
                alteradoEm: undefined,
                alteradoPor: undefined,
                alteradoRF: undefined,
              },
              listaTiposFrequencia: [],
            },
          });
        }
        return Promise.resolve({});
      });

      await ServicoFrequencia.obterListaFrequencia();

      expect(store.dispatch).toHaveBeenCalledWith(setTemEstudanteAlteradoComCompensacao(false));
      expect(store.dispatch).toHaveBeenCalledWith(setExibirLoaderFrequenciaPlanoAula(true));
      expect(store.dispatch).toHaveBeenCalledWith(
        setListaDadosFrequencia({
          auditoria: {
            criadoEm: undefined,
            criadoPor: undefined,
            criadoRF: undefined,
            alteradoEm: undefined,
            alteradoPor: undefined,
            alteradoRF: undefined,
          },
          listaTiposFrequencia: [],
        })
      );
      expect(store.dispatch).toHaveBeenCalledWith(setExibirLoaderFrequenciaPlanoAula(false));
    });
  });

  describe('salvarFrequencia', () => {
    it('deve chamar api.post com a url e params corretos', () => {
      const params = { aulaId: 1, dados: 'dados' };
      ServicoFrequencia.salvarFrequencia(params);
      expect(api.post).toHaveBeenCalledWith(expect.stringContaining('v1/calendarios/frequencias'), params);
    });
  });

  describe('obterTipoFrequencia', () => {
    it('deve chamar api.get com a url correta', () => {
      ServicoFrequencia.obterTipoFrequencia('M', 2023);
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('v1/calendarios/frequencias/tipos?modalidade=M&anoLetivo=2023')
      );
    });
  });

  describe('obterFrequenciasPorPeriodo', () => {
    it('deve chamar api.get com a url correta', () => {
      ServicoFrequencia.obterFrequenciasPorPeriodo('2023-01-01', '2023-02-01', 10, 'disc1', 5);
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('v1/calendarios/frequencias/por-periodo?dataInicio=2023-01-01&dataFim=2023-02-01')
      );
    });
  });

  describe('obterFrequenciaDetalhadaAluno', () => {
    it('deve chamar api.get com a url correta', () => {
      ServicoFrequencia.obterFrequenciaDetalhadaAluno('aluno1', '2023-01-01', '2023-02-01');
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('v1/calendarios/frequencias/detalhadas?codigoAluno=aluno1')
      );
    });
  });

  describe('salvarFrequenciaListao', () => {
    it('deve chamar api.post com a url e params corretos', () => {
      const params = { dados: 'dados' };
      ServicoFrequencia.salvarFrequenciaListao(params);
      expect(api.post).toHaveBeenCalledWith(expect.stringContaining('v1/calendarios/frequencias/salvar'), params);
    });
  });

  describe('registrarLog', () => {
    it('deve chamar api.post com a url correta e a mensagem', () => {
      const mensagem = 'Teste log';
      ServicoFrequencia.registrarLog(mensagem);
      expect(api.post).toHaveBeenCalledWith(
        expect.stringContaining('v1/calendarios/frequencias/log/registrar'),
        { mensagem }
      );
    });
  });
});
