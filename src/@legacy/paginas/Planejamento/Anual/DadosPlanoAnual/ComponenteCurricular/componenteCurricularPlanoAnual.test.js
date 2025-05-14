import React from 'react';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import ServicoDisciplinas from '~/servicos/Paginas/ServicoDisciplina';
import ComponenteCurricularPlanoAnual from './ComponenteCurricularPlanoAnual';

import planoAnualReducer from '~/redux/modulos/anual/reducers';
import usuarioReducer from '~/redux/modulos/usuario/reducers';
import filtroReducer from '~/redux/modulos/filtro/reducers';

import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import { confirmar, erros } from '~/servicos/alertas';
import servicoSalvarPlanoAnual from '../../servicoSalvarPlanoAnual';

const rootReducer = combineReducers({
  planoAnual: planoAnualReducer,
  usuario: usuarioReducer,
  filtro: filtroReducer,
});

jest.mock('~/servicos/Validacoes/validacoesInfatil', () => ({
  ehTurmaInfantil: jest.fn(),
}));
jest.mock('~/servicos/alertas', () => ({
  confirmar: jest.fn(),
  erros: jest.fn(),
  sucesso: jest.fn(),
}));
jest.mock('../../servicoSalvarPlanoAnual', () => ({
  validarSalvarPlanoAnual: jest.fn(),
}));
jest.mock('~/servicos/Paginas/ServicoDisciplina', () => ({
  obterDisciplinasPorTurma: jest.fn(),
}));

const mockStore = configureStore([]);

const renderWithMockStore = initialState => {
  const store = mockStore(initialState);
  return {
    store,
    ...render(
      <Provider store={store}>
        <ComponenteCurricularPlanoAnual />
      </Provider>
    ),
  };
};

const renderWithRealStore = initialState => {
  const store = createStore(rootReducer, initialState);
  return {
    store,
    ...render(
      <Provider store={store}>
        <ComponenteCurricularPlanoAnual />
      </Provider>
    ),
  };
};

describe('Componente Curricular plano anual', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('quando só tiver uma disciplina ela é deixada selecionada e select fica desabilitado', async () => {
    ehTurmaInfantil.mockReturnValue(false);

    const sóUma = [
      { id: 6, codigoComponenteCurricular: 6, nome: 'Ed. Física' },
    ];
    ServicoDisciplinas.obterDisciplinasPorTurma.mockResolvedValueOnce({
      data: sóUma,
    });

    const initialState = {
      planoAnual: {
        componenteCurricular: undefined,
        listaComponentesCurricularesPlanejamento: sóUma,
        bimestresPlanoAnual: [],
        planoAnualEmEdicao: false,
        tabAtualComponenteCurricular: [],
        dadosBimestresPlanoAnual: [],
        dadosEditadosBimestresPlanoAnual: [],
        listaObjetivosAprendizagemPorComponente: [],
        errosPlanoAnual: [],
        exibirModalErrosPlanoAnual: false,
        exibirCopiarConteudo: false,
        listaTurmasParaCopiar: [],
        ehRegistroMigrado: false,
        planejamentoAnualId: 0,
        planoAnualSomenteConsulta: false,
        listaComponentesCheck: [],
      },
      usuario: {
        nome: 'Professor Teste',
        id: 1,
        turmaSelecionada: {
          anoLetivo: 2025,
          modalidade: 5,
          dre: '108200',
          unidadeEscolar: '092967',
          turma: '2853818',
          ano: '7',
          desc: 'desc',
          periodo: 0,
          consideraHistorico: false,
          ensinoEspecial: false,
          id: 4390735,
        },
      },
      filtro: { modalidades: [{ desc: 'Ensino Fundamental', valor: 5 }] },
    };

    const { store } = renderWithRealStore(initialState);

    await waitFor(() => {
      expect(store.getState().planoAnual.componenteCurricular).toEqual(
        sóUma[0]
      );
    });

    const select = await screen.findByRole('combobox', {
      id: 'componente-curricular',
    });
    expect(select).toBeDisabled();
    expect(screen.getByText(/Ed\. Física/i)).toBeInTheDocument();
  });

  it('quando tiver mais de uma disciplina, select fica habilitado e mostra todas opções', async () => {
    ehTurmaInfantil.mockReturnValue(false);

    const duas = [
      { id: 6, codigoComponenteCurricular: 6, nome: 'Ed. Física' },
      { id: 7, codigoComponenteCurricular: 7, nome: 'Matemática' },
    ];
    ServicoDisciplinas.obterDisciplinasPorTurma.mockResolvedValueOnce({
      data: duas,
    });

    const initialState = {
      planoAnual: {
        componenteCurricular: undefined,
        listaComponentesCurricularesPlanejamento: duas,
        bimestresPlanoAnual: [],
        planoAnualEmEdicao: false,
        tabAtualComponenteCurricular: [],
        dadosBimestresPlanoAnual: [],
        dadosEditadosBimestresPlanoAnual: [],
        listaObjetivosAprendizagemPorComponente: [],
        errosPlanoAnual: [],
        exibirModalErrosPlanoAnual: false,
        exibirCopiarConteudo: false,
        listaTurmasParaCopiar: [],
        ehRegistroMigrado: false,
        planejamentoAnualId: 0,
        planoAnualSomenteConsulta: false,
        listaComponentesCheck: [],
      },
      usuario: {
        nome: 'Professor Teste',
        id: 1,
        turmaSelecionada: {
          anoLetivo: 2025,
          modalidade: 5,
          dre: '108200',
          unidadeEscolar: '092967',
          turma: '2853818',
          ano: '7',
          desc: 'desc',
          periodo: 0,
          consideraHistorico: false,
          ensinoEspecial: false,
          id: 4390735,
        },
      },
      filtro: { modalidades: [{ desc: 'Ensino Fundamental', valor: 5 }] },
    };

    renderWithMockStore(initialState);

    const select = await screen.findByRole('combobox', {
      id: 'componente-curricular',
    });
    expect(select).toBeEnabled();

    fireEvent.mouseDown(select);

    expect(await screen.findByText(/Ed\. Física/i)).toBeInTheDocument();
    expect(await screen.findByText(/Matemática/i)).toBeInTheDocument();
  });

  it('quando o fetch falhar, chama erros() e não define componente', async () => {
    ehTurmaInfantil.mockReturnValue(false);

    ServicoDisciplinas.obterDisciplinasPorTurma.mockRejectedValueOnce(
      new Error('fail')
    );

    const initialState = {
      planoAnual: {
        componenteCurricular: undefined,
        listaComponentesCurricularesPlanejamento: [],
        bimestresPlanoAnual: [],
        planoAnualEmEdicao: false,
        tabAtualComponenteCurricular: [],
        dadosBimestresPlanoAnual: [],
        dadosEditadosBimestresPlanoAnual: [],
        listaObjetivosAprendizagemPorComponente: [],
        errosPlanoAnual: [],
        exibirModalErrosPlanoAnual: false,
        exibirCopiarConteudo: false,
        listaTurmasParaCopiar: [],
        ehRegistroMigrado: false,
        planejamentoAnualId: 0,
        planoAnualSomenteConsulta: false,
        listaComponentesCheck: [],
      },
      usuario: {
        nome: 'Professor Teste',
        id: 1,
        turmaSelecionada: {
          anoLetivo: 2025,
          modalidade: 5,
          dre: '108200',
          unidadeEscolar: '092967',
          turma: '2853818',
          ano: '7',
          desc: 'desc',
          periodo: 0,
          consideraHistorico: false,
          ensinoEspecial: false,
          id: 4390735,
        },
      },
      filtro: { modalidades: [{ desc: 'Ensino Fundamental', valor: 5 }] },
    };

    const { store } = renderWithMockStore(initialState);

    await waitFor(() => {
      expect(erros).toHaveBeenCalledWith(expect.any(Error));
      expect(store.getState().planoAnual.componenteCurricular).toBeUndefined();
    });

    const select = await screen.findByRole('combobox', {
      id: 'componente-curricular',
    });
    expect(select).toBeEnabled();
    expect(screen.queryByText(/Ed\. Física/i)).toBeNull();
  });

  it('se for turma infantil, não chama fetch e select fica desabilitado', async () => {
    ehTurmaInfantil.mockReturnValue(true);

    const initialState = {
      planoAnual: {
        componenteCurricular: undefined,
        listaComponentesCurricularesPlanejamento: [],
        bimestresPlanoAnual: [],
        planoAnualEmEdicao: false,
        tabAtualComponenteCurricular: [],
        dadosBimestresPlanoAnual: [],
        dadosEditadosBimestresPlanoAnual: [],
        listaObjetivosAprendizagemPorComponente: [],
        errosPlanoAnual: [],
        exibirModalErrosPlanoAnual: false,
        exibirCopiarConteudo: false,
        listaTurmasParaCopiar: [],
        ehRegistroMigrado: false,
        planejamentoAnualId: 0,
        planoAnualSomenteConsulta: false,
        listaComponentesCheck: [],
      },
      usuario: {
        nome: 'Professor Teste',
        id: 1,
        turmaSelecionada: {
          anoLetivo: 2025,
          modalidade: 5,
          dre: '108200',
          unidadeEscolar: '092967',
          turma: '2853818',
          ano: '7',
          desc: 'desc',
          periodo: 0,
          consideraHistorico: false,
          ensinoEspecial: false,
          id: 4390735,
        },
      },
      filtro: { modalidades: [{ desc: 'Ensino Fundamental', valor: 5 }] },
    };

    renderWithMockStore(initialState);

    expect(ServicoDisciplinas.obterDisciplinasPorTurma).not.toHaveBeenCalled();

    const select = await screen.findByRole('combobox', {
      id: 'componente-curricular',
    });
    expect(select).toBeDisabled();
  });

  it('onChange sem edição despacha limpar + set', async () => {
    ehTurmaInfantil.mockReturnValue(false);

    const mockDuas = [
      { id: 6, codigoComponenteCurricular: 6, nome: 'Ed. Física' },
      { id: 7, codigoComponenteCurricular: 7, nome: 'Matemática' },
    ];
    ServicoDisciplinas.obterDisciplinasPorTurma.mockResolvedValueOnce({
      data: mockDuas,
    });

    const initialState = {
      planoAnual: {
        componenteCurricular: undefined,
        listaComponentesCurricularesPlanejamento: mockDuas,
        bimestresPlanoAnual: [],
        planoAnualEmEdicao: false,
        tabAtualComponenteCurricular: [],
        dadosBimestresPlanoAnual: [],
        dadosEditadosBimestresPlanoAnual: [],
        listaObjetivosAprendizagemPorComponente: [],
        errosPlanoAnual: [],
        exibirModalErrosPlanoAnual: false,
        exibirCopiarConteudo: false,
        listaTurmasParaCopiar: [],
        ehRegistroMigrado: false,
        planejamentoAnualId: 0,
        planoAnualSomenteConsulta: false,
        listaComponentesCheck: [],
      },
      usuario: {
        nome: 'Professor Teste',
        id: 1,
        turmaSelecionada: {
          anoLetivo: 2025,
          modalidade: 5,
          dre: '108200',
          unidadeEscolar: '092967',
          turma: '2853818',
          ano: '7',
          desc: 'desc',
          periodo: 0,
          consideraHistorico: false,
          ensinoEspecial: false,
          id: 4390735,
        },
      },
      filtro: { modalidades: [{ desc: 'Ensino Fundamental', valor: 5 }] },
    };

    const { store } = renderWithMockStore(initialState);

    const select = await screen.findByRole('combobox', {
      id: 'componente-curricular',
    });
    fireEvent.mouseDown(select);
    const option2 = await screen.findByText(/Matemática/i);
    fireEvent.click(option2);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: expect.stringContaining('setComponenteCurricularPlanoAnual'),
            payload: mockDuas[1],
          }),
        ])
      );
    });
  });

  it('deve chamar perguntaAoSalvar e validarSalvarPlanoAnual ao trocar componente curricular com plano em edição', async () => {
    ehTurmaInfantil.mockReturnValue(false);
    confirmar.mockResolvedValueOnce(true);
    servicoSalvarPlanoAnual.validarSalvarPlanoAnual.mockResolvedValueOnce(true);

    const mockDuas = [
      { id: 6, codigoComponenteCurricular: 6, nome: 'Ed. Física' },
      { id: 7, codigoComponenteCurricular: 7, nome: 'Matemática' },
    ];
    ServicoDisciplinas.obterDisciplinasPorTurma.mockResolvedValueOnce({
      data: mockDuas,
    });
    const initialState = {
      planoAnual: {
        componenteCurricular: undefined,
        listaComponentesCurricularesPlanejamento: mockDuas,
        bimestresPlanoAnual: [],
        planoAnualEmEdicao: true,
        tabAtualComponenteCurricular: [],
        dadosBimestresPlanoAnual: [],
        dadosEditadosBimestresPlanoAnual: [],
        listaObjetivosAprendizagemPorComponente: [],
        errosPlanoAnual: [],
        exibirModalErrosPlanoAnual: false,
        exibirCopiarConteudo: false,
        listaTurmasParaCopiar: [],
        ehRegistroMigrado: false,
        planejamentoAnualId: 0,
        planoAnualSomenteConsulta: false,
        listaComponentesCheck: [],
      },
      usuario: {
        nome: 'Professor Teste',
        id: 1,
        turmaSelecionada: {
          anoLetivo: 2025,
          modalidade: 5,
          dre: '108200',
          unidadeEscolar: '092967',
          turma: '2853818',
          ano: '7',
          desc: 'desc',
          periodo: 0,
          consideraHistorico: false,
          ensinoEspecial: false,
          id: 4390735,
        },
      },
      filtro: { modalidades: [{ desc: 'Ensino Fundamental', valor: 5 }] },
    };
    const { store } = renderWithMockStore(initialState);
    const select = await screen.findByRole('combobox', {
      id: 'componente-curricular',
    });
    fireEvent.mouseDown(select);
    const option2 = await screen.findByText(/Matemática/i);
    fireEvent.click(option2);
    await waitFor(() => {
      expect(confirmar).toHaveBeenCalled();
      expect(
        servicoSalvarPlanoAnual.validarSalvarPlanoAnual
      ).toHaveBeenCalled();
      const actions = store.getActions();
      expect(actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: expect.stringContaining('setComponenteCurricularPlanoAnual'),
            payload: mockDuas[1],
          }),
        ])
      );
    });
  });

  it('deve chamar perguntaAoSalvar e NÃO setar componente se usuário cancelar', async () => {
    ehTurmaInfantil.mockReturnValue(false);
    confirmar.mockResolvedValueOnce(false);

    const mockDuas = [
      { id: 6, codigoComponenteCurricular: 6, nome: 'Ed. Física' },
      { id: 7, codigoComponenteCurricular: 7, nome: 'Matemática' },
    ];
    ServicoDisciplinas.obterDisciplinasPorTurma.mockResolvedValueOnce({
      data: mockDuas,
    });
    const initialState = {
      planoAnual: {
        componenteCurricular: undefined,
        listaComponentesCurricularesPlanejamento: mockDuas,
        bimestresPlanoAnual: [],
        planoAnualEmEdicao: true,
        tabAtualComponenteCurricular: [],
        dadosBimestresPlanoAnual: [],
        dadosEditadosBimestresPlanoAnual: [],
        listaObjetivosAprendizagemPorComponente: [],
        errosPlanoAnual: [],
        exibirModalErrosPlanoAnual: false,
        exibirCopiarConteudo: false,
        listaTurmasParaCopiar: [],
        ehRegistroMigrado: false,
        planejamentoAnualId: 0,
        planoAnualSomenteConsulta: false,
        listaComponentesCheck: [],
      },
      usuario: {
        nome: 'Professor Teste',
        id: 1,
        turmaSelecionada: {
          anoLetivo: 2025,
          modalidade: 5,
          dre: '108200',
          unidadeEscolar: '092967',
          turma: '2853818',
          ano: '7',
          desc: 'desc',
          periodo: 0,
          consideraHistorico: false,
          ensinoEspecial: false,
          id: 4390735,
        },
      },
      filtro: { modalidades: [{ desc: 'Ensino Fundamental', valor: 5 }] },
    };
    const { store } = renderWithMockStore(initialState);
    const select = await screen.findByRole('combobox', {
      id: 'componente-curricular',
    });
    fireEvent.mouseDown(select);
    const option2 = await screen.findByText(/Matemática/i);
    fireEvent.click(option2);
    await waitFor(() => {
      expect(confirmar).toHaveBeenCalled();
      expect(
        servicoSalvarPlanoAnual.validarSalvarPlanoAnual
      ).not.toHaveBeenCalled();
      const actions = store.getActions();
      expect(actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: expect.stringContaining('setComponenteCurricularPlanoAnual'),
            payload: mockDuas[1],
          }),
        ])
      );
    });
  });

  it('deve chamar perguntaAoSalvar e NÃO setar componente se validarSalvarPlanoAnual retornar false', async () => {
    ehTurmaInfantil.mockReturnValue(false);
    confirmar.mockResolvedValueOnce(true);
    servicoSalvarPlanoAnual.validarSalvarPlanoAnual.mockResolvedValueOnce(
      false
    );

    const mockDuas = [
      { id: 6, codigoComponenteCurricular: 6, nome: 'Ed. Física' },
      { id: 7, codigoComponenteCurricular: 7, nome: 'Matemática' },
    ];
    ServicoDisciplinas.obterDisciplinasPorTurma.mockResolvedValueOnce({
      data: mockDuas,
    });
    const initialState = {
      planoAnual: {
        componenteCurricular: undefined,
        listaComponentesCurricularesPlanejamento: mockDuas,
        bimestresPlanoAnual: [],
        planoAnualEmEdicao: true,
        tabAtualComponenteCurricular: [],
        dadosBimestresPlanoAnual: [],
        dadosEditadosBimestresPlanoAnual: [],
        listaObjetivosAprendizagemPorComponente: [],
        errosPlanoAnual: [],
        exibirModalErrosPlanoAnual: false,
        exibirCopiarConteudo: false,
        listaTurmasParaCopiar: [],
        ehRegistroMigrado: false,
        planejamentoAnualId: 0,
        planoAnualSomenteConsulta: false,
        listaComponentesCheck: [],
      },
      usuario: {
        nome: 'Professor Teste',
        id: 1,
        turmaSelecionada: {
          anoLetivo: 2025,
          modalidade: 5,
          dre: '108200',
          unidadeEscolar: '092967',
          turma: '2853818',
          ano: '7',
          desc: 'desc',
          periodo: 0,
          consideraHistorico: false,
          ensinoEspecial: false,
          id: 4390735,
        },
      },
      filtro: { modalidades: [{ desc: 'Ensino Fundamental', valor: 5 }] },
    };
    const { store } = renderWithMockStore(initialState);
    const select = await screen.findByRole('combobox', {
      id: 'componente-curricular',
    });
    fireEvent.mouseDown(select);
    const option2 = await screen.findByText(/Matemática/i);
    fireEvent.click(option2);
    await waitFor(() => {
      expect(confirmar).toHaveBeenCalled();
      expect(
        servicoSalvarPlanoAnual.validarSalvarPlanoAnual
      ).toHaveBeenCalled();
      const actions = store.getActions();

      expect(actions).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: expect.stringContaining('setComponenteCurricularPlanoAnual'),
            payload: mockDuas[1],
          }),
        ])
      );
    });
  });
});
