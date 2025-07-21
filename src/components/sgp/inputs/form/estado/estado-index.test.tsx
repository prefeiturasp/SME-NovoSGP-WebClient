// InputEstado.test.tsx

import { render, screen } from '@testing-library/react';
import InputEstado from './index';

jest.mock('@/core/constants/lista-uf', () => ({
  LISTA_UF: [
    { label: 'SP', value: 'SP' },
    { label: 'RJ', value: 'RJ' },
  ],
}));

jest.mock('../../../../lib/inputs/select', () => (props: any) => (
  <div data-testid="select" {...props} />
));
jest.mock('antd', () => {
  const originalAntd = jest.requireActual('antd');
  return {
    ...originalAntd,
    Form: {
      ...originalAntd.Form,
      Item: ({ children, ...props }: any) => (
        <div data-testid="form-item" {...props}>
          {children}
        </div>
      ),
    },
  };
});

describe('InputEstado', () => {
  it('renderiza Form.Item e Select com as opções corretas', () => {
    render(<InputEstado selectProps={{}} />);
    const formItem = screen.getByTestId('form-item');
    const select = screen.getByTestId('select');

    expect(formItem).toBeInTheDocument();
    expect(formItem).toHaveAttribute('label', 'UF');
    expect(formItem).toHaveAttribute('name', 'estado');
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute('id', 'SELECT_UF');
    expect(select).toHaveAttribute('placeholder', 'Informe a UF');
  });

  it('passa as props extras para o Form.Item', () => {
    render(
      <InputEstado
        selectProps={{}}
        formItemProps={{ label: 'Estado', name: 'uf', required: false }}
      />,
    );
    const formItem = screen.getByTestId('form-item');
    expect(formItem).toHaveAttribute('label', 'Estado');
    expect(formItem).toHaveAttribute('name', 'uf');
  });
});
