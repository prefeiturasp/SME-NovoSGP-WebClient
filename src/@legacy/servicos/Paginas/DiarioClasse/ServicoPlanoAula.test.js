import ServicoPlanoAula from './ServicoPlanoAula';
import { store } from '@/core/redux';
import api from '~/servicos/api';
import ServicoComponentesCurriculares from '~/servicos/Paginas/ComponentesCurriculares/ServicoComponentesCurriculares';
import {
  setDadosPlanoAula,
  setExibirCardCollapsePlanoAula,
  setExibirLoaderFrequenciaPlanoAula,
  setListaComponentesCurricularesPlanejamento,
  setDadosOriginaisPlanoAula,
  setCheckedExibirEscolhaObjetivos,
} from '~/redux/modulos/frequenciaPlanoAula/actions';

jest.mock('~/servicos/api', () => {
  const mockPost = jest.fn();
  const mockGet = jest.fn();

  return {
    get: mockGet,
    post: mockPost,
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

jest.mock('@/core/redux', () => {
  const actual = jest.requireActual('@/core/redux');
  return {
    ...actual,
    store: {
      dispatch: jest.fn(),
      getState: jest.fn(() => ({
        frequenciaPlanoAula: {
          aulaId: 1,
          dadosPlanoAula: null,
          componenteCurricular: {
            id: 5,
            regencia: false,
          },
        },
        usuario: {
          turmaSelecionada: {
            id: 123,
          },
        },
      })),
    },
  };
});
jest.mock('~/servicos/Paginas/ComponentesCurriculares/ServicoComponentesCurriculares', () => ({
  default: {
    obterComponetensCurricularesRegencia: jest.fn(() => Promise.resolve({ data: [] })),
  },
}));
jest.mock('~/servicos/alertas', () => ({ erros: jest.fn() }));

describe('ServicoPlanoAula', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter plano de aula e despachar as ações corretamente', async () => {
    const mockPlanoData = {
      criadoEm: '2023-01-01',
      criadoPor: 'João',
      alteradoPor: 'Maria',
      alteradoEm: '2023-01-02',
      alteradoRf: '1234',
      criadoRf: '5678',
      objetivosAprendizagemComponente: [{
        objetivosAprendizagem: [{}]
      }],
      migrado: false,
    };
    api.get.mockResolvedValueOnce({ data: mockPlanoData });

    await ServicoPlanoAula.obterPlanoAula();

    expect(store.dispatch).toHaveBeenCalledWith(setExibirLoaderFrequenciaPlanoAula(true));
    expect(api.get).toHaveBeenCalledWith(
      'v1/planos/aulas/1?turmaId=123&componenteCurricularId=5'
    );
    expect(store.dispatch).toHaveBeenCalledWith(setDadosPlanoAula(expect.any(Object)));
    expect(store.dispatch).toHaveBeenCalledWith(setDadosOriginaisPlanoAula(expect.any(Object)));
    expect(store.dispatch).toHaveBeenCalledWith(setCheckedExibirEscolhaObjetivos(true));
    expect(store.dispatch).toHaveBeenCalledWith(setListaComponentesCurricularesPlanejamento(expect.any(Array)));
    expect(store.dispatch).toHaveBeenCalledWith(setExibirLoaderFrequenciaPlanoAula(false));
  });

  it('deve despachar ações padrão quando o plano não for encontrado', async () => {
    api.get.mockResolvedValueOnce(null);

    await ServicoPlanoAula.obterPlanoAula();

    expect(store.dispatch).toHaveBeenCalledWith(setDadosPlanoAula());
    expect(store.dispatch).toHaveBeenCalledWith(setExibirCardCollapsePlanoAula({ exibir: false }));
  });
});
