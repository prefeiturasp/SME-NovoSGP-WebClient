import { Base } from '~/componentes/colors';

const statusAcompanhamentoFechamento = {
  NAO_INICIADO: {
    descricao: 'Não Iniciado',
    cor: Base.CinzaMako,
    id: 0,
  },
  PROCESSADO_PENDENCIAS: {
    descricao: 'Processado com pendências',
    cor: Base.LaranjaStatus,
    id: 2,
  },
  PROCESSADO_SUCESSO: {
    descricao: 'Processado com sucesso',
    cor: Base.Verde,
    id: 3,
  },
};

export default statusAcompanhamentoFechamento;
