import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Alert from './alert';
import * as reactRedux from 'react-redux';
import { removerAlerta } from '../redux/modulos/alertas/actions';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('../redux/modulos/alertas/actions', () => ({
  removerAlerta: jest.fn(),
}));

describe('Alert', () => {
  const alertaMock = {
    tipo: 'warning',
    id: 123,
    mensagem: 'Alerta de teste',
    estiloTitulo: { fontSize: '20px' },
    mensagemClick: 'Clique aqui',
    marginBottom: '10px',
  };

  const dispatchMock = jest.fn();

  beforeEach(() => {
    dispatchMock.mockClear();
    removerAlerta.mockClear();
    reactRedux.useDispatch.mockReturnValue(dispatchMock);
  });

  it('deve renderizar corretamente com mensagem e mensagemClick', () => {
    render(<Alert alerta={alertaMock} />);
    expect(screen.getByText('Alerta de teste')).toBeInTheDocument();
    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });

  it('deve chamar onClickMessage ao clicar em mensagemClick', () => {
    const onClickMessage = jest.fn();
    render(<Alert alerta={alertaMock} onClickMessage={onClickMessage} />);
    fireEvent.click(screen.getByText('Clique aqui'));
    expect(onClickMessage).toHaveBeenCalled();
  });

  it('deve renderizar botão de fechar se closable for true', () => {
    render(<Alert alerta={alertaMock} closable />);
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('deve despachar removerAlerta ao clicar no botão de fechar', () => {
    render(<Alert alerta={alertaMock} closable />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(removerAlerta).toHaveBeenCalledWith(alertaMock.id);
    expect(dispatchMock).toHaveBeenCalled();
  });

  it('não deve renderizar botão de fechar se closable for false', () => {
    render(<Alert alerta={alertaMock} closable={false} />);
    expect(screen.queryByRole('button', { name: /close/i })).toBeNull();
  });
});
