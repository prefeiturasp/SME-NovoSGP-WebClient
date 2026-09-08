import { render } from '@testing-library/react';
import CapturaErros from './captura-erros';

describe('CapturaErros', () => {
  it('renderiza os filhos', () => {
    const { getByText } = render(
      <CapturaErros navigate={jest.fn()}>
        <span>conteúdo</span>
      </CapturaErros>
    );
    expect(getByText('conteúdo')).toBeInTheDocument();
  });
});
