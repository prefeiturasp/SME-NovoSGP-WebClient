import { CadastroAcessoABAEDto } from '../dto/CadastroAcessoABAEDto';
import { alterarRegistro, deletarRegistro, inserirRegistro, obterRegistro } from './api';

const URL_DEFAULT = 'v1/abae';

const incluir = (params: CadastroAcessoABAEDto) =>
  inserirRegistro<CadastroAcessoABAEDto>(URL_DEFAULT, params);

const alterar = (params: CadastroAcessoABAEDto) =>
  alterarRegistro<CadastroAcessoABAEDto>(URL_DEFAULT, params);

const buscarPorId = (id: number | string) =>
  obterRegistro<CadastroAcessoABAEDto>(`${URL_DEFAULT}/${id}`);

const excluir = (id: number | string) =>
  deletarRegistro<CadastroAcessoABAEDto>(URL_DEFAULT, { params: { id } });

export default {
  incluir,
  alterar,
  buscarPorId,
  excluir,
};
