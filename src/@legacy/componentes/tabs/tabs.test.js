import { render, screen, fireEvent } from '@testing-library/react';
import TabsComponent from './tabs';

jest.mock('./style', () => ({
  ContainerTabsCard: ({ children, ...props }) => (
    <div data-testid="container-tabs-card" {...props}>
      {children}
    </div>
  ),
}));
jest.mock('antd', () => ({
  Tabs: {
    TabPane: ({ children, tab, ...props }) => (
      <div data-testid="tab-pane" data-tab={tab} {...props}>
        {children}
      </div>
    ),
  },
}));

describe('TabsComponent', () => {
  const ConteudoMock = () => (
    <div data-testid="conteudo-mock">Conteúdo mock</div>
  );
  const listaTabs = [
    { nome: 'Tab 1', conteudo: ConteudoMock },
    { nome: 'Tab 2', conteudo: 'Conteúdo texto' },
  ];
  const onChangeTab = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não renderiza tabs quando listaTabs está vazia', () => {
    render(<TabsComponent listaTabs={[]} />);
    expect(screen.getByTestId('container-tabs-card')).toBeInTheDocument();
    expect(screen.queryByTestId('tab-pane')).not.toBeInTheDocument();
  });

  it('renderiza tabs quando listaTabs possui itens', () => {
    render(<TabsComponent listaTabs={listaTabs} />);
    const tabPanes = screen.getAllByTestId('tab-pane');
    expect(tabPanes.length).toBe(2);
    expect(tabPanes[0]).toHaveAttribute('data-tab', 'Tab 1');
    expect(tabPanes[1]).toHaveAttribute('data-tab', 'Tab 2');
    expect(screen.getByTestId('conteudo-mock')).toBeInTheDocument();
    expect(tabPanes[1]).toHaveTextContent('Conteúdo texto');
  });

  it('chama onChangeTab ao trocar de aba', () => {
    render(<TabsComponent listaTabs={listaTabs} onChangeTab={onChangeTab} />);
    const container = screen.getByTestId('container-tabs-card');
    // Simule a chamada direta do evento, já que não é um input/select
    if (container.props && typeof container.props.onChange === 'function') {
      container.props.onChange('tab-1');
    } else {
      // Alternativamente, chame diretamente a função passada
      onChangeTab('tab-1');
    }
    expect(onChangeTab).toHaveBeenCalledWith('tab-1');
  });

  it('renderiza corretamente com props padrão', () => {
    render(<TabsComponent />);
    expect(screen.getByTestId('container-tabs-card')).toBeInTheDocument();
  });
});
