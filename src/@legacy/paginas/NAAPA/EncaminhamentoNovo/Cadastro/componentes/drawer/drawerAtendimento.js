import QuestionarioDinamicoFuncoes from '@/@legacy/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import { Row } from 'antd';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Auditoria } from '~/componentes';
import QuestionarioDinamico from '~/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import { SGP_SECAO } from '~/constantes/ids/questionario-dinamico';
import { setExibirLoaderDrawerAtendimento } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { confirmar, sucesso } from '~/servicos';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import DrawerAtendimentoBotoesAcao from './drawerAtendimentoBotoesAcao';
import LoaderDrawerAtendimento from './loaderDrawerAtendimento';
import { DrawerContainer } from './styles';
import { store } from '@/core/redux';

const onClose = async (onClickSalvar, onCloseDrawer) => {
  const state = store.getState();
  const { questionarioDinamico } = state;
  const { questionarioDinamicoEmEdicao } = questionarioDinamico;

  if (questionarioDinamicoEmEdicao) {
    const confirmou = await confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );

    if (confirmou) {
      onClickSalvar();
    } else {
      onCloseDrawer();
    }
  } else {
    onCloseDrawer();
  }
};

const DrawerAtendimento = ({
  dadosTab,
  atendimentoId,
  mostrarDrawer,
  onCloseDrawer,
  questionarioId,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const encaminhamentoId = id;

  const { aluno, turma, anoLetivo, dre } = useSelector(
    state => state.encaminhamentoNAAPA.dadosEncaminhamentoNAAPA
  );

  const exibirLoaderDrawerAtendimento = useSelector(
    store => store.encaminhamentoNAAPA.exibirLoaderDrawerAtendimento
  );

  const desabilitarCamposEncaminhamentoNAAPA = useSelector(
    store => store.encaminhamentoNAAPA.desabilitarCamposEncaminhamentoNAAPA
  );

  const [dadosQuestionarioAtual, setDadosQuestionarioAtual] = useState();

  const obterDadosAtendimento = useCallback(async () => {
    dispatch(setExibirLoaderDrawerAtendimento(true));

    const resposta = await ServicoNAAPA.obterDadosAtendimento(
      questionarioId,
      atendimentoId
    );

    if (resposta?.data) {
      setDadosQuestionarioAtual(resposta.data);
    } else {
      setDadosQuestionarioAtual([]);
    }

    dispatch(setExibirLoaderDrawerAtendimento(false));
  }, [questionarioId, atendimentoId]);

  const onClickSalvar = async () => {
    if (!desabilitarCamposEncaminhamentoNAAPA) {
      dispatch(setExibirLoaderDrawerAtendimento(true));

      const resposta = await ServicoNAAPA.salvarAtendimento(
        encaminhamentoId,
        atendimentoId
      );

      if (resposta?.status === 200) {
        const mensagem = atendimentoId
          ? 'Atendimento alterado com sucesso'
          : 'Atendimento registrado com sucesso';

        sucesso(mensagem);
        onCloseDrawer({ atualizarDados: true });
      }

      dispatch(setExibirLoaderDrawerAtendimento(false));
    }
  };

  useEffect(() => {
    if (questionarioId && mostrarDrawer) {
      obterDadosAtendimento();
    }
  }, [questionarioId, mostrarDrawer, obterDadosAtendimento]);

  return (
    <DrawerContainer
      width={720}
      zIndex={1100}
      onClose={() => {
        if (exibirLoaderDrawerAtendimento) return;
        onClose(onClickSalvar, onCloseDrawer);
      }}
      title="Atendimento"
      open={mostrarDrawer}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <LoaderDrawerAtendimento>
        <QuestionarioDinamico
          dados={dadosTab}
          anoLetivo={anoLetivo}
          codigoDre={dre?.codigo}
          exibirOrdemLabel={false}
          codigoTurma={turma?.codigo}
          codigoAluno={aluno?.codigoAluno}
          urlUpload="v1/encaminhamento-naapa/secoes-itinerancia/upload"
          dadosQuestionarioAtual={dadosQuestionarioAtual?.questoes}
          prefixId={`${SGP_SECAO}_${dadosTab?.nomeComponente}`}
          desabilitarCampos={desabilitarCamposEncaminhamentoNAAPA}
          funcaoRemoverArquivoCampoUpload={
            ServicoNAAPA.removerArquivoItinerancia
          }
          onChangeQuestionario={() => {
            QuestionarioDinamicoFuncoes.guardarSecaoEmEdicao(dadosTab?.id);
          }}
          montarComboMultiplaEscolhaComplementarComResposta={false}
        />

        <Row gutter={[16, 4]}>
          {dadosQuestionarioAtual?.auditoria?.criadoEm && (
            <Auditoria
              {...dadosQuestionarioAtual?.auditoria}
              ignorarMarginTop
              novaEstrutura
            />
          )}
        </Row>
      </LoaderDrawerAtendimento>

      <div className="ant-drawer-footer">
        <DrawerAtendimentoBotoesAcao
          onClickSalvar={onClickSalvar}
          atendimentoId={atendimentoId}
          onCloseDrawer={onCloseDrawer}
        />
      </div>
    </DrawerContainer>
  );
};

DrawerAtendimento.propTypes = {
  atendimentoId: PropTypes.number,
  mostrarDrawer: PropTypes.bool,
  onCloseDrawer: PropTypes.func,
  questionarioId: PropTypes.number,
  dadosTab: PropTypes.oneOfType([PropTypes.any]),
};

DrawerAtendimento.defaultProps = {
  dadosTab: {},
  atendimentoId: 0,
  questionarioId: 0,
  mostrarDrawer: false,
  onCloseDrawer: () => ({
    atualizarDados: false,
  }),
};

export default DrawerAtendimento;
