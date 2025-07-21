// TituloOcorrencia.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import TituloOcorrencia from './TituloOcorrencia';

// Mock do CampoTexto
jest.mock('~/componentes', () => ({
  CampoTexto: props => (
    <input
      data-testid="campo-texto"
      data-id={props.id}
      data-form={!!props.form}
      data-name={props.name}
      data-label={props.label}
      data-placeholder={props.placeholder}
      data-maxlength={props.maxLength}
      data-desabilitado={props.desabilitado ? 'true' : 'false'}
      data-labelrequired={props.labelRequired ? 'true' : 'false'}
      onChange={props.onChange}
    />
  ),
}));

describe('TituloOcorrencia', () => {
  const mockForm = {};
  const mockOnChangeCampos = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza CampoTexto com os props corretos', () => {
    render(
      <TituloOcorrencia
        form={mockForm}
        onChangeCampos={mockOnChangeCampos}
        desabilitar={true}
      />
    );
    const campo = screen.getByTestId('campo-texto');
    expect(campo).toBeInTheDocument();
    expect(campo.getAttribute('data-id')).toBe(
      'SGP_INPUT_TEXT_TITULO_OCORRENCIA'
    );
    expect(campo.getAttribute('data-form')).toBe('true');
    expect(campo.getAttribute('data-name')).toBe('titulo');
    expect(campo.getAttribute('data-label')).toBe('Título da ocorrência');
    expect(campo.getAttribute('data-placeholder')).toBe('Título');
    expect(campo.getAttribute('data-maxlength')).toBe('50');
    expect(campo.getAttribute('data-desabilitado')).toBe('true');
    expect(campo.getAttribute('data-labelrequired')).toBe('true');
  });

  it('usa valores padrão quando não informado', () => {
    render(<TituloOcorrencia />);
    const campo = screen.getByTestId('campo-texto');
    expect(campo.getAttribute('data-form')).toBe('false');
    expect(campo.getAttribute('data-desabilitado')).toBe('false');
    expect(campo.getAttribute('data-labelrequired')).toBe('true');
  });

  it('chama onChangeCampos ao disparar onChange', () => {
    render(<TituloOcorrencia onChangeCampos={mockOnChangeCampos} />);
    const campo = screen.getByTestId('campo-texto');
    fireEvent.change(campo, { target: { value: 'Novo título' } });
    expect(mockOnChangeCampos).toHaveBeenCalled();
  });
});
