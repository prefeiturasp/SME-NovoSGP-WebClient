import { useAppDispatch, useAppSelector } from '@/core/hooks/use-redux';
import { Ordenacao } from '~/componentes-sgp';
import { setEstudantesMapeamentoEstudantes } from '~/redux/modulos/mapeamentoEstudantes/actions';

export const BotaoOrdenarMapeamentoEstudantes = () => {
  const dispatch = useAppDispatch();

  const estudantesMapeamentoEstudantes = useAppSelector(
    store => store.mapeamentoEstudantes.estudantesMapeamentoEstudantes
  );

  return (
    <Ordenacao
      conteudoParaOrdenar={estudantesMapeamentoEstudantes}
      ordenarColunaNumero="numeroChamada"
      ordenarColunaTexto="nome"
      retornoOrdenado={retorno =>
        dispatch(setEstudantesMapeamentoEstudantes(retorno))
      }
    />
  );
};
