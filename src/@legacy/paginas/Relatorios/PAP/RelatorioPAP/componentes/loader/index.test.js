import { render } from '@testing-library/react';
import LoaderRelatorioPAP from './index';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('~/componentes', () => ({
  Loader: ({ loading, children }) => (
    <div data-testid="loader" data-loading={loading ? 'true' : 'false'}>
      {children}
    </div>
  ),
}));

import { useSelector } from 'react-redux';

describe('LoaderRelatorioPAP', () => {
  it('renderiza Loader com loading=true quando exibirLoaderRelatorioPAP é true', () => {
    useSelector.mockImplementation(() => true);
    const { getByTestId } = render(
      <LoaderRelatorioPAP>conteudo</LoaderRelatorioPAP>
    );
    expect(getByTestId('loader')).toHaveAttribute('data-loading', 'true');
    expect(getByTestId('loader')).toHaveTextContent('conteudo');
  });

  it('renderiza Loader com loading=false quando exibirLoaderRelatorioPAP é false', () => {
    useSelector.mockImplementation(() => false);
    const { getByTestId } = render(
      <LoaderRelatorioPAP>conteudo</LoaderRelatorioPAP>
    );
    expect(getByTestId('loader')).toHaveAttribute('data-loading', 'false');
    expect(getByTestId('loader')).toHaveTextContent('conteudo');
  });
});
