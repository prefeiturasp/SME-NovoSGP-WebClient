import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { GraficoQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre } from './index';
import dashboardBuscaAtivaService from '@/core/services/dashboard-busca-ativa-service';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { useWatch } from 'antd/es/form/Form';

jest.mock('@/core/services/dashboard-busca-ativa-service', () => ({
  obterQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre: jest.fn(),
}));
jest.mock('antd/es/form/hooks/useFormInstance', () => jest.fn());
jest.mock('antd/es/form/Form', () => ({ useWatch: jest.fn() }));
jest.mock('@/components/sgp/graficos/barras', () => ({
  GraficoBarras: (props) => <div data-testid="grafico">Grafico - {JSON.stringify(props.data)}</div>,
}));
jest.mock('~/componentes', () => ({
  Loader: (props) =>
    props.loading ? <div>Loading...</div> : <div data-testid="loader">{props.children}</div>,
}));
jest.mock('antd', () => ({
  Row: (props) => <div data-testid="row">{props.children}</div>,
  Segmented: (props) => (
    <select
      data-testid="segmented"
      value={props.value}
      onChange={(e) => props.onChange(Number(e.target.value))}
    >
      {props.options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

describe('GraficoQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre', () => {
  const mockGetFieldsValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useFormInstance as jest.Mock).mockReturnValue({
      getFieldsValue: mockGetFieldsValue,
    });
  });

  it('renderiza com mensagem "Sem dados" inicialmente', () => {
    (useWatch as jest.Mock).mockReturnValue(undefined);
    const { getByText } = render(<GraficoQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre />);
    expect(getByText('Sem dados')).toBeInTheDocument();
  });

  it('exibe loader enquanto busca os dados', async () => {
    let outerResolve;
    (useWatch as jest.Mock).mockReturnValue({ value: 'modalidade' });
    mockGetFieldsValue.mockReturnValue({
      anoLetivo: 2024,
      dre: { id: 1 },
      ue: { id: 2 },
      modalidade: { value: 'modalidade' },
    });
    (
      dashboardBuscaAtivaService.obterQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre as jest.Mock
    ).mockImplementation(
      () =>
        new Promise((resolve) => {
          outerResolve = resolve;
        }),
    );
    const { getByText } = render(<GraficoQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre />);
    expect(getByText('Loading...')).toBeInTheDocument();
    await act(async () => {
      outerResolve({ sucesso: true, dados: { graficos: [{ grupo: 'A', valor: 10 }] } });
    });
  });

  it('chama o serviço se modalidade.value existir e renderiza gráfico', async () => {
    (useWatch as jest.Mock).mockReturnValue({ value: 'modalidade' });
    mockGetFieldsValue.mockReturnValue({
      anoLetivo: 2024,
      dre: { id: 1 },
      ue: { id: 2 },
      modalidade: { value: 'modalidade' },
    });
    (
      dashboardBuscaAtivaService.obterQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre as jest.Mock
    ).mockResolvedValue({
      sucesso: true,
      dados: { graficos: [{ grupo: 'A', valor: 10 }] },
    });
    const { findByTestId } = render(<GraficoQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre />);
    const grafico = await findByTestId('grafico');
    expect(grafico).toHaveTextContent('A');
  });

  it('exibe "Sem dados" se resposta não tem sucesso ou dados', async () => {
    (useWatch as jest.Mock).mockReturnValue({ value: 'modalidade' });
    mockGetFieldsValue.mockReturnValue({
      anoLetivo: 2024,
      dre: { id: 1 },
      ue: { id: 2 },
      modalidade: { value: 'modalidade' },
    });
    (
      dashboardBuscaAtivaService.obterQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre as jest.Mock
    ).mockResolvedValue({
      sucesso: false,
    });
    const { findByText } = render(<GraficoQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre />);
    await waitFor(() => expect(findByText('Sem dados')).resolves.toBeTruthy());
  });

  it('altera o tipo de procedimento e busca novos dados', async () => {
    (useWatch as jest.Mock).mockReturnValue({ value: 'modalidade' });
    mockGetFieldsValue.mockReturnValue({
      anoLetivo: 2024,
      dre: { id: 1 },
      ue: { id: 2 },
      modalidade: { value: 'modalidade' },
    });
    (
      dashboardBuscaAtivaService.obterQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre as jest.Mock
    ).mockResolvedValue({
      sucesso: true,
      dados: { graficos: [{ grupo: 'A', valor: 10 }] },
    });
    const { findByTestId } = render(<GraficoQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre />);
    const select = await findByTestId('segmented');
    fireEvent.change(select, { target: { value: 2 } });
    await waitFor(() =>
      expect(
        dashboardBuscaAtivaService.obterQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre,
      ).toHaveBeenCalledTimes(2),
    );
    const grafico = await findByTestId('grafico');
    expect(grafico).toBeInTheDocument();
  });
});
