// TurmaOcorrencia.test.js

import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import TurmaOcorrencia from './TurmaOcorrencia';

// Mocks dos componentes e serviços
jest.mock('antd', () => {
  const originalAntd = jest.requireActual('antd');
  return {
    ...originalAntd,
    Col: props => (
      <div data-testid="col" {...props}>
        {props.children}
      </div>
    ),
  };
});
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
  SGP_SELECT_TURMA: 'select-turma',
}));
jest.mock('@/core/enum/modalidade-enum', () => ({
  ModalidadeEnum: { EJA: 1, CELP: 2 },
}));

// Mock sempre retorna Promise
const mockBuscarTurmas = jest.fn().mockResolvedValue({ data: [] });
jest.mock('~/servicos', () => ({
  AbrangenciaServico: {
    buscarTurmas: (...args) => mockBuscarTurmas(...args),
  },
  erros: jest.fn(),
}));

describe('TurmaOcorrencia', () => {
  const mockOnChangeCampos = jest.fn();
  const getForm = (values = {}, initialValues = {}) => ({
    values,
    initialValues,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Sempre retorna Promise resolvida por padrão
    mockBuscarTurmas.mockResolvedValue({ data: [] });
  });

  it('renderiza Col, Loader e SelectComponent', () => {
    render(
      <TurmaOcorrencia
        form={getForm({ anoLetivo: 2024, modalidade: 3, semestre: 1 })}
        ueCodigo={1}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    expect(screen.getByTestId('col')).toBeInTheDocument();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByTestId('select-component')).toBeInTheDocument();
  });

  it('busca e seta lista de turmas ao informar modalidade', async () => {
    mockBuscarTurmas.mockResolvedValue({
      data: [
        { id: 1, nomeFiltro: 'Turma 1' },
        { id: 2, nomeFiltro: 'Turma 2' },
      ],
    });

    await act(async () => {
      render(
        <TurmaOcorrencia
          form={getForm({ anoLetivo: 2024, modalidade: 3, semestre: 1 })}
          ueCodigo={1}
          onChangeCampos={mockOnChangeCampos}
        />
      );
    });

    await waitFor(() => {
      const lista = JSON.parse(
        screen.getByTestId('select-component').getAttribute('data-lista')
      );
      expect(lista).toEqual([
        { id: 1, nomeFiltro: 'Turma 1' },
        { id: 2, nomeFiltro: 'Turma 2' },
      ]);
    });
  });

  it('seta lista de turmas vazia se resposta não tem dados', async () => {
    mockBuscarTurmas.mockResolvedValue({ data: [] });

    await act(async () => {
      render(
        <TurmaOcorrencia
          form={getForm({ anoLetivo: 2024, modalidade: 3, semestre: 1 })}
          ueCodigo={1}
          onChangeCampos={mockOnChangeCampos}
        />
      );
    });

    await waitFor(() => {
      const lista = JSON.parse(
        screen.getByTestId('select-component').getAttribute('data-lista')
      );
      expect(lista).toEqual([]);
    });
  });

  it('usa listaTurmasEdicao no modo edição', () => {
    const form = getForm(
      { anoLetivo: 2024, modalidade: 3, semestre: 1 },
      { turmaId: 7, turmaNome: 'Turma Edit' }
    );
    render(
      <TurmaOcorrencia
        form={form}
        ueCodigo={1}
        ocorrenciaId={123}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    const lista = JSON.parse(
      screen.getByTestId('select-component').getAttribute('data-lista')
    );
    expect(lista).toEqual([{ id: 7, nomeFiltro: 'Turma Edit' }]);
    expect(
      screen.getByTestId('select-component').getAttribute('data-disabled')
    ).toBe('true');
  });

  it('desabilita SelectComponent corretamente', () => {
    render(
      <TurmaOcorrencia
        form={getForm({ anoLetivo: 2024, modalidade: null, semestre: 1 })}
        ueCodigo={1}
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
      <TurmaOcorrencia
        form={getForm({ anoLetivo: 2024, modalidade: 3, semestre: 1 })}
        ueCodigo={1}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    fireEvent.click(screen.getByTestId('select-component'));
    expect(mockOnChangeCampos).toHaveBeenCalled();
  });
});
