import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import ListaNotificacoes from './listaNotificacoes';

jest.mock('~/componentes/table/dataTable', () => {
  return ({ dataSource, columns, onClickRow, locale }) => (
    <div>
      {dataSource.length === 0 ? (
        <div>{locale.emptyText}</div>
      ) : (
        <table>
          <tbody>
            {dataSource.map((row, index) => (
              <tr
                key={index}
                onClick={() => onClickRow(row)}
                data-testid={`row-${index}`}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render
                      ? col.render(row[col.dataIndex], row)
                      : row[col.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
});

jest.mock('~/componentes', () => ({
  Loader: ({ children, loading }) =>
    loading ? <div data-testid="loader">Loading...</div> : children,
  Button: ({ label, onClick }) => <button onClick={onClick}>{label}</button>,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockStore = configureStore([]);

describe('ListaNotificacoes', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      notificacoes: {
        notificacoes: [
          {
            id: 1,
            codigo: 'N001',
            categoria: 1,
            titulo: 'Alerta importante',
            status: 1,
            data: '2025-06-25T12:00:00Z',
          },
        ],
      },
    });
  });

  it('deve exibir mensagem quando não há notificações', () => {
    store = mockStore({
      notificacoes: {
        notificacoes: [],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ListaNotificacoes />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText('Você não tem nenhuma notificação!')
    ).toBeInTheDocument();
  });
});
