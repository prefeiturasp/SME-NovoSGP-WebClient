import { Base } from '~/componentes/colors';

const statusAcompanhamentoFechamento = {
  NAO_INICIADO: {
    descricao: 'Não Iniciado',
    cor: Base.CinzaMako,
    id: 0,
  },
  EM_ANDAMENTO: {
    descricao: 'Em Andamento',
    cor: Base.LaranjaStatus,
    id: 1,
  },
  CONCLUIDO: {
    descricao: 'Concluído',
    cor: Base.Verde,
    id: 2,
  },
};

export default statusAcompanhamentoFechamento;
