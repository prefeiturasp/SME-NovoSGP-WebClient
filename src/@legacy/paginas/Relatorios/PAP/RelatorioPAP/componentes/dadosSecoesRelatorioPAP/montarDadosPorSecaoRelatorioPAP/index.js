import QuestionarioDinamico from '@/@legacy/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import ServicoRelatorioPAP from '@/@legacy/servicos/Paginas/Relatorios/PAP/RelatorioPAP/ServicoRelatorioPAP';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setQuestionarioDinamicoEmEdicao } from '~/redux/modulos/questionarioDinamico/actions';
import { erros } from '~/servicos';

const MontarDadosPorSecaoRelatorioPAP = props => {
  const dispatch = useDispatch();

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const { dados } = props;

  const estudanteSelecionadoRelatorioPAP = useSelector(
    store => store.relatorioPAP?.estudanteSelecionadoRelatorioPAP
  );

  const desabilitarCamposRelatorioPAP = useSelector(
    store => store.relatorioPAP.desabilitarCamposRelatorioPAP
  );

  const [dadosQuestionarioAtual, setDadosQuestionarioAtual] = useState();

  const obterQuestionario = useCallback(async () => {
    dispatch(setQuestionarioDinamicoEmEdicao(false));

    const resposta = await ServicoRelatorioPAP.obterQuestionario(
      dados?.questionarioId
    ).catch(e => erros(e));

    if (!dadosQuestionarioAtual?.length && resposta?.data) {
      setDadosQuestionarioAtual(resposta.data);
    } else {
      setDadosQuestionarioAtual();
    }
  }, [dados]);

  useEffect(() => {
    if (dados?.questionarioId && estudanteSelecionadoRelatorioPAP?.codigoEOL) {
      obterQuestionario();
    } else {
      setDadosQuestionarioAtual([]);
    }
  }, [dados, estudanteSelecionadoRelatorioPAP, obterQuestionario]);

  return dados?.questionarioId && dadosQuestionarioAtual?.length ? (
    <>
      <QuestionarioDinamico
        codigoAluno={estudanteSelecionadoRelatorioPAP?.codigoEOL}
        codigoTurma={turmaSelecionada?.turma}
        anoLetivo={turmaSelecionada?.anoLetivo}
        dados={dados}
        dadosQuestionarioAtual={dadosQuestionarioAtual}
        desabilitarCampos={desabilitarCamposRelatorioPAP}
        // funcaoRemoverArquivoCampoUpload={
        // TODO
        // ServicoRelatorioPAP.removerArquivo
        // }
        // urlUpload="v1/encaminhamento-aee/upload"
        onChangeQuestionario={() => {
          // TODO fazer no ServicoRelatorioPAP, comentado abaixo para se basear no AEE ou NAAPA
          // ServicoEncaminhamentoAEE.guardarSecaoEmEdicao(dados?.id);
        }}
      />
      {/* <AuditoriaEncaminhamento dadosAuditoria={dados?.auditoria} /> */}
    </>
  ) : (
    <></>
  );
};

export default MontarDadosPorSecaoRelatorioPAP;
