import { CadastroAcessoABAEDto } from '../dto/CadastroAcessoABAEDto';
import { NomeCpfABAEDto } from '../dto/NomeCpfABAEDto';
import { alterarRegistro, deletarRegistro, inserirRegistro, obterRegistro } from './api';

const URL_DEFAULT = 'v1/abae';

const incluir = (params: CadastroAcessoABAEDto) =>
  inserirRegistro<CadastroAcessoABAEDto>(URL_DEFAULT, params);

const alterar = (params: CadastroAcessoABAEDto) =>
  alterarRegistro<CadastroAcessoABAEDto>(URL_DEFAULT, params);

const buscarPorId = (id: number | string) =>
  obterRegistro<CadastroAcessoABAEDto>(`${URL_DEFAULT}/${id}`);

const excluir = (id: number | string) =>
  deletarRegistro<CadastroAcessoABAEDto>(`${URL_DEFAULT}/${id}`);

const buscarABAEs = (
  codigoDre: string,
  codigoUe: string,
  codigoRf?: string,
  nomeServidor?: string,
) =>
  obterRegistro<NomeCpfABAEDto[]>(`${URL_DEFAULT}/dres/${codigoDre}/ues/${codigoUe}/funcionarios`, {
    params: { codigoRf, nomeServidor },
  });

export default {
  incluir,
  alterar,
  buscarPorId,
  excluir,
  buscarABAEs,
};
