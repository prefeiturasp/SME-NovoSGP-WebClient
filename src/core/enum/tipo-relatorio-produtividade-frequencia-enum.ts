export enum TipoRelatorioProdutividadeFrequenciaEnum {
  MediaPorUE = 1,
  MediaPorProfessor = 2,
  Analitico = 3,
}

export const TipoRelatorioProdutividadeFrequenciaEnumDisplay: Record<
  TipoRelatorioProdutividadeFrequenciaEnum,
  string
> = {
  [TipoRelatorioProdutividadeFrequenciaEnum.MediaPorUE]: 'Média por UE',
  [TipoRelatorioProdutividadeFrequenciaEnum.MediaPorProfessor]: 'Média por Professor',
  [TipoRelatorioProdutividadeFrequenciaEnum.Analitico]: 'Analítico',
};
