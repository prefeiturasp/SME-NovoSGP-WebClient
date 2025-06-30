import { render, waitFor, act } from '@testing-library/react';

import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { useWatch } from 'antd/es/form/Form';
import { GraficoQuantidadeBuscaAtivaPorMotivosAusencia } from './index';
import dashboardBuscaAtivaService from '@/core/services/dashboard-busca-ativa-service';

jest.mock('@/core/services/dashboard-busca-ativa-service', () => ({
  obterQuantidadeBuscaAtivaPorMotivosAusencia: jest.fn(),
}));

jest.mock('antd/es/form/hooks/useFormInstance', () => jest.fn());
jest.mock('antd/es/form/Form', () => ({
  useWatch: jest.fn(),
}));

jest.mock('@/components/sgp/graficos/barras', () => ({
  GraficoBarras: (props) => <div data-testid="grafico">Grafico - {JSON.stringify(props.data)}</div>,
}));

jest.mock('~/componentes', () => ({
  Loader: (props) =>
    props.loading ? <div>Loading...</div> : <div data-testid="loader">{props.children}</div>,
}));

describe('GraficoQuantidadeBuscaAtivaPorMotivosAusencia', () => {
  const mockGetFieldsValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useFormInstance as jest.Mock).mockReturnValue({
      getFieldsValue: mockGetFieldsValue,
    });
  });

  it('renderiza com mensagem "Sem dados" inicialmente', () => {
    (useWatch as jest.Mock).mockReturnValue(undefined);
    const { getByText } = render(<GraficoQuantidadeBuscaAtivaPorMotivosAusencia />);
    expect(getByText('Sem dados')).toBeInTheDocument();
  });

  it('chama o serviço se modalidade.value existir', async () => {
    (useWatch as jest.Mock).mockReturnValue({ value: 'some-modalidade' });
    mockGetFieldsValue.mockReturnValue({
      anoLetivo: 2024,
      dre: { id: 1 },
      ue: { id: 2 },
      modalidade: { value: 'some-modalidade' },
    });

    (
      dashboardBuscaAtivaService.obterQuantidadeBuscaAtivaPorMotivosAusencia as jest.Mock
    ).mockResolvedValue({
      sucesso: true,
      dados: { graficos: [{ id: 1, nome: 'Motivo A' }] },
    });

    const { findByTestId } = render(<GraficoQuantidadeBuscaAtivaPorMotivosAusencia />);
    const grafico = await findByTestId('grafico');
    expect(grafico).toHaveTextContent('Motivo A');
  });

  it('exibe "Sem dados" se resposta não tem sucesso ou dados', async () => {
    (useWatch as jest.Mock).mockReturnValue({ value: 'some-modalidade' });
    mockGetFieldsValue.mockReturnValue({
      anoLetivo: 2024,
      dre: { id: 1 },
      ue: { id: 2 },
      modalidade: { value: 'some-modalidade' },
    });

    (
      dashboardBuscaAtivaService.obterQuantidadeBuscaAtivaPorMotivosAusencia as jest.Mock
    ).mockResolvedValue({
      sucesso: false,
    });

    const { findByText } = render(<GraficoQuantidadeBuscaAtivaPorMotivosAusencia />);
    await waitFor(() => expect(findByText('Sem dados')).resolves.toBeTruthy());
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
      dashboardBuscaAtivaService.obterQuantidadeBuscaAtivaPorMotivosAusencia as jest.Mock
    ).mockImplementation(
      () =>
        new Promise((resolve) => {
          outerResolve = resolve;
        }),
    );

    const { getByText } = render(<GraficoQuantidadeBuscaAtivaPorMotivosAusencia />);
    expect(getByText('Loading...')).toBeInTheDocument();

    await act(async () => {
      outerResolve({ sucesso: true, dados: { graficos: [] } });
    });
  });
});
