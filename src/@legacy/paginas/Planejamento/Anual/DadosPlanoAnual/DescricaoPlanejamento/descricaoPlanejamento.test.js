import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import DescricaoPlanejamento from './descricaoPlanejamento';

jest.mock('~/componentes', () => ({
  Label: ({ text }) => <span>{text}</span>,
  Auditoria: props => <div data-testid="auditoria" {...props} />,
}));
jest.mock('~/componentes/jodit-editor/joditEditor', () => props => (
  <textarea
    data-testid="jodit-editor"
    value={props.value || ''}
    onChange={e => props.onChange && props.onChange(e.target.value)}
    readOnly={props.readonly}
  />
));
jest.mock('../../servicoSalvarPlanoAnual', () => ({
  campoInvalido: jest.fn(() => false),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const getStore = (custom = {}) =>
  mockStore({
    planoAnual: {
      dadosBimestresPlanoAnual: {
        1: {
          componentes: [
            {
              componenteCurricularId: 10,
              descricao: 'Descrição inicial',
              emEdicao: false,
              auditoria: {
                criadoEm: '2024-01-01',
                criadoPor: 'Prof',
                criadoRF: '123',
                alteradoPor: 'Prof2',
                alteradoEm: '2024-02-01',
                alteradoRF: '456',
              },
            },
          ],
        },
      },
      componenteCurricular: { codigoComponenteCurricular: 10 },
      planoAnualSomenteConsulta: false,
      ...custom,
    },
  });

describe('DescricaoPlanejamento', () => {
  const defaultProps = {
    dadosBimestre: { bimestre: 1, periodoAberto: true },
    tabAtualComponenteCurricular: { codigoComponenteCurricular: 10 },
  };

  it('deve renderizar corretamente com dados', () => {
    const store = getStore();
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <DescricaoPlanejamento {...defaultProps} />
      </Provider>
    );
    expect(getByText('Descrição do planejamento')).toBeInTheDocument();
    expect(getByTestId('jodit-editor')).toBeInTheDocument();
    expect(getByTestId('auditoria')).toBeInTheDocument();
  });

  it('deve chamar onChange e setPlanoAnualEmEdicao ao editar o texto', async () => {
    const store = getStore();
    store.dispatch = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <DescricaoPlanejamento {...defaultProps} />
      </Provider>
    );
    fireEvent.change(getByTestId('jodit-editor'), {
      target: { value: 'Novo texto' },
    });
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@planoAnual/setPlanoAnualEmEdicao',
        payload: true,
      });
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: '@planoAnual/setDadosBimestresPlanoAnual',
        })
      );
    });
  });

  it('não deve renderizar nada se não houver dadosBimestrePlanoAnual', () => {
    const store = mockStore({
      planoAnual: {
        dadosBimestresPlanoAnual: {},
        componenteCurricular: {},
        planoAnualSomenteConsulta: false,
      },
    });
    const { container } = render(
      <Provider store={store}>
        <DescricaoPlanejamento {...defaultProps} />
      </Provider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('não deve permitir edição se planoAnualSomenteConsulta for true', () => {
    const store = getStore({ planoAnualSomenteConsulta: true });
    const { getByTestId } = render(
      <Provider store={store}>
        <DescricaoPlanejamento {...defaultProps} />
      </Provider>
    );
    fireEvent.change(getByTestId('jodit-editor'), {
      target: { value: 'Novo texto' },
    });
    expect(store.getActions()).toEqual([]);
  });
});
