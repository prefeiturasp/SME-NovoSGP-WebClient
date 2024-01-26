import { useAppSelector } from '@/core/hooks/use-redux';
import { Auditoria } from '~/componentes';

const BuscaAtivaRegistroAcoesAuditoria = () => {
  const dadosSecoesBuscaAtivaRegistroAcoes: any = useAppSelector(
    (state) => state.buscaAtivaRegistroAcoes?.dadosSecoesBuscaAtivaRegistroAcoes,
  );

  return (
    <>
      {dadosSecoesBuscaAtivaRegistroAcoes?.auditoria?.criadoEm && (
        <Auditoria {...dadosSecoesBuscaAtivaRegistroAcoes?.auditoria} ignorarMarginTop />
      )}
    </>
  );
};

export default BuscaAtivaRegistroAcoesAuditoria;
