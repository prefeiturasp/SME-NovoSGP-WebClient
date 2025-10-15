import React from 'react';
import { render } from '@testing-library/react';
import Loader from './loader';

describe('Loader', () => {
  it('renders without crashing', () => {
    render(<Loader>teste</Loader>);
  });
});
