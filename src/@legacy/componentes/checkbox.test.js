import React from 'react';
import { render } from '@testing-library/react';
import CheckboxComponent from './checkbox';
describe('CheckboxComponent', () => {
  it('should render without crashing', () => {
    render(<CheckboxComponent />);
  });
});
