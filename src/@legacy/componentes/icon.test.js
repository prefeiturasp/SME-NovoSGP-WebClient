import { render } from '@testing-library/react';
import Icon from './icon';

describe('Icon', () => {
  it('renders with default props', () => {
    const { container } = render(<Icon />);
    const iconElement = container.querySelector('i');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement.className).toContain('fa');
    expect(iconElement.className).toContain('fa-check');
  });

  it('renders with custom props', () => {
    const { container } = render(
      <Icon icon="fa-user" pack="fas" color="red" iconSize="24px" />
    );
    const iconElement = container.querySelector('i');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement.className).toContain('fas');
    expect(iconElement.className).toContain('fa-user');
    const style = iconElement.getAttribute('style');
    if (style) {
      expect(style).toMatch(/ color:\s * red /);
      expect(style).toMatch(/ font - size:\s * 24px /);
    }
  });
});
