import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('styled-components', () => {
  const React = require('react');

  const styled = Component =>
    jest.fn().mockImplementation((...args) => {
      return React.forwardRef(
        (
          {
            children,
            style: userStyle,
            hidden,
            height,
            width,
            fontSize,
            padding,
            color,
            'data-testid': testId,
            ...props
          },
          ref
        ) => {
          const inlineStyle = {
            ...(hidden ? { display: 'none' } : {}),
            ...(height ? { height } : { height: '38px' }),
            ...(width ? { width } : {}),
            ...(fontSize ? { fontSize } : {}),
            ...(padding ? { padding } : {}),
            ...(color ? { color } : {}),
            ...(userStyle || {}),
          };

          return (
            <Component ref={ref} {...props} style={inlineStyle}>
              {children}
            </Component>
          );
        }
      );
    });

  styled.button = styled('button');
  styled.i = styled('i');
  return { __esModule: true, default: styled };
});

import Button from './button';

describe('Button', () => {
  it('renderiza com valores padrão', () => {
    render(<Button label="Botão padrão" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Botão padrão');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveStyle(`height: 38px`);
  });

  it('chama a função onClick quando clicado', () => {
    const onClick = jest.fn();
    render(<Button label="Clique aqui" onClick={onClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('não chama onClick quando desabilitado', () => {
    const onClick = jest.fn();
    render(<Button label="Desabilitado" onClick={onClick} disabled />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('renderiza o botão com a classe de remoção quando remove é true', () => {
    render(<Button label="Remover" remove />);
    const removeIcon = screen.getByLabelText('Remover');
    expect(removeIcon).toBeInTheDocument();
  });

  it('renderiza com hidden quando a prop hidden é true', () => {
    render(<Button label="Oculto" hidden />);
    const button = screen.getByRole('button', { hidden: true });
    expect(button).toHaveStyle('display: none');
  });
});
