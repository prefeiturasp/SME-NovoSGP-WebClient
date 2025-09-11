import ServicoPeriodoEscolar from './ServicoPeriodoEscolar';
import api from '~/servicos/api';
import moment from 'moment';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
}));

jest.mock('moment', () => {
  const moment = jest.requireActual('moment');
  return (date) => moment(date);
});

describe('ServicoPeriodoEscolar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obterPeriodosAbertos', () => {
    it('deve chamar o endpoint sem dataReferencia quando não informada', async () => {
      api.get.mockResolvedValue({ data: ['periodo1', 'periodo2'] });

      const resposta = await ServicoPeriodoEscolar.obterPeriodosAbertos(10);

      expect(api.get).toHaveBeenCalledWith('v1/periodo-escolar/turmas/10/bimestres/aberto');
      expect(resposta.data).toEqual(['periodo1', 'periodo2']);
    });

    it('deve chamar o endpoint com dataReferencia formatada corretamente', async () => {
      const data = '2025-07-30T15:00:00Z';
      const dataFormatada = moment(data).format('YYYY-MM-DD');
      api.get.mockResolvedValue({ data: ['periodo1'] });

      const resposta = await ServicoPeriodoEscolar.obterPeriodosAbertos(5, data);

      expect(api.get).toHaveBeenCalledWith(
        `v1/periodo-escolar/turmas/5/bimestres/aberto?dataReferencia=${dataFormatada}`
      );
      expect(resposta.data).toEqual(['periodo1']);
    });
  });

  describe('obterPeriodosPorAnoLetivoModalidade', () => {
    it('deve chamar o endpoint com os parâmetros corretos', async () => {
      api.get.mockResolvedValue({ data: ['periodo1'] });

      const resposta = await ServicoPeriodoEscolar.obterPeriodosPorAnoLetivoModalidade(2, 2025, 1);

      expect(api.get).toHaveBeenCalledWith(
        'v1/periodo-escolar/modalidades/2/ano-letivo/2025/bimestres',
        { params: { semestre: 1 } }
      );
      expect(resposta.data).toEqual(['periodo1']);
    });
  });

  describe('obterBimestresPorTurmaId', () => {
    it('deve chamar o endpoint correto', async () => {
      api.get.mockResolvedValue({ data: ['bimestre1', 'bimestre2'] });

      const resposta = await ServicoPeriodoEscolar.obterBimestresPorTurmaId(3);

      expect(api.get).toHaveBeenCalledWith('v1/periodo-escolar/turmas/3');
      expect(resposta.data).toEqual(['bimestre1', 'bimestre2']);
    });
  });

  describe('obterBimestreAtualPorTurmaId', () => {
    it('deve chamar o endpoint correto', async () => {
      api.get.mockResolvedValue({ data: { atual: true } });

      const resposta = await ServicoPeriodoEscolar.obterBimestreAtualPorTurmaId(7);

      expect(api.get).toHaveBeenCalledWith('v1/periodo-escolar/turmas/7/bimestres/atual');
      expect(resposta.data).toEqual({ atual: true });
    });
  });

  describe('obterPeriodoLetivoTurma', () => {
    it('deve chamar o endpoint correto', async () => {
      api.get.mockResolvedValue({ data: { periodo: 'letivo' } });

      const resposta = await ServicoPeriodoEscolar.obterPeriodoLetivoTurma(12);

      expect(api.get).toHaveBeenCalledWith('v1/periodo-escolar/turmas/12/periodo-letivo');
      expect(resposta.data).toEqual({ periodo: 'letivo' });
    });
  });

  describe('obterPeriodoPorComponente', () => {
    it('deve chamar o endpoint sem exibirDataFutura', async () => {
      api.get.mockResolvedValue({ data: { periodo: 'teste' } });

      const resposta = await ServicoPeriodoEscolar.obterPeriodoPorComponente(
        1, 2, true, 3, false
      );

      expect(api.get).toHaveBeenCalledWith(
        'v1/periodo-escolar/turmas/1/componentes-curriculares/2/regencia/true/bimestres/3'
      );
      expect(resposta.data).toEqual({ periodo: 'teste' });
    });

    it('deve chamar o endpoint com exibirDataFutura=true', async () => {
      api.get.mockResolvedValue({ data: { periodo: 'teste' } });

      const resposta = await ServicoPeriodoEscolar.obterPeriodoPorComponente(
        1, 2, false, 3, true
      );

      expect(api.get).toHaveBeenCalledWith(
        'v1/periodo-escolar/turmas/1/componentes-curriculares/2/regencia/false/bimestres/3?exibirDataFutura=true'
      );
      expect(resposta.data).toEqual({ periodo: 'teste' });
    });
  });
});
