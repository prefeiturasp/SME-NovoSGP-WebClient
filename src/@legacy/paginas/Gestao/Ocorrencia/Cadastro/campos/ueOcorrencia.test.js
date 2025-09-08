// UeOcorrencia.test.js

import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import UeOcorrencia from './UeOcorrencia';

// Mocks dos componentes e serviços
jest.mock('~/componentes', () => ({
  Loader: ({ loading, children }) => (
    <div data-testid="loader" data-loading={loading ? 'true' : 'false'}>
      {children}
    </div>
  ),
  SelectComponent: props => (
    <div
      data-testid="select-component"
      data-id={props.id}
      data-lista={JSON.stringify(props.lista)}
      data-disabled={props.disabled ? 'true' : 'false'}
      data-placeholder={props.placeholder}
      data-label={props.label}
      data-valueoption={props.valueOption}
      data-valuetext={props.valueText}
      data-name={props.name}
      onClick={props.onChange}
    />
  ),
}));
jest.mock('~/constantes/ids/select', () => ({
  SGP_SELECT_UE: 'select-ue',
}));

// Mock sempre retorna Promise
const mockBuscarUes = jest.fn().mockResolvedValue({ data: [] });
jest.mock('~/servicos', () => ({
  AbrangenciaServico: {
    buscarUes: (...args) => mockBuscarUes(...args),
  },
  erros: jest.fn(),
}));

describe('UeOcorrencia', () => {
  const mockOnChangeCampos = jest.fn();
  const mockSetListaUes = jest.fn();
  const getForm = (values = {}, initialValues = {}) => ({
    values,
    initialValues,
    setFieldValue: jest.fn(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockBuscarUes.mockResolvedValue({ data: [] });
  });

  it('renderiza Loader e SelectComponent', () => {
    render(
      <UeOcorrencia
        form={getForm({ anoLetivo: 2024 })}
        dreCodigo={1}
        setListaUes={mockSetListaUes}
        listaUes={[]}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByTestId('select-component')).toBeInTheDocument();
  });

  it('seta ueId se só houver uma UE', async () => {
    mockBuscarUes.mockResolvedValue({
      data: [{ id: 10, nome: 'Unica', codigo: '10' }],
    });
    const form = getForm({ anoLetivo: 2024 });
    render(
      <UeOcorrencia
        form={form}
        dreCodigo={1}
        setListaUes={mockSetListaUes}
        listaUes={[]}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    await waitFor(() => {
      expect(form.setFieldValue).toHaveBeenCalledWith('ueId', '10');
      expect(mockSetListaUes).toHaveBeenCalledWith([
        { id: 10, nome: 'Unica', codigo: '10' },
      ]);
    });
  });

  it('seta listaUes vazia se resposta não tem dados', async () => {
    mockBuscarUes.mockResolvedValue({ data: [] });
    const form = getForm({ anoLetivo: 2024 }, { ueId: 5 });
    render(
      <UeOcorrencia
        form={form}
        dreCodigo={1}
        setListaUes={mockSetListaUes}
        listaUes={[]}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    await waitFor(() => {
      expect(mockSetListaUes).toHaveBeenCalledWith([]);
    });
  });

  it('usa listaUesEdicao no modo edição', () => {
    const form = getForm(
      { anoLetivo: 2024 },
      { ueId: 7, ueNome: 'UE Edit', ueCodigo: '07' }
    );
    render(
      <UeOcorrencia
        form={form}
        dreCodigo={1}
        setListaUes={mockSetListaUes}
        listaUes={[]}
        ocorrenciaId={123}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    const lista = JSON.parse(
      screen.getByTestId('select-component').getAttribute('data-lista')
    );
    expect(lista).toEqual([{ id: 7, nome: 'UE Edit', codigo: '07' }]);
    expect(
      screen.getByTestId('select-component').getAttribute('data-disabled')
    ).toBe('true');
  });

  it('desabilita SelectComponent corretamente', () => {
    render(
      <UeOcorrencia
        form={getForm({ anoLetivo: 2024 })}
        dreCodigo={null}
        setListaUes={mockSetListaUes}
        listaUes={[]}
        onChangeCampos={mockOnChangeCampos}
        desabilitar={true}
      />
    );
    expect(
      screen.getByTestId('select-component').getAttribute('data-disabled')
    ).toBe('true');
  });

  it('chama onChangeCampos ao disparar onChange', () => {
    render(
      <UeOcorrencia
        form={getForm({ anoLetivo: 2024 })}
        dreCodigo={1}
        setListaUes={mockSetListaUes}
        listaUes={[]}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    fireEvent.click(screen.getByTestId('select-component'));
    expect(mockOnChangeCampos).toHaveBeenCalled();
  });
});
