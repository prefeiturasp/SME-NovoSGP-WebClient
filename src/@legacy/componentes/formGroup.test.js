import { render } from '@testing-library/react';
import FormGroup from './formGroup';
describe('FormGroup', () => {
  it('should render without crashing', () => {
    render(<FormGroup />);
  });
});
