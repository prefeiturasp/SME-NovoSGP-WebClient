import {
  limparDadosRelatorioPAP,
  setEstudantesRelatorioPAP,
} from '@/@legacy/redux/modulos/relatorioPAP/actions';
import { Col, Row } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '~/componentes';
import { AlertaModalidadeInfantil, Cabecalho } from '~/componentes-sgp';
import {
  setLimparDadosQuestionarioDinamico,
  setListaSecoesEmEdicao,
} from '~/redux/modulos/questionarioDinamico/actions';
import AlertaDentroPeriodoPAP from './componentes/alertaDentroPeriodoPAP';
import AlertaSemTurmaPAP from './componentes/alertaSemTurmaPAP';
import AlertaSemTurmaSelecionada from './componentes/alertaSemTurmaSelecionada';
import BotoesAcoesRelatorioPAP from './componentes/botoesAcoes';
import DadosRelatorioPAP from './componentes/dadosRelatorioPAP';
import LoaderRelatorioPAP from './componentes/loader';
import SelectPeridosPAP from './componentes/selectPeriodo';

const RelatorioPAP = () => {
  const dispatch = useDispatch();
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  useEffect(() => {
    return () => {
      dispatch(setEstudantesRelatorioPAP([]));
      dispatch(limparDadosRelatorioPAP());
      dispatch(setListaSecoesEmEdicao([]));
      dispatch(setLimparDadosQuestionarioDinamico());
    };
  }, [dispatch]);

  return (
    <>
      <AlertaSemTurmaSelecionada />
      <AlertaSemTurmaPAP />
      <AlertaModalidadeInfantil />
      <AlertaDentroPeriodoPAP />
      <LoaderRelatorioPAP>
        <Cabecalho pagina="Relatório de PAP">
          <BotoesAcoesRelatorioPAP />
        </Cabecalho>

        <Card padding="24px 24px">
          {turmaSelecionada?.turma ? (
            <Col span={24}>
              <Row gutter={[16, 16]}>
                <SelectPeridosPAP />
                <DadosRelatorioPAP />
              </Row>
            </Col>
          ) : (
            <></>
          )}
        </Card>
      </LoaderRelatorioPAP>
    </>
  );
};

export default RelatorioPAP;
