import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RelatorioEncaminhamentoNAAPABotoesAcoes from './RelatorioEncaminhamentoNAAPABotoesAcoes';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock(
  '~/servicos/Paginas/Relatorios/NAAPA/ServicoRelatorioEncaminhamentoNAAPA',
  () => ({
    gerar: jest.fn(),
  })
);

jest.mock('~/servicos', () => ({
  erros: jest.fn(),
  sucesso: jest.fn(),
}));

jest.mock('~/componentes-sgp/botoesAcaoRelatorio', () => {
  return function BotoesAcaoRelatorioMock(props) {
    return (
      <div>
        <button onClick={props.onClickVoltar}>Voltar</button>
        <button onClick={props.onClickCancelar}>Cancelar</button>
        <button
          onClick={props.onClickGerar}
          disabled={props.desabilitarBtnGerar}
        >
          Gerar
        </button>
      </div>
    );
  };
});

describe('RelatorioEncaminhamentoNAAPABotoesAcoes', () => {
  const mockNavigate = jest.fn();
  const mockForm = {
    setFieldTouched: jest.fn(),
    validateForm: jest.fn().mockResolvedValue({}),
    isValid: true,
    errors: {},
    values: {
      anoLetivo: '2024',
      dreCodigo: '1',
      ueCodigo: '1',
      modoEdicao: true,
    },
    resetForm: jest.fn(),
    setFieldValue: jest.fn(),
  };

  const defaultProps = {
    form: mockForm,
    initialValues: {},
    desabilitarGerar: false,
    setGerandoRelatorio: jest.fn(),
    setDesabilitarGerar: jest.fn(),
  };

  beforeEach(() => {
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  test('renderiza botoes', () => {
    render(<RelatorioEncaminhamentoNAAPABotoesAcoes {...defaultProps} />);

    expect(screen.getByText('Voltar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Gerar')).toBeInTheDocument();
  });

  test('clica botao voltar', () => {
    render(<RelatorioEncaminhamentoNAAPABotoesAcoes {...defaultProps} />);

    fireEvent.click(screen.getByText('Voltar'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('clica botao cancelar', () => {
    render(<RelatorioEncaminhamentoNAAPABotoesAcoes {...defaultProps} />);

    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockForm.resetForm).toHaveBeenCalled();
    expect(mockForm.setFieldValue).toHaveBeenCalledWith('modoEdicao', false);
  });

  test('desabilita botao gerar quando prop desabilitarGerar é true', () => {
    const props = { ...defaultProps, desabilitarGerar: true };
    render(<RelatorioEncaminhamentoNAAPABotoesAcoes {...props} />);

    const botaoGerar = screen.getByText('Gerar');
    expect(botaoGerar).toBeDisabled();
  });
});
