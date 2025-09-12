import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Formik } from 'formik';

import InputRF from './index';

jest.mock('~/componentes/loader', () => {
  return jest.fn(({ loading, children }) =>
    loading ? <div>Carregando...</div> : children
  );
});

jest.mock('./styles', () => ({
  InputRFEstilo: ({ children }) => (
    <div data-testid="input-rf-estilo">{children}</div>
  ),
}));

jest.mock('~/utils/funcoes/gerais', () => ({
  valorNuloOuVazio: jest.fn(
    val => val === null || val === undefined || val === ''
  ),
}));

describe('Componente: InputRF', () => {
  let onSelectMock, onChangeMock, onKeyDownMock;

  beforeEach(() => {
    onSelectMock = jest.fn();
    onChangeMock = jest.fn();
    onKeyDownMock = jest.fn();

    require('~/utils/funcoes/gerais').valorNuloOuVazio.mockClear();
  });

  describe('Renderização e Comportamento Geral', () => {
    test('deve renderizar com props mínimas e no modo standalone', () => {
      render(<InputRF placeholderRF="Digite o RF" />);
      expect(screen.getByPlaceholderText('Digite o RF')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument(); // Botão de busca
    });

    test('deve exibir o loader quando exibirLoader for true', () => {
      render(<InputRF placeholderRF="Digite o RF" exibirLoader />);
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    test('deve desabilitar o input e o botão quando desabilitado for true', () => {
      render(<InputRF placeholderRF="Digite o RF" desabilitado />);
      expect(screen.getByPlaceholderText('Digite o RF')).toBeDisabled();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    test('deve chamar onSelect ao clicar no botão de busca', () => {
      render(<InputRF placeholderRF="Digite o RF" onSelect={onSelectMock} />);
      const input = screen.getByPlaceholderText('Digite o RF');
      const botao = screen.getByRole('button');

      fireEvent.change(input, { target: { value: '12345' } });
      fireEvent.click(botao);

      expect(onSelectMock).toHaveBeenCalledWith({ rf: '12345' });
    });

    test('deve chamar onSelect ao pressionar Enter', () => {
      render(<InputRF placeholderRF="Digite o RF" onSelect={onSelectMock} />);
      const input = screen.getByPlaceholderText('Digite o RF');

      fireEvent.change(input, { target: { value: '54321' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(onSelectMock).toHaveBeenCalledWith({ rf: '54321' });
    });

    test('botão de busca deve estar desabilitado se não houver valor', () => {
      render(<InputRF placeholderRF="Digite o RF" />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Modo Standalone (sem Formik)', () => {
    test('deve chamar onChange ao digitar no input', () => {
      render(<InputRF placeholderRF="Digite o RF" onChange={onChangeMock} />);
      const input = screen.getByPlaceholderText('Digite o RF');
      fireEvent.change(input, { target: { value: 'abc' } });

      expect(onChangeMock).toHaveBeenCalledWith('abc');
      expect(input).toHaveValue('abc');
    });

    test('deve atualizar valor quando pessoaSelecionada mudar', () => {
      const pessoa = {
        professorRf: 'RF-INICIAL',
        professorNome: 'Nome Inicial',
      };
      const { rerender } = render(
        <InputRF placeholderRF="RF" pessoaSelecionada={{}} />
      );
      const input = screen.getByPlaceholderText('RF');
      expect(input).toHaveValue('');

      rerender(<InputRF placeholderRF="RF" pessoaSelecionada={pessoa} />);
      expect(input).toHaveValue('RF-INICIAL');
    });
  });

  describe('Modo Integrado (com Formik)', () => {
    test('NÃO deve atualizar initialValues quando estiver em modo de edição', async () => {
      let formikBagRef;
      render(
        <Formik
          initialValues={{ professorRf: '', modoEdicao: true }}
          onSubmit={() => {}}
        >
          {formikBag => {
            formikBagRef = formikBag;
            return (
              <InputRF placeholderRF="RF" name="professorRf" form={formikBag} />
            );
          }}
        </Formik>
      );

      const input = screen.getByPlaceholderText('RF');
      fireEvent.change(input, { target: { value: 'RF-NOVO' } });

      await new Promise(r => setTimeout(r, 0));

      expect(formikBagRef.initialValues.professorRf).toBe('');
    });

    test('deve chamar onKeyDown', () => {
      render(
        <Formik initialValues={{ professorRf: '' }} onSubmit={() => {}}>
          {formikBag => (
            <InputRF
              placeholderRF="RF"
              name="professorRf"
              form={formikBag}
              onKeyDown={onKeyDownMock}
            />
          )}
        </Formik>
      );
      const input = screen.getByPlaceholderText('RF');
      fireEvent.keyDown(input, { key: 'a' });
      expect(onKeyDownMock).toHaveBeenCalledTimes(1);
    });
  });
});
