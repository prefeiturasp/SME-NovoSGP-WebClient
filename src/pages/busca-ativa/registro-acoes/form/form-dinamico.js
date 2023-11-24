import QuestionarioDinamicoFuncoes from '@/@legacy/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import QuestionarioDinamico from '@/@legacy/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import { SGP_SECAO } from '@/@legacy/constantes/ids/questionario-dinamico';
import { setLimparDadosQuestionarioDinamico } from '@/@legacy/redux/modulos/questionarioDinamico/actions';
import buscaAtivaService from '@/core/services/busca-ativa-service';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  setDadosSecoesBuscaAtivaRegistroAcoes,
  setExibirLoaderBuscaAtivaRegistroAcoes,
  setLimparDadosBuscaAtivaRegistroAcoes,
} from '~/redux/modulos/buscaAtivaRegistroAcoes/actions';

const BuscaAtivaRegistroAcoesFormDinamico = () => {
  const dispatch = useDispatch();
  const paramsRoute = useParams();

  const dadosSecoesBuscaAtivaRegistroAcoes = useSelector(
    state => state.buscaAtivaRegistroAcoes?.dadosSecoesBuscaAtivaRegistroAcoes
  );

  const [dadosQuestionarioAtual, setDadosQuestionarioAtual] = useState([]);

  const registroAcaoId = paramsRoute?.id || 0;
  const questionarioId = dadosSecoesBuscaAtivaRegistroAcoes?.questionarioId;

  const obterQuestoes = useCallback(async () => {
    dispatch(setExibirLoaderBuscaAtivaRegistroAcoes(true));

    const resposta = await buscaAtivaService.obterQuestionario(
      questionarioId,
      registroAcaoId
    );

    if (resposta?.sucesso && resposta.dados?.length) {
      setDadosQuestionarioAtual(resposta.dados);
    } else {
      setDadosQuestionarioAtual([]);
    }

    dispatch(setExibirLoaderBuscaAtivaRegistroAcoes(false));
  }, [questionarioId, registroAcaoId]);

  useEffect(() => {
    if (questionarioId) {
      obterQuestoes();
    } else {
      setDadosQuestionarioAtual([]);
      dispatch(setLimparDadosQuestionarioDinamico());
    }
  }, [questionarioId, obterQuestoes]);

  useEffect(() => {
    return () => {
      dispatch(setLimparDadosQuestionarioDinamico());
    };
  }, []);

  const obterSecoes = async () => {
    const resposta = await buscaAtivaService.obterSecoesDeRegistroAcao();

    if (resposta.sucesso && resposta.dados?.length) {
      dispatch(setDadosSecoesBuscaAtivaRegistroAcoes(resposta.dados[0]));
    } else {
      dispatch(setDadosSecoesBuscaAtivaRegistroAcoes([]));
    }
  };

  useEffect(() => {
    obterSecoes();
  }, []);

  useEffect(() => {
    return () => {
      dispatch(setLimparDadosBuscaAtivaRegistroAcoes());
      dispatch(setLimparDadosQuestionarioDinamico());
    };
  }, []);

  return (
    <>
      {dadosQuestionarioAtual?.length ? (
        <QuestionarioDinamico
          dados={dadosSecoesBuscaAtivaRegistroAcoes}
          exibirOrdemLabel={false}
          dadosQuestionarioAtual={dadosQuestionarioAtual}
          prefixId={`${SGP_SECAO}_BUSCA_ATIVA_REGISTRO_ACOES`}
          onChangeQuestionario={() => {
            QuestionarioDinamicoFuncoes.guardarSecaoEmEdicao(
              dadosQuestionarioAtual?.id
            );
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default BuscaAtivaRegistroAcoesFormDinamico;
