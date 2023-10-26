import { AxiosResponse } from 'axios';
import { CepDto } from '../dto/CepDto';
import { api } from '@/@legacy/servicos';

const URL_DEFAULT = 'v1/cep';

const obterDadosCEP = (cep: string): Promise<AxiosResponse<CepDto>> =>
  api.get(URL_DEFAULT, { params: { cep } });

export default {
  obterDadosCEP,
};
