import ServicoDashboard from './ServicoDashboard';
import api from '~/servicos/api';
import { store } from '@/core/redux';
import {
  setDadosCardsDashboard,
  setCarregandoDadosCardsDashboard,
} from '~/redux/modulos/dashboard/actions';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
  },
}));

jest.mock('@/core/redux', () => {
  const actualRedux = jest.requireActual('@/core/redux');
  return {
    ...actualRedux,
    store: {
      dispatch: jest.fn(),
    },
  };
});

describe('ServicoDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar api.get e despachar ações corretamente com dados', async () => {
    const dadosMock = [{ id: 1, nome: 'Indicador A' }];
    api.get.mockResolvedValue({ data: dadosMock });

    await ServicoDashboard.obterDadosDashboard();

    expect(store.dispatch).toHaveBeenCalledWith(setDadosCardsDashboard([]));
    expect(store.dispatch).toHaveBeenCalledWith(setCarregandoDadosCardsDashboard(true));
    expect(api.get).toHaveBeenCalledWith('v1/dashboard');
    expect(store.dispatch).toHaveBeenCalledWith(setDadosCardsDashboard(dadosMock));
    expect(store.dispatch).toHaveBeenCalledWith(setCarregandoDadosCardsDashboard(false));
  });

  it('não deve despachar setDadosCardsDashboard se retorno for vazio', async () => {
    api.get.mockResolvedValue({ data: [] });

    await ServicoDashboard.obterDadosDashboard();

    expect(store.dispatch).toHaveBeenCalledWith(setDadosCardsDashboard([]));
    expect(store.dispatch).toHaveBeenCalledWith(setCarregandoDadosCardsDashboard(true));
    expect(api.get).toHaveBeenCalledWith('v1/dashboard');
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'DASHBOARD/SET_DADOS_CARDS' }), expect.anything());
    expect(store.dispatch).toHaveBeenCalledWith(setCarregandoDadosCardsDashboard(false));
  });
});
