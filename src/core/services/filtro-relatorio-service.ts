import { OpcaoDropdownDto } from '../dto/OpcaoDropdownDto';
import { obterRegistro } from './api';

const URL_DEFAULT = 'v1/relatorios/filtros';

type ObterModalidadesProps = {
  ueCodigo: string;
  anoLetivo: string;
  consideraHistorico?: boolean;
  consideraNovasModalidades?: boolean;
};
const obterModalidades = (params: ObterModalidadesProps) => {
  const paramsQueryString = {
    anoLetivo: params.anoLetivo,
    consideraHistorico: params.consideraHistorico || false,
    consideraNovasModalidades: params.consideraNovasModalidades || false,
  };
  return obterRegistro<OpcaoDropdownDto[]>(`${URL_DEFAULT}/ues/${params.ueCodigo}/modalidades`, {
    params: paramsQueryString,
  });
};

export default {
  obterModalidades,
};
