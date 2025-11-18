import { api, erros } from '@/@legacy/servicos';
import { RetornoBaseDto } from '@/core/dto/RetornoBaseDto';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export type ApiResult<T> = {
  dados: T;
  sucesso: boolean;
  mensagens: string[];
};

const tratarThen = <T>(response: AxiosResponse<T>): ApiResult<T> => {
  return { sucesso: true, dados: response?.data, mensagens: [] };
};

const tratarCatch = (error: AxiosError<RetornoBaseDto>): ApiResult<any> => {
  erros(error);

  const mensagens = error?.response?.data?.mensagens?.length
    ? error?.response?.data?.mensagens
    : [];

  return { sucesso: false, mensagens, dados: null };
};

export const obterRegistro = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> => {
  return api
    .get(url, config)
    .then(tratarThen<T>)
    .catch(tratarCatch);
};

export const alterarRegistro = async <T>(url: string, params: any): Promise<ApiResult<T>> => {
  return api
    .put(url, params)
    .then(tratarThen<T>)
    .catch(tratarCatch);
};

export const inserirRegistro = async <T>(
  url: string,
  params: any,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> => {
  return api
    .post(url, params, config)
    .then(tratarThen<T>)
    .catch(tratarCatch);
};

export const deletarRegistro = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> => {
  return api
    .delete(url, config)
    .then(tratarThen<T>)
    .catch(tratarCatch);
};
