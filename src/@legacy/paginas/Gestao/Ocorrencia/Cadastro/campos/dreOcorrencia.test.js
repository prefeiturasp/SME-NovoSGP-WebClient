// DreOcorrencia.test.js

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DreOcorrencia from './DreOcorrencia';

// Mocks dos helpers e componentes
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
      data-label={props.label}
      data-lista={JSON.stringify(props.lista)}
      data-valueoption={props.valueOption}
      data-valuetext={props.valueText}
      data-disabled={props.disabled ? 'true' : 'false'}
      data-placeholder={props.placeholder}
      data-name={props.name}
      data-labelrequired={props.labelRequired ? 'true' : 'false'}
      onClick={props.onChange}
    />
  ),
}));
jest.mock('~/componentes-sgp', () => ({
  FiltroHelper: {
    ordenarLista: () => (a, b) => a.nome.localeCompare(b.nome),
  },
}));
jest.mock('~/constantes/ids/select', () => ({
  SGP_SELECT_DRE: 'select-dre',
}));
const mockBuscarDres = jest.fn();
jest.mock('~/servicos', () => ({
  AbrangenciaServico: {
    buscarDres: (...args) => mockBuscarDres(...args),
  },
  erros: jest.fn(),
}));

describe('DreOcorrencia', () => {
  const mockSetFieldValue = jest.fn();
  const mockSetListaDres = jest.fn();

  const getForm = (values = {}, initialValues = {}) => ({
    values,
    initialValues,
    setFieldValue: mockSetFieldValue,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza Loader e SelectComponent com lista de dres', async () => {
    mockBuscarDres.mockResolvedValue({
      data: [
        { id: 2, nome: 'B', codigo: '02' },
        { id: 1, nome: 'A', codigo: '01' },
      ],
    });

    const form = getForm({ anoLetivo: 2024 });
    render(
      <DreOcorrencia
        form={form}
        setListaDres={mockSetListaDres}
        listaDres={[
          { id: 1, nome: 'A', codigo: '01' },
          { id: 2, nome: 'B', codigo: '02' },
        ]}
        onChangeCampos={jest.fn()}
      />
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByTestId('select-component')).toBeInTheDocument();

    await waitFor(() => {
      // Deve ordenar a lista por nome
      expect(mockSetListaDres).toHaveBeenCalledWith([
        { id: 1, nome: 'A', codigo: '01' },
        { id: 2, nome: 'B', codigo: '02' },
      ]);
      // Não chama setFieldValue se lista tem mais de 1
      expect(mockSetFieldValue).not.toHaveBeenCalledWith(
        'dreId',
        expect.anything()
      );
    });
  });

  it('seta dreId se só houver uma DRE', async () => {
    mockBuscarDres.mockResolvedValue({
      data: [{ id: 10, nome: 'Unica', codigo: '10' }],
    });

    const form = getForm({ anoLetivo: 2024 });
    render(
      <DreOcorrencia
        form={form}
        setListaDres={mockSetListaDres}
        listaDres={[]}
        onChangeCampos={jest.fn()}
      />
    );
    await waitFor(() => {
      expect(mockSetFieldValue).toHaveBeenCalledWith('dreId', '10');
      expect(mockSetListaDres).toHaveBeenCalledWith([
        { id: 10, nome: 'Unica', codigo: '10' },
      ]);
    });
  });

  it('seta undefined e lista vazia se resposta não tem dados', async () => {
    mockBuscarDres.mockResolvedValue({ data: [] });

    const form = getForm({ anoLetivo: 2024 });
    render(
      <DreOcorrencia
        form={form}
        setListaDres={mockSetListaDres}
        listaDres={[]}
        onChangeCampos={jest.fn()}
      />
    );
    await waitFor(() => {
      expect(mockSetFieldValue).toHaveBeenCalledWith('dreId', undefined);
      expect(mockSetListaDres).toHaveBeenCalledWith([]);
    });
  });

  it('usa listaDresEdicao quando ocorrenciaId e initialValues.dreId estão presentes', () => {
    const form = getForm(
      { anoLetivo: 2024 },
      { dreId: 5, dreNome: 'DRE Edit', dreCodigo: '05' }
    );
    render(
      <DreOcorrencia
        form={form}
        setListaDres={mockSetListaDres}
        listaDres={[]}
        ocorrenciaId={123}
        onChangeCampos={jest.fn()}
      />
    );
    const select = screen.getByTestId('select-component');
    const lista = JSON.parse(select.getAttribute('data-lista'));
    expect(lista).toEqual([{ id: 5, nome: 'DRE Edit', codigo: '05' }]);
    expect(select.getAttribute('data-disabled')).toBe('true');
  });

  it('chama onChangeCampos e limpa campos relacionados ao trocar DRE', () => {
    const form = getForm({ anoLetivo: 2024 });
    const onChangeCampos = jest.fn();
    render(
      <DreOcorrencia
        form={form}
        setListaDres={mockSetListaDres}
        listaDres={[]}
        onChangeCampos={onChangeCampos}
      />
    );
    const select = screen.getByTestId('select-component');
    fireEvent.click(select);
    expect(onChangeCampos).toHaveBeenCalled();
    expect(mockSetFieldValue).toHaveBeenCalledWith('ueCodigo', undefined);
    expect(mockSetFieldValue).toHaveBeenCalledWith('modalidade', undefined);
    expect(mockSetFieldValue).toHaveBeenCalledWith('semestre', undefined);
    expect(mockSetFieldValue).toHaveBeenCalledWith('turmaId', null);
  });
});
