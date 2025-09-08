import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Ordenacao from './ordenacao';

jest.mock('antd', () => {
  return {
    Dropdown: ({ children, dropdownRender, ...props }) => (
      <div data-testid="dropdown" {...props}>
        {typeof children === 'function' ? children() : children}
        {dropdownRender && dropdownRender()}
      </div>
    ),
    Menu: Object.assign(
      ({ children, ...props }) => (
        <div data-testid="menu" {...props}>
          {children}
        </div>
      ),
      {
        Item: ({ children, onClick }) => (
          <div onClick={onClick} role="menuitem">
            {children}
          </div>
        ),
      }
    ),
  };
});

jest.mock('~/componentes/button', () => props => {
  const { border, label, ...rest } = props;
  return <button {...rest}>{label || 'Ordenar'}</button>;
});

jest.mock('~/componentes/colors', () => ({
  Base: { Roxo: '#800080', Branco: '#fff' },
  Colors: { Azul: '#0000ff' },
}));

describe('Ordenacao', () => {
  const conteudo = [
    { id: 2, nome: 'B' },
    { id: 1, nome: 'A' },
    { id: 3, nome: 'C' },
  ];

  let retornoOrdenado;
  let onChangeOrdenacao;

  beforeEach(() => {
    retornoOrdenado = jest.fn();
    onChangeOrdenacao = jest.fn();
  });

  it('renderiza botão de ordenação', () => {
    const { getByText } = render(
      <Ordenacao
        conteudoParaOrdenar={[]}
        retornoOrdenado={() => {}}
        onChangeOrdenacao={() => {}}
      />
    );
    expect(getByText('Ordenar')).toBeInTheDocument();
  });

  it('ordena do menor para o maior', () => {
    const { getByText } = render(
      <Ordenacao
        conteudoParaOrdenar={[...conteudo]}
        ordenarColunaNumero="id"
        retornoOrdenado={retornoOrdenado}
        onChangeOrdenacao={onChangeOrdenacao}
      />
    );
    fireEvent.click(getByText('Número (Menor para o maior)'));
    expect(onChangeOrdenacao).toHaveBeenCalledWith(3);
    expect(retornoOrdenado).toHaveBeenCalledWith([
      { id: 1, nome: 'A' },
      { id: 2, nome: 'B' },
      { id: 3, nome: 'C' },
    ]);
  });

  it('ordena do maior para o menor', () => {
    const { getByText } = render(
      <Ordenacao
        conteudoParaOrdenar={[...conteudo]}
        ordenarColunaNumero="id"
        retornoOrdenado={retornoOrdenado}
        onChangeOrdenacao={onChangeOrdenacao}
      />
    );
    fireEvent.click(getByText('Número (Maior para o menor)'));
    expect(onChangeOrdenacao).toHaveBeenCalledWith(4);
    expect(retornoOrdenado).toHaveBeenCalledWith([
      { id: 3, nome: 'C' },
      { id: 2, nome: 'B' },
      { id: 1, nome: 'A' },
    ]);
  });

  it('ordena por ordem alfabética A-Z', () => {
    const { getByText } = render(
      <Ordenacao
        conteudoParaOrdenar={[...conteudo]}
        ordenarColunaTexto="nome"
        retornoOrdenado={retornoOrdenado}
        onChangeOrdenacao={onChangeOrdenacao}
      />
    );
    fireEvent.click(getByText('Por ordem alfabética (A–Z)'));
    expect(onChangeOrdenacao).toHaveBeenCalledWith(1);
    expect(retornoOrdenado).toHaveBeenCalledWith([
      { id: 1, nome: 'A' },
      { id: 2, nome: 'B' },
      { id: 3, nome: 'C' },
    ]);
  });

  it('ordena por ordem alfabética Z-A', () => {
    const { getByText } = render(
      <Ordenacao
        conteudoParaOrdenar={[...conteudo]}
        ordenarColunaTexto="nome"
        retornoOrdenado={retornoOrdenado}
        onChangeOrdenacao={onChangeOrdenacao}
      />
    );
    fireEvent.click(getByText('Por ordem alfabética (Z–A)'));
    expect(onChangeOrdenacao).toHaveBeenCalledWith(2);
    expect(retornoOrdenado).toHaveBeenCalledWith([
      { id: 3, nome: 'C' },
      { id: 2, nome: 'B' },
      { id: 1, nome: 'A' },
    ]);
  });

  it('mantém ordem quando valores são iguais (A–Z)', () => {
    const iguais = [
      { id: 1, nome: 'A' },
      { id: 2, nome: 'A' },
    ];
    const { getByText } = render(
      <Ordenacao
        conteudoParaOrdenar={[...iguais]}
        ordenarColunaTexto="nome"
        retornoOrdenado={retornoOrdenado}
        onChangeOrdenacao={onChangeOrdenacao}
      />
    );
    fireEvent.click(getByText('Por ordem alfabética (A–Z)'));
    expect(retornoOrdenado).toHaveBeenCalledWith([
      { id: 1, nome: 'A' },
      { id: 2, nome: 'A' },
    ]);
  });

  it('mantém ordem quando valores são iguais (Z–A)', () => {
    const iguais = [
      { id: 1, nome: 'A' },
      { id: 2, nome: 'A' },
    ];
    const { getByText } = render(
      <Ordenacao
        conteudoParaOrdenar={[...iguais]}
        ordenarColunaTexto="nome"
        retornoOrdenado={retornoOrdenado}
        onChangeOrdenacao={onChangeOrdenacao}
      />
    );
    fireEvent.click(getByText('Por ordem alfabética (Z–A)'));
    expect(retornoOrdenado).toHaveBeenCalledWith([
      { id: 1, nome: 'A' },
      { id: 2, nome: 'A' },
    ]);
  });

  it('desabilita botão quando `desabilitado` for true', () => {
    const { getByText } = render(<Ordenacao desabilitado />);
    expect(getByText('Ordenar')).toBeDisabled();
  });

  it('não chama nada se tentar ordenar com botão desabilitado', () => {
    const { getByText } = render(
      <Ordenacao
        conteudoParaOrdenar={[{ id: 1, nome: 'A' }]}
        retornoOrdenado={retornoOrdenado}
        onChangeOrdenacao={onChangeOrdenacao}
        desabilitado
      />
    );
    const botao = getByText('Ordenar');
    fireEvent.click(botao);
    expect(onChangeOrdenacao).not.toHaveBeenCalled();
    expect(retornoOrdenado).not.toHaveBeenCalled();
  });
});
