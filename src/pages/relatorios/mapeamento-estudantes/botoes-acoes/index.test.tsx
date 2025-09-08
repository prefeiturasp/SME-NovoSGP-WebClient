import { render, fireEvent, act } from '@testing-library/react';
import { Form } from 'antd';
import { RelMapeamentoEstudantesBotoesAcoes } from './index';
import { useNavigate } from 'react-router-dom';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { ROUTES } from '@/core/enum/routes';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('antd/es/form/hooks/useFormInstance', () => jest.fn());

jest.mock('@/components/lib/button/secundary', () => (props) => (
  <button onClick={props.onClick} disabled={props.disabled} data-testid={props.id}>
    {props.children}
  </button>
));
jest.mock('~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao', () => (props) => (
  <button onClick={props.onClick} data-testid="botao-voltar">
    Voltar
  </button>
));
describe('RelMapeamentoEstudantesBotoesAcoes', () => {
  const mockNavigate = jest.fn();
  const mockResetFields = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useFormInstance as jest.Mock).mockReturnValue({
      resetFields: mockResetFields,
      isFieldsTouched: jest.fn(() => true),
    });
  });

  it('renderiza corretamente com botão "Gerar" habilitado', () => {
    const { getByTestId } = render(
      <Form>
        <RelMapeamentoEstudantesBotoesAcoes desabilitarGerar={false} />
      </Form>,
    );
    expect(getByTestId('SGP_BUTTON_GERAR_RELATORIO')).toBeEnabled();
  });

  it('desabilita botão "Gerar" quando desabilitarGerar=true', () => {
    const { getByTestId } = render(
      <Form>
        <RelMapeamentoEstudantesBotoesAcoes desabilitarGerar={true} />
      </Form>,
    );
    expect(getByTestId('SGP_BUTTON_GERAR_RELATORIO')).toBeDisabled();
  });

  it('chama resetFields ao clicar no botão "Cancelar"', async () => {
    const { getByTestId } = render(
      <Form>
        <RelMapeamentoEstudantesBotoesAcoes desabilitarGerar={false} />
      </Form>,
    );
    await act(async () => {
      fireEvent.click(getByTestId('SGP_BUTTON_CANCELAR'));
    });
    expect(mockResetFields).toHaveBeenCalled();
  });

  it('navega para a rota principal ao clicar em "Voltar"', async () => {
    const { getByTestId } = render(
      <Form>
        <RelMapeamentoEstudantesBotoesAcoes desabilitarGerar={false} />
      </Form>,
    );
    await act(async () => {
      fireEvent.click(getByTestId('botao-voltar'));
    });
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
  });

  it('desabilita botão "Cancelar" se form.isFieldsTouched() for false', () => {
    (useFormInstance as jest.Mock).mockReturnValue({
      resetFields: mockResetFields,
      isFieldsTouched: () => false,
    });

    const { getByTestId } = render(
      <Form>
        <RelMapeamentoEstudantesBotoesAcoes desabilitarGerar={false} />
      </Form>,
    );
    expect(getByTestId('SGP_BUTTON_CANCELAR')).toBeDisabled();
  });
});
