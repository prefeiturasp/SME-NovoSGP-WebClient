import React from 'react';
import { render, screen } from '@testing-library/react';
import AlertaModalidadeInfantil from './alertaModalidadeInfantil';
import { useSelector } from 'react-redux';
import * as validacoes from '~/servicos/Validacoes/validacoesInfatil';
import Alert from '~/componentes/alert';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('~/componentes/alert', () =>
  jest.fn(() => <div data-testid="alerta" />)
);
jest.mock('~/servicos/Validacoes/validacoesInfatil', () => ({
  ehTurmaInfantil: jest.fn(),
}));

describe('AlertaModalidadeInfantil', () => {
  const mockTurma = { nome: 'Turma Infantil' };
  const mockModalidades = ['EI', 'EF'];

  beforeEach(() => {
    useSelector.mockImplementation(callback =>
      callback({
        usuario: { turmaSelecionada: mockTurma },
        filtro: { modalidades: mockModalidades },
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o alerta quando ehTurmaInfantil retorna true e naoPermiteTurmaInfantil também é true', () => {
    validacoes.ehTurmaInfantil.mockReturnValue(true);

    render(
      <AlertaModalidadeInfantil
        exibir={false}
        naoPermiteTurmaInfantil
        validarModalidadeFiltroPrincipal
      />
    );

    expect(screen.getByTestId('alerta')).toBeInTheDocument();
    expect(validacoes.ehTurmaInfantil).toHaveBeenCalledWith(
      mockModalidades,
      mockTurma
    );
  });

  it('não renderiza o alerta quando ehTurmaInfantil retorna true e naoPermiteTurmaInfantil é false', () => {
    validacoes.ehTurmaInfantil.mockReturnValue(true);

    render(
      <AlertaModalidadeInfantil
        exibir={false}
        naoPermiteTurmaInfantil={false}
        validarModalidadeFiltroPrincipal
      />
    );

    expect(screen.queryByTestId('alerta')).not.toBeInTheDocument();
  });

  it('renderiza o alerta quando ehTurmaInfantil retorna false e naoPermiteTurmaInfantil é false', () => {
    validacoes.ehTurmaInfantil.mockReturnValue(false);

    render(
      <AlertaModalidadeInfantil
        exibir={false}
        naoPermiteTurmaInfantil={false}
        validarModalidadeFiltroPrincipal
      />
    );

    expect(screen.getByTestId('alerta')).toBeInTheDocument();
  });

  it('respeita a prop exibir quando validarModalidadeFiltroPrincipal é false', () => {
    render(
      <AlertaModalidadeInfantil
        exibir={true}
        validarModalidadeFiltroPrincipal={false}
      />
    );

    expect(screen.getByTestId('alerta')).toBeInTheDocument();
    expect(validacoes.ehTurmaInfantil).not.toHaveBeenCalled();
  });

  it('não renderiza nada se exibir for false e validarModalidadeFiltroPrincipal for false', () => {
    render(
      <AlertaModalidadeInfantil
        exibir={false}
        validarModalidadeFiltroPrincipal={false}
      />
    );

    expect(screen.queryByTestId('alerta')).not.toBeInTheDocument();
  });
});
