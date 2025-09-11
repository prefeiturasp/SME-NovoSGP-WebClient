import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardBuscaAtivaTabs } from './index';

jest.mock('./grafico-motivos-ausencias', () => ({
  GraficoQuantidadeBuscaAtivaPorMotivosAusencia: () => <div data-testid="grafico-ausencia" />,
}));

jest.mock('./grafico-procedimentos-trabalho', () => ({
  GraficoQuantidadeBuscaAtivaPorProcedimentosTrabalhoDre: () => (
    <div data-testid="grafico-procedimentos" />
  ),
}));

jest.mock('./grafico-reflexos-percentual-frequencia', () => ({
  GraficoQuantidadeBuscaAtivaPorReflexoFrequenciaMes: () => <div data-testid="grafico-reflexos" />,
}));

describe('DashboardBuscaAtivaTabs', () => {
  it('renderiza mensagem inicial quando nenhuma tab está selecionada', () => {
    render(<DashboardBuscaAtivaTabs />);
    expect(screen.getByText('Selecione uma tab')).toBeInTheDocument();
  });

  it('renderiza gráfico de motivos de ausência ao clicar na primeira aba', () => {
    render(<DashboardBuscaAtivaTabs />);
    fireEvent.click(screen.getByText('Motivos da ausência'));
    expect(screen.getByTestId('grafico-ausencia')).toBeInTheDocument();
  });

  it('renderiza gráfico de procedimentos ao clicar na segunda aba', () => {
    render(<DashboardBuscaAtivaTabs />);
    fireEvent.click(screen.getByText('Procedimentos de trabalho'));
    expect(screen.getByTestId('grafico-procedimentos')).toBeInTheDocument();
  });

  it('renderiza gráfico de reflexos ao clicar na terceira aba', () => {
    render(<DashboardBuscaAtivaTabs />);
    fireEvent.click(screen.getByText('Reflexos no percentual de frequência'));
    expect(screen.getByTestId('grafico-reflexos')).toBeInTheDocument();
  });
});
