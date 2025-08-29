import { render, screen } from '@testing-library/react';
import AlertaBalao from './alertaBalao';
import { Base } from '~/componentes/colors';

describe('AlertaBalao', () => {
  it('deve renderizar com texto padrão', () => {
    render(<AlertaBalao texto="Mensagem de teste" />);
    expect(screen.getByText('Mensagem de teste')).toBeInTheDocument();
  });

  it('não deve exibir o alerta se mostrarAlerta for false', () => {
    const { container } = render(<AlertaBalao mostrarAlerta={false} />);
    expect(container.firstChild).toHaveAttribute('hidden');
  });

  it('deve aplicar estilos personalizados passados via props', () => {
    const props = {
      texto: 'Aviso customizado',
      maxWidth: 200,
      marginTop: 20,
      background: 'rgb(0, 0, 255)',
      color: 'rgb(255, 255, 0)',
      mostrarAlerta: true,
    };

    const { container } = render(<AlertaBalao {...props} />);
    const alerta = container.firstChild;
    expect(alerta).toHaveStyle(`max-width: 200px`);
    expect(alerta).toHaveStyle(`background: ${props.background}`);
    expect(alerta).toHaveStyle(`color: ${props.color}`);
    expect(screen.getByText('Aviso customizado')).toBeInTheDocument();
  });

  it('deve aplicar valores padrões quando nenhuma prop é passada', () => {
    const { container } = render(<AlertaBalao />);
    const alerta = container.firstChild;
    expect(alerta).toHaveStyle(`max-width: 100px`);
    expect(alerta).toHaveStyle(`background: ${Base.Branco}`);
    expect(alerta).toHaveStyle(`color: ${Base.VermelhoAlerta}`);
  });
});
