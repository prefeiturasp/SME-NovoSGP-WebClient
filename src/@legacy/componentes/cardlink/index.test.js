import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CardLink from './index';

describe('CardLink', () => {
  test('deve renderizar corretamente com as propriedades padrão', () => {
    render(
      <BrowserRouter>
        <CardLink />
      </BrowserRouter>
    );

    expect(screen.getByText('Insira a label')).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  test('deve aplicar a classe "col-lg-3" por padrão', () => {
    render(
      <BrowserRouter>
        <CardLink />
      </BrowserRouter>
    );

    const linkParent = screen.getByRole('link').parentElement;
    expect(linkParent).toHaveClass('col-lg-3');
  });

  test('deve aplicar as classes de colunas corretamente', () => {
    const cols = [4, 6, 8, 12];
    render(
      <BrowserRouter>
        <CardLink cols={cols} />
      </BrowserRouter>
    );

    const linkParent = screen.getByRole('link').parentElement;
    expect(linkParent).toHaveClass('col-lg-4 col-md-6 col-sm-8 col-xs-12');
  });

  test('deve aplicar a classe "not-allowed" no cursor quando o componente estiver desabilitado', () => {
    render(
      <BrowserRouter>
        <CardLink disabled />
      </BrowserRouter>
    );

    const link = screen.getByText('Insira a label').closest('a');
    const linkParent = link?.parentElement;

    if (linkParent) {
      expect(linkParent).toHaveStyle('cursor: not-allowed');
    }
  });

  xtest('deve aplicar a cor de fundo e o ícone corretamente quando desabilitado', () => {
    render(
      <BrowserRouter>
        <CardLink disabled label="Link Desabilitado" icone="fa fa-times" />
      </BrowserRouter>
    );

    const link = screen.getByText('Link Desabilitado').closest('a');

    const linkParent = link?.parentElement;

    if (linkParent) {
      expect(linkParent).toHaveStyle('cursor: not-allowed');
    }

    expect(screen.getByText('Link Desabilitado')).toBeInTheDocument();

    const icon = link?.querySelector('i');

    if (icon) {
      expect(icon).toHaveClass('fa-times');
    } else {
      throw new Error('Ícone não encontrado dentro do link');
    }
  });

  test('deve renderizar a URL corretamente quando fornecida', () => {
    render(
      <BrowserRouter>
        <CardLink url="https://www.example.com" />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://www.example.com');
  });

  test('deve renderizar a URL padrão como "/" se não for fornecida', () => {
    render(
      <BrowserRouter>
        <CardLink />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });
});
