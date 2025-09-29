import { render, screen } from '@testing-library/react';
import RelatorioOcorrenciasForm from './RelatorioOcorrenciasForm';

jest.mock('~/componentes-sgp/inputs', () => ({
  AnoLetivo: () => <div data-testid="ano-letivo">Ano Letivo</div>,
  Dre: () => <div data-testid="dre">DRE</div>,
  Ue: () => <div data-testid="ue">UE</div>,
  Modalidade: () => <div data-testid="modalidade">Modalidade</div>,
  Semestre: () => <div data-testid="semestre">Semestre</div>,
  Turma: () => <div data-testid="turma">Turma</div>,
  ExibirHistorico: () => <div data-testid="historico">Exibir Histórico</div>,
}));

jest.mock('@/@legacy/componentes-sgp/inputs/data-ocorrencia', () => ({
  DataOcorrencia: () => (
    <div data-testid="data-ocorrencia">Data Ocorrência</div>
  ),
}));

jest.mock('@/@legacy/componentes-sgp/inputs/tipo-ocorrencia', () => () => (
  <div data-testid="tipo-ocorrencia">Tipo Ocorrência</div>
));

jest.mock(
  '@/@legacy/componentes-sgp/inputs/imprimir-descricao-ocorrencia',
  () => ({
    ImprimirDescricaoOcorrencia: () => (
      <div data-testid="imprimir-descricao">Imprimir Descrição</div>
    ),
  })
);

describe('RelatorioOcorrenciasForm', () => {
  const mockForm = {
    values: {
      ueCodigo: '123',
      modalidade: '1',
    },
    setFieldValue: jest.fn(),
  };

  const mockOnChange = jest.fn();

  it('deve renderizar todos os campos do formulário', () => {
    render(
      <RelatorioOcorrenciasForm form={mockForm} onChangeCampos={mockOnChange} />
    );

    expect(screen.getByTestId('historico')).toBeInTheDocument();
    expect(screen.getByTestId('ano-letivo')).toBeInTheDocument();
    expect(screen.getByTestId('dre')).toBeInTheDocument();
    expect(screen.getByTestId('ue')).toBeInTheDocument();
    expect(screen.getByTestId('modalidade')).toBeInTheDocument();
    expect(screen.getByTestId('semestre')).toBeInTheDocument();
    expect(screen.getByTestId('turma')).toBeInTheDocument();
    expect(screen.getByTestId('data-ocorrencia')).toBeInTheDocument();
    expect(screen.getByTestId('tipo-ocorrencia')).toBeInTheDocument();
    expect(screen.getByTestId('imprimir-descricao')).toBeInTheDocument();
  });

  it('deve renderizar sem form props', () => {
    render(<RelatorioOcorrenciasForm onChangeCampos={mockOnChange} />);

    expect(screen.getByTestId('ano-letivo')).toBeInTheDocument();
  });

  it('deve renderizar sem onChangeCampos props', () => {
    render(<RelatorioOcorrenciasForm form={mockForm} />);

    expect(screen.getByTestId('dre')).toBeInTheDocument();
  });
});
