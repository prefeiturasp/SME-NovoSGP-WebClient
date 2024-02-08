import { URL_API_REGISTRO_COLETIVO } from '../constants/urls-api';
import { OpcaoDropdownDto } from '../dto/OpcaoDropdownDto';
import { ApiResult, obterRegistro } from './api';

const onterTipoReuniao = (): Promise<ApiResult<OpcaoDropdownDto[]>> =>
  obterRegistro<OpcaoDropdownDto[]>(URL_API_REGISTRO_COLETIVO);

export default {
  onterTipoReuniao,
};
