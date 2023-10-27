import { Button, Colors } from '@/@legacy/componentes';
import BotaoVoltarPadrao from '@/@legacy/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_BUTTON_NOVO } from '@/@legacy/constantes/ids/button';
import { ROUTES } from '@/core/enum/routes';
import { Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { URL_HOME } from '~/constantes';

const ListaInformesBotoesAcoes = props => {
  const navigate = useNavigate();

  const { somenteConsulta, podeIncluir } = props;

  const desabilitarNovo = somenteConsulta || !podeIncluir;

  const onClickVoltar = () => navigate(URL_HOME);

  const onClickNovo = () => navigate(`${ROUTES.INFORMES}/novo`);

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>
      <Col>
        <Button
          bold
          border
          label="Novo"
          color={Colors.Roxo}
          id={SGP_BUTTON_NOVO}
          onClick={onClickNovo}
          disabled={desabilitarNovo}
        />
      </Col>
    </Row>
  );
};

export default ListaInformesBotoesAcoes;
