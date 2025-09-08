import { render, screen, waitFor } from '@testing-library/react';
import { FormRegistroColetivo } from './index';
import { MemoryRouter } from 'react-router-dom';

jest.mock('@/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(() => ({
    permissoes: {
      '/naapa/registro-coletivo': {
        podeIncluir: true,
        podeExcluir: true,
        podeAlterar: true,
      },
    },
  })),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: '1' }),
  useLocation: () => ({ pathname: '/naapa/registro-coletivo/1' }),
}));

jest.mock('@/core/services/registro-coletivo-service', () => ({
  buscarPorId: jest.fn(() =>
    Promise.resolve({
      sucesso: true,
      dados: {
        id: 1,
        dreId: 1,
        codigoDre: '123',
        nomeDre: 'DRE Leste',
        ues: [],
        tipoReuniaoId: 1,
        dataRegistro: new Date().toISOString(),
        quantidadeParticipantes: 5,
        quantidadeEducadores: 2,
        quantidadeEducandos: 3,
        quantidadeCuidadores: 1,
        descricao: 'Descrição mockada',
        observacao: '',
        anexos: [],
        criadoRF: '12345',
      },
    })
  ),
}));

jest.mock('@/components/sgp/inputs/form/dre', () => () => <div>DRE Mock</div>);
jest.mock('@/components/sgp/inputs/form/ue', () => () => <div>UE Mock</div>);
jest.mock('@/components/sgp/inputs/form/tipo-reuniao', () => ({
  SelectTipoReuniao: () => <div>Tipo Reunião Mock</div>,
  SelectTipoReuniaoFormItem: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('./components/editor', () => ({
  EditorDescricaoAcao: () => <div>Editor Mock</div>,
}));

describe('FormRegistroColetivo', () => {
  it('renderiza corretamente', async () => {
    render(
      <MemoryRouter>
        <FormRegistroColetivo />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('DRE Mock')).toBeInTheDocument();
      expect(screen.getByText('UE Mock')).toBeInTheDocument();
      expect(screen.getByText('Editor Mock')).toBeInTheDocument();
    });
  });
});
