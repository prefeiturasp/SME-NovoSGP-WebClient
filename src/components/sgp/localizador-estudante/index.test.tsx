import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import estudanteService from '@/core/services/estudante-service';
import LocalizadorEstudante from '.';

jest.mock('@/core/services/estudante-service', () => ({
  obterDadosEstudantesPaginado: jest.fn(),
}));

const renderWithForm = (initialValues = {}) => {
  const Wrapper = () => {
    const [form] = Form.useForm();
    return (
      <Form form={form} initialValues={initialValues}>
        <LocalizadorEstudante />
      </Form>
    );
  };
  return render(<Wrapper />);
};

describe('LocalizadorEstudante', () => {
  it('mostra campos de input', () => {
    renderWithForm({ ue: { codigo: '123' } });
    expect(screen.getByPlaceholderText(/Digite o Código EOL/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Digite o nome da Criança\/Estudante/i)).toBeInTheDocument();
  });

  it('não chama api se o nome tiver menos de 3 caracteres', async () => {
    renderWithForm({ ue: { codigo: '123' }, anoLetivo: '2025' });

    const nameInput = screen.getByPlaceholderText(/Digite o nome da Criança/i);
    fireEvent.change(nameInput, { target: { value: 'Al' } });

    await waitFor(() => {
      expect(estudanteService.obterDadosEstudantesPaginado).not.toHaveBeenCalled();
    });
  });

  it('chama api quando nome é valido', async () => {
    (estudanteService.obterDadosEstudantesPaginado as jest.Mock).mockResolvedValue({
      data: { items: [{ codigo: '1', nome: 'Alice' }] },
    });

    renderWithForm({
      ue: { codigo: '123' },
      anoLetivo: '2025',
      turma: { codigo: '999' },
    });

    const nameInput = screen.getByPlaceholderText(/Digite o nome da Criança/i);
    fireEvent.change(nameInput, { target: { value: 'Alice123' } });

    await waitFor(() => {
      expect(estudanteService.obterDadosEstudantesPaginado).toHaveBeenCalled();
    });
  });

  it('limpa dados quando nome é apagado', async () => {
    renderWithForm({ ue: { codigo: '123' } });

    const codeInput = screen.getByPlaceholderText(/Digite o Código EOL/i);
    fireEvent.change(codeInput, { target: { value: '' } });

    await waitFor(() => {
      expect(codeInput).toBeInTheDocument();
    });
  });
});
