import React from 'react';
import { render } from '@testing-library/react';
import Card from './cardBootstrap';
describe('CardBootstrap', () => {
  it('renderiza sem erros', () => {
    render(<Card>teste</Card>);
  });
});
