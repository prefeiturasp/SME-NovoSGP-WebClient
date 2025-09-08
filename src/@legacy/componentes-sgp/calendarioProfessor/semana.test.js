import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import configureStore from 'redux-mock-store';
import Semana from './Semana';
import * as actions from '~/redux/modulos/calendarioProfessor/actions';

jest.useFakeTimers();

const mockStore = configureStore([]);

const mockDia = new Date(2023, 3, 3);

const baseProps = {
  inicial: true,
  dias: Array.from({ length: 7 }, (_, i) => new Date(2023, 3, 2 + i)),
  mesAtual: 4,
  filtros: [],
  tipoEventosDiaLista: [
    { dia: 3, temAula: true, temAulaCJ: false, temEvento: false },
    { dia: 4, temAula: false, temAulaCJ: true, temEvento: false },
    { dia: 5, temAula: false, temAulaCJ: false, temEvento: true },
    { dia: 6, temAula: true, temAulaCJ: true, temEvento: true },
    { dia: 7 },
    { dia: 8 },
    { dia: 9 },
  ],
};

const renderComponent = (storeOverrides = {}) => {
  const store = mockStore({
    calendarioProfessor: {
      diaSelecionado: baseProps.dias[0],
      eventoAulaCalendarioEdicao:
        storeOverrides.eventoAulaCalendarioEdicao || null,
    },
  });

  return render(
    <Provider store={store}>
      <Semana {...baseProps} />
    </Provider>
  );
};

describe('<Semana />', () => {
  it('renderiza 7 componentes Dia', () => {
    renderComponent();
    const dias = screen.getAllByText(/0[2-9]/);
    expect(dias).toHaveLength(7);
  });

  it('dispara dispatch de selecao ao clicar no Dia', () => {
    const dispatchSpy = jest
      .spyOn(actions, 'selecionaDia')
      .mockReturnValue({ type: 'TEST' });

    renderComponent();
    const dia = screen.getAllByText(/0[2-9]/)[0];
    fireEvent.click(dia);

    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('dispara salvarEventoAulaCalendarioEdicao se dia bater com evento', () => {
    const salvaEventoSpy = jest
      .spyOn(actions, 'salvarEventoAulaCalendarioEdicao')
      .mockReturnValue({ type: 'SALVAR' });

    renderComponent({
      eventoAulaCalendarioEdicao: {
        dia: baseProps.dias[0],
      },
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(salvaEventoSpy).toHaveBeenCalled();
  });
});
