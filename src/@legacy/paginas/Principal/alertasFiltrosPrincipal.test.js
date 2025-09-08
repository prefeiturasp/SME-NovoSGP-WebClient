import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AlertasFiltroPrincipal from './AlertasFiltroPrincipal';

const mockStore = configureStore([]);

describe('AlertasFiltroPrincipal', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      usuario: {
        turmaSelecionada: { turma: true },
        ehPerfilProfessor: false,
        rf: '123',
      },
      perfil: { perfilSelecionado: { nomePerfil: 'Supervisor' } },
      filtro: { modalidades: [], anosLetivos: [2025] },
    });
  });

  it('deve exibir alerta de supervisor quando modalidades estiver vazio e perfil for Supervisor', () => {
    render(
      <Provider store={store}>
        <AlertasFiltroPrincipal />
      </Provider>
    );

    expect(
      screen.getByText(
        /Não foi possível obter as escolas atribuídas ao supervisor 123/i
      )
    ).toBeInTheDocument();
  });

  it('deve exibir alerta para escolher uma turma quando turmaSelecionada for falso', () => {
    store = mockStore({
      usuario: { turmaSelecionada: null, ehPerfilProfessor: false, rf: '123' },
      perfil: { perfilSelecionado: { nomePerfil: 'Supervisor' } },
      filtro: { modalidades: ['modalidade1'], anosLetivos: [2025] },
    });

    render(
      <Provider store={store}>
        <AlertasFiltroPrincipal />
      </Provider>
    );

    expect(
      screen.getByText(/Você precisa escolher uma turma/i)
    ).toBeInTheDocument();
  });
});
