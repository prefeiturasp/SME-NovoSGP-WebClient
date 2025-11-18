import { setEstudantesRelatorioPAP } from '@/@legacy/redux/modulos/relatorioPAP/actions';
import { useDispatch, useSelector } from 'react-redux';
import { Ordenacao } from '~/componentes-sgp';

const BotaoOrdenarListaAlunosPAP = () => {
  const dispatch = useDispatch();

  const estudantesRelatorioPAP = useSelector(
    store => store.relatorioPAP.estudantesRelatorioPAP
  );

  return (
    <Ordenacao
      conteudoParaOrdenar={estudantesRelatorioPAP}
      ordenarColunaNumero="numeroChamada"
      ordenarColunaTexto="nome"
      retornoOrdenado={retorno => dispatch(setEstudantesRelatorioPAP(retorno))}
    />
  );
};

export default BotaoOrdenarListaAlunosPAP;
