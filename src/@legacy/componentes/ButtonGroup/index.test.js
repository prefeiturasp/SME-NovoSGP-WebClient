import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ButtonGroup from './index'; // Certifique-se de ajustar o caminho, se necessário
import { BrowserRouter } from 'react-router-dom';

// Mocka a função window.matchMedia para testes
beforeAll(() => {
  global.matchMedia = global.matchMedia || function () {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };
});

describe('ButtonGroup Component', () => {
  const mockOnClickVoltar = jest.fn();
  const mockOnClickExcluir = jest.fn();
  const mockOnClickCancelar = jest.fn();
  const mockOnClickBotaoPrincipal = jest.fn();

  const defaultProps = {
    form: {},
    modoEdicao: true,
    novoRegistro: false,
    permissoesTela: { podeExcluir: true, podeIncluir: true },
    temItemSelecionado: true,
    labelBotaoPrincipal: 'Salvar',
    desabilitarBotaoPrincipal: false,
    onClickVoltar: mockOnClickVoltar,
    onClickExcluir: mockOnClickExcluir,
    onClickCancelar: mockOnClickCancelar,
    onClickBotaoPrincipal: mockOnClickBotaoPrincipal,
    somenteConsulta: false,
    idBotaoPrincipal: 'botao-principal',
  };

  it('deve chamar a função correta ao clicar em Cancelar', () => {
    render(
      <BrowserRouter>
        <ButtonGroup {...defaultProps} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(mockOnClickCancelar).toHaveBeenCalledTimes(1);
  });

  it('deve desabilitar o botão principal quando não permitido', () => {
    render(
      <BrowserRouter>
        <ButtonGroup {...defaultProps} desabilitarBotaoPrincipal={true} />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /Salvar/i })).toBeDisabled();
  });

  it('deve chamar a função correta ao clicar no botão principal', () => {
    render(
      <BrowserRouter>
        <ButtonGroup {...defaultProps} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));
    expect(mockOnClickBotaoPrincipal).toHaveBeenCalledTimes(1);
  });
});
