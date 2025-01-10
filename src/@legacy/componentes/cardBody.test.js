import React from 'react';
import { render } from '@testing-library/react';
import CardBody from './cardBody';

describe('CardBody Component', () => {
  it('sDeve renderizar o componente', () => {
    const { getByText } = render(
      <CardBody>
        <p>Test Child</p>
      </CardBody>
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('Deve aplicar a classe custom ', () => {
    const customClass = 'custom-class';
    const { container } = render(<CardBody className={customClass} />);

    expect(container.firstChild).toHaveClass('card-body');
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('Deve aplicar os estilos', () => {
    const customStyle = { backgroundColor: 'red' };
    const { container } = render(<CardBody style={customStyle} />);

    expect(container.firstChild).toHaveStyle(customStyle);
  });

  it('Deve renderizar mesmo sem passar as props', () => {
    const { container } = render(<CardBody />);

    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
