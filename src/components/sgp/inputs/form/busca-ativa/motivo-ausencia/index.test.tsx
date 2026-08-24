import { render, screen, waitFor } from '@testing-library/react';
import { SelectMotivoAusenciaBuscaAtiva, SelectMotivoAusenciaBuscaAtivaFormItem } from './index';
import buscaAtivaService from '@/core/services/busca-ativa-service';
import { Form } from 'antd';

jest.mock('@/core/services/busca-ativa-service');
jest.mock('@/components/lib/inputs/select', () => (props: any) => {
  const { options, children, id, placeholder, value, onChange, 'data-testid': dataTestId } = props;
  return (
    <select
      data-testid={dataTestId}
      id={id}
      data-placeholder={placeholder}
      value={value}
      onChange={onChange}
    >
      {options &&
        options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      {children}
    </select>
  );
});

const mockMotivos = [
  { id: 1, nome: 'Motivo 1' },
  { id: 2, nome: 'Motivo 2' },
];

describe('SelectMotivoAusenciaBuscaAtiva', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o select e chama o serviço ao montar', async () => {
    (buscaAtivaService.obterMotivosAusencia as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: mockMotivos,
    });
    render(<SelectMotivoAusenciaBuscaAtiva data-testid="select-test" />);
    expect(buscaAtivaService.obterMotivosAusencia).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByTestId('select-test')).toBeInTheDocument();
      expect(screen.getByText('Motivo 1')).toBeInTheDocument();
      expect(screen.getByText('Motivo 2')).toBeInTheDocument();
    });
  });

  it('deixa options vazio se serviço retorna erro', async () => {
    (buscaAtivaService.obterMotivosAusencia as jest.Mock).mockResolvedValue({ sucesso: false });
    render(<SelectMotivoAusenciaBuscaAtiva data-testid="select-test" />);
    await waitFor(() => {
      expect(screen.getByTestId('select-test').children.length).toBe(0);
    });
  });

  it('passa props extras e placeholder corretamente', async () => {
    (buscaAtivaService.obterMotivosAusencia as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: mockMotivos,
    });
    render(
      <SelectMotivoAusenciaBuscaAtiva data-testid="select-test" placeholder="Teste Placeholder" />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('select-test')).toHaveAttribute(
        'data-placeholder',
        'Teste Placeholder',
      );
    });
  });

  it('renderiza o Form.Item com label e name corretos', () => {
    render(
      <Form>
        <SelectMotivoAusenciaBuscaAtivaFormItem>
          <input data-testid="input-child" />
        </SelectMotivoAusenciaBuscaAtivaFormItem>
      </Form>,
    );
    expect(screen.getByText('Motivo de Ausência')).toBeInTheDocument();
    expect(screen.getByTestId('input-child')).toBeInTheDocument();
  });
});
