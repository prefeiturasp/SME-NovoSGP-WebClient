import { render } from '@testing-library/react';
import Conteudo from './conteudo';

jest.mock('./breadcrumb-sgp', () => () => (
  <div data-testid="breadcrumb">Breadcrumb</div>
));
jest.mock('./mensagens/mensagens', () => () => (
  <div data-testid="mensagens">Mensagens</div>
));
jest.mock('./modalConfirmacao', () => () => (
  <div data-testid="modal-confirmacao">Modal</div>
));
jest.mock('./tempoExpiracaoSessao/tempoExpiracaoSessao', () => () => (
  <div data-testid="expiracao">Expiracao</div>
));
jest.mock('./versao', () => () => <div data-testid="versao">Versao</div>);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="outlet">Outlet</div>,
}));

describe('Conteudo', () => {
  it('renderiza todos os componentes principais', () => {
    const { getByTestId, container } = render(<Conteudo />);
    expect(getByTestId('breadcrumb')).toBeInTheDocument();
    expect(getByTestId('mensagens')).toBeInTheDocument();
    expect(getByTestId('modal-confirmacao')).toBeInTheDocument();
    expect(getByTestId('expiracao')).toBeInTheDocument();
    expect(getByTestId('versao')).toBeInTheDocument();
    expect(getByTestId('outlet')).toBeInTheDocument();
    expect(container.querySelector('.secao-conteudo')).toBeInTheDocument();
  });

  it('não quebra se algum filho retornar null', () => {
    jest.mock('./mensagens/mensagens', () => () => null);
    const { container } = render(<Conteudo />);
    expect(container.querySelector('.secao-conteudo')).toBeInTheDocument();
  });
});
