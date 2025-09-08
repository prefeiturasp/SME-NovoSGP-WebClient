import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LazyLoad from './index';

jest.mock('~/componentes', () => ({
  Loader: jest.fn(({ loading, tip }) => (
    <div>{loading && <span>{tip}</span>}</div>
  )),
}));

describe('LazyLoad Component', () => {
  it('should render the fallback loader initially', () => {
    const LazyChild = React.lazy(() => new Promise(() => {}));
    render(
      <LazyLoad>
        <LazyChild />
      </LazyLoad>
    );
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('should render children when loaded', async () => {
    const LazyChild = React.lazy(() =>
      Promise.resolve({
        default: () => <div>Loaded Content</div>,
      })
    );

    render(
      <LazyLoad>
        <LazyChild />
      </LazyLoad>
    );

    const loadedContent = await screen.findByText('Loaded Content');
    expect(loadedContent).toBeInTheDocument();
  });

  it('should render children directly if not lazy-loaded', () => {
    const ChildComponent = () => <div>Direct Content</div>;
    render(
      <LazyLoad>
        <ChildComponent />
      </LazyLoad>
    );
    expect(screen.getByText('Direct Content')).toBeInTheDocument();
  });

  it('should match the snapshot', () => {
    const { container } = render(
      <LazyLoad>
        <div>Snapshot Test</div>
      </LazyLoad>
    );
    expect(container).toMatchSnapshot();
  });
});
