import { DadosResponsavelAtualizarDto } from '../dto/DadosResponsavelAtualizarDto';
import { alterarRegistro } from './api';

const URL_DEFAULT = 'v1/busca-ativa';

const atualizarDadosResponsavel = (params: DadosResponsavelAtualizarDto) =>
  alterarRegistro<boolean>(`${URL_DEFAULT}/atualizar/dados-usuario`, params);

export default {
  atualizarDadosResponsavel,
};
