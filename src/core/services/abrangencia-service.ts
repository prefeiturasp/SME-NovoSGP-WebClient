import queryString from 'query-string';
import { AbrangenciaTurmaRetornoDto } from '../dto/AbrangenciaTurmaRetorno';
import { FiltroSemestreDto } from '../dto/FiltroSemestreDto';
import { ModalidadeEnum } from '../enum/modalidade-enum';
import { obterRegistro } from './api';

const URL_DEFAULT = 'v1/abrangencias';

type ObterSemestresProps = FiltroSemestreDto & {
  consideraHistorico?: boolean;
};
const obterSemestres = (params: ObterSemestresProps) => {
  const consideraHistorico = params?.consideraHistorico || false;

  const paramsQueryString: FiltroSemestreDto = {
    anoLetivo: params.anoLetivo,
    dreCodigo: params.dreCodigo,
    ueCodigo: params.ueCodigo,
    modalidade: params.modalidade,
  };
  return obterRegistro<number[]>(`${URL_DEFAULT}/${consideraHistorico}/semestres`, {
    params: paramsQueryString,
  });
};

type ObterTurmasProps = {
  ueCodigo: string;
  anoLetivo: number;
  periodo?: number;
  modalidade: ModalidadeEnum | string;
  consideraHistorico?: boolean;
  tipos?: number[];
};
const obterTurmas = (params: ObterTurmasProps) => {
  const consideraHistorico = params?.consideraHistorico || false;
  const ueCodigo = params.ueCodigo;

  const paramsQueryString = {
    anoLetivo: params.anoLetivo,
    ueCodigo: params.ueCodigo,
    modalidade: params.modalidade,
    periodo: params.periodo,
    consideraNovosAnosInfantil: true,
  };

  const url = `${URL_DEFAULT}/${consideraHistorico}/dres/ues/${ueCodigo}/turmas`;

  return obterRegistro<AbrangenciaTurmaRetornoDto[]>(url, {
    params: paramsQueryString,
    paramsSerializer: {
      serialize: (params) => {
        return queryString.stringify(params, {
          skipNull: true,
          skipEmptyString: true,
        });
      },
    },
  });
};

export default {
  obterSemestres,
  obterTurmas,
};
