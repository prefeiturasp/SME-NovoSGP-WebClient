import { fireEvent, render, waitFor } from '@testing-library/react';
import CollapseDadosSecaoRelatorioPAP from './index';

jest.mock('~/componentes', () => ({
  Base: { AzulBordaCard: '#086397' },
}));

const mockMontarDadosPorSecao = jest.fn(() => <div>Questionário</div>);

jest.mock('../montarDadosPorSecaoRelatorioPAP', () => {
  const React = require('react');

  return {
    __esModule: true,
    default: React.memo(props => mockMontarDadosPorSecao(props)),
  };
});

describe('CollapseDadosSecaoRelatorioPAP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inicia a seção expandida', () => {
    const { container } = render(
      <CollapseDadosSecaoRelatorioPAP
        dados={{ nome: 'Dificuldades apresentadas' }}
        index={0}
      />
    );

    expect(
      container.querySelector('#secao-0-collapse-indice')
    ).toHaveClass('show');
  });

  it('fecha e abre sem remontar o questionário ou alterar a URL', async () => {
    const { container } = render(
      <CollapseDadosSecaoRelatorioPAP
        dados={{ nome: 'Dificuldades apresentadas' }}
        index={0}
      />
    );

    const controle = container.querySelector(
      '#expandir-retrair-secao-0-collapse-indice'
    );

    expect(controle).toHaveAttribute('href', '#secao-0-collapse-indice');

    fireEvent.click(controle);

    await waitFor(() => {
      expect(
        container.querySelector('#secao-0-collapse-indice')
      ).not.toHaveClass('show');
    });

    expect(mockMontarDadosPorSecao).toHaveBeenCalledTimes(1);
    expect(window.location.hash).toBe('');

    fireEvent.click(controle);

    await waitFor(() => {
      expect(
        container.querySelector('#secao-0-collapse-indice')
      ).toHaveClass('show');
    });

    expect(mockMontarDadosPorSecao).toHaveBeenCalledTimes(1);
    expect(window.location.hash).toBe('');
  });
});
