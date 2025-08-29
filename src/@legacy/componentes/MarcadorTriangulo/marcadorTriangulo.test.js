import React from 'react';
import { render } from '@testing-library/react';
import MarcadorTriangulo from './marcadorTriangulo';
import { Base } from '~/componentes/colors';

describe('MarcadorTriangulo', () => {
  it('deve renderizar com a cor padrão', () => {
    const { container } = render(<MarcadorTriangulo />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('deve renderizar com uma cor personalizada', () => {
    const { container } = render(<MarcadorTriangulo corFundo="red" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('deve aceitar props adicionais', () => {
    const { getByTestId } = render(
      <MarcadorTriangulo data-testid="triangulo" />
    );
    expect(getByTestId('triangulo')).toBeInTheDocument();
  });
});
