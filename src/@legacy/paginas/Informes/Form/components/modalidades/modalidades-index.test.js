// SelectModalidadesInformes.test.js

import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { SelectModalidadesInformes } from './index';

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
      data-multiple={props.multiple ? 'true' : 'false'}
      data-labelrequired={props.labelRequired ? 'true' : 'false'}
      onClick={() => props.onChange && props.onChange('valorNovo')}
    />
  ),
}));
jest.mock('~/constantes', () => ({
  OPCAO_TODOS: 0,
}));
jest.mock('~/constantes/ids/select', () => ({
  SGP_SELECT_MODALIDADE: 'select-modalidade',
}));
const mockObterModalidadesPorAbrangencia = jest
  .fn()
  .mockResolvedValue({ data: [] });
jest.mock('~/servicos', () => ({
  ServicoFiltroRelatorio: {
    obterModalidadesPorAbrangencia: (...args) =>
      mockObterModalidadesPorAbrangencia(...args),
  },
  erros: jest.fn(),
}));
jest.mock('~/utils', () => ({
  onchangeMultiSelect: jest.fn((valor, antigo, setar) => setar(valor)),
}));
jest.mock('../../utils', () => ({
  temPerfisValidosCadstroInformes: jest.fn(() => true),
}));

describe('SelectModalidadesInformes', () => {
  const mockSetFieldValue = jest.fn();
  const mockSetFieldTouched = jest.fn();
  const mockOnChange = jest.fn();

  const getForm = (values = {}, initialValues = {}) => ({
    values,
    initialValues,
    setFieldValue: mockSetFieldValue,
    setFieldTouched: mockSetFieldTouched,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockObterModalidadesPorAbrangencia.mockResolvedValue({ data: [] });
  });

  it('renderiza Loader e SelectComponent', () => {
    render(
      <SelectModalidadesInformes
        form={getForm({
          ueCodigo: 0,
          dreCodigo: 1,
          perfis: [],
          listaPerfis: [],
        })}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByTestId('select-component')).toBeInTheDocument();
  });

  it('desabilita SelectComponent se só houver uma modalidade', () => {
    render(
      <SelectModalidadesInformes
        form={getForm({ listaModalidades: [{ valor: 1, descricao: 'EJA' }] })}
        onChange={mockOnChange}
      />
    );
    expect(
      screen.getByTestId('select-component').getAttribute('data-disabled')
    ).toBe('true');
  });

  it('chama obterModalidadesPorAbrangencia e seta lista no form', async () => {
    mockObterModalidadesPorAbrangencia.mockResolvedValue({
      data: [
        { valor: 1, descricao: 'EJA' },
        { valor: 2, descricao: 'CELP' },
      ],
    });

    const form = getForm({
      ueCodigo: 0,
      dreCodigo: 1,
      perfis: [],
      listaPerfis: [],
    });
    await act(async () => {
      render(
        <SelectModalidadesInformes
          form={form}
          onChange={mockOnChange}
          name="modalidade"
          nameList="listaModalidades"
        />
      );
    });

    await waitFor(() => {
      // Deve setar a lista no form
      expect(form.setFieldValue).toHaveBeenCalledWith('listaModalidades', [
        { valor: 0, descricao: 'Todas' },
        { valor: 1, descricao: 'EJA' },
        { valor: 2, descricao: 'CELP' },
      ]);
    });
  });

  it('seta modalidade automaticamente se só houver uma modalidade', async () => {
    mockObterModalidadesPorAbrangencia.mockResolvedValue({
      data: [{ valor: 42, descricao: 'Única' }],
    });
    const form = getForm({
      ueCodigo: 0,
      dreCodigo: 1,
      perfis: [],
      listaPerfis: [],
    });
    await act(async () => {
      render(
        <SelectModalidadesInformes
          form={form}
          onChange={mockOnChange}
          name="modalidade"
          nameList="listaModalidades"
        />
      );
    });
    await waitFor(() => {
      expect(form.setFieldValue).toHaveBeenCalledWith('modalidade', '42');
      expect(form.setFieldValue).toHaveBeenCalledWith('listaModalidades', [
        { valor: 42, descricao: 'Única' },
      ]);
    });
  });

  it('chama onChange e onchangeMultiSelect ao trocar valor no modo multiple', () => {
    render(
      <SelectModalidadesInformes
        form={getForm({
          ueCodigo: 0,
          dreCodigo: 1,
          perfis: [],
          listaPerfis: [],
        })}
        onChange={mockOnChange}
        multiple
      />
    );
    fireEvent.click(screen.getByTestId('select-component'));
    expect(mockOnChange).toHaveBeenCalledWith('valorNovo');
  });

  it('labelRequired só é true se temPerfisValidos for true', () => {
    render(
      <SelectModalidadesInformes
        form={getForm({
          ueCodigo: 0,
          dreCodigo: 1,
          perfis: [],
          listaPerfis: [],
        })}
        labelRequired
      />
    );
    expect(
      screen.getByTestId('select-component').getAttribute('data-labelrequired')
    ).toBe('true');
  });
});
