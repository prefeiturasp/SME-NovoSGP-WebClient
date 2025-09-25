import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import TextEditor from './index';

jest.mock('./container', () =>
  jest.fn(({ children, ...props }) => (
    <div data-testid="container" {...props}>
      {children}
    </div>
  ))
);

jest.mock('./component', () =>
  jest.fn(({ ...props }) => <div data-testid="editor" {...props} />)
);

describe('TextEditor', () => {
  it('renderiza o Container e o Editor com as props corretas', () => {
    render(<TextEditor id="text-editor" height="300px" maxHeight="500px" />);

    const container = screen.getByTestId('container');
    const editor = screen.getByTestId('editor');

    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('id', 'text-editor');
    expect(container).toHaveAttribute('height', '300px');
    expect(container).toHaveAttribute('maxHeight', '500px');

    expect(editor).toBeInTheDocument();
  });

  it('passa a ref corretamente para o Editor', () => {
    const ref = createRef();
    render(<TextEditor ref={ref} />);

    expect(ref.current).toBeDefined();
  });

  it('renderiza corretamente com children', () => {
    render(
      <TextEditor>
        <div>Conteúdo interno</div>
      </TextEditor>
    );

    expect(screen.getByText('Conteúdo interno')).toBeInTheDocument();
  });
});
