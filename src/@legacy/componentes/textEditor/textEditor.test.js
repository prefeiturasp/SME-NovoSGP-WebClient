import React from 'react';
import { render } from '@testing-library/react';
import TextEditor from './index';

describe('TextEditor', () => {
  it('renderiza sem erros', () => {
    render(<TextEditor />);
  });
});
