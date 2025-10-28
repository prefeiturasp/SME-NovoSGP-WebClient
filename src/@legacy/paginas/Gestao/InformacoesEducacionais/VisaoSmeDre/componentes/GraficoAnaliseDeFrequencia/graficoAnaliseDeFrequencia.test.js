import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import GraficoAnaliseDeFrequencia from './GraficoAnaliseDeFrequencia';

describe('GraficoAnaliseDeFrequencia', () => {
  it('não deve renderizar nada quando dreId é nulo', () => {
    const { container } = render(<GraficoAnaliseDeFrequencia dreId={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('não deve renderizar nada quando dreId é undefined', () => {
    const { container } = render(<GraficoAnaliseDeFrequencia />);
    expect(container.firstChild).toBeNull();
  });
});
