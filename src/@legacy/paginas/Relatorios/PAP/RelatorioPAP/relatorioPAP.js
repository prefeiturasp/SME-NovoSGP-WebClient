import { store } from '@/core/redux';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '~/componentes';
import { AlertaModalidadeInfantil, Cabecalho } from '~/componentes-sgp';
import { setLimparDadosQuestionarioDinamico } from '~/redux/modulos/questionarioDinamico/actions';
import AlertaSemTurmaPAP from './componentes/alertaSemTurmaPAP';
import AlertaSemTurmaSelecionada from './componentes/alertaSemTurmaSelecionada';
import BotoesAcoesRelatorioPAP from './componentes/botoesAcoes';
import LoaderRelatorioPAP from './componentes/loader';
import SelectPeridosPAP from './componentes/selectPeriodo';
import { Col, Row } from 'antd';
import DadosRelatorioPAP from './componentes/dadosRelatorioPAP';

const RelatorioPAP = () => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  useEffect(() => {
    return () => {
      // TODO - Deve limpar os dados do relatório PAP quando sair da tela
      store.dispatch(setLimparDadosQuestionarioDinamico());
    };
  }, []);

  return (
    <>
      <AlertaSemTurmaSelecionada />
      <AlertaSemTurmaPAP />
      <AlertaModalidadeInfantil />
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
