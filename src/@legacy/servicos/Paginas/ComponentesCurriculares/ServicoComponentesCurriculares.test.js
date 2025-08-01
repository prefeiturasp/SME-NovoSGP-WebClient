import ServicoComponentesCurriculares from './ServicoComponentesCurriculares';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('ServicoComponentesCurriculares', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obterComponetensCurriculares', () => {
    it('deve chamar api.get com a URL correta formatando anosEscolares e turmasPrograma', async () => {
      api.get.mockResolvedValue({ data: ['componente1'] });
      const codigoUe = 10;
      const modalidade = 2;
      const anoLetivo = 2024;
      const anosEscolares = [1, 2, 3];
      const turmasPrograma = true;

      const resposta = await ServicoComponentesCurriculares.obterComponetensCurriculares(
        codigoUe,
        modalidade,
        anoLetivo,
        anosEscolares,
        turmasPrograma
      );

      const urlEsperada = `v1/componentes-curriculares/ues/10/modalidades/2/anos/2024/anos-escolares?anosEscolares=1&anosEscolares=2&anosEscolares=3&turmasPrograma=true`;
      expect(api.get).toHaveBeenCalledWith(urlEsperada);
      expect(resposta.data).toEqual(['componente1']);
    });
  });

  describe('obterComponetensCurricularesPorTurma', () => {
    it('deve chamar api.post com a URL e dados corretos', async () => {
      api.post.mockResolvedValue({ data: ['componentePorTurma'] });
      const codigoUe = 5;
      const turmas = [10, 20];
      const resposta = await ServicoComponentesCurriculares.obterComponetensCurricularesPorTurma(codigoUe, turmas);

      expect(api.post).toHaveBeenCalledWith('v1/componentes-curriculares/ues/5/turmas', turmas);
      expect(resposta.data).toEqual(['componentePorTurma']);
    });
  });

  describe('obterComponetensCurricularesRegencia', () => {
    it('deve chamar api.get com a URL correta', async () => {
      api.get.mockResolvedValue({ data: ['regenciaComponente'] });
      const turmaId = 7;
      const resposta = await ServicoComponentesCurriculares.obterComponetensCurricularesRegencia(turmaId);

      expect(api.get).toHaveBeenCalledWith('v1/componentes-curriculares/turmas/7/regencia/componentes');
      expect(resposta.data).toEqual(['regenciaComponente']);
    });
  });

  describe('obterComponentesPorListaDeTurmas', () => {
    it('deve chamar api.post com a URL e dados corretos', async () => {
      api.post.mockResolvedValue({ data: ['componentesLista'] });
      const turmasId = [1, 2, 3];
      const resposta = await ServicoComponentesCurriculares.obterComponentesPorListaDeTurmas(turmasId);

      expect(api.post).toHaveBeenCalledWith('v1/professores/disciplinas/turmas', turmasId);
      expect(resposta.data).toEqual(['componentesLista']);
    });
  });

  describe('obterComponentesPorUeTurmas', () => {
    it('deve chamar api.post com a URL e dados corretos', async () => {
      api.post.mockResolvedValue({ data: ['componentesPorUeTurmas'] });
      const ueId = 9;
      const turmasId = [4, 5];
      const resposta = await ServicoComponentesCurriculares.obterComponentesPorUeTurmas(ueId, turmasId);

      expect(api.post).toHaveBeenCalledWith('v1/componentes-curriculares/ues/9/turmas', turmasId);
      expect(resposta.data).toEqual(['componentesPorUeTurmas']);
    });
  });
});
