import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UeDropDown from './index';

jest.mock('~/componentes', () => ({
  SelectComponent: jest.fn(({ lista, onChange, ...props }) => {
    const { valueOption, valueText, showSearch, labelRequired, ...rest } =
      props;
    return (
      <select
        data-testid="SelectComponent"
        {...rest}
        onChange={e => onChange && onChange(e.target.value)}
      >
        {lista?.map((item, idx) => (
          <option key={idx} value={item.valor}>
            {item.desc}
          </option>
        ))}
      </select>
    );
  }),
  Loader: jest.fn(({ children }) => <div data-testid="Loader">{children}</div>),
}));

jest.mock('~/servicos/Abrangencia', () => ({
  buscarUes: jest.fn(),
}));

import AbrangenciaServico from '~/servicos/Abrangencia';

describe('UeDropDown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const formMock = { setFieldValue: jest.fn(), values: {} };

  it('renderiza select vazio quando dreId não é passado', () => {
    render(<UeDropDown onChange={jest.fn()} form={formMock} />);
    expect(screen.getByTestId('SelectComponent').children.length).toBe(0);
  });

  it('busca UEs quando dreId é passado', async () => {
    AbrangenciaServico.buscarUes.mockResolvedValue({
      data: [
        { nome: 'UE 1', codigo: '1', id: 1 },
        { nome: 'UE 2', codigo: '2', id: 2 },
      ],
    });
    render(<UeDropDown onChange={jest.fn()} dreId="123" form={formMock} />);
    await waitFor(() => {
      expect(AbrangenciaServico.buscarUes).toHaveBeenCalled();
      expect(screen.getByText('UE 1')).toBeInTheDocument();
      expect(screen.getByText('UE 2')).toBeInTheDocument();
    });
  });

  it('adiciona opção "Todas" quando opcaoTodas=true e há mais de uma UE', async () => {
    AbrangenciaServico.buscarUes.mockResolvedValue({
      data: [
        { nome: 'UE 1', codigo: '1', id: 1 },
        { nome: 'UE 2', codigo: '2', id: 2 },
      ],
    });
    render(
      <UeDropDown onChange={jest.fn()} dreId="123" form={formMock} opcaoTodas />
    );
    await waitFor(() => {
      expect(screen.getByText('Todas')).toBeInTheDocument();
    });
  });

  it('adiciona opção "Todas" quando opcaoTodas=true e não há UEs', async () => {
    AbrangenciaServico.buscarUes.mockResolvedValue({ data: [] });
    render(
      <UeDropDown onChange={jest.fn()} dreId="123" form={formMock} opcaoTodas />
    );
    await waitFor(() => {
      expect(screen.getByText('Todas')).toBeInTheDocument();
    });
  });

  it('chama onChange com valor correto ao selecionar', async () => {
    AbrangenciaServico.buscarUes.mockResolvedValue({
      data: [
        { nome: 'UE 1', codigo: '1', id: 1 },
        { nome: 'UE 2', codigo: '2', id: 2 },
      ],
    });
    const onChange = jest.fn();
    render(<UeDropDown onChange={onChange} dreId="123" form={formMock} />);
    await waitFor(() => {
      fireEvent.change(screen.getByTestId('SelectComponent'), {
        target: { value: '2' },
      });
      expect(onChange).toHaveBeenCalledWith(
        '2',
        [
          { desc: 'UE 1', valor: '1', id: 1 },
          { desc: 'UE 2', valor: '2', id: 2 },
        ],
        true
      );
    });
  });

  it('desabilita select corretamente quando dreId=0', async () => {
    AbrangenciaServico.buscarUes.mockResolvedValue({
      data: [
        { nome: 'UE 1', codigo: '1', id: 1 },
        { nome: 'UE 2', codigo: '2', id: 2 },
      ],
    });
    render(
      <UeDropDown onChange={jest.fn()} dreId="0" opcaoTodas form={formMock} />
    );
    await waitFor(() => {
      expect(screen.getByTestId('SelectComponent')).toBeDisabled();
    });
  });

  it('não quebra se form for objeto vazio', async () => {
    AbrangenciaServico.buscarUes.mockResolvedValue({ data: [] });
    expect(() => {
      render(<UeDropDown onChange={jest.fn()} dreId="123" form={formMock} />);
    }).not.toThrow();
  });

  it('seta valor automaticamente e chama onChange quando só há uma UE', async () => {
    const setFieldValue = jest.fn();
    const onChange = jest.fn();
    AbrangenciaServico.buscarUes.mockResolvedValue({
      data: [{ nome: 'UE Única', codigo: '99', id: 99 }],
    });
    render(
      <UeDropDown
        onChange={onChange}
        dreId="123"
        form={{ setFieldValue, values: {} }}
      />
    );
    await waitFor(() => {
      expect(setFieldValue).toHaveBeenCalledWith('ueId', '99');
      expect(onChange).toHaveBeenCalledWith('99', [
        { desc: 'UE Única', valor: '99', id: 99 },
      ]);
    });
  });

  it('cobre branch de valorUeId quando valorUe existe e está na lista', async () => {
    const setFieldValue = jest.fn();
    const form = { setFieldValue, values: { ueId: '2' } };
    AbrangenciaServico.buscarUes.mockResolvedValue({
      data: [
        { nome: 'UE 1', codigo: '1', id: 1 },
        { nome: 'UE 2', codigo: '2', id: 2 },
      ],
    });
    render(<UeDropDown onChange={jest.fn()} dreId="123" form={form} />);
    await waitFor(() => {
      expect(setFieldValue).toHaveBeenCalledWith('ueId', '2');
    });
  });
});
