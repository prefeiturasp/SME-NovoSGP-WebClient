import { Col, Row } from 'antd';
import { useSelector } from 'react-redux';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
} from '~/constantes/ids/button';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';

const BotoesAcoesRelatorioPAP = () => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const estudantesRelatorioPAP = useSelector(
    store => store.relatorioPAP.estudantesRelatorioPAP
  );

  const desabilitarCamposRelatorioPAP = useSelector(
    store => store.relatorioPAP.desabilitarCamposRelatorioPAP
  );

  const turmaSelecionadaEhInfantil = ehTurmaInfantil(
    modalidadesFiltroPrincipal,
    turmaSelecionada
  );

  const onClickSalvar = () => {};

  const onClickVoltar = () => {};

  const onClickCancelar = () => {};

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Col>
      <Col>
        <Button
          id={SGP_BUTTON_CANCELAR}
          label="Cancelar"
          color={Colors.Roxo}
          border
          onClick={() => onClickCancelar()}
          disabled={
            desabilitarCamposRelatorioPAP || !estudantesRelatorioPAP.length
          }
        />
      </Col>
      <Col>
        <Button
          id={SGP_BUTTON_SALVAR}
          label="Salvar"
          color={Colors.Roxo}
          border
          bold
          onClick={() => onClickSalvar()}
          disabled={turmaSelecionadaEhInfantil || desabilitarCamposRelatorioPAP}
        />
      </Col>
    </Row>
  );
};

export default BotoesAcoesRelatorioPAP;
