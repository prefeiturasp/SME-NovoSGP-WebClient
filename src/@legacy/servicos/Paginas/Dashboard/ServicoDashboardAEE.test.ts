import ServicoDashboardAEE from './ServicoDashboardAEE'; // ajuste o caminho conforme o seu projeto
import api from '../../../servicos/api'


jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
}));

describe('ServicoDashboardAEE', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('monta corretamente a URL com apenas anoLetivo', () => {
    ServicoDashboardAEE.obterEncaminhamentosDeferidos(2024);
    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/aee/encaminhamentos/deferidos?anoLetivo=2024'
    );
  });

  it('monta URL com dreId e ueId', () => {
    ServicoDashboardAEE.obterEncaminhamentosDeferidos(2024, 'dre123', 'ue456');
    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/aee/encaminhamentos/deferidos?anoLetivo=2024&dreId=dre123&ueId=ue456'
    );
  });

  it('monta URL com dre/ue códigos e ids', () => {
    ServicoDashboardAEE.obterQuantidadeEstudantesMatriculados(
      2024,
      'dre1',
      'ue2',
      'codDre1',
      'codUe2'
    );
    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/aee/encaminhamentos/matriculados-srm-paee?anoLetivo=2024&dreId=dre1&ueId=ue2&dreCodigo=codDre1&ueCodigo=codUe2'
    );
  });
});
