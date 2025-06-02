import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './index';

describe('Modal', () => {
  it('renderiza título, children e botões', () => {
    render(
      <Modal open title="Título Teste" okText="Confirmar" cancelText="Fechar">
        <div>Conteúdo do modal</div>
      </Modal>,
    );
    expect(screen.getByText('Título Teste')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fechar/i })).toBeInTheDocument();
  });

  it('chama onOk e onCancel ao clicar nos botões', () => {
    const onOk = jest.fn();
    const onCancel = jest.fn();
    render(
      <Modal open title="Ações" onOk={onOk} onCancel={onCancel} okText="OK" cancelText="Cancelar">
        <span>Testando ações</span>
      </Modal>,
    );
    fireEvent.click(screen.getByRole('button', { name: /ok/i }));
    expect(onOk).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('aplica props customizadas nos botões', () => {
    render(
      <Modal
        open
        title="Custom Props"
        okText="Salvar"
        cancelText="Sair"
        okButtonProps={{ disabled: true }}
        cancelButtonProps={{ style: { color: 'gray' } }}
      >
        <span>Testando props</span>
      </Modal>,
    );
    expect(screen.getByRole('button', { name: /salvar/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /sair/i })).toHaveStyle('color: rgb(66, 71, 74)');
  });
});
