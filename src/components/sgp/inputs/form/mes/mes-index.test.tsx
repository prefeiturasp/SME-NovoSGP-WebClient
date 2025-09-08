// SelectMes.test.tsx

import { render, screen } from '@testing-library/react';
import { SelectMesFormItem } from './index';

jest.mock('~/constantes/ids/select', () => ({
  SGP_SELECT_MESES: 'select-meses',
}));

jest.mock('~/utils', () => ({
  obterTodosMeses: jest.fn(() => [
    { numeroMes: '1', nome: 'Janeiro' },
    { numeroMes: '2', nome: 'Fevereiro' },
  ]),
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

describe('SelectMesFormItem', () => {
  it('renderiza Form.Item com label e name corretos', () => {
    render(
      <SelectMesFormItem>
        <span data-testid="child">Filho</span>
      </SelectMesFormItem>,
    );
    const formItem = screen.getByTestId('form-item');
    expect(formItem).toBeInTheDocument();
    expect(formItem).toHaveAttribute('label', 'Mês');
    expect(formItem).toHaveAttribute('name', 'mes');
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
