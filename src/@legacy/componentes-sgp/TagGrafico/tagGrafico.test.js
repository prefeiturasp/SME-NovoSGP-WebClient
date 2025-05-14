import React from 'react';
import { render, screen } from '@testing-library/react';
import TagGrafico from './tagGrafico';

jest.mock('./tagGrafico.css', () => ({
  ContainerTagGrafico: ({ children }) => (
    <div data-testid="container-tag-grafico">{children}</div>
  ),
}));

describe('TagGrafico', () => {
  it('não renderiza nada se valor for vazio', () => {
    const { container } = render(<TagGrafico />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza valor corretamente', () => {
    render(<TagGrafico valor="42" />);
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByTestId('container-tag-grafico')).toBeInTheDocument();
  });

  it('renderiza valor e descricao', () => {
    render(<TagGrafico valor="99" descricao="Alunos" />);
    expect(screen.getByText('99')).toBeInTheDocument();
    expect(screen.getByText('Alunos')).toBeInTheDocument();
  });

  it('não renderiza descricao se não for passada', () => {
    render(<TagGrafico valor="100" />);
    expect(screen.queryByText('Alunos')).not.toBeInTheDocument();
  });
});
