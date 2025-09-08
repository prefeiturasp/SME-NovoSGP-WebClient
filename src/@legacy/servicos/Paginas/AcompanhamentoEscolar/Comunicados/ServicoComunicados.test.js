import ServicoComunicados from './ServicoComunicados';
import api from '~/servicos/api';
import { OPCAO_TODOS } from '~/constantes/constantes';

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

  it('deve retornar grupo por modalidade com sucesso', async () => {
    const dataMock = [{ id: 1 }];
    api.get.mockResolvedValue({ data: dataMock });

    const resultado = await ServicoComunicados.obterIdGrupoComunicadoPorModalidade('1');

    expect(api.get).toHaveBeenCalledWith('listar/modalidade/1');
    expect(resultado).toEqual({ sucesso: true, data: dataMock });
  });

  it('deve tratar erro ao buscar grupo por modalidade', async () => {
    const erro = new Error('Erro');
    api.get.mockRejectedValue(erro);

    const resultado = await ServicoComunicados.obterIdGrupoComunicadoPorModalidade('1');

    expect(resultado).toEqual({ sucesso: false, erro });
  });

  it('deve consultar comunicado por ID com sucesso', async () => {
    const comunicadoMock = { titulo: 'Teste' };
    api.get.mockResolvedValue({ data: comunicadoMock });

    const resultado = await ServicoComunicados.consultarPorId(123);

    expect(api.get).toHaveBeenCalledWith('v1/comunicado/123');
    expect(resultado).toEqual(comunicadoMock);
  });

  it('deve retornar objeto vazio se erro ao consultar por ID', async () => {
    api.get.mockRejectedValue(new Error('Erro'));

    const resultado = await ServicoComunicados.consultarPorId(123);

    expect(resultado).toEqual({});
  });

  it('deve salvar novo comunicado (POST)', async () => {
    const dados = { titulo: 'Novo' };
    const response = { data: dados };
    api.post.mockResolvedValue(response);

    const resultado = await ServicoComunicados.salvar(dados);

    expect(api.post).toHaveBeenCalledWith('v1/comunicado', dados);
    expect(resultado).toEqual(response);
  });

  it('deve atualizar comunicado existente (PUT)', async () => {
    const dados = { id: 1, titulo: 'Atualizado' };
    const response = { data: dados };
    api.put.mockResolvedValue(response);

    const resultado = await ServicoComunicados.salvar(dados);

    expect(api.put).toHaveBeenCalledWith('v1/comunicado/1', dados);
    expect(resultado).toEqual(response);
  });

  it('deve tratar erro ao salvar', async () => {
    const erroMock = {
      response: { data: { mensagens: ['Erro ao salvar'] } },
    };
    api.post.mockRejectedValue(erroMock);

    const resultado = await ServicoComunicados.salvar({ titulo: 'Erro' });

    expect(resultado).toEqual(['Erro ao salvar']);
  });

  it('deve excluir comunicados', async () => {
    const response = { status: 200 };
    api.delete.mockResolvedValue(response);

    const resultado = await ServicoComunicados.excluir([1, 2]);

    expect(api.delete).toHaveBeenCalledWith('v1/comunicado', { data: [1, 2] });
    expect(resultado).toEqual(response);
  });

  it('deve tratar erro ao excluir comunicados', async () => {
    const erroMock = {
      response: { data: { mensagens: ['Erro ao excluir'] } },
    };
    api.delete.mockRejectedValue(erroMock);

    const resultado = await ServicoComunicados.excluir([1, 2]);

    expect(resultado).toEqual(['Erro ao excluir']);
  });

  it('deve buscar anos com código de UE válido', async () => {
    const params = { exemplo: true };
    api.get.mockResolvedValue({ data: [2023] });

    await ServicoComunicados.buscarAnosPorModalidade(1, 123, params);

    expect(api.get).toHaveBeenCalledWith(
      'v1/comunicado/anos/modalidade/1?codigoUe=123',
      { params }
    );
  });

  it('deve buscar anos com código de UE = OPCAO_TODOS', async () => {
    const params = {};
    await ServicoComunicados.buscarAnosPorModalidade(2, OPCAO_TODOS, params);

    expect(api.get).toHaveBeenCalledWith(
      'v1/comunicado/anos/modalidade/2',
      { params }
    );
  });

  it('deve obter grupos por modalidade com dados', async () => {
    api.get.mockResolvedValue({ status: 200, data: ['grupo'] });

    const resultado = await ServicoComunicados.obterGruposPorModalidade(1);

    expect(resultado).toEqual(['grupo']);
  });

  it('deve retornar array vazio se status 204 em obter grupos por modalidade', async () => {
    api.get.mockResolvedValue({ status: 204 });

    const resultado = await ServicoComunicados.obterGruposPorModalidade(1);

    expect(resultado).toEqual([]);
  });

  it('deve obter alunos por turma e anoLetivo', async () => {
    api.get.mockResolvedValue({ data: ['aluno1'] });

    const resultado = await ServicoComunicados.obterAlunos('123', 2024);

    expect(api.get).toHaveBeenCalledWith('v1/comunicado/123/alunos/2024');
    expect(resultado).toEqual(['aluno1']);
  });

  it('deve retornar array vazio se status 204 ao obter alunos', async () => {
    api.get.mockResolvedValue({ status: 204 });

    const resultado = await ServicoComunicados.obterAlunos('123', 2024);

    expect(resultado).toEqual([]);
  });

  it('deve obter tipo escola mockado', async () => {
    const resultado = await ServicoComunicados.obterTipoEscola();

    expect(resultado).toEqual({
      data: [
        { valor: '1', desc: 1 },
        { valor: '2', desc: 2 },
      ],
    });
  });
});
