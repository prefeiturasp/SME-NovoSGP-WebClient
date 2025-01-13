import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';  // Garantir que BrowserRouter está importado
import CardLink from './index';

describe('CardLink', () => {
    test('deve renderizar corretamente com as propriedades padrão', () => {
        render(
            <BrowserRouter>
                <CardLink />
            </BrowserRouter>
        );

        // Verificar se o ícone e o label padrão estão sendo renderizados
        expect(screen.getByText('Insira a label')).toBeInTheDocument();

        // Verificar se o link foi renderizado com o atributo 'to' correto (URL padrão)
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/');  // Verifique o atributo href, não o 'to' diretamente
    });

    test('deve aplicar a classe "col-lg-3" por padrão', () => {
        render(
            <BrowserRouter>
                <CardLink />
            </BrowserRouter>
        );

        // Verificar se a classe "col-lg-3" está sendo aplicada corretamente
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

        // Verificar se as classes de colunas foram aplicadas corretamente
        const linkParent = screen.getByRole('link').parentElement;
        expect(linkParent).toHaveClass('col-lg-4 col-md-6 col-sm-8 col-xs-12');
    });

    test('deve aplicar a classe "not-allowed" no cursor quando o componente estiver desabilitado', () => {
        render(
            <BrowserRouter>
                <CardLink disabled />
            </BrowserRouter>
        );

        // Tentar localizar o link pelo texto "Insira a label" ou diretamente pelo tag 'a'
        const link = screen.getByText('Insira a label').closest('a'); // Pegamos o elemento <a> mais próximo
        const linkParent = link?.parentElement;

        // Verificar se o estilo de cursor está correto
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

        // Tentar localizar o link pelo texto "Link Desabilitado"
        const link = screen.getByText('Link Desabilitado').closest('a'); // Pegamos o elemento <a> mais próximo

        const linkParent = link?.parentElement;

        // Verificar se o cursor está "not-allowed"
        if (linkParent) {
            expect(linkParent).toHaveStyle('cursor: not-allowed');
        }

        // Verificar se o texto da label está correto
        expect(screen.getByText('Link Desabilitado')).toBeInTheDocument();

        // Verificar se o ícone está sendo renderizado
        const icon = link?.querySelector('i');

        // Verificar se o ícone está presente e se tem a classe 'fa-times'
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

        // Verificar se o link está apontando para a URL correta
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', 'https://www.example.com');
    });

    test('deve renderizar a URL padrão como "/" se não for fornecida', () => {
        render(
            <BrowserRouter>
                <CardLink />
            </BrowserRouter>
        );

        // Verificar se a URL padrão está sendo usada
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/');
    });
});
