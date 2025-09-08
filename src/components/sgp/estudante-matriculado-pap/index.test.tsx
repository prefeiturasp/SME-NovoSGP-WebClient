import { render, screen, fireEvent } from '@testing-library/react';
import EstudanteMatriculadoPAP from './index';

describe('EstudanteMatriculadoPAP', () => {
  it('não deve renderizar o ícone quando show for false', () => {
    render(<EstudanteMatriculadoPAP show={false} titleTooltip="Tooltip" />);
    const img = screen.queryByAltText('Matriculado PAP');
    expect(img).not.toBeInTheDocument();
  });

  it('deve renderizar o ícone com o título de tooltip padrão', async () => {
    render(<EstudanteMatriculadoPAP show={true} titleTooltip="Matriculado PAP" />);
    const img = screen.getByAltText('Matriculado PAP');
    expect(img).toBeInTheDocument();
    fireEvent.mouseOver(img);
    const tooltip = await screen.findByText('Matriculado PAP');
    expect(tooltip).toBeInTheDocument();
  });

  it('deve renderizar o ícone com título de tooltip customizado', async () => {
    const title = 'Tooltip Customizado';
    render(<EstudanteMatriculadoPAP show={true} titleTooltip={title} />);
    const img = screen.getByAltText('Matriculado PAP');
    expect(img).toBeInTheDocument();
    fireEvent.mouseOver(img);
    const tooltip = await screen.findByText(title);
    expect(tooltip).toBeInTheDocument();
  });

  it('deve usar titleTooltip default quando prop não for fornecida', async () => {
    // @ts-ignore
    render(<EstudanteMatriculadoPAP show={true} />);
    const img = screen.getByAltText('Matriculado PAP');
    fireEvent.mouseOver(img);
    const tooltip = await screen.findByText('Matriculado PAP');
    expect(tooltip).toBeInTheDocument();
  });
});
