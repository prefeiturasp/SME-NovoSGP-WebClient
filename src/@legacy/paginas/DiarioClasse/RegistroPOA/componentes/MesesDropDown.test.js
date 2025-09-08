import { render, fireEvent } from '@testing-library/react';
import MesesDropDown from './MesesDropDown';

jest.mock('~/componentes', () => ({
  SelectComponent: ({
    valueOption,
    valueText,
    lista,
    labelRequired,
    ...rest
  }) => (
    <select data-testid="select" {...rest}>
      {lista &&
        lista.map(item => (
          <option key={item.valor} value={item.valor}>
            {item.desc}
          </option>
        ))}
    </select>
  ),
}));

describe('MesesDropDown', () => {
  const mockForm = {};
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza SelectComponent com todos os bimestres', () => {
    const { getByTestId } = render(
      <MesesDropDown
        form={mockForm}
        onChange={mockOnChange}
        label="Bimestre"
        name="mes"
      />
    );
    const select = getByTestId('select');
    expect(select).toBeInTheDocument();
    expect(select.children).toHaveLength(4);
    expect(select.children[0].textContent).toBe('1º Bimestre');
    expect(select.children[1].textContent).toBe('2º Bimestre');
    expect(select.children[2].textContent).toBe('3º Bimestre');
    expect(select.children[3].textContent).toBe('4º Bimestre');
  });

  it('passa as props corretas para SelectComponent', () => {
    const { getByTestId } = render(
      <MesesDropDown
        form={mockForm}
        onChange={mockOnChange}
        label="Bimestre"
        name="mes"
        desabilitado={true}
      />
    );
    const select = getByTestId('select');
    expect(select.disabled).toBe(true);
    expect(select.getAttribute('name')).toBe('mes');
  });

  it('chama onChange ao selecionar um bimestre', () => {
    const { getByTestId } = render(
      <MesesDropDown
        form={mockForm}
        onChange={mockOnChange}
        label="Bimestre"
        name="mes"
      />
    );
    const select = getByTestId('select');
    fireEvent.change(select, { target: { value: '2' } });
  });
});
