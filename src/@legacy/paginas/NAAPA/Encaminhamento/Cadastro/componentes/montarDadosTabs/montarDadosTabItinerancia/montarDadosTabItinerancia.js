/* eslint-disable react/prop-types */
import { Col, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Colors } from '~/componentes';
import { SGP_BUTTON_NOVO_ATENDIMENTO } from '~/constantes/ids/button';
import { setListaSecoesEmEdicao } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import {
  setLimparDadosQuestionarioDinamico,
  setQuestionarioDinamicoEmEdicao,
} from '~/redux/modulos/questionarioDinamico/actions';
import DrawerAtendimento from '../../drawer/drawerAtendimento';
import ListaHistoricoAtendimentosPaginada from './listaHistoricoAtendimentosPaginada';
import { setRecarregarHistorico } from '@/@legacy/redux/modulos/historico-paginado/actions';

const MontarDadosTabItinerancia = ({ questionarioId, dadosTab }) => {
  const dispatch = useDispatch();

  const desabilitarCamposEncaminhamentoNAAPA = useSelector(
    store => store.encaminhamentoNAAPA.desabilitarCamposEncaminhamentoNAAPA
  );

  const [atendimentoId, setAtendimentoId] = useState();
  const [mostrarDrawer, setMostrarDrawer] = useState(false);
  const [atualizarTabela, setAtualizarTabela] = useState(false);

  const abrirDrawer = () => {
    setMostrarDrawer(true);
    setAtualizarTabela(false);
  };

  const onClickNovoAtendimento = () => {
    if (!desabilitarCamposEncaminhamentoNAAPA) abrirDrawer();
  };

  const onCloseDrawer = props => {
    const atualizarDados = !!props?.atualizarDados;

    setMostrarDrawer(false);
    setAtendimentoId(undefined);
    if (atualizarDados) {
      setAtualizarTabela(true);
    }
    dispatch(setQuestionarioDinamicoEmEdicao(false));
    dispatch(setLimparDadosQuestionarioDinamico());
    dispatch(setListaSecoesEmEdicao([]));
    dispatch(setRecarregarHistorico(true));
  };

  useEffect(() => {
    if (atendimentoId) {
      abrirDrawer();
    }
  }, [atendimentoId]);

  return (
    <Card padding="20px 20px">
      {mostrarDrawer && (
        <DrawerAtendimento
          dadosTab={dadosTab}
          atendimentoId={atendimentoId}
          mostrarDrawer={mostrarDrawer}
          onCloseDrawer={onCloseDrawer}
          questionarioId={questionarioId}
        />
      )}
      <Col span={24}>
        <Row
          gutter={[16, 16]}
          type="flex"
          justify="center"
          style={{ marginBottom: 20 }}
        >
          <Col>
            <Button
              border
              color={Colors.Roxo}
              label="Novo atendimento"
              id={SGP_BUTTON_NOVO_ATENDIMENTO}
              onClick={() => onClickNovoAtendimento()}
              disabled={desabilitarCamposEncaminhamentoNAAPA}
            />
          </Col>
        </Row>

        <hr />

        <Row
          type="flex"
          justify="center"
          gutter={[16, 16]}
          style={{ marginTop: 20 }}
        >
          <Col span={24}>
            <ListaHistoricoAtendimentosPaginada
              atualizarTabela={atualizarTabela}
              setAtendimentoId={setAtendimentoId}
            />
          </Col>
        </Row>
      </Col>
    </Card>
  );
};

export default MontarDadosTabItinerancia;
