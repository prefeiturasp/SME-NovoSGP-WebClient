import { act, render, screen } from '@testing-library/react';

import ContadorExpiracao from './contadorExpiracao';

describe('ContadorExpiracao', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-11-12T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('exibe minutos e segundos quando nao ha horas', () => {
    render(
      <ContadorExpiracao
        dataHoraExpiracao="2026-11-12T12:10:00Z"
        deslogarDoUsuario={jest.fn()}
      />
    );

    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('exibe horas, minutos e segundos quando ha horas', () => {
    render(
      <ContadorExpiracao
        dataHoraExpiracao="2026-11-12T14:05:06Z"
        deslogarDoUsuario={jest.fn()}
      />
    );

    expect(screen.getByText('02:05:06')).toBeInTheDocument();
  });

  it('atualiza o contador a cada segundo', () => {
    render(
      <ContadorExpiracao
        dataHoraExpiracao="2026-11-12T12:00:02Z"
        deslogarDoUsuario={jest.fn()}
      />
    );

    expect(screen.getByText('00:02')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('00:01')).toBeInTheDocument();
  });
});
