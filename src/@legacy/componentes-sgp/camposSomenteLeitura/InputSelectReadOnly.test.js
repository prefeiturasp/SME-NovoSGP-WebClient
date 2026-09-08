import { render, screen } from '@testing-library/react';
import InputSelectReadOnly from './InputSelectReadOnly';

describe('InputSelectReadOnly', () => {
  it('renderiza input readonly com valor e placeholder', () => {
    render(
      <InputSelectReadOnly value="Fundamental" placeholder="Selecione" />
    );
    const input = screen.getByDisplayValue('Fundamental');
    expect(input).toHaveAttribute('readOnly');
    expect(input).toHaveAttribute('placeholder', 'Selecione');
  });

  it('aplica classe disabled quando desabilitado', () => {
    const { container } = render(<InputSelectReadOnly disabled value="X" />);
    expect(container.firstChild).toHaveClass('ant-select-disabled');
    expect(screen.getByDisplayValue('X')).toBeDisabled();
  });

  it('usa id padrão', () => {
    render(<InputSelectReadOnly />);
    expect(document.getElementById('input-select-readOnly')).toBeInTheDocument();
  });
});
