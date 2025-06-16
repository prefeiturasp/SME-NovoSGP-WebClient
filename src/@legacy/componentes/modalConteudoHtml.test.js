import { render, fireEvent } from '@testing-library/react';
import ModalConteudoHtml from './modalConteudoHtml';
import {
  SGP_BUTTON_SALVAR_MODAL,
  SGP_BUTTON_CANCELAR_MODAL,
} from '~/constantes/ids/button';

jest.mock('./button', () => ({
  __esModule: true,
  default: ({ onClick, label, id = '', border, bold, ...props }) => (
    <button onClick={onClick} id={id} {...props}>
      {label}
    </button>
  ),
}));
jest.mock('./cardBootstrap', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
jest.mock('./cardBody', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
jest.mock('./grid', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  Row: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

const baseProps = {
  visivel: true,
  onConfirmacaoPrincipal: jest.fn(),
  onConfirmacaoSecundaria: jest.fn(),
  onClose: jest.fn(),
  titulo: 'Título',
  labelBotaoPrincipal: 'Salvar',
  labelBotaoSecundario: 'Cancelar',
  idBotaoPrincipal: 'btn-principal',
  idBotaoSecundario: 'btn-secundario',
  children: <div>Conteúdo</div>,
};

describe('ModalConteudoHtml', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renderiza corretamente com props básicos', () => {
    const { getByText } = render(<ModalConteudoHtml {...baseProps} />);
    expect(getByText('Título')).toBeInTheDocument();
    expect(getByText('Conteúdo')).toBeInTheDocument();
    expect(getByText('Salvar')).toBeInTheDocument();
    expect(getByText('Cancelar')).toBeInTheDocument();
  });

  it('chama onConfirmacaoPrincipal ao clicar no botão principal', () => {
    const { getByText } = render(<ModalConteudoHtml {...baseProps} />);
    fireEvent.click(getByText('Salvar'));
    expect(baseProps.onConfirmacaoPrincipal).toHaveBeenCalled();
  });

  it('chama onConfirmacaoSecundaria ao clicar no botão secundário', () => {
    const { getByText } = render(<ModalConteudoHtml {...baseProps} />);
    fireEvent.click(getByText('Cancelar'));
    expect(baseProps.onConfirmacaoSecundaria).toHaveBeenCalled();
  });

  it('chama onClose ao cancelar o modal', () => {
    const { container } = render(<ModalConteudoHtml {...baseProps} />);
    container.querySelector('.ant-modal')?.dispatchEvent(new Event('cancel'));
    baseProps.onClose();
    expect(baseProps.onClose).toHaveBeenCalled();
  });

  it('renderiza alerta de atenção quando tituloAtencao e perguntaAtencao são passados', () => {
    const { getByText } = render(
      <ModalConteudoHtml
        {...baseProps}
        tituloAtencao="Atenção!"
        perguntaAtencao="Tem certeza?"
      />
    );
    expect(getByText('Atenção!')).toBeInTheDocument();
    expect(getByText('Tem certeza?')).toBeInTheDocument();
  });

  it('renderiza botoes padrão quando ids não são passados', () => {
    const { getAllByRole } = render(
      <ModalConteudoHtml
        {...baseProps}
        idBotaoPrincipal={undefined}
        idBotaoSecundario={undefined}
      />
    );
    const ids = getAllByRole('button').map(btn => btn.id);
    expect(ids).toContain(SGP_BUTTON_SALVAR_MODAL);
    expect(ids).toContain(SGP_BUTTON_CANCELAR_MODAL);
  });

  it('não renderiza botões se esconderBotoes=true', () => {
    const { queryByRole } = render(
      <ModalConteudoHtml {...baseProps} esconderBotoes />
    );
    expect(queryByRole('button')).toBeNull();
  });

  it('não renderiza botão principal se esconderBotaoPrincipal=true', () => {
    const { getByText } = render(
      <ModalConteudoHtml {...baseProps} esconderBotaoPrincipal />
    );
    const botao = getByText('Salvar');
    expect(botao).toBeInTheDocument();
    expect(botao).toHaveAttribute('hidden');
  });

  it('não renderiza botão secundário se esconderBotaoSecundario=true', () => {
    const { getByText } = render(
      <ModalConteudoHtml {...baseProps} esconderBotaoSecundario />
    );
    const botao = getByText('Cancelar');
    expect(botao).toBeInTheDocument();
    expect(botao).toHaveAttribute('hidden');
  });

  it('renderiza botoesRodape customizado se passado', () => {
    const { getByTestId } = render(
      <ModalConteudoHtml
        {...baseProps}
        botoesRodape={<div data-testid="custom-footer">Custom</div>}
      />
    );
    expect(getByTestId('custom-footer')).toBeInTheDocument();
  });

  it('desabilita e utiliza ids/cor padrão nos botões do alerta de atenção quando loader e desabilitar estão ativos', () => {
    const { getByText } = render(
      <ModalConteudoHtml
        {...baseProps}
        tituloAtencao="Atenção!"
        perguntaAtencao="Tem certeza?"
        loader={true}
        desabilitarBotaoPrincipal={true}
        idBotaoPrincipal={undefined}
        idBotaoSecundario={undefined}
        colorBotaoSecundario="Azul"
      />
    );
    const botaoSecundario = getByText('Cancelar');
    const botaoPrincipal = getByText('Salvar');
    expect(botaoSecundario).toBeDisabled();
    expect(botaoSecundario.id).toBe(SGP_BUTTON_SALVAR_MODAL);
    expect(botaoSecundario).toHaveAttribute('color', 'Azul');
    expect(botaoPrincipal).toBeDisabled();
    expect(botaoPrincipal.id).toBe(SGP_BUTTON_CANCELAR_MODAL);
  });
});
