import { render } from '@testing-library/react';
import { Form } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { ListaPaginadaRegistroColetivo } from '.';

jest.mock('@/@legacy/componentes', () => ({
  ListaPaginada: () => <div>ListaPaginada Mockada</div>,
  Base: { Branco: '#fff' },
}));

describe('ListaPaginadaRegistroColetivo', () => {
  it('mostra dentro do formulario sem quebrar', () => {
    const Wrapper = () => {
      const [form] = Form.useForm();
      return (
        <BrowserRouter>
          <Form form={form} initialValues={{}}>
            <ListaPaginadaRegistroColetivo />
          </Form>
        </BrowserRouter>
      );
    };

    const { getByText } = render(<Wrapper />);
    expect(getByText('ListaPaginada Mockada')).toBeInTheDocument();
  });
});
