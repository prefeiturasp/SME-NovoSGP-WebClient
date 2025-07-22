jest.mock('~/servicos/api', () => ({
  __esModule: true,
  default: {
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}));

import api from '~/servicos/api';
import ServicoComponentesCurriculares from './ServicoComponentesCurriculares';

describe('ServicoComponentesCurriculares', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar componentes curriculares corretamente', async () => {
    const codigoUe = 1;
    const modalidade = 2;
    const anoLetivo = 2024;
    const anosEscolares = [3, 4];
    const turmasPrograma = true;

    await ServicoComponentesCurriculares.obterComponetensCurriculares(
      codigoUe, modalidade, anoLetivo, anosEscolares, turmasPrograma
    );

    expect(api.get).toHaveBeenCalledWith(
      'v1/componentes-curriculares/ues/1/modalidades/2/anos/2024/anos-escolares?anosEscolares=3&anosEscolares=4&turmasPrograma=true'
    );
  });

  /*it('deve buscar componentes curriculares por turma', async () => {
    const codigoUe = 99;
    const turmas = [{ turmaId: 'T1' }, { turmaId: 'T2' }];
    await ServicoComponentesCurriculares.obterComponetensCurricularesPorTurma(codigoUe, turmas);

    expect(api.post).toHaveBeenCalledWith('v1/componentes-curriculares/ues/99/turmas', turmas);
  });*/

  it('deve buscar componentes de regência corretamente', async () => {
    const turmaId = 'TURMA123';
    await ServicoComponentesCurriculares.obterComponetensCurricularesRegencia(turmaId);

    expect(api.get).toHaveBeenCalledWith('v1/componentes-curriculares/turmas/TURMA123/regencia/componentes');
  });

  /*it('deve buscar componentes por lista de turmas', async () => {
    const turmasId = [1, 2, 3];
    await ServicoComponentesCurriculares.obterComponentesPorListaDeTurmas(turmasId);

    expect(api.post).toHaveBeenCalledWith('v1/professores/disciplinas/turmas', turmasId);
  });

  it('deve buscar componentes por ue e turmas', async () => {
    const ueId = 55;
    const turmasId = [10, 20];
    await ServicoComponentesCurriculares.obterComponetensCurricularesPorUeTurmas(ueId, turmasId);

    expect(api.post).toHaveBeenCalledWith('v1/componentes-curriculares/ues/55/turmas', turmasId);
  });*/
});
