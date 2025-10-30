import React from 'react';
import { render } from '@testing-library/react';
import selectMultiple from './selectMultiple';

describe('selectMultiple', () => {
  it('should render without crashing', () => {
    render(React.createElement(selectMultiple, { lista: [] }));
  });
});
