type TotalAtendimentoQuestaoPorRespostas = {
  total: number;
  descricao: string;
};

type TotalAtendimentoQuestoes = {
  descricao: string;
  totalAtendimentoQuestaoPorRespostas: TotalAtendimentoQuestaoPorRespostas[];
};

export type TotalDeAtendimentoDto = {
  total: number;
  totalAtendimentoQuestoes: TotalAtendimentoQuestoes[];
};
