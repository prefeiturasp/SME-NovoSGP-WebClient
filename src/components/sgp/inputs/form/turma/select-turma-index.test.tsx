// SelectTurma.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import SelectTurma from './index';

jest.mock('@/core/utils/functions', () => ({
  onChangeMultiSelectLabelInValueOpcaoTodos: jest.fn((values) => values),
}));
jest.mock('@/@legacy/componentes', () => ({
  Loader: ({ loading, children }: any) => (
    <div data-testid="loader" data-loading={loading ? 'true' : 'false'}>
      {children}
    </div>
  ),
}));
jest.mock('@/@legacy/constantes', () => ({
  OPCAO_TODOS: 'TODOS',
}));
jest.mock('@/@legacy/constantes/ids/select', () => ({
  SGP_SELECT_TURMA: 'select-turma',
}));
jest.mock('@/core/enum/modalidade-enum', () => ({
  ModalidadeEnum: {
    EJA: 1,
    CELP: 2,
  },
}));
const mockObterTurmas = jest.fn();
jest.mock('@/core/services/abrangencia-service', () => ({
  __esModule: true,
  default: {
    obterTurmas: (...args: any[]) => mockObterTurmas(...args),
  },
}));

jest.mock('../../../../lib/inputs/select', () => (props: any) => (
  <div
    data-testid="select"
    data-options={JSON.stringify(props.options)}
    data-disabled={props.disabled ? 'true' : 'false'}
    {...props}
  />
));

const mockSetFieldValue = jest.fn();
jest.mock('antd', () => {
  const originalAntd = jest.requireActual('antd');
  return {
    ...originalAntd,
    Form: {
      ...originalAntd.Form,
      useFormInstance: () => ({
        setFieldValue: mockSetFieldValue,
        isFieldsTouched: () => false,
      }),
      Item: ({ children, ...props }: any) => (
        <div data-testid="form-item" {...props}>
          {children}
        </div>
      ),
    },
  };
});

const formState = {
  anoLetivo: 2024,
  ue: { value: 123 },
  modalidade: { value: 3 },
  semestre: 1,
  consideraHistorico: false,
};
jest.mock('antd/es/form/Form', () => ({
  useWatch: jest.fn((field: string) => formState[field]),
}));

describe('SelectTurma', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // formState.anoLetivo = 2024;
    // formState.ue = { value: 123 };
    // formState.modalidade = { value: 3 };
    // formState.semestre = 1;
    // formState.consideraHistorico = false;
  });

  it('renderiza Loader, Form.Item e Select', async () => {
    mockObterTurmas.mockResolvedValue({
      sucesso: true,
      dados: [
        { codigo: 1, nomeFiltro: 'Turma 1' },
        { codigo: 2, nomeFiltro: 'Turma 2' },
      ],
    });

    render(<SelectTurma />);
    const loader = screen.getByTestId('loader');
    const formItem = screen.getByTestId('form-item');
    const select = await screen.findByTestId('select');

    expect(loader).toBeInTheDocument();
    expect(formItem).toBeInTheDocument();
    expect(select).toBeInTheDocument();

    await waitFor(() => {
      const options = JSON.parse(select.getAttribute('data-options')!);
      expect(options).toEqual([
        { codigo: 1, nomeFiltro: 'Turma 1', value: 1, label: 'Turma 1' },
        { codigo: 2, nomeFiltro: 'Turma 2', value: 2, label: 'Turma 2' },
      ]);
      expect(select.getAttribute('id')).toBe('select-turma');
      expect(select.getAttribute('placeholder')).toBe('Turma');
    });
  });

  it('desabilita Select se selectProps.disabled for true', async () => {
    mockObterTurmas.mockResolvedValue({ sucesso: true, dados: [] });
    render(<SelectTurma selectProps={{ disabled: true }} />);
    const select = await screen.findByTestId('select');
    expect(select.getAttribute('data-disabled')).toBe('true');
  });

  it('renderiza apenas opção "Todas" se listaSomenteComOpcaoTodas for true', async () => {
    render(<SelectTurma listaSomenteComOpcaoTodas />);
    const select = await screen.findByTestId('select');
    await waitFor(() => {
      const options = JSON.parse(select.getAttribute('data-options')!);
      expect(options).toEqual([{ value: 'TODOS', label: 'Todas' }]);
    });
  });

  it('passa props extras para o Form.Item', () => {
    render(<SelectTurma formItemProps={{ label: 'Turmas', name: 'turmas', required: false }} />);
    const formItem = screen.getByTestId('form-item');
    expect(formItem.getAttribute('label')).toBe('Turmas');
    expect(formItem.getAttribute('name')).toBe('turmas');
  });
});
