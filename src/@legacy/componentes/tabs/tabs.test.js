import React from 'react';
import { render } from '@testing-library/react';
import Tabs from './tabs';

describe('Tabs', () => {
  it('renderiza sem erros', () => {
    render(<Tabs />);
  });
});
