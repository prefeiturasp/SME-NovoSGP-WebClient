import { ROUTES } from '@/core/enum/routes';
import { Col, Row, Dropdown, Button as AntButton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Button, Colors } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { URL_HOME } from '~/constantes';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import BtnImpressaoEncaminhamentoNAAPA from '../componentes/btnImpressaoNAAPA';
import './listaEncaminhamentoNAAPABotoesAcao.css';

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

  const onClickNovoInstitucional = () => {
    const dadosSalvarState = obterDadosFiltros();
    navigate(`${ROUTES.ENCAMINHAMENTO_NAAPA_INSTITUCIONAL}/novo`, {
      state: dadosSalvarState,
    });
  };

  const items = [
    {
      key: '1',
      label: (
        <button className="btnDropNovoEcaminhamentoItem" onClick={onClickNovo}>
          Encaminhamento Individual
        </button>
      ),
    },
    {
      key: '2',
      label: (
        <button
          className="btnDropNovoEcaminhamentoItem"
          onClick={onClickNovoInstitucional}
        >
          Encaminhamento Institucional
        </button>
      ),
    },
  ];

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>
      <Col>
        <Dropdown
          disabled={desabilitarNovo}
          menu={{ items, selectable: false }}
          placement="bottomLeft"
          overlayClassName="dropdownNovoEncaminhamento"
        >
          <AntButton
            disabled={desabilitarNovo}
            className="btnDropNovoEcaminhamento"
          >
            Novo Encaminhamento
          </AntButton>
        </Dropdown>
      </Col>
    </Row>
  );
};

export default ListaEncaminhamentoNAAPABotoesAcao;
