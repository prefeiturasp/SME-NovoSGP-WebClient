import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputBusca from './InputBusca';

describe('InputBusca Component', () => {
  const mockOnClick = jest.fn();
  const mockOnPressEnter = jest.fn();
  const mockOnChange = jest.fn();

  const setup = (props = {}) => {
    const defaultProps = {
      label: 'Search Label',
      placeholder: 'Type something...',
      valor: '',
      onClick: mockOnClick,
      onPressEnter: mockOnPressEnter,
      onChange: mockOnChange,
      disabled: false,
      ...props,
    };
    return render(<InputBusca {...defaultProps} />);
  };

  it('should render the component with the label and input', () => {
    setup();
    expect(screen.getByText('Search Label')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Type something...')
    ).toBeInTheDocument();
  });

  it('should render the button inside the input prefix', () => {
    setup();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(
      screen.getByRole('button').querySelector('i.fa-search')
    ).toBeInTheDocument();
  });

  it('should call onClick when the button is clicked', () => {
    setup();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onChange when the input value changes', () => {
    setup();
    const input = screen.getByPlaceholderText('Type something...');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should disable the input when the disabled prop is true', () => {
    setup({ disabled: true });
    const input = screen.getByPlaceholderText('Type something...');
    expect(input).toBeDisabled();
  });

  xit('should match the snapshot', () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });
});
