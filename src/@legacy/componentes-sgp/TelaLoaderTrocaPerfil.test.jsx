import { render, screen } from '@testing-library/react';
import TelaLoaderTrocaPerfil from './TelaLoaderTrocaPerfil';

jest.mock('../componentes/loader', () => props => (
  <div data-testid="loader" />
));

describe('TelaLoaderTrocaPerfil', () => {
  it('renderiza mensagem de aguarde', () => {
    render(<TelaLoaderTrocaPerfil />);
    expect(screen.getByText('Aguarde um momento!')).toBeInTheDocument();
  });

  it('renderiza mensagem de carregamento', () => {
    render(<TelaLoaderTrocaPerfil />);
    expect(
      screen.getByText('Estamos carregando as informações do perfil...')
    ).toBeInTheDocument();
  });

  it('renderiza o loader', () => {
    render(<TelaLoaderTrocaPerfil />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
