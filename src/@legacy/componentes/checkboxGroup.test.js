import React from 'react';
import { render } from '@testing-library/react';
import CheckboxGroup from './checkboxGroup';
test('renders CheckboxGroup without crashing', () => {
  render(<CheckboxGroup />);
});
