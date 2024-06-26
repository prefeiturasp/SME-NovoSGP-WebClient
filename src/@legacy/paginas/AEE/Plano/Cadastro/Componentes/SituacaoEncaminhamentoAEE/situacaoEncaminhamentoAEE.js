import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlanoAEESituacaoEncaminhamentoAEE } from '~/redux/modulos/planoAEE/actions';
import ServicoEncaminhamentoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';

const SituacaoEncaminhamentoAEE = () => {
  const dispatch = useDispatch();
  const dadosCollapseLocalizarEstudante = useSelector(
    store => store.collapseLocalizarEstudante.dadosCollapseLocalizarEstudante
  );

  const [situacao, setSituacao] = useState({});

  useEffect(() => {
    const codigoAluno = dadosCollapseLocalizarEstudante?.codigoAluno;
    const codigoUe = dadosCollapseLocalizarEstudante?.codigoUe;

    const obtemSituacaoEncaminhamento = async () => {
      dispatch(setPlanoAEESituacaoEncaminhamentoAEE());
      const retorno =
        await ServicoEncaminhamentoAEE.obterAlunoSituacaoEncaminhamentoAEE({
          estudanteCodigo: codigoAluno,
          ueCodigo: codigoUe,
        });

      if (retorno?.data) {
        setSituacao(retorno?.data);
        dispatch(setPlanoAEESituacaoEncaminhamentoAEE(retorno?.data));
      }
    };

    if (codigoAluno && codigoUe) {
      obtemSituacaoEncaminhamento();
    }
  }, [dadosCollapseLocalizarEstudante, dispatch]);

  return situacao?.situacao ? (
    <>
      <strong>Encaminhamento AEE: </strong>
      {situacao?.situacao}
    </>
  ) : (
    ''
  );
};

export default SituacaoEncaminhamentoAEE;
