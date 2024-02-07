type TotalQuetaoDTO = {
  total: number;
  descricao: string;
};

type TotalQuetoesDTO = {
  descricao: string;
  itens: TotalQuetaoDTO[];
};

export type TotalRegistroPorAtendimentoRelatorioDinamicoNAAPADTO = {
  total: number;
  totalQuetoes: TotalQuetoesDTO[];
};
