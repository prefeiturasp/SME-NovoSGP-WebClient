import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Colors, Loader } from '~/componentes';
import { SGP_BUTTON_REABRIR_ENCAMINHAMENTO_NAAPA } from '~/constantes/ids/button';
import { confirmar, sucesso, erros } from '~/servicos';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import situacaoNAAPA from '~/dtos/situacaoNAAPA';
import situacaoMatriculaAluno from '@/@legacy/dtos/situacaoMatriculaAluno';

import { setDadosSituacaoEncaminhamentoNAAPA } from '@/@legacy/redux/modulos/encaminhamentoNAAPA/actions';
import { setRecarregarHistorico } from '@/@legacy/redux/modulos/historico-paginado/actions';
import { Col } from 'antd';

const BtnReabrirEncaminhamentoNAAPA = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const dadosSituacao = useSelector(
    state => state.encaminhamentoNAAPA.dadosSituacaoEncaminhamentoNAAPA
  );

  const dadosEncaminhamentoNAAPA = useSelector(
    state => state.encaminhamentoNAAPA
  )?.dadosEncaminhamentoNAAPA;

  const codigoSituacaoMatricula =
    dadosEncaminhamentoNAAPA?.aluno?.codigoSituacaoMatricula;

  const alunoAtivo = codigoSituacaoMatricula === situacaoMatriculaAluno.Ativo;

  const [exibirLoaderReabrir, setExibirLoaderReabrir] = useState(false);

  const encaminhamentoId = id;

  const onClickReabrir = async () => {
    const confirmou = await confirmar(
      'Atenção',
      '',
      'Deseja realmente reabrir este encaminhamento?'
    );
    if (confirmou) {
      setExibirLoaderReabrir(true);
      ServicoNAAPA.reabrir(encaminhamentoId)
        .then(resultado => {
          if (resultado?.status === 200 && resultado?.data) {
            const dadosSituacao = {
              situacao: resultado?.data?.codigo,
              descricaoSituacao: resultado?.data?.descricao,
            };

            dispatch(setDadosSituacaoEncaminhamentoNAAPA(dadosSituacao));
            dispatch(setRecarregarHistorico(true));
            sucesso('Encaminhamento aberto com sucesso');
          }
        })
        .catch(e => erros(e))
        .finally(() => setExibirLoaderReabrir(false));
    }
  };

  const exibirReabrir =
    dadosSituacao?.situacao === situacaoNAAPA.Encerrado && alunoAtivo;

  return exibirReabrir ? (
    <Col>
      <Loader loading={exibirLoaderReabrir}>
        <Button
          border
          label="Reabrir"
          color={Colors.Azul}
          id={SGP_BUTTON_REABRIR_ENCAMINHAMENTO_NAAPA}
          onClick={() => onClickReabrir()}
        />
      </Loader>
    </Col>
  ) : (
    <></>
  );
};

export default BtnReabrirEncaminhamentoNAAPA;
