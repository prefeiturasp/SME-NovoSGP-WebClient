import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Avaliacao from './avaliacao';
import * as actions from '~/redux/modulos/notasConceitos/actions';
import notasConceitos from '~/dtos/notasConceitos';

const mockStore = configureStore([]);
jest.mock('~/redux/modulos/notasConceitos/actions');

describe('Avaliacao', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      notasConceitos: {
        avaliacoes: [
          {
            id: 1,
            nome: 'Matemática',
            atividades: [{ id: 1, nome: 'Prova 1' }],
            conceitos: [{ id: 1, descricao: 'Excelente' }],
          },
        ],
        conceitos: [{ id: 1, descricao: 'Excelente' }],
      },
      bimestres: {
        selecionado: { id: 1, nome: '1º Bimestre' },
      },
      aluno: {
        id: 1,
        nome: 'João',
      },
    });

    store.dispatch = jest.fn();
  });

  it('deve renderizar corretamente quando não há avaliações', () => {
    store = mockStore({
      notasConceitos: {
        avaliacoes: [], // sem avaliações
        conceitos: [],
      },
    });

    render(
      <Provider store={store}>
        <Avaliacao />
      </Provider>
    );

    expect(screen.queryByText('Matemática')).not.toBeInTheDocument();
  });
});
