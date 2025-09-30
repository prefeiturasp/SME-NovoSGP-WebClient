import { render, screen, waitFor, act } from '@testing-library/react';
import { useSelector } from 'react-redux';
import ModalTrocarImagem from './modalTrocarImagem';
import ServicoArmazenamento from '~/servicos/Componentes/ServicoArmazenamento';
import ServicoImagemEstudante from '~/servicos/Componentes/ServicoImagemEstudante';
import { getBase64DataURL } from '~/utils';
import { erros, sucesso } from '~/servicos';

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('~/servicos/Componentes/ServicoArmazenamento');
jest.mock('~/servicos/Componentes/ServicoImagemEstudante');
jest.mock('~/utils');
jest.mock('~/servicos', () => ({
  erros: jest.fn(),
  sucesso: jest.fn(),
}));

jest.mock('~/componentes/loader', () => ({ children }) => <>{children}</>);
jest.mock('~/componentes-sgp/UploadImagens/uploadImagens', () =>
  jest.fn(() => <div>UploadImagensMock</div>)
);

jest.mock('~/componentes', () => ({
  ModalConteudoHtml: jest.fn(({ children, visivel, onClose }) =>
    visivel ? (
      <div data-testid="modal-conteudo-html">
        <button data-testid="modal-close-button" onClick={onClose}>
          Fechar
        </button>
        {children}
      </div>
    ) : null
  ),
  Base: {
    CinzaBotao: '#A8A8A8',
  },
}));

describe('ModalTrocarImagem', () => {
  const mockOnCloseModal = jest.fn();
  const codigoEOL = '12345';
  const dadosImagemInicial = { uid: 'uid-inicial', name: 'foto.png' };

  const mockRespostaDownload = {
    data: 'dados-binarios',
    headers: { 'content-type': 'image/png' },
  };
  const mockBase64Url = 'data:image/png;base64,mock-base64-string';

  beforeEach(() => {
    jest.clearAllMocks();

    useSelector.mockReturnValue({ confirmacao: { visivel: false } });

    ServicoArmazenamento.obterArquivoParaDownload.mockResolvedValue(
      mockRespostaDownload
    );
    ServicoImagemEstudante.excluirImagemEstudante.mockResolvedValue({
      data: true,
    });
    getBase64DataURL.mockResolvedValue(mockBase64Url);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('não deve renderizar nada se exibirModal for false', () => {
    const { container } = render(<ModalTrocarImagem exibirModal={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('deve renderizar o modal quando exibirModal for true', () => {
    render(<ModalTrocarImagem exibirModal />);
    expect(screen.getByTestId('modal-conteudo-html')).toBeInTheDocument();
  });

  it('deve buscar e exibir a imagem inicial ao abrir o modal', async () => {
    render(<ModalTrocarImagem exibirModal dadosImagem={dadosImagemInicial} />);
    await waitFor(() => {
      expect(
        ServicoArmazenamento.obterArquivoParaDownload
      ).toHaveBeenCalledWith('uid-inicial');
      expect(getBase64DataURL).toHaveBeenCalledWith(
        'dados-binarios',
        'image/png'
      );
    });
  });

  it('deve chamar a função de erros se a busca da imagem inicial falhar', async () => {
    const erro = new Error('Falha no download');
    ServicoArmazenamento.obterArquivoParaDownload.mockRejectedValue(erro);
    render(<ModalTrocarImagem exibirModal dadosImagem={dadosImagemInicial} />);
    await waitFor(() => {
      expect(erros).toHaveBeenCalledWith(erro);
    });
  });

  it('deve chamar onCloseModal com trocouImagem=true após uma troca de imagem', async () => {
    render(
      <ModalTrocarImagem
        exibirModal
        codigoEOL={codigoEOL}
        onCloseModal={mockOnCloseModal}
      />
    );

    const UploadImagens = require('~/componentes-sgp/UploadImagens/uploadImagens');
    const uploadImagensProps = UploadImagens.mock.calls[0][0];
    await act(async () => {
      uploadImagensProps.afterSuccessUpload('novo-uid');
    });

    const ModalConteudoHtml = require('~/componentes').ModalConteudoHtml;
    const lastModalCallIndex = ModalConteudoHtml.mock.calls.length - 1;
    const modalProps = ModalConteudoHtml.mock.calls[lastModalCallIndex][0];
    modalProps.onClose();

    expect(mockOnCloseModal).toHaveBeenCalledWith(true);
  });

  it('deve chamar a função para remover imagem e exibir sucesso', async () => {
    render(<ModalTrocarImagem exibirModal codigoEOL={codigoEOL} />);

    const UploadImagens = require('~/componentes-sgp/UploadImagens/uploadImagens');
    const uploadImagensProps = UploadImagens.mock.calls[0][0];
    await act(async () => {
      await uploadImagensProps.removerImagem();
    });

    await waitFor(() => {
      expect(
        ServicoImagemEstudante.excluirImagemEstudante
      ).toHaveBeenCalledWith(codigoEOL);
      expect(sucesso).toHaveBeenCalledWith('Imagem excluída com sucesso');
    });
  });

  it('deve chamar a função de erros se a remoção da imagem falhar', async () => {
    const erro = new Error('Falha ao excluir');
    ServicoImagemEstudante.excluirImagemEstudante.mockRejectedValue(erro);
    render(<ModalTrocarImagem exibirModal codigoEOL={codigoEOL} />);

    const UploadImagens = require('~/componentes-sgp/UploadImagens/uploadImagens');
    const uploadImagensProps = UploadImagens.mock.calls[0][0];
    await act(async () => {
      await uploadImagensProps.removerImagem();
    });

    await waitFor(() => {
      expect(erros).toHaveBeenCalledWith(erro);
    });
  });
});
