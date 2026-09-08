import { render, screen } from '@testing-library/react';
import Mensagens from './mensagens';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));
jest.mock('~/componentes/alert', () => ({ alerta }) => (
  <div data-testid={`alert-${alerta.id || alerta.tipo}`}>{alerta.mensagem}</div>
));

import { useSelector } from 'react-redux';

describe('Mensagens', () => {
  it('não renderiza quando não há alertas nem consulta', () => {
    useSelector.mockImplementation(cb =>
      cb({ navegacao: { somenteConsulta: false }, alertas: { alertas: [] } })
    );
    const { container } = render(<Mensagens />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza alertas da store', () => {
    useSelector.mockImplementation(cb =>
      cb({
        navegacao: { somenteConsulta: false },
        alertas: { alertas: [{ id: '1', mensagem: 'Atenção' }] },
      })
    );
    render(<Mensagens />);
    expect(screen.getByText('Atenção')).toBeInTheDocument();
  });

  it('exibe aviso de somente consulta', () => {
    useSelector.mockImplementation(cb =>
      cb({ navegacao: { somenteConsulta: true }, alertas: { alertas: [] } })
    );
    render(<Mensagens />);
    expect(
      screen.getByText('Você tem apenas permissão de consulta nesta tela.')
    ).toBeInTheDocument();
  });
});
