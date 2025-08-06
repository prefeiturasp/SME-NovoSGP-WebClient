import ServicoDashboardRegistroItinerancia from './ServicoDashboardRegistroItinerancia';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
}));

describe('ServicoDashboardRegistroItinerancia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve montar corretamente a URL para obterQuantidadeRegistrosPAAI', () => {
    ServicoDashboardRegistroItinerancia.obterQuantidadeRegistrosPAAI(
      2025,
      1,
      2,
      'DRE-CODE',
      'UE-CODE',
      3
    );

    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('visitas-paais?anoLetivo=2025&dreId=1&ueId=2&mes=3')
    );
  });

  it('deve montar corretamente a URL para obterQuantidadeRegistrosPorObjetivo', () => {

    ServicoDashboardRegistroItinerancia.obterQuantidadeRegistrosPorObjetivo(
      2025,
      1,
      2,
      'DRE-CODE',
      'UE-CODE',
      3,
      'RF123'
    );

    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('objetivos?anoLetivo=2025&dreId=1&ueId=2&mes=3&rf=RF123')
    );
  });
});
