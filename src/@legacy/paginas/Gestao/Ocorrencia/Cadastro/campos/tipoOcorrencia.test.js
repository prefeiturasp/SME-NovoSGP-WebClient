// TipoOcorrencia.test.js

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TipoOcorrencia from './TipoOcorrencia';

// Mock do SelectComponent
jest.mock('~/componentes', () => ({
  SelectComponent: props => (
    <div
      data-testid="select-component"
      data-lista={JSON.stringify(props.lista)}
      data-disabled={props.disabled ? 'true' : 'false'}
      data-placeholder={props.placeholder}
      data-label={props.label}
      data-valueoption={props.valueOption}
      data-valuetext={props.valueText}
      data-id={props.id}
      data-name={props.name}
      onClick={props.onChange}
    />
  ),
}));

// Mock do serviço
const mockBuscarTiposOcorrencias = jest.fn();
jest.mock('~/servicos', () => ({
  ServicoOcorrencias: {
    buscarTiposOcorrencias: (...args) => mockBuscarTiposOcorrencias(...args),
  },
}));

describe('TipoOcorrencia', () => {
  const mockForm = {};
  const mockOnChangeCampos = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza SelectComponent com lista de tipos de ocorrências', async () => {
    mockBuscarTiposOcorrencias.mockResolvedValue({
      data: [
        { id: 1, descricao: 'Tipo 1' },
        { id: 2, descricao: 'Tipo 2' },
      ],
    });

    render(
      <TipoOcorrencia
        form={mockForm}
        onChangeCampos={mockOnChangeCampos}
        desabilitar={false}
      />
    );

    const select = screen.getByTestId('select-component');
    expect(select).toBeInTheDocument();

    await waitFor(() => {
      const lista = JSON.parse(select.getAttribute('data-lista'));
      expect(lista).toEqual([
        { id: 1, descricao: 'Tipo 1' },
        { id: 2, descricao: 'Tipo 2' },
      ]);
      expect(select.getAttribute('data-id')).toBe('SGP_SELECT_TIPO_OCORRENCIA');
      expect(select.getAttribute('data-label')).toBe('Tipo da ocorrência');
      expect(select.getAttribute('data-placeholder')).toBe(
        'Tipo da ocorrência'
      );
      expect(select.getAttribute('data-valueoption')).toBe('id');
      expect(select.getAttribute('data-valuetext')).toBe('descricao');
      expect(select.getAttribute('data-disabled')).toBe('false');
      expect(select.getAttribute('data-name')).toBe('ocorrenciaTipoId');
    });
  });

  it('renderiza SelectComponent com lista vazia se serviço retorna vazio', async () => {
    mockBuscarTiposOcorrencias.mockResolvedValue({ data: [] });

    render(
      <TipoOcorrencia
        form={mockForm}
        onChangeCampos={mockOnChangeCampos}
        desabilitar={false}
      />
    );

    const select = screen.getByTestId('select-component');
    await waitFor(() => {
      const lista = JSON.parse(select.getAttribute('data-lista'));
      expect(lista).toEqual([]);
    });
  });

  it('passa prop disabled corretamente', async () => {
    mockBuscarTiposOcorrencias.mockResolvedValue({ data: [] });

    render(
      <TipoOcorrencia
        form={mockForm}
        onChangeCampos={mockOnChangeCampos}
        desabilitar={true}
      />
    );

    const select = screen.getByTestId('select-component');
    await waitFor(() => {
      expect(select.getAttribute('data-disabled')).toBe('true');
    });
  });

  it('chama onChangeCampos ao disparar onChange', async () => {
    mockBuscarTiposOcorrencias.mockResolvedValue({ data: [] });

    render(
      <TipoOcorrencia
        form={mockForm}
        onChangeCampos={mockOnChangeCampos}
        desabilitar={false}
      />
    );

    const select = screen.getByTestId('select-component');
    fireEvent.click(select);
    expect(mockOnChangeCampos).toHaveBeenCalled();
  });
});
