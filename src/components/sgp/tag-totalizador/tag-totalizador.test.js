import React from 'react';
import { render, screen } from '@testing-library/react';
import { TagDescricao } from './index';

jest.mock('antd', () => ({
  Tag: ({ children, ...props }) => (
    <div data-testid="tag" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('~/componentes', () => ({
  Base: {
    Roxo: '#800080',
    Branco: '#fff',
  },
}));

describe('TagDescricao', () => {
  it('não renderiza nada se descricao for vazia', () => {
    const { container } = render(<TagDescricao descricao="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza o Tag com a descricao e estilos corretos', () => {
    render(<TagDescricao descricao="Minha descrição" />);
    const tag = screen.getByTestId('tag');
    expect(tag).toBeInTheDocument();
    expect(tag).toHaveTextContent('Minha descrição');
    expect(tag).toHaveStyle({
      backgroundColor: '#800080',
      color: '#fff',
      padding: '0px 5px',
      fontWeight: '700',
      border: 'solid 0.5px #800080',
    });
  });

  it('renderiza corretamente se descricao for passada como undefined (default)', () => {
    const { container } = render(<TagDescricao />);
    expect(container).toBeEmptyDOMElement();
  });
});
