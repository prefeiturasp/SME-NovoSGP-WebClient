import React from 'react';
import { render } from '@testing-library/react';
import SelectMultiple from './selectMultiple';
describe('SelectMultiple', () => {
  it('renderiza sem erros', () => {
    render(
      <SelectMultiple name="teste" id="teste" lista={[]} onChange={() => {}} />
    );
  });
});
