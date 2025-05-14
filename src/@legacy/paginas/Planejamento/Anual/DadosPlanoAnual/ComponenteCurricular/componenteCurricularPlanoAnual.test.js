import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ServicoDisciplinas from '~/servicos/Paginas/ServicoDisciplina';
import ComponenteCurricularPlanoAnual from './ComponenteCurricularPlanoAnual';

import planoAnualReducer from '~/redux/modulos/anual/reducers';
import usuarioReducer from '~/redux/modulos/usuario/reducers';
import filtroReducer from '~/redux/modulos/filtro/reducers';

const rootReducer = combineReducers({
  planoAnual: planoAnualReducer,
  usuario: usuarioReducer,
  filtro: filtroReducer,
});

jest.mock('~/servicos', () => ({
  erros: jest.fn(),
  sucesso: jest.fn(),
}));
jest.mock('@/@legacy/servicos/Paginas/ServicoDisciplina', () => ({
  obterDisciplinasPorTurma: jest.fn(),
}));

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
  it('quando só tiver uma disciplina ela é deixada selecionada e select fica desabilitado', async () => {
    const mockApenasUmaDisciplina = [
      { id: 6, codigoComponenteCurricular: 6, nome: 'Ed. Física' },
    ];
    ServicoDisciplinas.obterDisciplinasPorTurma.mockResolvedValueOnce({
      data: mockApenasUmaDisciplina,
    });

    const initialState = {
      planoAnual: {
        componenteCurricular: undefined,
        listaComponentesCurricularesPlanejamento: mockApenasUmaDisciplina,
        bimestresPlanoAnual: [],
        planoAnualEmEdicao: false,
        tabAtualComponenteCurricular: [],
        dadosBimestresPlanoAnual: [],
        dadosEditadosBimestresPlanoAnual: [],
        listaObjetivosAprendizagemPorComponente: [],
        errosPlanoAnual: [],
        exibirModalErrosPlanoAnual: false,
        exibirModalCopiarConteudo: false,
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
      const state = store.getState();
      expect(state.planoAnual.componenteCurricular).toEqual(
        mockApenasUmaDisciplina[0]
      );
    });

    const select = await screen.findByRole('combobox', {
      id: 'componente-curricular',
    });
    expect(select).toBeDisabled();
    expect(screen.getByText(/Ed\. Física/i)).toBeInTheDocument();
  });

  it('quando tiver mais de uma disciplina, select fica habilitado e mostra todas opções', async () => {
    const mockDuasDisciplinas = [
      { id: 6, codigoComponenteCurricular: 6, nome: 'Ed. Física' },
      { id: 7, codigoComponenteCurricular: 7, nome: 'Matemática' },
    ];
    ServicoDisciplinas.obterDisciplinasPorTurma.mockResolvedValueOnce({
      data: mockDuasDisciplinas,
    });

    const initialState = {
      planoAnual: {
        componenteCurricular: undefined,
        listaComponentesCurricularesPlanejamento: mockDuasDisciplinas,
        bimestresPlanoAnual: [],
        planoAnualEmEdicao: false,
        tabAtualComponenteCurricular: [],
        dadosBimestresPlanoAnual: [],
        dadosEditadosBimestresPlanoAnual: [],
        listaObjetivosAprendizagemPorComponente: [],
        errosPlanoAnual: [],
        exibirModalErrosPlanoAnual: false,
        exibirModalCopiarConteudo: false,
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

    renderWithRealStore(initialState);

    const select = await screen.findByRole('combobox', {
      id: 'componente-curricular',
    });
    expect(select).toBeEnabled();

    fireEvent.mouseDown(select);

    const option1 = await screen.findByText(/Ed\. Física/i);
    const option2 = await screen.findByText(/Matemática/i);

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
  });
});
