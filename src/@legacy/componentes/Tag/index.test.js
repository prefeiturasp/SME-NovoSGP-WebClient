import { render, screen } from '@testing-library/react';

jest.mock('./styles', () => ({
  TagEstilo: ({ children, className, tipo }) => (
    <div data-testid="tag-estilo" data-classname={className} data-tipo={tipo}>
      {children}
    </div>
  ),
}));
jest.mock('antd', () => ({
  Tag: ({ children, ...rest }) => (
    <span data-testid="ant-tag" {...rest}>
      {children}
    </span>
  ),
}));

import Tag from './index';

describe('Tag', () => {
  it('renderiza com valores padrão', () => {
    render(<Tag>Texto padrão</Tag>);
    const estilo = screen.getByTestId('tag-estilo');
    const antTag = screen.getByTestId('ant-tag');
    expect(estilo).toBeInTheDocument();
    expect(estilo).toHaveAttribute('data-classname', 'pequeno false false');
    expect(estilo).toHaveAttribute('data-tipo', 'basico');
    expect(antTag).toHaveTextContent('Texto padrão');
  });

  it('renderiza com props customizados', () => {
    render(
      <Tag tipo="erro" tamanho="grande" fluido centralizado>
        Customizado
      </Tag>
    );
    const estilo = screen.getByTestId('tag-estilo');
    expect(estilo).toHaveAttribute(
      'data-classname',
      'grande fluido centralizado'
    );
    expect(estilo).toHaveAttribute('data-tipo', 'erro');
    expect(screen.getByTestId('ant-tag')).toHaveTextContent('Customizado');
  });

  it('renderiza sem children', () => {
    render(<Tag />);
    expect(screen.getByTestId('ant-tag')).toBeEmptyDOMElement();
  });

  it('passa props adicionais para AntTag', () => {
    render(<Tag data-extra="teste">Extra</Tag>);
    expect(screen.getByTestId('ant-tag')).toHaveAttribute(
      'data-extra',
      'teste'
    );
  });
});
