// ModalidadeSemestreOcorrencia.test.js

import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import ModalidadeSemestreOcorrencia from './ModalidadeSemestreOcorrencia';

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
      data-testid={`select-component-${props.name}`}
      data-id={props.id}
      data-lista={JSON.stringify(props.lista)}
      data-disabled={props.disabled ? 'true' : 'false'}
      data-placeholder={props.placeholder}
      data-label={props.label}
      data-valueoption={props.valueOption}
      data-valuetext={props.valueText}
      onClick={props.onChange}
    />
  ),
}));
jest.mock('~/constantes/ids/select', () => ({
  SGP_SELECT_MODALIDADE: 'select-modalidade',
  SGP_SELECT_SEMESTRE: 'select-semestre',
}));
jest.mock('@/core/enum/modalidade-enum', () => ({
  ModalidadeEnum: { EJA: 1, CELP: 2 },
}));
const mockObterModalidades = jest.fn().mockResolvedValue({ data: [] });
const mockObterSemestres = jest.fn().mockResolvedValue({ data: [] });
jest.mock('~/servicos', () => ({
  ServicoFiltroRelatorio: {
    obterModalidades: (...args) => mockObterModalidades(...args),
  },
  AbrangenciaServico: {
    obterSemestres: (...args) => mockObterSemestres(...args),
  },
  erros: jest.fn(),
}));

describe('ModalidadeSemestreOcorrencia', () => {
  const mockSetFieldValue = jest.fn();
  const mockOnChangeCampos = jest.fn();
  const getForm = (values = {}, initialValues = {}) => ({
    values,
    initialValues,
    setFieldValue: mockSetFieldValue,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza Modalidade e não Semestre se não for EJA/CELP', () => {
    render(
      <ModalidadeSemestreOcorrencia
        form={getForm({ anoLetivo: 2024, modalidade: 3 })}
        dreCodigo={1}
        ueCodigo={2}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    expect(
      screen.getByTestId('select-component-modalidade')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('select-component-semestre')).toBeNull();
  });

  it('seta semestre undefined se resposta de semestres for vazia', async () => {
    mockObterSemestres.mockResolvedValue({ data: [] });
    const form = getForm({ anoLetivo: 2024, modalidade: 1 });
    await act(async () => {
      render(
        <ModalidadeSemestreOcorrencia
          form={form}
          dreCodigo={1}
          ueCodigo={2}
          onChangeCampos={mockOnChangeCampos}
        />
      );
    });
    await waitFor(() => {
      expect(form.setFieldValue).toHaveBeenCalledWith('semestre', undefined);
    });
  });

  it('seta semestre automaticamente se só houver um semestre', async () => {
    mockObterSemestres.mockResolvedValue({ data: ['2º'] });
    const form = getForm({ anoLetivo: 2024, modalidade: 1 });
    await act(async () => {
      render(
        <ModalidadeSemestreOcorrencia
          form={form}
          dreCodigo={1}
          ueCodigo={2}
          onChangeCampos={mockOnChangeCampos}
        />
      );
    });
    await waitFor(() => {
      expect(form.setFieldValue).toHaveBeenCalledWith('semestre', '2º');
    });
  });

  it('chama onChangeCampos e limpa campos ao trocar modalidade', () => {
    render(
      <ModalidadeSemestreOcorrencia
        form={getForm({ anoLetivo: 2024, modalidade: 3 })}
        dreCodigo={1}
        ueCodigo={2}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    fireEvent.click(screen.getByTestId('select-component-modalidade'));
    expect(mockOnChangeCampos).toHaveBeenCalled();
    expect(mockSetFieldValue).toHaveBeenCalledWith('semestre', undefined);
    expect(mockSetFieldValue).toHaveBeenCalledWith('turmaId', null);
  });

  it('chama onChangeCampos e limpa turmaId ao trocar semestre', () => {
    render(
      <ModalidadeSemestreOcorrencia
        form={getForm({ anoLetivo: 2024, modalidade: 1 })}
        dreCodigo={1}
        ueCodigo={2}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    fireEvent.click(screen.getByTestId('select-component-semestre'));
    expect(mockOnChangeCampos).toHaveBeenCalled();
    expect(mockSetFieldValue).toHaveBeenCalledWith('turmaId', null);
  });

  it('usa listaModalidadesEdicao e listaSemestresEdicao no modo edição', () => {
    const form = getForm(
      { anoLetivo: 2024, modalidade: 1 },
      { modalidade: 2, modalidadeNome: 'CELP', semestre: '1º' }
    );
    render(
      <ModalidadeSemestreOcorrencia
        form={form}
        dreCodigo={1}
        ueCodigo={2}
        ocorrenciaId={123}
        onChangeCampos={mockOnChangeCampos}
      />
    );
    const modalidadeLista = JSON.parse(
      screen
        .getByTestId('select-component-modalidade')
        .getAttribute('data-lista')
    );
    expect(modalidadeLista).toEqual([{ valor: 2, descricao: 'CELP' }]);
    const semestreLista = JSON.parse(
      screen.getByTestId('select-component-semestre').getAttribute('data-lista')
    );
    expect(semestreLista).toEqual([{ valor: '1º', desc: '1º' }]);
  });

  it('busca e seta lista de modalidades ao informar ueCodigo', async () => {
    mockObterModalidades.mockResolvedValue({
      data: [
        { valor: 1, descricao: 'EJA' },
        { valor: 2, descricao: 'CELP' },
      ],
    });

    await act(async () => {
      render(
        <ModalidadeSemestreOcorrencia
          form={getForm({ anoLetivo: 2024, modalidade: 3 })}
          dreCodigo={1}
          ueCodigo={2}
          onChangeCampos={mockOnChangeCampos}
        />
      );
    });
    await waitFor(() => {
      expect(mockObterModalidades).toHaveBeenCalled();
    });
  });
});
