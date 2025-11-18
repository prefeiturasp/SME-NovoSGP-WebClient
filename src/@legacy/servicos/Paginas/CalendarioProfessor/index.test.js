import CalendarioProfessorServico from './index';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
}));

describe('CalendarioProfessorServico', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buscarTiposCalendario', () => {
    it('deve chamar api.get com a URL correta', async () => {
      api.get.mockResolvedValue({ data: 'tipos' });
      const turma = 123;
      const resposta = await CalendarioProfessorServico.buscarTiposCalendario(turma);
      expect(api.get).toHaveBeenCalledWith(`/v1/turmas/${turma}/tipo-calendario`);
      expect(resposta.data).toBe('tipos');
    });
  });

  describe('buscarEventosAulasMes', () => {
    it('deve chamar api.get com a URL correta incluindo os parâmetros', async () => {
      api.get.mockResolvedValue({ data: ['evento1', 'evento2'] });
      const params = {
        tipoCalendarioId: 10,
        numeroMes: 7,
        ue: 100,
        dre: 200,
        anoLetivo: 2025,
        turma: 300,
      };
      const resposta = await CalendarioProfessorServico.buscarEventosAulasMes(params);
      expect(api.get).toHaveBeenCalledWith(
        `/v1/calendarios/10/meses/7/eventos-aulas?ueCodigo=100&dreCodigo=200&anoLetivo=2025&turmaCodigo=300`
      );
      expect(resposta.data).toEqual(['evento1', 'evento2']);
    });
  });

  describe('buscarEventosAulasDia', () => {
    it('deve chamar api.get com a URL correta incluindo os parâmetros', async () => {
      api.get.mockResolvedValue({ data: ['eventoDia'] });
      const params = {
        tipoCalendarioId: 15,
        numeroMes: 8,
        dia: 25,
        ue: 110,
        dre: 210,
        anoLetivo: 2024,
        turma: 310,
      };
      const resposta = await CalendarioProfessorServico.buscarEventosAulasDia(params);
      expect(api.get).toHaveBeenCalledWith(
        `v1/calendarios/15/meses/8/dias/25/eventos-aulas?ueCodigo=110&dreCodigo=210&anoLetivo=2024&turmaCodigo=310`
      );
      expect(resposta.data).toEqual(['eventoDia']);
    });
  });
});
