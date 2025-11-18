import { TipoConsolidadoFrequencia } from '@/core/enum/tipo-consolidado-frequencia';

const tipoGraficos = {
  DIARIO: { valor: 1, desc: 'Diário' },
  SEMANAL: {
    valor: 2,
    desc: 'Semanal',
    tipoConsolidadoFrequencia: TipoConsolidadoFrequencia.Semanal,
  },
  MENSAL: {
    valor: 3,
    desc: 'Mensal',
    tipoConsolidadoFrequencia: TipoConsolidadoFrequencia.Mensal,
  },
};

export default tipoGraficos;
