import React from 'react';
import { render, screen } from '@testing-library/react';
import { TagDataUltimaConsolidacao } from './index';

// Mock do antd Tag
jest.mock('antd', () => ({
  Tag: ({ children, ...props }) => (
    <div data-testid="tag" {...props}>
      {children}
    </div>
  ),
}));

// Mock do Base (cores)
jest.mock('~/componentes', () => ({
  Base: {
    Roxo: '#a020f0',
    Branco: '#fff',
  },
}));

// Mock do dayjs
jest.mock('dayjs', () => date => ({
  format: fmt => `mock-format(${date})`,
}));

describe('TagDataUltimaConsolidacao', () => {
  it('não renderiza nada se data for vazia', () => {
    const { container } = render(<TagDataUltimaConsolidacao data="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza o Tag com data formatada e titulo padrão', () => {
    render(<TagDataUltimaConsolidacao data="2024-05-20T12:34:00" />);
    const tag = screen.getByTestId('tag');
    expect(tag).toBeInTheDocument();
    expect(tag).toHaveTextContent(
      'Data da última atualização: mock-format(2024-05-20T12:34:00)'
    );
    expect(tag).toHaveStyle('background-color: #a020f0');
    expect(tag).toHaveStyle('color: #fff');
  });

  it('renderiza o Tag com titulo customizado', () => {
    render(
      <TagDataUltimaConsolidacao
        data="2024-05-20T12:34:00"
        titulo="Atualizado em:"
      />
    );
    expect(screen.getByText(/Atualizado em:/)).toBeInTheDocument();
  });
});
