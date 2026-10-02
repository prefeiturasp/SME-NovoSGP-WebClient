import { render } from '@testing-library/react';
import MarcadorTriangulo from './marcadorTriangulo';

jest.mock('./marcadorTriangulo.css.js', () => ({
  Container: ({ cor, ...rest }) => (
    <div data-testid="marcador" data-cor={cor} {...rest} />
  ),
}));
jest.mock('./marcadorTriangulo.css', () => ({
  Container: ({ cor, ...rest }) => (
    <div data-testid="marcador" data-cor={cor} {...rest} />
  ),
}));

describe('MarcadorTriangulo', () => {
  it('usa cor padrão quando corFundo não é informada', () => {
    const { getByTestId } = render(<MarcadorTriangulo />);
    expect(getByTestId('marcador')).toBeInTheDocument();
  });

  it('repassa corFundo para o container', () => {
    const { getByTestId } = render(<MarcadorTriangulo corFundo="#ff0000" />);
    expect(getByTestId('marcador')).toHaveAttribute('data-cor', '#ff0000');
  });
});
