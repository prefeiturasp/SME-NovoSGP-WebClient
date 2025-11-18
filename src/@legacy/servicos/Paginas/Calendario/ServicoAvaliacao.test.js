import api from '~/servicos/api';
import ServicoAvaliacao from './ServicoAvaliacao';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
}));

describe('ServicoAvaliacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('listarDisciplinas deve chamar o endpoint correto', async () => {
    api.get.mockResolvedValue({ data: ['disciplina1'] });

    const resultado = await ServicoAvaliacao.listarDisciplinas('123', '456');

    expect(api.get).toHaveBeenCalledWith('v1/professores/turmas/456/disciplinas');
    expect(resultado).toEqual({ data: ['disciplina1'] });
  });

  it('listarTipos deve retornar os tipos corretamente', async () => {
    api.get.mockResolvedValue({ data: ['tipo1', 'tipo2'] });

    const resultado = await ServicoAvaliacao.listarTipos();

    expect(api.get).toHaveBeenCalledWith('v1/atividade-avaliativa/tipos/listar');
    expect(resultado).toEqual({ data: ['tipo1', 'tipo2'] });
  });

  it('verificarSeExiste deve enviar os dados via POST', async () => {
    const payload = { turma: '123', tipo: 'teste' };
    api.post.mockResolvedValue({ data: true });

    const resultado = await ServicoAvaliacao.verificarSeExiste(payload);

    expect(api.post).toHaveBeenCalledWith('v1/atividade-avaliativa/validar-existente', payload);
    expect(resultado).toEqual({ data: true });
  });

  it('validar deve retornar erro formatado quando falha', async () => {
    const erroSimulado = {
      response: { data: { mensagens: ['Erro de validação'] } }
    };
    api.post.mockRejectedValue(erroSimulado);

    const resultado = await ServicoAvaliacao.validar({});

    expect(resultado).toBe('Erro de validação');
  });

  it('salvar deve usar post quando id não é passado', async () => {
    const payload = { atividade: 'nova' };
    api.post.mockResolvedValue({ data: 'ok' });

    const resultado = await ServicoAvaliacao.salvar(undefined, payload);

    expect(api.post).toHaveBeenCalledWith('v1/atividade-avaliativa/undefined', payload);
    expect(resultado).toEqual({ data: 'ok' });
  });

  it('salvar deve usar put quando id for fornecido', async () => {
    const payload = { atividade: 'editada' };
    api.put.mockResolvedValue({ data: 'ok' });

    const resultado = await ServicoAvaliacao.salvar(1, payload);

    expect(api.put).toHaveBeenCalledWith('v1/atividade-avaliativa/1', payload);
    expect(resultado).toEqual({ data: 'ok' });
  });

  it('excluir deve retornar mensagem de erro em caso de falha', async () => {
    const erro = {
      response: { data: { mensagens: ['Não foi possível excluir'] } }
    };
    api.delete.mockRejectedValue(erro);

    const resultado = await ServicoAvaliacao.excluir(10);

    expect(resultado).toBe('Não foi possível excluir');
  });
});
