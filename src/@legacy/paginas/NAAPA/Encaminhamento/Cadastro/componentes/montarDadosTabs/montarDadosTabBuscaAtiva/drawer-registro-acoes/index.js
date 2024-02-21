import buscaAtivaService from '@/core/services/busca-ativa-service';
import { Col } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Loader } from '~/componentes';
import QuestionarioDinamico from '~/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import { SGP_SECAO } from '~/constantes/ids/questionario-dinamico';
import { DrawerContainer } from '../../../drawer/styles';

export const DrawerBuscaAtivaRegistroAcoesForm = ({
  mostrarDrawer,
  onCloseDrawer,
  registroAcaoId,
}) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [
    dadosSecoesBuscaAtivaRegistroAcoes,
    setDadosSecoesBuscaAtivaRegistroAcoes,
  ] = useState();
  const [dadosQuestionarioAtual, setDadosQuestionarioAtual] = useState([]);

  const questionarioId = dadosSecoesBuscaAtivaRegistroAcoes?.questionarioId;

  const obterSecoes = useCallback(async () => {
    setExibirLoader(true);
    const resposta = await buscaAtivaService.obterSecoesDeRegistroAcao({
      registroAcaoBuscaAtivaId: registroAcaoId,
    });

    if (resposta.sucesso && resposta.dados?.length) {
      setDadosSecoesBuscaAtivaRegistroAcoes(resposta.dados[0]);
    } else {
      setDadosSecoesBuscaAtivaRegistroAcoes(undefined);
    }

    setExibirLoader(false);
  }, [registroAcaoId]);

  useEffect(() => {
    obterSecoes();
  }, [obterSecoes]);

  const obterQuestoes = useCallback(async () => {
    setExibirLoader(true);

    const resposta = await buscaAtivaService.obterQuestionario(
      questionarioId,
      registroAcaoId
    );

    if (resposta?.sucesso && resposta.dados?.length) {
      setDadosQuestionarioAtual(resposta.dados);
    } else {
      setDadosQuestionarioAtual([]);
    }

    setExibirLoader(false);
  }, [questionarioId, registroAcaoId]);

  useEffect(() => {
    if (questionarioId) {
      obterQuestoes();
    } else {
      setDadosQuestionarioAtual([]);
    }
  }, [questionarioId, obterQuestoes]);

  return (
    <Col xs={24}>
      <DrawerContainer
        width="70%"
        zIndex={1100}
        onClose={onCloseDrawer}
        title="Busca ativa - Registro de ações"
        open={mostrarDrawer}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Loader loading={exibirLoader}>
          {dadosQuestionarioAtual?.length ? (
            <QuestionarioDinamico
              desabilitarCampos
              dados={dadosSecoesBuscaAtivaRegistroAcoes}
              exibirOrdemLabel={false}
              dadosQuestionarioAtual={dadosQuestionarioAtual}
              prefixId={`${SGP_SECAO}_BUSCA_ATIVA_REGISTRO_ACOES`}
            />
          ) : (
            <></>
          )}
        </Loader>
      </DrawerContainer>
    </Col>
  );
};
