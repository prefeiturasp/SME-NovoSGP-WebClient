import ServicoCalendarios from './ServicoCalendarios';
import api from '~/servicos/api';
import moment from 'moment';

import { ModalidadeTipoCalendarioEnum } from '@/core/enum/modalidade-tipo-calendario-enum';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('ServicoCalendarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('obterTiposCalendario deve chamar o endpoint com o ano atual quando não informado', async () => {
    const anoAtual = moment().year();
    api.get.mockResolvedValueOnce({ data: ['tipo1', 'tipo2'] });

    const resposta = await ServicoCalendarios.obterTiposCalendario();

    expect(api.get).toHaveBeenCalledWith(
      `v1/calendarios/tipos/anos/letivos/${anoAtual}`
    );
    expect(resposta.data).toEqual(['tipo1', 'tipo2']);
  });

  it('obterTiposCalendario deve retornar [] em caso de erro', async () => {
    api.get.mockRejectedValueOnce(new Error('Erro'));
    const resposta = await ServicoCalendarios.obterTiposCalendario(2025);
    expect(resposta).toEqual([]);
  });

  it('converterModalidade deve converter corretamente', () => {
    expect(
      ServicoCalendarios.converterModalidade(ModalidadeTipoCalendarioEnum.EJA)
    ).toBe(ModalidadeEnum.EJA);

    expect(
      ServicoCalendarios.converterModalidade(
        ModalidadeTipoCalendarioEnum.FUNDAMENTAL_MEDIO
      )
    ).toBe(ModalidadeEnum.FUNDAMENTAL);

    expect(ServicoCalendarios.converterModalidade('DESCONHECIDO')).toBeNull();
  });

  it('gerarRelatorio deve chamar api.post com o payload correto', async () => {
    const payload = { teste: true };
    api.post.mockResolvedValueOnce({ data: 'ok' });

    const resposta = await ServicoCalendarios.gerarRelatorio(payload);
    expect(api.post).toHaveBeenCalledWith(
      'v1/relatorios/calendarios/impressao',
      payload
    );
    expect(resposta.data).toBe('ok');
  });

  it('obterTiposCalendarioAutoComplete deve chamar api.get com a descrição', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    await ServicoCalendarios.obterTiposCalendarioAutoComplete('calendario');
    expect(api.get).toHaveBeenCalledWith(
      'v1/calendarios/tipos/anos-letivos?descricao=calendario'
    );
  });

  it('obterDatasDeAulasDisponiveis deve montar URL corretamente', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    await ServicoCalendarios.obterDatasDeAulasDisponiveis(2024, 10, 999);
    expect(api.get).toHaveBeenCalledWith(
      'v1/calendarios/frequencias/aulas/datas/2024/turmas/10/disciplinas/999'
    );
  });

  it('obterAusenciaMotivoPorAlunoTurmaBimestreAno deve montar URL corretamente', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    await ServicoCalendarios.obterAusenciaMotivoPorAlunoTurmaBimestreAno(
      1,
      2,
      3,
      2024
    );
    expect(api.get).toHaveBeenCalledWith(
      'v1/calendarios/frequencias/ausencias-motivos?codigoAluno=1&codigoTurma=3&bimestre=2&anoLetivo=2024'
    );
  });

  it('obterFrequenciaAluno deve montar URL corretamente', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    await ServicoCalendarios.obterFrequenciaAluno(123, 456);
    expect(api.get).toHaveBeenCalledWith(
      'v1/calendarios/frequencias/alunos/123/turmas/456/geral'
    );
  });

  it('obterFrequenciaAlunoPorSemestre deve montar URL corretamente', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    await ServicoCalendarios.obterFrequenciaAlunoPorSemestre(111, 222, 1);
    expect(api.get).toHaveBeenCalledWith(
      'v1/calendarios/frequencias/alunos/111/turmas/222/semestre/1/geral'
    );
  });

  it('obterTiposCalendarioPorAnoLetivoModalidade deve montar URL corretamente sem semestre', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    await ServicoCalendarios.obterTiposCalendarioPorAnoLetivoModalidade(2024, 1);
    expect(api.get).toHaveBeenCalledWith(
      'v1/calendarios/tipos/ano-letivo/2024/modalidade/1'
    );
  });

  it('obterTiposCalendarioPorAnoLetivoModalidade deve montar URL corretamente com semestre', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    await ServicoCalendarios.obterTiposCalendarioPorAnoLetivoModalidade(
      2024,
      1,
      2
    );
    expect(api.get).toHaveBeenCalledWith(
      'v1/calendarios/tipos/ano-letivo/2024/modalidade/1?semestre=2'
    );
  });

  it('obterBimestres deve chamar api.get com o ID correto', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    await ServicoCalendarios.obterBimestres(5);
    expect(api.get).toHaveBeenCalledWith('v1/calendarios/tipos/5/bimestres');
  });

  it('obterTipoCalendarioPorId deve chamar api.get com o ID correto', async () => {
    api.get.mockResolvedValueOnce({ data: {} });
    await ServicoCalendarios.obterTipoCalendarioPorId(77);
    expect(api.get).toHaveBeenCalledWith('v1/calendarios/tipos/77');
  });

  it('obterFeriados deve chamar api.post corretamente', async () => {
    api.post.mockResolvedValueOnce({ data: [] });
    await ServicoCalendarios.obterFeriados();
    expect(api.post).toHaveBeenCalledWith('v1/calendarios/feriados/listar', {});
  });
});
