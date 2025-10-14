import React from 'react';
import { render } from '@testing-library/react';
import Tag from './Tag/index';

describe('Tag', () => {
  it('renderiza sem erros', () => {
    render(
      <Tag tipo="basico" tamanho="m">Texto</Tag>
    );
  });
});
