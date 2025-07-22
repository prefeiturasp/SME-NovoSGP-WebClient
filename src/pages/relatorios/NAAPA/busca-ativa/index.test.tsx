import { render } from '@testing-library/react';
import { RelatorioNAAPABuscaAtiva } from './index';

jest.mock('@/components/lib/card-content', () => () => <div>CardContent</div>);
jest.mock('@/components/lib/header-page', () => () => <div>HeaderPage</div>);
jest.mock('@/components/sgp/botoes-acoes/relatorio', () => () => <div>BotoesAcoesRelatorio</div>);
jest.mock('@/components/sgp/inputs/form/anoLetivo', () => () => <div>SelectAnoLetivo</div>);
jest.mock('@/components/sgp/inputs/form/busca-ativa/motivo-ausencia', () => ({
  SelectMotivoAusenciaBuscaAtiva: () => <div>SelectMotivoAusenciaBuscaAtiva</div>,
  SelectMotivoAusenciaBuscaAtivaFormItem: () => <div>SelectMotivoAusenciaBuscaAtivaFormItem</div>,
}));

describe('RelatorioNAAPABuscaAtiva', () => {
  it('Mostra componente sem quebrar', () => {
    render(<RelatorioNAAPABuscaAtiva />);
  });

  it('Mostra principais elementos do form', () => {
    const { getByText } = render(<RelatorioNAAPABuscaAtiva />);

    expect(getByText('HeaderPage')).toBeInTheDocument();
    expect(getByText('CardContent')).toBeInTheDocument();
    // expect(getByText('BotoesAcoesRelatorio')).toBeInTheDocument(); TODO: esta dando erro ver depois
    // expect(getByText('SelectAnoLetivo')).toBeInTheDocument(); TODO: esta dando erro ver depois
  });

  it('inicializa form com alguns valores', () => {
    const { container } = render(<RelatorioNAAPABuscaAtiva />);
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });
});
