import { ROUTES } from '@/core/enum/routes';
import BuscaAtivaRegistroAcoesForm from '@/pages/busca-ativa/registro-acoes/form';

const BuscaAtivaHistoricoRegistroAcoesForm = () => {
  return (
    <BuscaAtivaRegistroAcoesForm
      rotaPermissoesTela={ROUTES.BUSCA_ATIVA_CONSULTA_CRIANCAS_ESTUDANTES_AUSENTES}
      rotaPai={ROUTES.BUSCA_ATIVA_HISTORICO_REGISTRO_ACOES}
    />
  );
};

export default BuscaAtivaHistoricoRegistroAcoesForm;
