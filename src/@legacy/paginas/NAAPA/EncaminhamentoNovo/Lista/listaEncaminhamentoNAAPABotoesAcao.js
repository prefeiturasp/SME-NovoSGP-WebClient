import { ROUTES } from '@/core/enum/routes';
import { Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Button, Colors } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { URL_HOME } from '~/constantes';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import BtnImpressaoEncaminhamentoNAAPA from '../componentes/btnImpressaoNAAPA';

const ListaEncaminhamentoNAAPABotoesAcao = props => {
  const navigate = useNavigate();

  const { somenteConsulta, podeIncluir, idsSelecionados, obterDadosFiltros } =
    props;

  const desabilitarNovo = somenteConsulta || !podeIncluir;

  const onClickVoltar = () => navigate(URL_HOME);

  const onClickNovo = () => {
    const dadosSalvarState = obterDadosFiltros();
    navigate(`${ROUTES.ENCAMINHAMENTO_NAAPA}/novo`, {
      state: dadosSalvarState,
    });
  };

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>
      <Col>
        <BtnImpressaoEncaminhamentoNAAPA idsSelecionados={idsSelecionados} />
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

export default ListaEncaminhamentoNAAPABotoesAcao;
