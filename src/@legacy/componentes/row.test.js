import React from 'react';
import { render } from '@testing-library/react';
import Row from './row';
import shortid from 'shortid';

jest.mock('shortid', () => ({
  generate: jest.fn().mockReturnValue('12345'),
}));

describe('Row Component', () => {
  beforeEach(() => {
    shortid.generate.mockClear();
  });

  it('Deve renderizar o clidren corretamente', () => {
    const { getByText } = render(
      <Row>
        <p>Test Child</p>
      </Row>
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('Deve aplicar a classe customizada', () => {
    const customClass = 'custom-class';
    const { container } = render(<Row className={customClass} />);

    expect(container.firstChild).toHaveClass('row');
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('Deve gerar uma chave unica', () => {
    render(<Row />);

    expect(shortid.generate).toHaveBeenCalledTimes(1);
    expect(shortid.generate).toHaveBeenCalledWith();
  });

  it('Deve aplicar todas as props', () => {
    const { container } = render(<Row id="row1" data-test="test-value" />);

    expect(container.firstChild).toHaveAttribute('id', 'row1');
    expect(container.firstChild).toHaveAttribute('data-test', 'test-value');
  });
});
