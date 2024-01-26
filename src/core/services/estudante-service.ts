import { api } from '~/servicos';
import { AlunoReduzidoDto } from '../dto/AlunoReduzidoDto';
import { AlunoSimplesDto } from '../dto/AlunoSimplesDto';
import { FiltroBuscaEstudanteDto } from '../dto/FiltroBuscaEstudanteDto';
import { PaginacaoResultadoDTO } from '../dto/PaginacaoResultadoDto';
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

const obterDadosEstudantesPaginado = (params: FiltroBuscaEstudanteDto) =>
  api.post<PaginacaoResultadoDTO<AlunoSimplesDto[]>>(`${URL_DEFAULT}/pesquisa`, params);

export default {
  obterDadosEstudante,
  obterDadosEstudantesPaginado,
};
