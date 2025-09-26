import { render, screen, waitFor } from '@testing-library/react';
import TabelaIndicadoresPap from './TabelaIndicadoresPap';

jest.mock('~/servicos/InformacoesEducacionais/ServicoPap', () => ({
  obterIndicadoresPap: jest.fn().mockResolvedValue({ data: [] }),
}));

jest.mock('~/servicos/alertas', () => ({
  erros: jest.fn(),
}));

jest.mock('./tabelaIndicadoresPapDetalhes', () => () => <div>Mock Tabela</div>);

jest.mock('@ckeditor/ckeditor5-react', () => ({
  default: () => <textarea data-testid="ckeditor-mock" />,
}));

jest.mock('@ckeditor/ckeditor5-build-classic', () => ({
  default: class MockEditor {},
}));

global.api = {
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
};

describe('TabelaIndicadoresPap', () => {
  it('deve renderizar sem erros', () => {
    render(<TabelaIndicadoresPap codigoDre="123" codigoUe="456" />);

    expect(screen.getByText(/Carregando/)).toBeInTheDocument();
  });

  it('deve sair do estado de loading', async () => {
    render(<TabelaIndicadoresPap codigoDre="123" codigoUe="456" />);

    expect(
      screen.getByText('Carregando indicadores PAP...')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText('Carregando indicadores PAP...')
      ).not.toBeInTheDocument();
    });
  });

  it('deve exibir o título após carregar', async () => {
    render(<TabelaIndicadoresPap codigoDre="123" codigoUe="456" />);

    expect(
      await screen.findByText('Projeto de Apoio Pedagógico (PAP)')
    ).toBeInTheDocument();
  });
});
