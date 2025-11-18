import { HttpStatusCode as HttpStatusCodeAxios } from 'axios';

export const HttpStatusCode = {
  ...HttpStatusCodeAxios,
  NegocioException: 601,
};
