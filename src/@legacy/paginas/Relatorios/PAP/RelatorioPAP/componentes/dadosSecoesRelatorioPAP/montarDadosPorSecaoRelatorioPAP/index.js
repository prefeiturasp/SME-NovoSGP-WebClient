import { Auditoria } from '@/@legacy/componentes';
import QuestionarioDinamicoFuncoes from '@/@legacy/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import QuestionarioDinamico from '@/@legacy/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import ServicoRelatorioPAP from '@/@legacy/servicos/Paginas/Relatorios/PAP/RelatorioPAP/ServicoRelatorioPAP';
import { Col, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
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
  const periodoSelecionadoPAP = useSelector(
    store => store.relatorioPAP?.periodoSelecionadoPAP
  );
  const desabilitarCamposRelatorioPAP = useSelector(
    store => store.relatorioPAP.desabilitarCamposRelatorioPAP
  );

  const [dadosQuestionarioAtual, setDadosQuestionarioAtual] = useState();

  const obterQuestionario = useCallback(async () => {
    dispatch(setQuestionarioDinamicoEmEdicao(false));
    const parametros = {
      turmaCodigo: turmaSelecionada.turma,
      alunoCodigo: estudanteSelecionadoRelatorioPAP.codigoEOL,
      periodoRelatorioPAPId: periodoSelecionadoPAP.periodoRelatorioPAPId,
      questionarioId: dados?.questionarioId,
    };
    const resposta = await ServicoRelatorioPAP.obterQuestionario(
      parametros
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
    <Row>
      <Col span={24}>
        <QuestionarioDinamico
          codigoAluno={estudanteSelecionadoRelatorioPAP?.codigoEOL}
          codigoTurma={turmaSelecionada?.turma}
          anoLetivo={turmaSelecionada?.anoLetivo}
          dados={dados}
          dadosQuestionarioAtual={dadosQuestionarioAtual}
          desabilitarCampos={desabilitarCamposRelatorioPAP}
          funcaoRemoverArquivoCampoUpload={ServicoRelatorioPAP.removerArquivo}
          urlUpload="v1/relatorios/pap/upload"
          onChangeQuestionario={() => {
            QuestionarioDinamicoFuncoes.guardarSecaoEmEdicao(dados?.id);
          }}
        />
      </Col>
      {dados?.auditoria?.criadoEm && (
        <Col span={24} style={{ marginLeft: -14 }}>
          <Auditoria
            alteradoEm={dados?.auditoria?.alteradoEm}
            alteradoPor={dados?.auditoria?.alteradoPor}
            alteradoRf={dados?.auditoria?.alteradoRF}
            criadoEm={dados?.auditoria?.criadoEm}
            criadoPor={dados?.auditoria?.criadoPor}
            criadoRf={dados?.auditoria?.criadoRF}
            ignorarMarginTop
          />
        </Col>
      )}
    </Row>
  ) : (
    <></>
  );
};

export default React.memo(MontarDadosPorSecaoRelatorioPAP);
