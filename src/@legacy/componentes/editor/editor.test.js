import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Editor from './editor';

jest.mock('@ckeditor/ckeditor5-react', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef((props, ref) => (
      <textarea
        data-testid="ckeditor-mock"
        value={props.data}
        data-toolbar={JSON.stringify(props.config.toolbar)}
        data-language={props.config.language}
        data-remove-plugins={props.config.removePlugins.join(',')}
        data-table-enabled={String(props.config.table.isEnabled)}
        data-read-only={String(props.config.readOnly)}
        disabled={props.disabled}
        onChange={e =>
          props.onChange &&
          props.onChange({}, { getData: () => e.target.value })
        }
        ref={ref}
      />
    )),
  };
});
jest.mock('@ckeditor/ckeditor5-build-classic', () => ({}));
jest.mock('../label', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ text }) => <label>{text}</label>,
  };
});
jest.mock('formik', () => ({
  Field: ({ component: Component, form, ...props }) => (
    <Component formik={form} {...props} />
  ),
}));

const formMock = {
  errors: {},
  touched: {},
  values: { editor: 'valor inicial' },
  setFieldValue: jest.fn(),
  setFieldTouched: jest.fn(),
};

describe('Editor', () => {
  it('renderiza com label', () => {
    render(<Editor label="Meu Label" name="editor" />);
    expect(screen.getByText('Meu Label')).toBeInTheDocument();
  });

  it('renderiza sem label', () => {
    render(<Editor name="editor" />);
    expect(screen.queryByText('Meu Label')).not.toBeInTheDocument();
  });

  it('renderiza com form e valor inicial', () => {
    render(<Editor name="editor" form={formMock} />);
    expect(screen.getByTestId('ckeditor-mock')).toHaveValue('valor inicial');
  });

  it('chama onChange ao alterar valor', () => {
    const onChange = jest.fn();
    render(<Editor name="editor" onChange={onChange} />);
    fireEvent.change(screen.getByTestId('ckeditor-mock'), {
      target: { value: 'novo valor' },
    });
    expect(onChange).toHaveBeenCalledWith('novo valor');
  });

  it('chama setFieldValue e setFieldTouched ao alterar valor com form', () => {
    const form = {
      ...formMock,
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
    };
    render(<Editor name="editor" form={form} />);
    fireEvent.change(screen.getByTestId('ckeditor-mock'), {
      target: { value: 'novo valor' },
    });
    expect(form.setFieldValue).toHaveBeenCalledWith('editor', 'novo valor');
    expect(form.setFieldTouched).toHaveBeenCalledWith('editor', true, true);
  });

  it('renderiza mensagem de erro se temErro ou validacaoComErro', () => {
    render(<Editor name="editor" temErro mensagemErro="Erro customizado" />);
    expect(screen.getByText('Erro customizado')).toBeInTheDocument();
  });

  it('renderiza mensagem de erro se touched e errors do form', () => {
    const form = {
      ...formMock,
      errors: { editor: 'Erro do formik' },
      touched: { editor: true },
    };
    render(<Editor name="editor" form={form} />);
    expect(screen.getByText('Erro do formik')).toBeInTheDocument();
  });

  it('renderiza erro se validacaoComErro (validação customizada)', () => {
    const validarSeTemErro = jest.fn(() => true);
    render(<Editor name="editor" validarSeTemErro={validarSeTemErro} />);
    fireEvent.change(screen.getByTestId('ckeditor-mock'), {
      target: { value: 'qualquer' },
    });
    expect(
      screen.getByText((content, element) => element.tagName === 'SPAN')
    ).toBeInTheDocument();
  });

  it('renderiza erro se temErro sem mensagemErro', () => {
    render(<Editor name="editor" temErro />);
    expect(
      screen.getByText((content, element) => element.tagName === 'SPAN')
    ).toBeInTheDocument();
  });

  it('renderiza desabilitado', () => {
    render(<Editor name="editor" desabilitar />);
    expect(screen.getByTestId('ckeditor-mock')).toBeDisabled();
  });

  it('renderiza sem toolbar se removerToolbar', () => {
    render(<Editor name="editor" removerToolbar />);
    expect(screen.getByTestId('ckeditor-mock')).toBeInTheDocument();
  });

  it('valida com validarSeTemErro', () => {
    const validarSeTemErro = jest.fn(() => true);
    render(<Editor name="editor" validarSeTemErro={validarSeTemErro} />);
    fireEvent.change(screen.getByTestId('ckeditor-mock'), {
      target: { value: 'qualquer' },
    });
    expect(validarSeTemErro).toHaveBeenCalledWith('qualquer');
  });

  it('renderiza erro se validacaoComErro (validação customizada) com mensagemErro', () => {
    const validarSeTemErro = jest.fn(() => true);
    render(
      <Editor
        name="editor"
        validarSeTemErro={validarSeTemErro}
        mensagemErro="Erro customizado"
      />
    );
    fireEvent.change(screen.getByTestId('ckeditor-mock'), {
      target: { value: 'qualquer' },
    });
    expect(screen.getByText('Erro customizado')).toBeInTheDocument();
  });

  it('deve lidar com form.values[name] undefined', () => {
    const form = {
      ...formMock,
      values: {},
    };
    render(<Editor name="editor" form={form} />);
    expect(screen.getByTestId('ckeditor-mock')).toHaveValue('');
  });

  it('não deve quebrar quando onChange não é fornecido', () => {
    render(<Editor name="editor" />);
    expect(() => {
      fireEvent.change(screen.getByTestId('ckeditor-mock'), {
        target: { value: 'novo valor' },
      });
    }).not.toThrow();
  });

  it('não deve mostrar erro quando validarSeTemErro retorna false', () => {
    const validarSeTemErro = jest.fn(() => false);
    render(<Editor name="editor" validarSeTemErro={validarSeTemErro} />);
    fireEvent.change(screen.getByTestId('ckeditor-mock'), {
      target: { value: 'valor válido' },
    });
    expect(
      screen.queryByText((content, element) => element.tagName === 'SPAN')
    ).not.toBeInTheDocument();
  });

  it('deve renderizar com toolbar quando removerToolbar é false', () => {
    render(<Editor name="editor" removerToolbar={false} />);
    expect(screen.getByTestId('ckeditor-mock')).toBeInTheDocument();
  });

  it('deve aplicar classe ck-read-only quando desabilitado', () => {
    render(<Editor name="editor" desabilitar />);
    const textarea = screen.getByTestId('ckeditor-mock');
    expect(textarea).toBeDisabled();
  });

  it('deve encaminhar a ref corretamente', () => {
    const ref = React.createRef();
    render(<Editor name="editor" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('deve aplicar classe is-invalid quando há erro', () => {
    render(<Editor name="editor" temErro />);
    const wrapper = screen.getByTestId('ckeditor-mock').parentElement;
    expect(wrapper).toHaveClass('is-invalid');
  });

  it('deve lidar com onChange sem callback em editorComValidacoes', () => {
    const form = {
      ...formMock,
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
    };
    render(<Editor name="editor" form={form} />);
    expect(() => {
      fireEvent.change(screen.getByTestId('ckeditor-mock'), {
        target: { value: 'novo valor' },
      });
    }).not.toThrow();
    expect(form.setFieldValue).toHaveBeenCalled();
    expect(form.setFieldTouched).toHaveBeenCalled();
  });

  it('deve renderizar corretamente sem form e sem props adicionais', () => {
    render(<Editor name="editor" />);
    expect(screen.getByTestId('ckeditor-mock')).toBeInTheDocument();
  });

  it('deve renderizar corretamente quando form existe mas está vazio', () => {
    const emptyForm = {
      errors: {},
      touched: {},
      values: {},
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
    };
    render(<Editor name="editor" form={emptyForm} />);
    expect(screen.getByTestId('ckeditor-mock')).toBeInTheDocument();
  });
  it('não deve renderizar mensagem de erro quando não há erro mas mensagemErro existe', () => {
    render(<Editor name="editor" mensagemErro="Mensagem" />);
    expect(screen.queryByText('Mensagem')).not.toBeInTheDocument();
  });

  it('deve lidar com mudanças quando validarSeTemErro não é fornecido', () => {
    const onChange = jest.fn();
    render(<Editor name="editor" onChange={onChange} />);
    fireEvent.change(screen.getByTestId('ckeditor-mock'), {
      target: { value: 'novo valor' },
    });
    expect(onChange).toHaveBeenCalled();
    expect(
      screen.queryByText((content, element) => element.tagName === 'SPAN')
    ).not.toBeInTheDocument();
  });

  it('chama onChange prop em editorComValidacoes e atualiza form', () => {
    const onChange = jest.fn();
    const form = {
      ...formMock,
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
    };
    render(<Editor name="editor" form={form} onChange={onChange} />);
    const ta = screen.getByTestId('ckeditor-mock');
    fireEvent.change(ta, { target: { value: 'teste' } });
    expect(onChange).toHaveBeenCalledWith('teste');
    expect(form.setFieldValue).toHaveBeenCalledWith('editor', 'teste');
    expect(form.setFieldTouched).toHaveBeenCalledWith('editor', true, true);
  });
});

describe('Editor – cobertura total de config e classes', () => {
  it('sem form: toolbar, language, removePlugins, table e readOnly=false', () => {
    render(<Editor name="editor" />);
    const ta = screen.getByTestId('ckeditor-mock');

    expect(ta).toHaveAttribute(
      'data-toolbar',
      JSON.stringify([
        'heading',
        'bold',
        'italic',
        'bulletedList',
        'numberedList',
        'blockQuote',
        'redo',
        'undo',
      ])
    );
    expect(ta).toHaveAttribute('data-language', 'pt-br');
    expect(ta).toHaveAttribute(
      'data-remove-plugins',
      'Image,ImageCaption,ImageStyle,ImageToolbar,Indent,IndentToolbar,IndentStyle,Outdent'
    );
    expect(ta).toHaveAttribute('data-table-enabled', 'true');
    expect(ta).toHaveAttribute('data-read-only', 'false');
  });

  it('sem form + desabilitar: disabled e readOnly=true', () => {
    render(<Editor name="editor" desabilitar />);
    const ta = screen.getByTestId('ckeditor-mock');

    expect(ta).toBeDisabled();
    expect(ta).toHaveAttribute('data-read-only', 'true');
    expect(ta).toHaveAttribute('data-table-enabled', 'true');
  });

  it('com form: usa form.values, mesma config de toolbar, plugins e table', () => {
    render(<Editor name="editor" form={formMock} />);
    const ta = screen.getByTestId('ckeditor-mock');

    expect(ta).toHaveValue('valor inicial');

    expect(ta).toHaveAttribute(
      'data-toolbar',
      JSON.stringify([
        'heading',
        'bold',
        'italic',
        'bulletedList',
        'numberedList',
        'blockQuote',
        'redo',
        'undo',
      ])
    );
    expect(ta).toHaveAttribute('data-language', 'pt-br');
    expect(ta).toHaveAttribute(
      'data-remove-plugins',
      'Image,ImageCaption,ImageStyle,ImageToolbar,Indent,IndentToolbar,IndentStyle,Outdent'
    );
    expect(ta).toHaveAttribute('data-table-enabled', 'true');

    expect(ta).toHaveAttribute('data-read-only', 'undefined');
  });

  it('com form + removerToolbar=true: toolbar vazia', () => {
    render(<Editor name="editor" form={formMock} removerToolbar />);
    const ta = screen.getByTestId('ckeditor-mock');
    expect(ta).toHaveAttribute('data-toolbar', '[]');
  });

  it('com form: verifica language e removePlugins no config', () => {
    render(<Editor name="editor" form={formMock} />);
    const ta = screen.getByTestId('ckeditor-mock');
    expect(ta).toHaveAttribute('data-language', 'pt-br');
    expect(ta).toHaveAttribute(
      'data-remove-plugins',
      'Image,ImageCaption,ImageStyle,ImageToolbar,Indent,IndentToolbar,IndentStyle,Outdent'
    );
  });

  it('com form + removerToolbar=true: toolbar vazia', () => {
    render(<Editor name="editor" form={formMock} removerToolbar />);
    const ta = screen.getByTestId('ckeditor-mock');
    expect(ta).toHaveAttribute('data-toolbar', '[]');
  });

  it('sem form + inicial prop: usa valor de inicial', () => {
    render(<Editor name="editor" inicial="conteudo inicial" />);
    const ta = screen.getByTestId('ckeditor-mock');
    expect(ta).toHaveValue('conteudo inicial');
  });

  it('sem form + validarSeTemErro true: wrapper ganha .is-invalid', () => {
    const validar = jest.fn(() => true);
    render(<Editor name="editor" validarSeTemErro={validar} />);
    const ta = screen.getByTestId('ckeditor-mock');
    fireEvent.change(ta, { target: { value: 'x' } });
    const wrapper = ta.parentElement;
    expect(validar).toHaveBeenCalledWith('x');
    expect(wrapper).toHaveClass('is-invalid');
  });
});
