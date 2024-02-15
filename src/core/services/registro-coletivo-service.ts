import { URL_API_REGISTRO_COLETIVO } from '../constants/urls-api';
import { RegistroColetivoCompletoDto } from '../dto/RegistroColetivoCompletoDto';
import { RegistroColetivoDto } from '../dto/RegistroColetivoDto';
import { TipoReuniaoDto } from '../dto/TipoReuniaoDto';
import { deletarRegistro, inserirRegistro, obterRegistro } from './api';

const obterTipoDeReuniaoNAAPA = () =>
  obterRegistro<TipoReuniaoDto[]>(`${URL_API_REGISTRO_COLETIVO}/tipo-reuniao`);

const salvar = (params: RegistroColetivoDto) =>
  inserirRegistro(`${URL_API_REGISTRO_COLETIVO}/salvar`, params);

const alterar = (params: RegistroColetivoDto) =>
  inserirRegistro(`${URL_API_REGISTRO_COLETIVO}/salvar`, params);

const buscarPorId = (registroColetivoId: number | string) =>
  obterRegistro<RegistroColetivoCompletoDto>(`${URL_API_REGISTRO_COLETIVO}/${registroColetivoId}`);

const excluir = (id: number | string) => deletarRegistro(`${URL_API_REGISTRO_COLETIVO}/${id}`);

export default {
  obterTipoDeReuniaoNAAPA,
  salvar,
  alterar,
  buscarPorId,
  excluir,
};
