import { render } from '@testing-library/react';
import BuscaAtivaHistoricoRegistroAcoesForm from './index';
import { ROUTES } from '@/core/enum/routes';

jest.mock('@/pages/busca-ativa/registro-acoes/form', () => (props: any) => (
  <div
    data-testid="registro-acoes-form-mock"
    data-rota-permissoes-tela={props.rotaPermissoesTela}
    data-rota-pai={props.rotaPai}
  />
));

describe('BuscaAtivaHistoricoRegistroAcoesForm', () => {
  it('renderiza o componente filho com as props corretas', () => {
    const { getByTestId } = render(<BuscaAtivaHistoricoRegistroAcoesForm />);
    const form = getByTestId('registro-acoes-form-mock');
    expect(form).toHaveAttribute(
      'data-rota-permissoes-tela',
      ROUTES.BUSCA_ATIVA_CONSULTA_CRIANCAS_ESTUDANTES_AUSENTES,
    );
    expect(form).toHaveAttribute('data-rota-pai', ROUTES.BUSCA_ATIVA_HISTORICO_REGISTRO_ACOES);
  });
});
