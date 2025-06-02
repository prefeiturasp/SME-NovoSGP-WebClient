import { render, screen, fireEvent } from '@testing-library/react';
import { BotoesAcoesRelatorio } from './index';
import { useNavigate } from 'react-router-dom';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { Form } from 'antd';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('antd/es/form/hooks/useFormInstance');

const mockNavigate = jest.fn();
(useNavigate as jest.Mock).mockReturnValue(mockNavigate);

const mockResetFields = jest.fn();
const mockIsFieldsTouched = jest.fn();
(useFormInstance as jest.Mock).mockReturnValue({
  resetFields: mockResetFields,
  isFieldsTouched: mockIsFieldsTouched,
});

describe('BotoesAcoesRelatorio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza todos os botões', () => {
    mockIsFieldsTouched.mockReturnValue(false);
    render(
      <Form>
        <BotoesAcoesRelatorio desabilitarGerar={false} />
      </Form>,
    );
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /gerar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument();
  });

  it('desabilita o botão Cancelar se o form não está dirty', () => {
    mockIsFieldsTouched.mockReturnValue(false);
    render(
      <Form>
        <BotoesAcoesRelatorio desabilitarGerar={false} />
      </Form>,
    );
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeDisabled();
  });

  it('habilita o botão Cancelar se o form está dirty', () => {
    mockIsFieldsTouched.mockReturnValue(true);
    render(
      <Form>
        <BotoesAcoesRelatorio desabilitarGerar={false} />
      </Form>,
    );
    expect(screen.getByRole('button', { name: /cancelar/i })).not.toBeDisabled();
  });

  it('desabilita o botão Gerar conforme prop', () => {
    mockIsFieldsTouched.mockReturnValue(true);
    render(
      <Form>
        <BotoesAcoesRelatorio desabilitarGerar={true} />
      </Form>,
    );
    expect(screen.getByRole('button', { name: /gerar/i })).toBeDisabled();
  });

  it('aciona navegação ao clicar em Voltar', () => {
    mockIsFieldsTouched.mockReturnValue(false);
    render(
      <Form>
        <BotoesAcoesRelatorio desabilitarGerar={false} />
      </Form>,
    );
    fireEvent.click(screen.getByRole('button', { name: '' }));
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('reseta o form ao clicar em Cancelar', () => {
    mockIsFieldsTouched.mockReturnValue(true);
    render(
      <Form>
        <BotoesAcoesRelatorio desabilitarGerar={false} />
      </Form>,
    );
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(mockResetFields).toHaveBeenCalled();
  });
});
