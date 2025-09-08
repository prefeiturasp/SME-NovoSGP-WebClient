// DescricaoOcorrencia.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import DescricaoOcorrencia from './DescricaoOcorrencia';

jest.mock('~/componentes', () => ({
  JoditEditor: props => (
    <div
      data-testid="jodit-editor"
      data-label={props.label}
      data-form={!!props.form}
      data-value={props.value}
      data-name={props.name}
      data-id={props.id}
      data-permiteinserirarquivo={
        props.permiteInserirArquivo ? 'true' : 'false'
      }
      data-desabilitar={props.desabilitar ? 'true' : 'false'}
      data-labelrequired={props.labelRequired ? 'true' : 'false'}
      onClick={props.onChange}
    />
  ),
}));

describe('DescricaoOcorrencia', () => {
  const mockForm = {};
  const mockOnChange = jest.fn();

  it('renderiza JoditEditor com os props corretos', () => {
    render(
      <DescricaoOcorrencia
        form={mockForm}
        onChangeCampos={mockOnChange}
        desabilitar={true}
        initialValues={{ descricao: 'Texto inicial' }}
      />
    );
    const editor = screen.getByTestId('jodit-editor');
    expect(editor).toBeInTheDocument();
    expect(editor.getAttribute('data-label')).toBe('Descrição');
    expect(editor.getAttribute('data-form')).toBe('true');
    expect(editor.getAttribute('data-value')).toBe('Texto inicial');
    expect(editor.getAttribute('data-name')).toBe('descricao');
    expect(editor.getAttribute('data-id')).toBe('SGP_JODIT_EDITOR_DESCRICAO');
    expect(editor.getAttribute('data-permiteinserirarquivo')).toBe('true');
    expect(editor.getAttribute('data-desabilitar')).toBe('true');
    expect(editor.getAttribute('data-labelrequired')).toBe('true');
  });

  it('passa os valores padrão quando não informado', () => {
    render(<DescricaoOcorrencia />);
    const editor = screen.getByTestId('jodit-editor');
    expect(editor.getAttribute('data-form')).toBe('false');
    expect(editor.getAttribute('data-desabilitar')).toBe('false');
    expect(editor.getAttribute('data-labelrequired')).toBe('true');
  });

  it('chama onChangeCampos ao disparar onChange', () => {
    render(<DescricaoOcorrencia onChangeCampos={mockOnChange} />);
    const editor = screen.getByTestId('jodit-editor');
    fireEvent.click(editor);
    expect(mockOnChange).toHaveBeenCalled();
  });
});
