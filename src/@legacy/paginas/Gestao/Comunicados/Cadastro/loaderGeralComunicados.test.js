import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
import LoaderGeralComunicados from './LoaderGeralComunicados';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('~/componentes', () => ({
  Loader: jest.fn(({ children, loading }) => (
    <div data-testid="loader" data-loading={loading}>
      {children}
    </div>
  )),
}));

describe('LoaderGeralComunicados', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente quando loader está inativo e exibe children', () => {
    useSelector.mockReturnValue(false);

    render(
      <LoaderGeralComunicados>
        <span data-testid="child">Conteúdo</span>
      </LoaderGeralComunicados>
    );

    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
    expect(loader.dataset.loading).toBe('false');
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renderiza corretamente quando loader está ativo e quando não há children', () => {
    useSelector.mockReturnValue(true);

    render(<LoaderGeralComunicados>{null}</LoaderGeralComunicados>);

    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
    expect(loader.dataset.loading).toBe('true');
    expect(loader).toBeEmptyDOMElement();
  });
});
