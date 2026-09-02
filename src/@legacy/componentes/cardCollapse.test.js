import React, { useEffect } from 'react';
import { render } from '@testing-library/react';
import CardCollapse from './cardCollapse';

test('renders CardCollapse without crashing', () => {
  render(<CardCollapse>Conteúdo</CardCollapse>);
});

test('inicia recolhido por padrão', () => {
  const { container } = render(
    <CardCollapse indice="secao-teste">Conteúdo</CardCollapse>
  );

  expect(container.querySelector('#secao-teste')).not.toHaveClass('show');
});

test('não remonta o conteúdo quando o componente renderiza novamente', () => {
  const aoMontar = jest.fn();

  const Conteudo = () => {
    useEffect(() => {
      aoMontar();
    }, []);

    return <span>Conteúdo</span>;
  };

  const { rerender } = render(
    <CardCollapse titulo="Seção" indice="secao-teste">
      <Conteudo />
    </CardCollapse>
  );

  rerender(
    <CardCollapse titulo="Seção atualizada" indice="secao-teste">
      <Conteudo />
    </CardCollapse>
  );

  expect(aoMontar).toHaveBeenCalledTimes(1);
});
