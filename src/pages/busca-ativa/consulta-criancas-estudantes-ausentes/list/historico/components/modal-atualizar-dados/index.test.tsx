import { render, screen, fireEvent } from '@testing-library/react';
import ModalAtualizarDados from './index';
import { SGP_BUTTON_SALVAR_MODAL, SGP_BUTTON_CANCELAR_MODAL } from '~/constantes/ids/button';

jest.mock('@/components/sgp/inputs/form/email', () => (props: any) => (
  <input data-testid="input-email" {...props.inputProps} />
));
jest.mock('@/components/sgp/inputs/form/telefone', () => (props: any) => (
  <input data-testid="input-telefone" {...props.inputProps} />
));

const defaultProps = {
  salvarDadosResponsavel: jest.fn(),
  onClickCancelar: jest.fn(),
  formInitialValues: {
    nome: 'Maria',
    tipoResponsavel: 'Mãe',
    cpf: '123.456.789-00',
    email: 'maria@email.com',
    celular: '11999999999',
    foneResidencial: '1133334444',
    foneComercial: '1144445555',
  },
  loading: false,
};

describe('ModalAtualizarDados', () => {
  it('renderiza dados iniciais e campos', () => {
    render(<ModalAtualizarDados {...defaultProps} />);
    expect(screen.getByText('Atualizar dados do responsável')).toBeInTheDocument();
    expect(screen.getByText('Maria - Mãe')).toBeInTheDocument();
    expect(screen.getByText('123.456.789-00')).toBeInTheDocument();
    expect(screen.getAllByTestId('input-email').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('input-telefone').length).toBeGreaterThan(0);
  });

  it('chama salvarDadosResponsavel ao clicar em Atualizar', () => {
    render(<ModalAtualizarDados {...defaultProps} />);
    const btn = screen.getByText('Atualizar');
    fireEvent.click(btn);
    expect(defaultProps.salvarDadosResponsavel).toHaveBeenCalled();
  });

  it('chama onClickCancelar ao clicar em Cancelar', () => {
    render(<ModalAtualizarDados {...defaultProps} />);
    const btn = screen.getByText('Cancelar');
    fireEvent.click(btn);
    expect(defaultProps.onClickCancelar).toHaveBeenCalled();
  });

  it('desabilita botões quando loading=true', () => {
    render(<ModalAtualizarDados {...defaultProps} loading={true} />);
    expect(document.getElementById(SGP_BUTTON_SALVAR_MODAL)).toBeDisabled();
    expect(document.getElementById(SGP_BUTTON_CANCELAR_MODAL)).toBeDisabled();
  });
});
