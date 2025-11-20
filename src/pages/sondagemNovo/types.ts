export interface OpcaoResposta {
  id: number;
  orden: number;
  descricaoOpcao: string;
}

export interface Resposta {
  id: number;
  opcaoRespostaId: number;
}

export interface Coluna {
  descricaoColuna: string;
  PeriodoBimestreAtivo: boolean;
  opcaoResposta: OpcaoResposta[];
  resposta: Resposta[];
}

export interface Estudante {
  lp: boolean;
  numero: number;
  nome: string;
  pap: boolean;
  aee: boolean;
  acessibilidade: boolean;
  coluna: Coluna[];
}

export interface DadosTabelaDinamica {
  questao: string;
  estudantes: Estudante[];
}
