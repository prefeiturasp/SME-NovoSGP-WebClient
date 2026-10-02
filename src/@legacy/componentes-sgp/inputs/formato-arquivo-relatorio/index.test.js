import { render, fireEvent } from '@testing-library/react';
import { FormatoRelatorio } from './index';
import { TIPO_FORMATO_RELATORIO } from '@/core/enum/tipo-formato-relatorio';

jest.mock('~/componentes', () => ({
  SelectComponent: props => (
    <select
      data-testid="select-formato"
      disabled={props.disabled}
      onChange={e => props.onChange(Number(e.target.value))}
    >
      {props.lista.map(item => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  ),
}));

describe('FormatoRelatorio', () => {
  const form = {
    setFieldValue: jest.fn(),
    setFieldTouched: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('lista PDF e EXCEL', () => {
    const { getByTestId } = render(<FormatoRelatorio form={form} />);
    const select = getByTestId('select-formato');
    expect(select.textContent).toContain('PDF');
    expect(select.textContent).toContain('EXCEL');
  });

  it('atualiza o form ao mudar', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <FormatoRelatorio form={form} onChange={onChange} />
    );
    fireEvent.change(getByTestId('select-formato'), {
      target: { value: String(TIPO_FORMATO_RELATORIO.XLSX) },
    });
    expect(form.setFieldValue).toHaveBeenCalledWith('modoEdicao', true);
    expect(form.setFieldValue).toHaveBeenCalledWith(
      'tipoFormatoRelatorio',
      TIPO_FORMATO_RELATORIO.XLSX
    );
    expect(onChange).toHaveBeenCalledWith(TIPO_FORMATO_RELATORIO.XLSX);
  });

  it('fica desabilitado quando disabled=true', () => {
    const { getByTestId } = render(<FormatoRelatorio form={form} disabled />);
    expect(getByTestId('select-formato')).toBeDisabled();
  });
});
