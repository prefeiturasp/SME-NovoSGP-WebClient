import { render, screen, fireEvent } from '@testing-library/react';
import GraficoIdeb from './graficoIdeb';

describe('GraficoIdeb', () => {
  it('exibe "Sem dados" quando não há dados', () => {
    render(<GraficoIdeb anoLetivo={2024} dreId={null} />);
    expect(screen.getByText('Sem dados')).toBeInTheDocument();
  });
});
