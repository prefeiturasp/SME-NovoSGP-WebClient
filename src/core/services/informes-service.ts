import { api } from '@/@legacy/servicos';
import { GruposDeUsuariosDTO } from '../dto/GruposDeUsuariosDto';
import { TipoPerfil } from '../enum/tipo-perfil-enum';
import { AxiosResponse } from 'axios';

const URL_API_INFORME = 'v1/informes';

const obterInformePorId = (id: string | number): Promise<AxiosResponse<any>> =>
  api.get(`${URL_API_INFORME}/${id}`);

const salvarInforme = (params: any): Promise<AxiosResponse<any>> =>
  api.post(`${URL_API_INFORME}/salvar`, params);

const excluirInformePorId = (id: string | number): Promise<AxiosResponse<any>> =>
  api.delete(`${URL_API_INFORME}/${id}`);

const obterPerfisPorTipoPerfil = (
  tipoPerfil: TipoPerfil,
): Promise<AxiosResponse<GruposDeUsuariosDTO[]>> =>
  api.get(`${URL_API_INFORME}/grupos-usuarios/perfil/${tipoPerfil}`);

export { excluirInformePorId, obterInformePorId, obterPerfisPorTipoPerfil, salvarInforme };
