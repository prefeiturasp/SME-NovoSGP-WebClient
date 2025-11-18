import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CollapseAtribuicaoResponsavel from '~/componentes-sgp/CollapseAtribuicaoResponsavel/collapseAtribuicaoResponsavel';
import { setExibirLoaderEncaminhamentoAEE } from '~/redux/modulos/encaminhamentoAEE/actions';
import { erros } from '~/servicos';
import ServicoEncaminhamentoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';

const AtribuicaoResponsavel = () => {
  const dispatch = useDispatch();
  const paramsRoute = useParams();

  const encaminhamentoId = paramsRoute?.id || 0;

  const dadosEncaminhamento = useSelector(
    store => store.encaminhamentoAEE.dadosEncaminhamento
  );

  const limparAtualizarDados = () => {
    ServicoEncaminhamentoAEE.obterEncaminhamentoPorId(encaminhamentoId);
  };

  const params = {
    codigoTurma: dadosEncaminhamento?.turma?.codigo,
    validarAntesAtribuirResponsavel: async funcionario => {
      const resposta =
        await ServicoEncaminhamentoAEE.atribuirResponsavelEncaminhamento(
          funcionario.codigoRF,
          encaminhamentoId
        ).catch(e => erros(e));

      if (resposta?.data) {
        limparAtualizarDados();
        return true;
      }
      return false;
    },
    clickRemoverResponsavel: async () => {
      if (encaminhamentoId) {
        dispatch(setExibirLoaderEncaminhamentoAEE(true));
        const retorno = await ServicoEncaminhamentoAEE.removerResponsavel(
          encaminhamentoId
        )
          .catch(e => erros(e))
          .finally(() => dispatch(setExibirLoaderEncaminhamentoAEE(false)));
        if (retorno?.status === 200) {
          limparAtualizarDados();
        }
      }
    },
  };

  return dadosEncaminhamento?.podeAtribuirResponsavel ? (
    <CollapseAtribuicaoResponsavel {...params} />
  ) : (
    <></>
  );
};

export default AtribuicaoResponsavel;
