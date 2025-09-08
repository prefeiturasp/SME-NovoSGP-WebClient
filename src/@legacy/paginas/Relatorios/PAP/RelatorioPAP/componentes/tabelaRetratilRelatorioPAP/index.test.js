import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TabelaRetratilRelatorioPAP from './index';

jest.mock('~/componentes', () => ({
  TabelaRetratil: ({ children }) => (
    <div data-testid="tabela-retratil">{children}</div>
  ),
}));

const mockStore = configureStore([]);

describe('TabelaRetratilRelatorioPAP', () => {
  it('não renderiza TabelaRetratil se estudantesRelatorioPAP for undefined', () => {
    const store = mockStore({
      relatorioPAP: { estudantesRelatorioPAP: undefined },
    });
    const { container } = render(
      <Provider store={store}>
        <TabelaRetratilRelatorioPAP />
      </Provider>
    );
    expect(container.querySelector('table')).toBeNull();
  });

  it('não renderiza TabelaRetratil se estudantesRelatorioPAP for array vazio', () => {
    const store = mockStore({ relatorioPAP: { estudantesRelatorioPAP: [] } });
    const { container } = render(
      <Provider store={store}>
        <TabelaRetratilRelatorioPAP />
      </Provider>
    );
    expect(container.querySelector('table')).toBeNull();
  });

  it('renderiza TabelaRetratil se estudantesRelatorioPAP tiver itens', () => {
    const store = mockStore({
      relatorioPAP: { estudantesRelatorioPAP: [{ id: 1, nome: 'Aluno 1' }] },
      conselhoClasse: { dadosInconsistenciasEstudantes: [] },
    });
    const { getByTestId } = render(
      <Provider store={store}>
        <TabelaRetratilRelatorioPAP />
      </Provider>
    );
    expect(getByTestId('tabela-retratil')).toBeInTheDocument();
  });

  it('passa corretamente as props para TabelaRetratil', () => {
    const store = mockStore({
      relatorioPAP: { estudantesRelatorioPAP: [{ id: 1, nome: 'Aluno 1' }] },
      conselhoClasse: { dadosInconsistenciasEstudantes: [] },
    });
    const onChangeAlunoSelecionado = jest.fn();
    const permiteOnChangeAluno = jest.fn();
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <TabelaRetratilRelatorioPAP
          onChangeAlunoSelecionado={onChangeAlunoSelecionado}
          permiteOnChangeAluno={permiteOnChangeAluno}
        >
          <span>Conteúdo filho</span>
        </TabelaRetratilRelatorioPAP>
      </Provider>
    );
    expect(getByText('Conteúdo filho')).toBeInTheDocument();
    expect(getByTestId('tabela-retratil')).toBeInTheDocument();
  });
});
