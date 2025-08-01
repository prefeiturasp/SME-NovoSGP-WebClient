import api from '~/servicos/api';
import queryString from 'query-string';
import ServicoComunicados from './ServicoComunicados';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('ServicoComunicados', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve consultar comunicado por ID', () => {
    ServicoComunicados.consultarPorId(123);
    expect(api.get).toHaveBeenCalledWith('v1/comunicados/123');
  });

  it('deve salvar comunicado existente com PUT', () => {
    const dados = { id: 5, titulo: 'Teste' };
    ServicoComunicados.salvar(dados);
    expect(api.put).toHaveBeenCalledWith('v1/comunicados/5', dados);
  });

  it('deve salvar novo comunicado com POST', () => {
    const dados = { titulo: 'Novo' };
    ServicoComunicados.salvar(dados);
    expect(api.post).toHaveBeenCalledWith('v1/comunicados', dados);
  });

  it('deve excluir comunicados', async () => {
    const ids = [1, 2, 3];
    await ServicoComunicados.excluir(ids);
    expect(api.delete).toHaveBeenCalledWith('v1/comunicados', { data: ids });
  });

  it('deve buscar anos por modalidade com serialização correta', async () => {
    const modalidades = [1, 2];
    const codigoUe = 10;

    await ServicoComunicados.buscarAnosPorModalidade(modalidades, codigoUe);

    expect(api.get).toHaveBeenCalledWith('v1/comunicados/anos/modalidades', {
      params: { modalidades, codigoUe },
      paramsSerializer: {
        serialize: expect.any(Function),
      },
    });

    const result = api.get.mock.calls[0][1].paramsSerializer.serialize({
      modalidades,
      codigoUe,
    });

    expect(result).toBe(queryString.stringify(
      { modalidades, codigoUe },
      { arrayFormat: 'repeat', skipEmptyString: true, skipNull: true }
    ));
  });

  it('deve obter grupos por modalidade com resposta com dados', async () => {
    api.get.mockResolvedValue({ status: 200, data: ['grupo1'] });

    const resultado = await ServicoComunicados.obterGruposPorModalidade(1);
    expect(api.get).toHaveBeenCalledWith('v1/comunicacao/grupos/listar/modalidade/1');
    expect(resultado).toEqual(['grupo1']);
  });

  it('deve retornar array vazio se status 204 ao obter grupos', async () => {
    api.get.mockResolvedValue({ status: 204 });

    const resultado = await ServicoComunicados.obterGruposPorModalidade(1);
    expect(resultado).toEqual([]);
  });

  it('deve obter alunos', () => {
    ServicoComunicados.obterAlunos(321, 2024);
    expect(api.get).toHaveBeenCalledWith('v1/comunicados/321/alunos/2024');
  });

  it('deve obter anos letivos com params', () => {
    ServicoComunicados.obterAnosLetivos(2020);
    expect(api.get).toHaveBeenCalledWith('v1/comunicados/anos-letivos', {
      params: { anoMinimo: 2020 },
    });
  });

  it('deve obter tipo de escola com modalidades', () => {
    const modalidades = [1, 2];
    ServicoComunicados.obterTipoEscola(1, 2, modalidades);
    expect(api.get).toHaveBeenCalledWith(
      '/v1/ues/dres/1/ues/2/tipos-escolas?modalidades=1&modalidades=2'
    );
  });

  it('deve obter turmas com params serializados', () => {
    ServicoComunicados.obterTurmas(2024, 2, 1, [1], [5], true);

    expect(api.get).toHaveBeenCalledWith(
      'v1/comunicados/ues/2/anoletivo/2024/turmas',
      {
        params: {
          semestre: 1,
          modalidades: [1],
          anos: [5],
          consideraHistorico: true,
        },
        paramsSerializer: {
          serialize: expect.any(Function),
        },
      }
    );
  });

  it('deve obter semestres com params', () => {
    ServicoComunicados.obterSemestres(true, 1, 2024, 55);
    expect(api.get).toHaveBeenCalledWith(
      'v1/comunicados/semestres/consideraHistorico/true',
      {
        params: {
          modalidade: 1,
          anoLetivo: 2024,
          ueCodigo: 55,
        },
      }
    );
  });

  it('deve obter tipos de calendário com serialização correta', () => {
    ServicoComunicados.obterTiposCalendario(2024, 'Final', [1]);

    expect(api.get).toHaveBeenCalledWith(
      'v1/calendarios/tipos/ano-letivo/2024/modalidades',
      {
        params: {
          descricao: 'Final',
          modalidades: [1],
        },
        paramsSerializer: {
          serialize: expect.any(Function),
        },
      }
    );
  });

  it('deve obter quantidade de crianças com múltiplos arrays', () => {
    const urlEsperada =
      'v1/comunicados/filtro/anos-letivos/2024/dres/10/ues/20/quantidade-alunos' +
      '?turmas=1&turmas=2' +
      '&modalidades=3&modalidades=4' +
      '&anoTurma=5&anoTurma=6';

    ServicoComunicados.obterQuantidadeCrianca(
      2024,
      10,
      20,
      [1, 2],
      [3, 4],
      [5, 6]
    );

    expect(api.get).toHaveBeenCalledWith(urlEsperada);
  });
});
