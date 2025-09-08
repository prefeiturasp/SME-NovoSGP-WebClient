// SelectAusencias.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import SelectAusencias from './index';

// Mock do id de select
jest.mock('@/@legacy/constantes/ids/select', () => ({
  SGP_SELECT_AUSENCIAS: 'select-ausencias',
}));

// Mock do serviço
const mockObterAusencias = jest.fn();
jest.mock('@/core/services/consulta-criancas-estudantes-ausentes-service', () => ({
  __esModule: true,
  default: {
    obterAusencias: (...args: any[]) => mockObterAusencias(...args),
  },
}));

// Mock do Select e Form.Item do antd
jest.mock('../../../../lib/inputs/select', () => (props: any) => (
  <div data-testid="select" data-options={JSON.stringify(props.options)} {...props} />
));
jest.mock('antd', () => {
  const originalAntd = jest.requireActual('antd');
  return {
    ...originalAntd,
    Form: {
      ...originalAntd.Form,
      Item: ({ children, ...props }: any) => (
        <div data-testid="form-item" {...props}>
          {children}
        </div>
      ),
    },
  };
});

describe('SelectAusencias', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza Form.Item e Select com opções vindas do serviço', async () => {
    mockObterAusencias.mockResolvedValue({
      sucesso: true,
      dados: [
        { descricao: 'Falta Justificada', id: 1 },
        { descricao: 'Falta Não Justificada', id: 2 },
      ],
    });

    render(<SelectAusencias />);
    const formItem = screen.getByTestId('form-item');
    const select = await screen.findByTestId('select');

    expect(formItem).toBeInTheDocument();
    expect(select).toBeInTheDocument();

    await waitFor(() => {
      const options = JSON.parse(select.getAttribute('data-options')!);
      expect(options).toEqual([
        { label: 'Falta Justificada', value: 1 },
        { label: 'Falta Não Justificada', value: 2 },
      ]);
      expect(select.getAttribute('id')).toBe('select-ausencias');
      expect(select.getAttribute('placeholder')).toBe('Ausências');
    });
  });

  it('renderiza Select com opções vazias se serviço falhar', async () => {
    mockObterAusencias.mockResolvedValue({
      sucesso: false,
      dados: [],
    });

    render(<SelectAusencias />);
    const select = await screen.findByTestId('select');

    await waitFor(() => {
      const options = JSON.parse(select.getAttribute('data-options')!);
      expect(options).toEqual([]);
    });
  });

  it('passa props extras para o Form.Item', () => {
    render(
      <SelectAusencias
        formItemProps={{ label: 'Outro', name: 'outraAusencia', required: false }}
      />,
    );
    const formItem = screen.getByTestId('form-item');
    expect(formItem).toHaveAttribute('label', 'Outro');
    expect(formItem).toHaveAttribute('name', 'outraAusencia');
  });
});
