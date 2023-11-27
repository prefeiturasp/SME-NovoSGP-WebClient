import { PermissaoAcoesDto } from '@/core/dto/PermissaoAcoes';
import { ROUTES } from '@/core/enum/routes';
import { useAppSelector } from '@/core/hooks/use-redux';
import BuscaAtivaRegistroAcoesForm from '@/pages/busca-ativa/registro-acoes/form';

const BuscaAtivaHistoricoRegistroAcoesForm = () => {
  const usuario = useAppSelector((state) => state.usuario);

  const permissoes: any = usuario?.permissoes;

  const permissoesTela: PermissaoAcoesDto =
    permissoes[ROUTES.BUSCA_ATIVA_CONSULTA_CRIANCAS_ESTUDANTES_AUSENTES];

  return (
    <BuscaAtivaRegistroAcoesForm
      permissoesTela={permissoesTela}
      rotaPai={ROUTES.BUSCA_ATIVA_HISTORICO_REGISTRO_ACOES}
    />
  );
};

export default BuscaAtivaHistoricoRegistroAcoesForm;
