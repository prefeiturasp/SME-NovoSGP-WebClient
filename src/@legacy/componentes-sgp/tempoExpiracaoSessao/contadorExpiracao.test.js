import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ContadorExpiracao from './contadorExpiracao';

jest.useFakeTimers();

describe('ContadorExpiracao', () => {
  const mockDeslogar = jest.fn();
  const dataFutura = new Date(Date.now() + 65000).toISOString(); // 1m05s no futuro

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve exibir o tempo restante formatado corretamente', () => {
    render(
      <ContadorExpiracao
        dataHoraExpiracao={dataFutura}
        deslogarDoUsuario={mockDeslogar}
      />
    );

    expect(screen.getByText(/01:05/)).toBeInTheDocument();
  });

  it('deve atualizar o contador a cada segundo', () => {
    render(
      <ContadorExpiracao
        dataHoraExpiracao={dataFutura}
        deslogarDoUsuario={mockDeslogar}
      />
    );

    act(() => jest.advanceTimersByTime(1000));
    expect(screen.getByText(/01:04/)).toBeInTheDocument();
  });

  it('deve chamar deslogar quando o tempo expirar', () => {
    const dataPassada = new Date(Date.now() - 1000).toISOString();
    render(
      <ContadorExpiracao
        dataHoraExpiracao={dataPassada}
        deslogarDoUsuario={mockDeslogar}
      />
    );

    expect(mockDeslogar).toHaveBeenCalled();
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('deve formatar números menores que 10 com zero à esquerda', () => {
    const data = new Date(Date.now() + 5900).toISOString(); // 5.9 segundos
    render(
      <ContadorExpiracao
        dataHoraExpiracao={data}
        deslogarDoUsuario={mockDeslogar}
      />
    );

    expect(screen.getByText('00:05')).toBeInTheDocument();
  });

  it('deve limpar o intervalo ao desmontar', () => {
    const { unmount } = render(
      <ContadorExpiracao
        dataHoraExpiracao={dataFutura}
        deslogarDoUsuario={mockDeslogar}
      />
    );

    unmount();
    expect(jest.getTimerCount()).toBe(0);
  });
});
