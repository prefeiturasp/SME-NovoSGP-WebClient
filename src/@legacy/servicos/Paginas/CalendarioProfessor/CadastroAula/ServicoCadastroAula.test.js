import ServicoCadastroAula from './ServicoCadastroAula';
import api from '~/servicos/api';
import moment from 'moment';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('ServicoCadastroAula', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obterPorId', () => {
    it('deve chamar api.get com a URL correta', async () => {
      api.get.mockResolvedValue({ data: { id: 1 } });
      const resposta = await ServicoCadastroAula.obterPorId(1);
      expect(api.get).toHaveBeenCalledWith('v1/calendarios/professores/aulas/1');
      expect(resposta.data).toEqual({ id: 1 });
    });
  });

  describe('salvar', () => {
    const aula = {
      disciplinaId: 10,
      disciplinaNome: 'Matemática',
      turmaId: 20,
      ueId: 30,
      outraProp: 'valor',
    };

    it('deve chamar api.post com os parâmetros corretos quando id <= 0', async () => {
      api.post.mockResolvedValue({ data: 'ok' });
      const resposta = await ServicoCadastroAula.salvar(0, aula, true);

      expect(api.post).toHaveBeenCalledWith(
        'v1/calendarios/professores/aulas',
        {
          ...aula,
          CodigoComponenteCurricular: aula.disciplinaId,
          NomeComponenteCurricular: aula.disciplinaNome,
          CodigoTurma: aula.turmaId,
          codigoUe: aula.ueId,
          ehRegencia: true,
        }
      );
      expect(resposta.data).toBe('ok');
    });

    it('deve chamar api.put com os parâmetros corretos quando id > 0', async () => {
      api.put.mockResolvedValue({ data: 'ok' });
      const resposta = await ServicoCadastroAula.salvar(5, aula, false);

      expect(api.put).toHaveBeenCalledWith(
        'v1/calendarios/professores/aulas/5',
        {
          ...aula,
          CodigoComponenteCurricular: aula.disciplinaId,
          NomeComponenteCurricular: aula.disciplinaNome,
          CodigoTurma: aula.turmaId,
          codigoUe: aula.ueId,
          ehRegencia: false,
        }
      );
      expect(resposta.data).toBe('ok');
    });
  });

  describe('obterGradePorComponenteETurma', () => {
    it('deve chamar api.get com a URL correta e parâmetros formatados', async () => {
      const turmaId = 20;
      const componenteId = 10;
      const dataAula = moment('2025-07-29');
      const aulaId = 5;
      const ehRegencia = true;
      const tipoAula = 'teorica';

      api.get.mockResolvedValue({ data: ['grade'] });

      const resposta = await ServicoCadastroAula.obterGradePorComponenteETurma(
        turmaId,
        componenteId,
        dataAula,
        aulaId,
        ehRegencia,
        tipoAula
      );

      expect(api.get).toHaveBeenCalledWith(
        `v1/calendarios/professores/aulas/${aulaId}/turmas/${turmaId}/componente-curricular/${componenteId}?dataAula=2025-07-29&ehRegencia=true&tipoAula=teorica`
      );
      expect(resposta.data).toEqual(['grade']);
    });
  });

  describe('obterRecorrenciaPorIdAula', () => {
    it('deve chamar api.get com a URL correta', async () => {
      api.get.mockResolvedValue({ data: { recorrencia: true } });
      const resposta = await ServicoCadastroAula.obterRecorrenciaPorIdAula(1, 'mensal');
      expect(api.get).toHaveBeenCalledWith(
        'v1/calendarios/professores/aulas/1/recorrencias/serie/mensal'
      );
      expect(resposta.data).toEqual({ recorrencia: true });
    });
  });

  describe('excluirAula', () => {
    it('deve chamar api.delete com a URL correta', async () => {
      api.delete.mockResolvedValue({ data: { sucesso: true } });
      const resposta = await ServicoCadastroAula.excluirAula(2, 'semanal');
      expect(api.delete).toHaveBeenCalledWith(
        'v1/calendarios/professores/aulas/2/recorrencias/semanal'
      );
      expect(resposta.data).toEqual({ sucesso: true });
    });
  });
});
