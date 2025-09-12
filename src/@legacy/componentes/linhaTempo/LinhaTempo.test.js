import { render, screen } from '@testing-library/react';
import LinhaTempo from './LinhaTempo';

jest.mock('./linhaTempo.css', () => {
  const EstiloLinhaTempo = ({ children, ...props }) => (
    <div {...props}>{children}</div>
  );
  return EstiloLinhaTempo;
});

describe('Componente <LinhaTempo />', () => {
  const mockListaDeStatus = [
    {
      titulo: 'Iniciado',
      status: 1,
      timestamp: '10/09/2025 10:00',
      rf: '11111',
      nome: 'Usuário A',
    },
    {
      titulo: 'Em Andamento',
      status: 2,
      timestamp: '10/09/2025 11:00',
      rf: '22222',
      nome: 'Usuário B',
    },
    {
      titulo: 'Reprovado',
      status: 3,
      timestamp: '10/09/2025 12:00',
      rf: '33333',
      nome: 'Usuário C',
    },
    {
      titulo: 'Pendente',
      status: 0,
      timestamp: 'Aguardando',
      rf: '44444',
      nome: 'Usuário D',
    },
  ];

  it('deve renderizar os títulos e os itens da linha do tempo corretamente', () => {
    render(<LinhaTempo listaDeStatus={mockListaDeStatus} />);

    expect(screen.getByText('Iniciado')).toBeInTheDocument();
    expect(screen.getByText('Em Andamento')).toBeInTheDocument();
    expect(screen.getByText('Reprovado')).toBeInTheDocument();
    expect(screen.getByText('Pendente')).toBeInTheDocument();

    expect(screen.getByText('10/09/2025 10:00')).toBeInTheDocument();
    expect(screen.getByText(/RF: 11111 - Usuário A/)).toBeInTheDocument();
    expect(screen.getByText(/RF: 33333 - Usuário C/)).toBeInTheDocument();
  });

  it('deve aplicar as classes CSS corretas de acordo com o status', () => {
    render(<LinhaTempo listaDeStatus={mockListaDeStatus} />);

    const itemEmAndamento = screen.getByText('10/09/2025 11:00').closest('li');
    const itemReprovado = screen.getByText('10/09/2025 12:00').closest('li');
    const itemIniciado = screen.getByText('10/09/2025 10:00').closest('li');

    expect(itemEmAndamento).toHaveClass('active');

    expect(itemReprovado).toHaveClass('disapproved');

    expect(itemIniciado).not.toHaveClass('active');
    expect(itemIniciado).not.toHaveClass('disapproved');
  });

  it('não deve renderizar os detalhes de RF e nome se o status for "falsy" (0, null, undefined)', () => {
    render(<LinhaTempo listaDeStatus={mockListaDeStatus} />);

    const timestampItemPendente = screen.getByText(/Aguardando/i);
    expect(timestampItemPendente).toBeInTheDocument();

    const detalhesItemPendente = screen.queryByText(/RF: 44444 - Usuário D/);
    expect(detalhesItemPendente).not.toBeInTheDocument();
  });

  it('deve calcular a largura de cada item dinamicamente', () => {
    render(<LinhaTempo listaDeStatus={mockListaDeStatus} />);

    const totalItens = mockListaDeStatus.length;
    const larguraEsperada = `${100 / totalItens}%`; // "25%"

    const itensDaLinhaTempo = screen.getAllByRole('listitem');

    const itensDaBarra = itensDaLinhaTempo.filter(
      item =>
        item.textContent.includes('2025') ||
        item.textContent.includes('Aguardando')
    );

    expect(itensDaBarra).toHaveLength(totalItens);
    itensDaBarra.forEach(item => {
      expect(item).toHaveStyle({ width: larguraEsperada });
    });
  });

  it('deve renderizar uma estrutura vazia se a lista de status estiver vazia', () => {
    render(<LinhaTempo listaDeStatus={[]} />);

    const listas = screen.getAllByRole('list');
    listas.forEach(lista => {
      expect(lista.firstChild).toBeNull();
    });
  });
});
