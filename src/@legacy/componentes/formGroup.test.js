import React from 'react';
import { render } from '@testing-library/react';
import FormGroup from './formGroup';
test('renders FormGroup without crashing', () => {
  render(<FormGroup>teste</FormGroup>);
});
