import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImagemEstudanteObjectCard from './imagemEstudanteObjectCard';
import ServicoImagemEstudante from '~/servicos/Componentes/ServicoImagemEstudante';
import { erros } from '~/servicos';

jest.mock('~/servicos/Componentes/ServicoImagemEstudante', () => ({
  obterImagemEstudante: jest.fn(),
}));
jest.mock('~/servicos', () => ({ erros: jest.fn() }));
jest.mock('./modalTrocarImagem', () => jest.fn(() => <div>ModalMock</div>));
jest.mock('~/componentes/loader', () => ({ children }) => (
  <div>{children}</div>
));

describe('ImagemEstudanteObjectCard', () => {
  const codigoEOL = '123';
  const dadosResposta = {
    data: {
      codigo: '123',
      download: {
        item1: 'base64string',
        item2: 'image/png',
        item3: 'foto.png',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama a função de erros quando a chamada da API falha', async () => {
    const erro = new Error('Erro na API');
    ServicoImagemEstudante.obterImagemEstudante.mockRejectedValue(erro);

    render(<ImagemEstudanteObjectCard codigoEOL={codigoEOL} />);

    await waitFor(() => {
      expect(erros).toHaveBeenCalledWith(erro);
    });
  });

  it('abre o modal ao clicar em "Alterar imagem" quando tem permissão', async () => {
    ServicoImagemEstudante.obterImagemEstudante.mockResolvedValue(
      dadosResposta
    );

    render(
      <ImagemEstudanteObjectCard
        codigoEOL={codigoEOL}
        permiteAlterarImagem={true}
      />
    );
    const botaoAlterarImagem = await screen.findByText('Alterar imagem');

    await userEvent.click(botaoAlterarImagem);

    expect(screen.getByText('ModalMock')).toBeInTheDocument();
  });

  it('não chama obterImagemEstudante quando codigoEOL não é fornecido', () => {
    render(<ImagemEstudanteObjectCard codigoEOL={undefined} />);
    expect(ServicoImagemEstudante.obterImagemEstudante).not.toHaveBeenCalled();
  });

  it('não exibe a opção de alterar imagem quando permiteAlterarImagem é false', async () => {
    ServicoImagemEstudante.obterImagemEstudante.mockResolvedValue(
      dadosResposta
    );

    render(
      <ImagemEstudanteObjectCard
        codigoEOL={codigoEOL}
        permiteAlterarImagem={false}
      />
    );

    const botaoAlterarImagem = screen.queryByText('Alterar imagem');

    expect(botaoAlterarImagem).not.toBeInTheDocument();
  });
});
