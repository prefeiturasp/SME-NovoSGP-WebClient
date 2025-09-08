import { render, screen, fireEvent } from '@testing-library/react';
import Select from './index';

describe('Select (custom wrapper)', () => {
  const options = [
    { value: '1', label: 'Primeira opção' },
    { value: '2', label: 'Segunda opção' },
  ];

  it('renderiza o select e as opções', () => {
    render(<Select options={options} open />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Primeira opção')).toBeInTheDocument();
    expect(screen.getByText('Segunda opção')).toBeInTheDocument();
  });

  it('exibe mensagem customizada quando não há dados', () => {
    render(<Select options={[]} open />);
    expect(screen.getByText('Sem dados')).toBeInTheDocument();
  });

  it('filtra opções pelo label', () => {
    render(<Select options={options} open showSearch />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'primeira' } });
    expect(screen.getByText('Primeira opção')).toBeInTheDocument();
    expect(screen.queryByText('Segunda opção')).not.toBeInTheDocument();
  });

  it('filtra opções pelo value', () => {
    render(<Select options={options} open showSearch />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: '2' } });
    expect(screen.getByText('Segunda opção')).toBeInTheDocument();
    expect(screen.queryByText('Primeira opção')).not.toBeInTheDocument();
  });

  it('chama onChange ao selecionar uma opção', () => {
    const onChange = jest.fn();
    render(<Select options={options} open onChange={onChange} />);
    fireEvent.click(screen.getByText('Primeira opção'));
    expect(onChange).toHaveBeenCalledWith('1', expect.anything());
  });
});
