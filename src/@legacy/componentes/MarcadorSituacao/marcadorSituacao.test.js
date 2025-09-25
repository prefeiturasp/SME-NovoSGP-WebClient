import React from 'react';
import { render, screen } from '@testing-library/react';
import MarcadorSituacao from './marcadorSituacao';

jest.mock('./marcadorSituacao.css', () => ({
  Container: ({ children, corFundo, corTexto }) => (
    <div
      data-testid="container"
      data-corfundo={corFundo}
      data-cortexto={corTexto}
    >
      {children}
    </div>
  ),
}));
jest.mock('~/componentes/colors', () => ({
  Colors: {
    Roxo: '#800080',
    Branco: '#fff',
    Vermelho: '#f00',
    Verde: '#0f0',
  },
}));

describe('MarcadorSituacao', () => {
  it('renderiza com valores padrão', () => {
    render(<MarcadorSituacao>Texto padrão</MarcadorSituacao>);
    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('data-corfundo', '#800080');
    expect(container).toHaveAttribute('data-cortexto', '#fff');
    expect(container).toHaveTextContent('Texto padrão');
  });

  it('renderiza com corFundo e corTexto customizados', () => {
    render(
      <MarcadorSituacao corFundo="#f00" corTexto="#0f0">
        Situação customizada
      </MarcadorSituacao>
    );
    const container = screen.getByTestId('container');
    expect(container).toHaveAttribute('data-corfundo', '#f00');
    expect(container).toHaveAttribute('data-cortexto', '#0f0');
    expect(container).toHaveTextContent('Situação customizada');
  });

  it('renderiza sem children', () => {
    render(<MarcadorSituacao />);
    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });
});
