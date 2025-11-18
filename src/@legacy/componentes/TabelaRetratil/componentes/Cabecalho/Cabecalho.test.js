import { render, screen, fireEvent } from '@testing-library/react';
import Cabecalho from './index';
import {
  SGP_BUTTON_EXPANDIR_RETRAIR_TABELA_RETRATIL,
  SGP_BUTTON_ANTERIOR_TABELA_RETRATIL,
  SGP_BUTTON_PROXIMO_TABELA_RETRATIL,
} from '~/constantes/ids/button';

jest.mock('antd', () => ({
  Tooltip: ({ title, children }) => (
    <div data-testid="tooltip" data-title={title}>
      {children}
    </div>
  ),
}));

jest.mock('~/componentes', () => ({
  Button: ({ id, label, onClick, disabled }) => (
    <button data-testid={id} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  ),
  Colors: { Roxo: 'purple' },
}));

describe('Componente Cabecalho', () => {
  const onCollapse = jest.fn();
  const onAnterior = jest.fn();
  const onProximo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar com título padrão e botões', () => {
    const { container } = render(
      <Cabecalho
        onClickCollapse={onCollapse}
        onClickAnterior={onAnterior}
        onClickProximo={onProximo}
      />
    );
    expect(screen.getByText('Sem título')).toBeInTheDocument();

    const collapseSpan = container.querySelector(
      `#${SGP_BUTTON_EXPANDIR_RETRAIR_TABELA_RETRATIL}`
    );
    expect(collapseSpan).toBeInTheDocument();
    expect(
      screen.getByTestId(SGP_BUTTON_ANTERIOR_TABELA_RETRATIL)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(SGP_BUTTON_PROXIMO_TABELA_RETRATIL)
    ).toBeInTheDocument();
  });

  it('deve chamar o onClickCollapse ao clicar e pressionar Enter', () => {
    const { container } = render(
      <Cabecalho
        onClickCollapse={onCollapse}
        onClickAnterior={onAnterior}
        onClickProximo={onProximo}
      />
    );

    const collapseSpan = container.querySelector(
      `#${SGP_BUTTON_EXPANDIR_RETRAIR_TABELA_RETRATIL}`
    );

    fireEvent.click(collapseSpan);
    expect(onCollapse).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(collapseSpan, { keyCode: 13 });
    expect(onCollapse).toHaveBeenCalledTimes(2);
  });

  it('deve chamar os callbacks de anterior e próximo', () => {
    render(
      <Cabecalho
        onClickCollapse={onCollapse}
        onClickAnterior={onAnterior}
        onClickProximo={onProximo}
      />
    );

    fireEvent.click(screen.getByTestId(SGP_BUTTON_ANTERIOR_TABELA_RETRATIL));
    fireEvent.click(screen.getByTestId(SGP_BUTTON_PROXIMO_TABELA_RETRATIL));

    expect(onAnterior).toHaveBeenCalled();
    expect(onProximo).toHaveBeenCalled();
  });

  it('deve desabilitar os botões quando props de disable forem true', () => {
    render(
      <Cabecalho
        onClickCollapse={onCollapse}
        onClickAnterior={onAnterior}
        onClickProximo={onProximo}
        desabilitarAnterior
        desabilitarProximo
      />
    );

    expect(
      screen.getByTestId(SGP_BUTTON_ANTERIOR_TABELA_RETRATIL)
    ).toBeDisabled();
    expect(
      screen.getByTestId(SGP_BUTTON_PROXIMO_TABELA_RETRATIL)
    ).toBeDisabled();
  });

  it('deve renderizar o texto correto no tooltip quando retraído', () => {
    render(
      <Cabecalho
        retraido
        onClickCollapse={onCollapse}
        onClickAnterior={onAnterior}
        onClickProximo={onProximo}
      />
    );

    expect(screen.getByTestId('tooltip')).toHaveAttribute(
      'data-title',
      'Expandir alunos'
    );
  });

  it('deve renderizar o texto correto no tooltip quando expandido', () => {
    render(
      <Cabecalho
        retraido={false}
        onClickCollapse={onCollapse}
        onClickAnterior={onAnterior}
        onClickProximo={onProximo}
      />
    );

    expect(screen.getByTestId('tooltip')).toHaveAttribute(
      'data-title',
      'Retrair alunos'
    );
  });

  it('deve adicionar a classe retraido quando retraído for true', () => {
    const { container } = render(
      <Cabecalho
        retraido
        onClickCollapse={onCollapse}
        onClickAnterior={onAnterior}
        onClickProximo={onProximo}
      />
    );

    const collapseSpan = container.querySelector(
      `#${SGP_BUTTON_EXPANDIR_RETRAIR_TABELA_RETRATIL}`
    );

    expect(collapseSpan.className).toContain('retraido');
  });

  it('deve ter os propTypes definidos corretamente', () => {
    expect(Cabecalho.propTypes).toBeDefined();
    expect(Cabecalho.defaultProps).toBeDefined();
  });

  it('não deve chamar o onClickCollapse se não for Enter', () => {
    const { container } = render(
      <Cabecalho
        onClickCollapse={onCollapse}
        onClickAnterior={onAnterior}
        onClickProximo={onProximo}
      />
    );

    const collapseSpan = container.querySelector(
      `#${SGP_BUTTON_EXPANDIR_RETRAIR_TABELA_RETRATIL}`
    );

    fireEvent.keyDown(collapseSpan, { keyCode: 65 });
    expect(onCollapse).not.toHaveBeenCalled();
  });

  it('não quebra quando o evento não tem keyCode', () => {
    const { container } = render(
      <Cabecalho
        onClickCollapse={onCollapse}
        onClickAnterior={onAnterior}
        onClickProximo={onProximo}
      />
    );

    const collapseSpan = container.querySelector(
      `#${SGP_BUTTON_EXPANDIR_RETRAIR_TABELA_RETRATIL}`
    );

    fireEvent.keyDown(collapseSpan, {});
    expect(onCollapse).not.toHaveBeenCalled();
  });
});
