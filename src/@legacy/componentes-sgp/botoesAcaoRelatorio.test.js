import { render, fireEvent } from '@testing-library/react';
import BotoesAcaoRelatorio from './botoesAcaoRelatorio';

jest.mock('antd', () => ({
  Row: ({ children }) => <div>{children}</div>,
  Col: ({ children }) => <div>{children}</div>,
}));
jest.mock('~/componentes/button', () => props => {
  const { border, bold, ...rest } = props;
  return (
    <button data-testid={`btn-${props.label}`} {...rest}>
      {props.label}
    </button>
  );
});
jest.mock('~/componentes/loader', () => ({ children }) => (
  <div data-testid="loader">{children}</div>
));
jest.mock('~/componentes/colors', () => ({
  Colors: { Roxo: 'purple', Azul: 'blue' },
}));
jest.mock('./BotoesAcaoPadrao/botaoVoltarPadrao', () => ({ onClick }) => (
  <button data-testid="btn-voltar" onClick={onClick}>
    Voltar
  </button>
));

describe('BotoesAcaoRelatorio', () => {
  it('chama voltar e cancelar', () => {
    const onClickVoltar = jest.fn();
    const onClickCancelar = jest.fn();
    const { getByTestId } = render(
      <BotoesAcaoRelatorio
        onClickVoltar={onClickVoltar}
        onClickCancelar={onClickCancelar}
        modoEdicao
      />
    );
    fireEvent.click(getByTestId('btn-voltar'));
    fireEvent.click(getByTestId('btn-Cancelar'));
    expect(onClickVoltar).toHaveBeenCalled();
    expect(onClickCancelar).toHaveBeenCalled();
  });

  it('desabilita Cancelar quando não está em edição', () => {
    const { getByTestId } = render(
      <BotoesAcaoRelatorio onClickCancelar={jest.fn()} modoEdicao={false} />
    );
    expect(getByTestId('btn-Cancelar')).toBeDisabled();
  });

  it('exibe botão Gerar e chama onClickGerar', () => {
    const onClickGerar = jest.fn();
    const { getByTestId } = render(
      <BotoesAcaoRelatorio onClickGerar={onClickGerar} />
    );
    fireEvent.click(getByTestId('btn-Gerar'));
    expect(onClickGerar).toHaveBeenCalled();
  });

  it('não exibe Gerar quando exibirBotaoImpressao=false', () => {
    const { queryByTestId } = render(
      <BotoesAcaoRelatorio exibirBotaoImpressao={false} />
    );
    expect(queryByTestId('btn-Gerar')).not.toBeInTheDocument();
  });

  it('usa Loader quando temLoaderBtnGerar', () => {
    const { getByTestId } = render(
      <BotoesAcaoRelatorio temLoaderBtnGerar carregandoGerar />
    );
    expect(getByTestId('loader')).toBeInTheDocument();
    expect(getByTestId('btn-Gerar')).toBeInTheDocument();
  });
});
