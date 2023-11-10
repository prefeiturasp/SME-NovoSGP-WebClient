import { AlunoReduzidoDto } from '../dto/AlunoReduzidoDto';
import { obterRegistro } from './api';

const URL_DEFAULT = 'v1/estudante';

type ObterDadosEstudanteProps = {
  anoLetivo: number;
  codigoAluno: string;
  codigoTurma: string;
  carregarDadosResponsaveis?: boolean;
};
const obterDadosEstudante = (params: ObterDadosEstudanteProps) =>
  obterRegistro<AlunoReduzidoDto>(
    `${URL_DEFAULT}/${params.codigoAluno}/anosLetivos/${params.anoLetivo}`,
    {
      params: {
        codigoTurma: params.codigoTurma,
        carregarDadosResponsaveis: params.carregarDadosResponsaveis,
      },
    },
  );

export default {
  obterDadosEstudante,
};
