import React from 'react';
import { render } from '@testing-library/react';
import CheckboxGroup from './checkboxGroup';
describe('CheckboxGroup', () => {
  it('renderiza sem erros', () => {
    render(<CheckboxGroup />);
  });
});
