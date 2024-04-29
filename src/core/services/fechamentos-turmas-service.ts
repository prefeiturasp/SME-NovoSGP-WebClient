import { URL_API_FECHAMENTOS_TURMAS } from '../constants/urls-api';
import { AlunoDadosBasicosDto } from '../dto/AlunoDadosBasicosDto';
import { obterRegistro } from './api';

const obterAlunos = (codigoTurma: string, anoLetivo: number, semestre?: number) =>
  obterRegistro<AlunoDadosBasicosDto>(
    `${URL_API_FECHAMENTOS_TURMAS}/${codigoTurma}/alunos/anos/${anoLetivo}/semestres/${semestre}`,
  );

export default {
  obterAlunos,
};
