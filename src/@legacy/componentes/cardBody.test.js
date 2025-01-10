import React from 'react';
import { render } from '@testing-library/react';
import CardBody from './cardBody';

describe('CardBody Component', () => {
  it('should render children correctly', () => {
    const { getByText } = render(
      <CardBody>
        <p>Test Child</p>
      </CardBody>
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const customClass = 'custom-class';
    const { container } = render(<CardBody className={customClass} />);

    expect(container.firstChild).toHaveClass('card-body');
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { container } = render(<CardBody style={customStyle} />);

    expect(container.firstChild).toHaveStyle(customStyle);
  });

  it('should render without children when none are provided', () => {
    const { container } = render(<CardBody />);

    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});
