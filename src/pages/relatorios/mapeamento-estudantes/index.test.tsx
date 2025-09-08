import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { RelatorioMapeamentoEstudantes } from './index';
import relatoriosService from '@/core/services/relatorios-service';
import { sucesso } from '~/servicos';

jest.mock('@/core/services/relatorios-service', () => ({
  mapeamentoEstudante: jest.fn(),
}));

jest.mock('~/servicos', () => ({
  sucesso: jest.fn(),
}));

jest.mock('@/components/lib/card-content', () => (props) => <div>{props.children}</div>);
jest.mock('@/components/lib/header-page', () => (props) => (
  <div>
    {props.title}
    {props.children}
  </div>
));
jest.mock('@/components/sgp/inputs/form/anoLetivo', () => () => <div>AnoLetivo</div>);
jest.mock('@/components/sgp/inputs/form/dre', () => () => <div>DRE</div>);
jest.mock('@/components/sgp/inputs/form/ue', () => () => <div>UE</div>);
jest.mock('@/components/sgp/inputs/form/modalidade', () => () => <div>Modalidade</div>);
jest.mock('@/components/sgp/inputs/form/semestre', () => () => <div>Semestre</div>);
jest.mock('@/components/sgp/inputs/form/turma', () => () => <div>Turma</div>);
jest.mock('@/components/sgp/inputs/form/parecer-conclusivo', () => ({
  SelectParecerConclusivoAnoLetivoModalidadeItem: (props) => <div>{props.children}</div>,
  SelectParecerConclusivoAnoLetivoModalidade: () => <div>Parecer</div>,
}));
jest.mock('@/components/sgp/inputs/form/exibir-historico', () => () => (
  <div>CheckboxExibirHistorico</div>
));
jest.mock('@/components/sgp/localizador-estudante', () => () => <div>LocalizadorEstudante</div>);

jest.mock('~/componentes', () => ({
  Loader: (props) => (props.loading ? <div>loading...</div> : <div>{props.children}</div>),
}));
jest.mock('./botoes-acoes', () => ({
  RelMapeamentoEstudantesBotoesAcoes: () => <div>Botões</div>,
}));
jest.mock('./campos-form-dinamico', () => ({
  RelMapeamentoEstudantesCamposFormDinamico: () => <div>Campos Dinâmicos</div>,
}));
describe('RelatorioMapeamentoEstudantes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza o componente sem erros', () => {
    const { getByText } = render(<RelatorioMapeamentoEstudantes />);
    expect(getByText('Mapeamento de estudantes')).toBeInTheDocument();
    expect(getByText('Botões')).toBeInTheDocument();
    expect(getByText('Campos Dinâmicos')).toBeInTheDocument();
  });

  it('executa onFinish com sucesso', async () => {
    (relatoriosService.mapeamentoEstudante as jest.Mock).mockResolvedValue({ sucesso: true });

    const { container } = render(<RelatorioMapeamentoEstudantes />);
    const form = container.querySelector('form') as HTMLFormElement;

    fireEvent.submit(form);

    await waitFor(() => {
      expect(relatoriosService.mapeamentoEstudante).toHaveBeenCalled();
      expect(sucesso).toHaveBeenCalled();
    });
  });

  it('exibe loader enquanto requisita', async () => {
    let resolve;
    (relatoriosService.mapeamentoEstudante as jest.Mock).mockImplementation(
      () =>
        new Promise((_resolve) => {
          resolve = _resolve;
        }),
    );

    const { findByText, container } = render(<RelatorioMapeamentoEstudantes />);
    const form = container.querySelector('form') as HTMLFormElement;

    fireEvent.submit(form);

    await findByText('loading...');

    act(() => resolve({ sucesso: true }));

    await waitFor(() => {
      expect(sucesso).toHaveBeenCalled();
    });
  });
});
