import { render, fireEvent } from '@testing-library/react';
import { ExibirHistorico } from './index';

jest.mock('~/componentes', () => ({
  CheckboxComponent: props => (
    <label>
      {props.label}
      <input
        data-testid="checkbox"
        type="checkbox"
        disabled={props.disabled}
        onChange={e => props.onChangeCheckbox(e.target.checked)}
      />
    </label>
  ),
}));

describe('ExibirHistorico', () => {
  const form = {
    setFieldValue: jest.fn(),
    setFieldTouched: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('renderiza o label padrão', () => {
    const { getByText } = render(<ExibirHistorico form={form} />);
    expect(getByText('Exibir histórico?')).toBeInTheDocument();
  });

  it('atualiza o form ao marcar', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <ExibirHistorico form={form} onChange={onChange} />
    );
    fireEvent.click(getByTestId('checkbox'));
    expect(form.setFieldValue).toHaveBeenCalledWith('modoEdicao', true);
    expect(form.setFieldValue).toHaveBeenCalledWith('consideraHistorico', true);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('fica desabilitado quando disabled=true', () => {
    const { getByTestId } = render(<ExibirHistorico form={form} disabled />);
    expect(getByTestId('checkbox')).toBeDisabled();
  });
});
