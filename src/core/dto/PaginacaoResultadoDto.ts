export type PaginacaoResultadoDTO<T> = {
  items: T;
  totalPaginas: number;
  totalRegistros: number;
};
