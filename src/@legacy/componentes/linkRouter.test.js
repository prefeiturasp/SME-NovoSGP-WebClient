import React from 'react';
import { render } from '@testing-library/react';
import LinkRouter from './linkRouter';
describe('LinkRouter', () => {
  it('renderiza sem erros', () => {
    render(<LinkRouter to="/" />);
  });
});
