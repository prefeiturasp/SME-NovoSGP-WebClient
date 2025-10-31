import React from 'react';
import { render } from '@testing-library/react';
import CardHeader from './cardHeader';
test('renders CardHeader without crashing', () => {
  render(<CardHeader configuracao={{ altura: 10, corBorda: '#000' }} />);
});
