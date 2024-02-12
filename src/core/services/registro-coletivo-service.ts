import { URL_API_REGISTRO_COLETIVO } from '../constants/urls-api';
import { OpcaoDropdownDto } from '../dto/OpcaoDropdownDto';
import { ApiResult, alterarRegistro, deletarRegistro, inserirRegistro, obterRegistro } from './api';

const onterTipoReuniao = (): Promise<ApiResult<OpcaoDropdownDto[]>> =>
  obterRegistro<OpcaoDropdownDto[]>(URL_API_REGISTRO_COLETIVO);

const incluir = (params: any) => inserirRegistro<any>(URL_API_REGISTRO_COLETIVO, params);

const alterar = (params: any) => alterarRegistro<any>(URL_API_REGISTRO_COLETIVO, params);

const buscarPorId = (id: number | string) =>
  obterRegistro<any>(`${URL_API_REGISTRO_COLETIVO}/${id}`);

const excluir = (id: number | string) => deletarRegistro<any>(`${URL_API_REGISTRO_COLETIVO}/${id}`);

export default {
  onterTipoReuniao,
  incluir,
  alterar,
  buscarPorId,
  excluir,
};
