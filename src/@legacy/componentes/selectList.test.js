import React from 'react';
import { render } from '@testing-library/react';
import SelectList from './selectList';
describe('SelectList', () => {
  it('should render without crashing', () => {
    render(<SelectList />);
  });
});
