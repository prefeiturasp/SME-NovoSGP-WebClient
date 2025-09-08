import { render, screen, fireEvent } from '@testing-library/react';
import EstudanteAtendidoAEE from './index';

describe('EstudanteAtendidoAEE', () => {
  it('não deve renderizar o ícone quando show for false', () => {
    render(<EstudanteAtendidoAEE show={false} titleTooltip="Tooltip" />);
    const img = screen.queryByAltText('Tooltip');
    expect(img).not.toBeInTheDocument();
  });

  it('deve renderizar o ícone com tooltip padrão', async () => {
    // @ts-ignore omit prop para usar valor default
    render(<EstudanteAtendidoAEE show={true} />);
    const defaultText = 'Criança/Estudante atendida pelo AEE';
    const img = screen.getByAltText(defaultText);
    fireEvent.mouseOver(img);
    const tooltip = await screen.findByText(defaultText);
    expect(tooltip).toBeInTheDocument();
  });

  it('deve renderizar o ícone com tooltip customizado', async () => {
    const custom = 'Atendido pelo AEE';
    render(<EstudanteAtendidoAEE show={true} titleTooltip={custom} />);
    const img = screen.getByAltText(custom);
    fireEvent.mouseOver(img);
    const tooltip = await screen.findByText(custom);
    expect(tooltip).toBeInTheDocument();
  });
});
