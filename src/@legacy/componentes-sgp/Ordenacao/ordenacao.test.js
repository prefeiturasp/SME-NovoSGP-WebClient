import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Ordenacao from './ordenacao';

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

  it('deve renderizar o botão de ordenação', () => {
    const { getByText } = render(<Ordenacao />);
    expect(getByText('Ordenar')).toBeInTheDocument();
  });

  it('deve ordenar do menor para o maior', () => {
    const { getByText } = render(
      <Ordenacao
        conteudoParaOrdenar={[...conteudo]}
        ordenarColunaNumero="id"
        retornoOrdenado={retornoOrdenado}
        onChangeOrdenacao={onChangeOrdenacao}
      />
    );
    fireEvent.click(getByText('Ordenar'));
    fireEvent.click(getByText('Número (Menor para o maior)'));
    expect(onChangeOrdenacao).toHaveBeenCalledWith(3);
    expect(retornoOrdenado).toHaveBeenCalledWith([
      { id: 1, nome: 'A' },
      { id: 2, nome: 'B' },
      { id: 3, nome: 'C' },
    ]);
  });

  it('deve ordenar do maior para o menor', () => {
    const { getByText } = render(
      <Ordenacao
        conteudoParaOrdenar={[...conteudo]}
        ordenarColunaNumero="id"
        retornoOrdenado={retornoOrdenado}
        onChangeOrdenacao={onChangeOrdenacao}
      />
    );
    fireEvent.click(getByText('Ordenar'));
    fireEvent.click(getByText('Número (Maior para o menor)'));
    expect(onChangeOrdenacao).toHaveBeenCalledWith(4);
    expect(retornoOrdenado).toHaveBeenCalledWith([
      { id: 3, nome: 'C' },
      { id: 2, nome: 'B' },
      { id: 1, nome: 'A' },
    ]);
  });

  it('deve ordenar por ordem alfabética A-Z', () => {
    const { getByText } = render(
      <Ordenacao
        conteudoParaOrdenar={[...conteudo]}
        ordenarColunaTexto="nome"
        retornoOrdenado={retornoOrdenado}
        onChangeOrdenacao={onChangeOrdenacao}
      />
    );
    fireEvent.click(getByText('Ordenar'));
    fireEvent.click(getByText('Por ordem alfabética (A–Z)'));
    expect(onChangeOrdenacao).toHaveBeenCalledWith(1);
    expect(retornoOrdenado).toHaveBeenCalledWith([
      { id: 1, nome: 'A' },
      { id: 2, nome: 'B' },
      { id: 3, nome: 'C' },
    ]);
  });

  it('deve ordenar por ordem alfabética Z-A', () => {
    const { getByText } = render(
      <Ordenacao
        conteudoParaOrdenar={[...conteudo]}
        ordenarColunaTexto="nome"
        retornoOrdenado={retornoOrdenado}
        onChangeOrdenacao={onChangeOrdenacao}
      />
    );
    fireEvent.click(getByText('Ordenar'));
    fireEvent.click(getByText('Por ordem alfabética (Z–A)'));
    expect(onChangeOrdenacao).toHaveBeenCalledWith(2);
    expect(retornoOrdenado).toHaveBeenCalledWith([
      { id: 3, nome: 'C' },
      { id: 2, nome: 'B' },
      { id: 1, nome: 'A' },
    ]);
  });

  it('deve manter a ordem quando os valores de texto são iguais (A-Z)', () => {
    const conteudoIguais = [
      { id: 1, nome: 'A' },
      { id: 2, nome: 'A' },
    ];
    const retornoOrdenado = jest.fn();
    const onChangeOrdenacao = jest.fn();
    const { getByText } = render(
      <Ordenacao
        conteudoParaOrdenar={[...conteudoIguais]}
        ordenarColunaTexto="nome"
        retornoOrdenado={retornoOrdenado}
        onChangeOrdenacao={onChangeOrdenacao}
      />
    );
    fireEvent.click(getByText('Ordenar'));
    fireEvent.click(getByText('Por ordem alfabética (A–Z)'));
    expect(retornoOrdenado).toHaveBeenCalledWith([
      { id: 1, nome: 'A' },
      { id: 2, nome: 'A' },
    ]);
  });

  it('deve manter a ordem quando os valores de texto são iguais (Z-A)', () => {
    const conteudoIguais = [
      { id: 1, nome: 'A' },
      { id: 2, nome: 'A' },
    ];
    const retornoOrdenado = jest.fn();
    const onChangeOrdenacao = jest.fn();
    const { getByText } = render(
      <Ordenacao
        conteudoParaOrdenar={[...conteudoIguais]}
        ordenarColunaTexto="nome"
        retornoOrdenado={retornoOrdenado}
        onChangeOrdenacao={onChangeOrdenacao}
      />
    );
    fireEvent.click(getByText('Ordenar'));
    fireEvent.click(getByText('Por ordem alfabética (Z–A)'));
    expect(retornoOrdenado).toHaveBeenCalledWith([
      { id: 1, nome: 'A' },
      { id: 2, nome: 'A' },
    ]);
  });

  it('deve desabilitar o botão quando desabilitado', () => {
    const { getByText } = render(<Ordenacao desabilitado />);
    expect(getByText('Ordenar')).toBeDisabled();
  });

  it('não deve abrir o menu quando desabilitado', () => {
    const { getByText, queryByText } = render(
      <Ordenacao desabilitado conteudoParaOrdenar={[{ id: 1, nome: 'A' }]} />
    );
    const botao = getByText('Ordenar');
    fireEvent.click(botao);
    expect(queryByText('Número (Menor para o maior)')).not.toBeInTheDocument();
  });
});
