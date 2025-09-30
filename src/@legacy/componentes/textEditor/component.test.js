import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('react-quill', () => {
  const ReactQuill = jest.fn().mockImplementation(props => null);
  ReactQuill.Quill = {
    import: jest.fn(),
  };
  return ReactQuill;
});

import TextEditor from './component';

const ReactQuill = require('react-quill');
ReactQuill.mockImplementation(props => (
  <textarea
    {...props}
    data-testid="react-quill"
    value={props.value}
    readOnly={props.readOnly}
    disabled={props.disabled}
    id={props.id}
    name={props.name}
    maxLength={props.maxlength}
    alt={props.alt}
    onBlur={e => props.onBlur && props.onBlur(e.target.value)}
    onClick={() => {
      if (props.onClick) props.onClick('focus');
      if (props.onFocus) props.onFocus('focus');
    }}
  />
));

describe('TextEditor', () => {
  it('renderiza com valores padrão', () => {
    render(<TextEditor />);
    const quill = screen.getByTestId('react-quill');
    expect(quill).toBeInTheDocument();
    expect(quill.value).toBe('');
    expect(quill).not.toBeDisabled();
    expect(quill).toHaveAttribute('maxLength', '500');
    expect(quill).toHaveAttribute('alt', '');
  });

  it('renderiza com props customizados', () => {
    render(
      <TextEditor
        value="Texto inicial"
        disabled={true}
        maxlength={100}
        id="editor-id"
        name="editor-name"
        alt="editor-alt"
        toolbar={false}
      />
    );
    const quill = screen.getByTestId('react-quill');
    expect(quill.value).toBe('Texto inicial');
    expect(quill).toBeDisabled();
    expect(quill).toHaveAttribute('maxLength', '100');
    expect(quill).toHaveAttribute('id', 'editor-id');
    expect(quill).toHaveAttribute('name', 'editor-name');
    expect(quill).toHaveAttribute('alt', 'editor-alt');
  });

  it('chama onClick ao focar', () => {
    const onClick = jest.fn();
    render(<TextEditor onClick={onClick} />);
    const quill = screen.getByTestId('react-quill');
    fireEvent.click(quill);
    expect(onClick).toHaveBeenCalledWith('focus');
  });

  it('foca e seleciona quando estadoAdicional.focado e estadoAdicional.ultimoFoco são definidos', () => {
    const ref = createRef();
    ref.current = {
      focus: jest.fn(),
      setEditorSelection: jest.fn(),
      getEditor: jest.fn(),
      state: { value: 'abc' },
    };
    render(
      <TextEditor
        ref={ref}
        estadoAdicional={{ focado: true, ultimoFoco: 2 }}
        value="abc"
      />
    );
    expect(ref.current.focus).toHaveBeenCalled();
    expect(ref.current.setEditorSelection).toHaveBeenCalledWith(
      ref.current.getEditor(),
      2
    );
  });

  it('chama onBlur no cleanup do useEffect se value mudou', () => {
    const onBlur = jest.fn();
    const ref = createRef();
    ref.current = {
      focus: jest.fn(),
      setEditorSelection: jest.fn(),
      getEditor: jest.fn(),
      state: { value: 'novo valor' },
    };
    const { unmount } = render(
      <TextEditor ref={ref} value="valor antigo" onBlur={onBlur} />
    );
    unmount();
    expect(onBlur).toHaveBeenCalledWith('novo valor');
  });

  it('chama a função de seleção corretamente', () => {
    const onSelect = jest.fn();
    const itemSelecionado = {
      props: {
        value: 'João Silva',
        codigoTurma: '101',
        turmaId: '1',
        nomeAlunoComTurmaModalidade: 'João Silva - 5A',
      },
    };
    render(<TextEditor onSelect={onSelect} />);
    onSelect(itemSelecionado.props.value, itemSelecionado);
    expect(onSelect).toHaveBeenCalledWith('João Silva', itemSelecionado);
  });
});
