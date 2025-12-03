import { ROUTES } from '@/core/enum/routes';
import { Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Button, Colors } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { URL_HOME } from '~/constantes';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import BtnImpressaoEncaminhamentoNAAPA from '../componentes/btnImpressaoNAAPA';

const ListaAtendimentoNAAPABotoesAcao = props => {
  const navigate = useNavigate();

  const { somenteConsulta, podeIncluir, idsSelecionados, obterDadosFiltros } =
    props;

  const desabilitarNovo = somenteConsulta || !podeIncluir;

  const onClickVoltar = () => navigate(URL_HOME);

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>
      <Col>
        <BtnImpressaoEncaminhamentoNAAPA idsSelecionados={idsSelecionados} />
      </Col>
    </Row>
  );
};

export default ListaAtendimentoNAAPABotoesAcao;
