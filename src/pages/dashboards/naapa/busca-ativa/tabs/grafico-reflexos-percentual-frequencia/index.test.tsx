import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { GraficoQuantidadeBuscaAtivaPorReflexoFrequenciaMes } from './index';
import dashboardBuscaAtivaService from '@/core/services/dashboard-busca-ativa-service';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { useWatch } from 'antd/es/form/Form';

jest.mock('@/core/services/dashboard-busca-ativa-service', () => ({
  obterQuantidadeBuscaAtivaPorReflexoFrequenciaMes: jest.fn(),
}));
jest.mock('antd/es/form/hooks/useFormInstance', () => jest.fn());
jest.mock('antd/es/form/Form', () => ({ useWatch: jest.fn() }));
jest.mock('@/components/sgp/graficos/barras', () => ({
  GraficoBarras: (props) => <div data-testid="grafico">Grafico - {JSON.stringify(props.data)}</div>,
}));
jest.mock('@/components/sgp/inputs/form/mes', () => ({
  SelectMes: (props) => (
    <select data-testid="select-mes" onChange={(e) => props.onChange(e.target.value)}>
      <option value="">Selecione</option>
      <option value="2">Fevereiro</option>
      <option value="3">Março</option>
    </select>
  ),
}));
jest.mock('@/components/sgp/data-ultima-consolidacao', () => ({
  TagDataUltimaConsolidacao: (props) => <div data-testid="tag-data">{props.data}</div>,
}));
jest.mock('~/componentes', () => ({
  Loader: (props) =>
    props.loading ? <div>Loading...</div> : <div data-testid="loader">{props.children}</div>,
}));
jest.mock('antd', () => ({
  Row: (props) => <div data-testid="row">{props.children}</div>,
  Col: (props) => <div data-testid="col">{props.children}</div>,
}));

describe('GraficoQuantidadeBuscaAtivaPorReflexoFrequenciaMes', () => {
  const mockGetFieldsValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useFormInstance as jest.Mock).mockReturnValue({
      getFieldsValue: mockGetFieldsValue,
    });
  });

  it('renderiza com mensagem "Sem dados" inicialmente', () => {
    (useWatch as jest.Mock).mockReturnValue(undefined);
    const { getByText } = render(<GraficoQuantidadeBuscaAtivaPorReflexoFrequenciaMes />);
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
      dashboardBuscaAtivaService.obterQuantidadeBuscaAtivaPorReflexoFrequenciaMes as jest.Mock
    ).mockImplementation(
      () =>
        new Promise((resolve) => {
          outerResolve = resolve;
        }),
    );
    const { getByText, getByTestId } = render(
      <GraficoQuantidadeBuscaAtivaPorReflexoFrequenciaMes />,
    );
    fireEvent.change(getByTestId('select-mes'), { target: { value: '2' } });
    expect(getByText('Loading...')).toBeInTheDocument();
    await act(async () => {
      outerResolve({ sucesso: true, dados: { graficos: [{ grupo: 'A', valor: 10 }] } });
    });
  });

  it('chama o serviço e renderiza gráfico ao selecionar mês', async () => {
    (useWatch as jest.Mock).mockReturnValue({ value: 'modalidade' });
    mockGetFieldsValue.mockReturnValue({
      anoLetivo: 2024,
      dre: { id: 1 },
      ue: { id: 2 },
      modalidade: { value: 'modalidade' },
    });
    (
      dashboardBuscaAtivaService.obterQuantidadeBuscaAtivaPorReflexoFrequenciaMes as jest.Mock
    ).mockResolvedValue({
      sucesso: true,
      dados: { graficos: [{ grupo: 'A', valor: 10 }] },
    });
    const { getByTestId, findByTestId } = render(
      <GraficoQuantidadeBuscaAtivaPorReflexoFrequenciaMes />,
    );
    fireEvent.change(getByTestId('select-mes'), { target: { value: '2' } });
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
      dashboardBuscaAtivaService.obterQuantidadeBuscaAtivaPorReflexoFrequenciaMes as jest.Mock
    ).mockResolvedValue({
      sucesso: false,
    });
    const { getByTestId, findByText } = render(
      <GraficoQuantidadeBuscaAtivaPorReflexoFrequenciaMes />,
    );
    fireEvent.change(getByTestId('select-mes'), { target: { value: '2' } });
    await waitFor(() => expect(findByText('Sem dados')).resolves.toBeTruthy());
  });

  it('exibe TagDataUltimaConsolidacao quando há data', async () => {
    (useWatch as jest.Mock).mockReturnValue({ value: 'modalidade' });
    mockGetFieldsValue.mockReturnValue({
      anoLetivo: 2024,
      dre: { id: 1 },
      ue: { id: 2 },
      modalidade: { value: 'modalidade' },
    });
    (
      dashboardBuscaAtivaService.obterQuantidadeBuscaAtivaPorReflexoFrequenciaMes as jest.Mock
    ).mockResolvedValue({
      sucesso: true,
      dados: { graficos: [{ grupo: 'A', valor: 10 }], dataUltimaConsolidacao: '2025-06-23' },
    });
    const { getByTestId, findByTestId } = render(
      <GraficoQuantidadeBuscaAtivaPorReflexoFrequenciaMes />,
    );
    fireEvent.change(getByTestId('select-mes'), { target: { value: '2' } });
    const tag = await findByTestId('tag-data');
    expect(tag).toHaveTextContent('2025-06-23');
  });
});
