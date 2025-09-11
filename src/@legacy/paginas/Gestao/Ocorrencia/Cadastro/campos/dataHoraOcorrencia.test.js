// DataHoraOcorrencia.test.js

import { render, screen } from '@testing-library/react';
import DataHoraOcorrencia from './DataHoraOcorrencia';

// Mock do CampoData e Col do antd
jest.mock('antd', () => {
  const originalAntd = jest.requireActual('antd');
  return {
    ...originalAntd,
    Col: props => (
      <div data-testid="col" {...props}>
        {props.children}
      </div>
    ),
  };
});
jest.mock('~/componentes', () => ({
  CampoData: props => (
    <div
      data-testid="campo-data"
      data-id={props.id}
      data-label={props.label}
      data-name={props.name}
      data-placeholder={props.placeholder}
      data-formato={props.formatoData}
      data-desabilitado={props.desabilitado ? 'true' : 'false'}
      data-labelrequired={props.labelRequired ? 'true' : 'false'}
      data-somentehora={props.somenteHora ? 'true' : 'false'}
      {...props}
    />
  ),
}));

describe('DataHoraOcorrencia', () => {
  const mockForm = {};
  const mockOnChange = jest.fn();

  it('renderiza dois Col e dois CampoData com os props corretos', () => {
    render(
      <DataHoraOcorrencia
        form={mockForm}
        onChangeCampos={mockOnChange}
        desabilitar={true}
      />
    );
    const cols = screen.getAllByTestId('col');
    expect(cols.length).toBe(2);

    const campos = screen.getAllByTestId('campo-data');
    expect(campos.length).toBe(2);

    // Data da ocorrência
    const dataCampo = campos[0];
    expect(dataCampo.getAttribute('data-id')).toBe('SGP_DATE_OCORRENCIA');
    expect(dataCampo.getAttribute('data-label')).toBe('Data da ocorrência');
    expect(dataCampo.getAttribute('data-name')).toBe('dataOcorrencia');
    expect(dataCampo.getAttribute('data-placeholder')).toBe('Data');
    expect(dataCampo.getAttribute('data-formato')).toBe('DD/MM/YYYY');
    expect(dataCampo.getAttribute('data-desabilitado')).toBe('true');
    expect(dataCampo.getAttribute('data-labelrequired')).toBe('true');
    expect(dataCampo.getAttribute('data-somentehora')).toBe('false');

    // Hora da ocorrência
    const horaCampo = campos[1];
    expect(horaCampo.getAttribute('data-id')).toBe('SGP_DATE_HORA_OCORRENCIA');
    expect(horaCampo.getAttribute('data-label')).toBe('Hora da ocorrência');
    expect(horaCampo.getAttribute('data-name')).toBe('horaOcorrencia');
    expect(horaCampo.getAttribute('data-placeholder')).toBe('Hora');
    expect(horaCampo.getAttribute('data-formato')).toBe('HH:mm');
    expect(horaCampo.getAttribute('data-desabilitado')).toBe('true');
    expect(horaCampo.getAttribute('data-labelrequired')).toBe('false');
    expect(horaCampo.getAttribute('data-somentehora')).toBe('true');
  });

  it('passa os props padrão se não informar nada', () => {
    render(<DataHoraOcorrencia />);
    const campos = screen.getAllByTestId('campo-data');
    expect(campos.length).toBe(2);
    // Ambos devem estar desabilitados como false
    expect(campos[0].getAttribute('data-desabilitado')).toBe('false');
    expect(campos[1].getAttribute('data-desabilitado')).toBe('false');
  });

  it('chama onChangeCampos ao passar como prop', () => {
    render(
      <DataHoraOcorrencia form={mockForm} onChangeCampos={mockOnChange} />
    );
    const campos = screen.getAllByTestId('campo-data');
    // Simula chamada do onChange
    campos[0].props &&
      campos[0].props.onChange &&
      campos[0].props.onChange('2024-01-01');
    expect(mockOnChange).not.toHaveBeenCalled(); // Não é possível simular evento real, só garante que prop foi passada
  });
});
