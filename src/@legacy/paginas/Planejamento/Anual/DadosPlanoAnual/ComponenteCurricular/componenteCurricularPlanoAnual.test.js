import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import * as ReactRedux from 'react-redux';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ServicoDisciplinas from '~/servicos/Paginas/ServicoDisciplina';
import ComponenteCurricularPlanoAnual from './ComponenteCurricularPlanoAnual';

const mockStore = configureStore([]);

const mockDispatch = jest.fn();

// Mock de dependências
jest.mock('~/servicos', () => ({
  erros: jest.fn(),
  sucesso: jest.fn(),
}));

jest.mock('@/@legacy/servicos/Paginas/ServicoDisciplina', () => ({
  obterDisciplinasPorTurma: jest.fn(),
}));

jest.mock('react-redux', () => {
  const actual = jest.requireActual('react-redux');
  return {
    ...actual,
    useDispatch: jest.fn(),
  };
});

const renderComponent = (storeOverrides = {}) => {
  const store = mockStore({
    usuario: {
      nome: 'Professor Teste',
      id: 1,
    },
    planoAnual: {
      componenteCurricular: undefined,
      bimestresPlanoAnual: [
        {
          bimestre: 1,
          id: 161,
          migrado: false,
          periodoAberto: true,
          descricao: '1° Bimestre',
        },
        {
          bimestre: 2,
          id: 162,
          migrado: false,
          periodoAberto: true,
          descricao: '2° Bimestre',
        },
        {
          bimestre: 3,
          id: 163,
          migrado: false,
          periodoAberto: true,
          descricao: '3° Bimestre',
        },
        {
          bimestre: 4,
          id: 164,
          migrado: false,
          periodoAberto: true,
          descricao: '4° Bimestre',
        },
      ],
      listaComponentesCurricularesPlanejamento: [
        {
          id: 6,
          codigoComponenteCurricular: 6,
          codigoComponenteCurricularTerritorioSaber: 0,
          codDisciplinaPai: null,
          compartilhada: false,
          nome: 'Ed. Física',
          nomeComponenteInfantil: null,
          possuiObjetivos: true,
          regencia: false,
          registraFrequencia: true,
          territorioSaber: false,
          lancaNota: true,
          objetivosAprendizagemOpcionais: false,
          grupoMatrizId: 1,
          grupoMatrizNome: 'Base Nacional Comum',
          turmaCodigo: null,
          professor: '7744927',
        },
        {
          id: 7,
          codigoComponenteCurricular: 7,
          codigoComponenteCurricularTerritorioSaber: 1,
          codDisciplinaPai: null,
          compartilhada: false,
          nome: 'Matemática',
          nomeComponenteInfantil: null,
          possuiObjetivos: true,
          regencia: false,
          registraFrequencia: true,
          territorioSaber: false,
          lancaNota: true,
          objetivosAprendizagemOpcionais: false,
          grupoMatrizId: 2,
          grupoMatrizNome: 'Base Nacional Comum',
          turmaCodigo: null,
          professor: '7744928',
        },
      ],
      planoAnualEmEdicao: false,
      tabAtualComponenteCurricular: [],
      dadosBimestresPlanoAnual: [],
      dadosEditadosBimestresPlanoAnual: [],
      listaObjetivosAprendizagemPorComponente: [],
      errosPlanoAnual: [],
      exibirModalErrosPlanoAnual: false,
      exibirLoaderPlanoAnual: false,
      clicouNoBimestre: [],
      exibirModalCopiarConteudo: false,
      listaTurmasParaCopiar: [
        {
          nomeTurma: '7A',
          possuiPlano: false,
          codTurma: 2853802,
          id: 4390729,
          codigoComponenteCurricular: 0,
          bimestre: 0,
        },
      ],
      ehRegistroMigrado: false,
      planejamentoAnualId: 0,
      planoAnualSomenteConsulta: false,
      listaComponentesCheck: [],
    },
    filtro: {
      modalidades: [
        {
          desc: 'Ensino Fundamental',
          valor: 5,
        },
      ],
    },
    usuario: {
      turmaSelecionada: {
        anoLetivo: 2025,
        modalidade: 5,
        dre: '108200',
        unidadeEscolar: '092967',
        turma: '2853818',
        ano: '7',
        desc: '2025 - EF - 7B - EMEF LEVY DE AZEVEDO SODRE, PROF.',
        periodo: 0,
        consideraHistorico: false,
        ensinoEspecial: false,
        id: 4390735,
      },
    },
    ...storeOverrides,
  });

  return render(
    <Provider store={store}>
      <ComponenteCurricularPlanoAnual />
    </Provider>
  );
};

describe('Componente Curricular plano anual', () => {
  beforeEach(() => {
    ReactRedux.useDispatch.mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  it.only('deve exibir um componente curricular selecionado caso tenha apenas um componente curricular e o select desabilitado', async () => {
    const mockApenasUmaDisciplina = [
      {
        id: 6,
        codigoComponenteCurricular: 6,
        codigoComponenteCurricularTerritorioSaber: 0,
        codDisciplinaPai: null,
        compartilhada: false,
        nome: 'Ed. Física',
        nomeComponenteInfantil: null,
        possuiObjetivos: true,
        regencia: false,
        registraFrequencia: true,
        territorioSaber: false,
        lancaNota: true,
        objetivosAprendizagemOpcionais: false,
        grupoMatrizId: 1,
        grupoMatrizNome: 'Base Nacional Comum',
        turmaCodigo: null,
        professor: '7744927',
      },
    ];
    ServicoDisciplinas.obterDisciplinasPorTurma.mockResolvedValueOnce({
      data: mockApenasUmaDisciplina,
    });
    renderComponent();
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: '@planoAnual/setComponenteCurricularPlanoAnual',
        payload: mockApenasUmaDisciplina[0],
      });
    });

    const selectComponenteCurricular = await screen.findByRole('combobox', {
      id: 'componente-curricular',
    });

    const [selectedOption] = await screen.findAllByText(/Ed. Física/i);
    expect(selectedOption).toBeInTheDocument();

    expect(selectComponenteCurricular).toBeDisabled();
  });

  it('deve permitir selecionar um componente curricular caso haja mais de um disponível', async () => {
    const mockDuasDisciplinas = [
      {
        id: 6,
        codigoComponenteCurricular: 6,
        nome: 'Ed. Física',
      },
      {
        id: 7,
        codigoComponenteCurricular: 7,
        nome: 'Matemática',
      },
    ];
    ServicoDisciplinas.obterDisciplinasPorTurma.mockResolvedValueOnce({
      data: mockDuasDisciplinas,
    });
    renderComponent();

    await waitFor(() => {
      const selectComponenteCurricular = screen.getByRole('combobox', {
        id: 'componente-curricular',
      });

      expect(selectComponenteCurricular).toBeEnabled();

      // Simula a abertura do select
      selectComponenteCurricular.focus();
      selectComponenteCurricular.click();
    });

    await waitFor(() => {
      const options = screen.getAllByText(/Ed. Física/i);
      const selectedOption = options.find(option =>
        option.classList.contains('ant-select-selection-item')
      );
      expect(selectedOption).toBeInTheDocument();

      expect(screen.getByText(/Matemática/i)).toBeInTheDocument();
    });
  });
});
