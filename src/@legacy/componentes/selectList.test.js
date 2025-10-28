import React from 'react';
import { render } from '@testing-library/react';
import selectList from './selectList';

describe('selectList', () => {
  it('should render without crashing', () => {
    render(React.createElement(selectList));
  });
});
