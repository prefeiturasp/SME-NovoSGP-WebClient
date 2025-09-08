import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import NovoRegistroIndividual from './novoRegistroIndividual';
import ServicoRegistroIndividual from '~/servicos/Paginas/DiarioClasse/ServicoRegistroIndividual';

global.window.moment = jest.requireActual('moment');

jest.mock('moment', () => {
  const actualMoment = jest.requireActual('moment');
  return {
    ...actualMoment,
    default: actualMoment,
  };
});

jest.mock('~/componentes/jodit-editor/JoditEditor', () => ({
  __esModule: true,
  default: ({ value, onChange }) => (
    <textarea
      data-testid="jodit-editor"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  ),
}));

jest.mock(
  '~/servicos/Paginas/DiarioClasse/ServicoRegistroIndividual.js',
  () => ({
    obterRegistroIndividualPorData: jest.fn(),
    obterSugestao: jest.fn(),
  })
);

jest.mock('@/core/enum/routes', () => ({
  ROUTES: {
    REGISTRO_INDIVIDUAL: 'registro-individual',
  },
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Componente NovoRegistroIndividual', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2023-05-15'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const defaultState = {
    registroIndividual: {
      auditoriaNovoRegistroIndividual: null,
      componenteCurricularSelecionado: 'Português',
      dadosAlunoObjectCard: { codigoEOL: '123' },
      podeRealizarNovoRegistro: true,
      resetDataNovoRegistroIndividual: false,
      dadosRegistroAtual: {},
      dadosSugestaoTopico: null,
    },
    usuario: {
      turmaSelecionada: { id: 1, anoLetivo: '2023' },
      permissoes: {
        'registro-individual': {
          podeIncluir: true,
        },
      },
    },
  };

  beforeEach(() => {
    ServicoRegistroIndividual.obterRegistroIndividualPorData.mockResolvedValue({
      data: {},
    });
    ServicoRegistroIndividual.obterSugestao.mockResolvedValue({ data: {} });
  });

  const renderComponent = (state = defaultState) => {
    const store = mockStore(state);
    return render(
      <Provider store={store}>
        <NovoRegistroIndividual />
      </Provider>
    );
  };

  it('deve renderizar o collapse quando podeRealizarNovoRegistro for true', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Novo registro individual')).toBeInTheDocument();
    });
  });
});
