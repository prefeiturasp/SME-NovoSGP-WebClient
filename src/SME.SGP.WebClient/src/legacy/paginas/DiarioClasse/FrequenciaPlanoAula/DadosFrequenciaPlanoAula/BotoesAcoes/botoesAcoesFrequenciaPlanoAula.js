import { Col, Row } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
} from '~/constantes/ids/button';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import { URL_HOME } from '~/constantes';
import {
  setExibirCardCollapseFrequencia,
  setLimparDadosPlanoAula,
  setModoEdicaoFrequencia,
  setModoEdicaoPlanoAula,
} from '~/redux/modulos/frequenciaPlanoAula/actions';
import { confirmar, history } from '~/servicos';
import ServicoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoFrequencia';
import servicoSalvarFrequenciaPlanoAula from '../../servicoSalvarFrequenciaPlanoAula';

const BotoesAcoesFrequenciaPlanoAula = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const modoEdicaoFrequencia = useSelector(
    state => state.frequenciaPlanoAula.modoEdicaoFrequencia
  );

  const modoEdicaoPlanoAula = useSelector(
    state => state.frequenciaPlanoAula.modoEdicaoPlanoAula
  );

  const somenteConsulta = useSelector(
    state => state.frequenciaPlanoAula.somenteConsulta
  );

  const idFrequencia = useSelector(
    state => state.frequenciaPlanoAula.listaDadosFrequencia?.id
  );

  const aulaIdPodeEditar = useSelector(
    state => state.frequenciaPlanoAula?.aulaIdPodeEditar
  );

  const onClickSalvar = async () => {
    servicoSalvarFrequenciaPlanoAula.validarSalvarFrequenciPlanoAula();
  };

  const pergutarParaSalvar = () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const irParaHome = () => {
    if (location?.state?.rotaOrigem) {
      history.push(location.state.rotaOrigem);
    } else {
      history.push(URL_HOME);
    }
  };

  const onClickVoltar = async () => {
    if ((modoEdicaoFrequencia || modoEdicaoPlanoAula) && aulaIdPodeEditar) {
      const confirmado = await pergutarParaSalvar();
      if (confirmado) {
        const salvou = await servicoSalvarFrequenciaPlanoAula.validarSalvarFrequenciPlanoAula();
        if (salvou) {
          irParaHome();
        }
      } else {
        irParaHome();
      }
    } else {
      irParaHome();
    }
  };

  const onClickCancelar = async () => {
    if ((modoEdicaoFrequencia || modoEdicaoPlanoAula) && aulaIdPodeEditar) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        ServicoFrequencia.obterListaFrequencia();
        dispatch(setExibirCardCollapseFrequencia(false));
        dispatch(setModoEdicaoFrequencia(false));
        dispatch(setLimparDadosPlanoAula());
        dispatch(setModoEdicaoPlanoAula(false));
      }
    }
  };

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
          onClick={onClickCancelar}
          disabled={
            somenteConsulta || (!modoEdicaoFrequencia && !modoEdicaoPlanoAula)
          }
        />
      </Col>
      <Col>
        <Button
          id={SGP_BUTTON_ALTERAR_CADASTRAR}
          label={idFrequencia ? 'Alterar' : 'Cadastrar'}
          color={Colors.Roxo}
          border
          bold
          onClick={onClickSalvar}
          disabled={
            somenteConsulta ||
            (!modoEdicaoFrequencia && !modoEdicaoPlanoAula) ||
            !aulaIdPodeEditar
          }
        />
      </Col>
    </Row>
  );
};

export default BotoesAcoesFrequenciaPlanoAula;
