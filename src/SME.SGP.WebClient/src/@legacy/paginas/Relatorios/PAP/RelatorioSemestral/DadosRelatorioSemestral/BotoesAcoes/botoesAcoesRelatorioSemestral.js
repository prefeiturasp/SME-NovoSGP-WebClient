import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'antd';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import { URL_HOME } from '~/constantes/url';
import {
  setRelatorioSemestralEmEdicao,
  setDadosRelatorioSemestral,
  limparDadosParaSalvarRelatorioSemestral,
} from '~/redux/modulos/relatorioSemestralPAP/actions';
import { confirmar } from '~/servicos/alertas';
import history from '~/servicos/history';
import servicoSalvarRelatorioSemestral from '../../servicoSalvarRelatorioSemestral';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
} from '~/constantes/ids/button';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';

const BotoesAcoesRelatorioSemestral = () => {
  const dispatch = useDispatch();
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const alunosRelatorioSemestral = useSelector(
    store => store.relatorioSemestralPAP.alunosRelatorioSemestral
  );

  const relatorioSemestralEmEdicao = useSelector(
    store => store.relatorioSemestralPAP.relatorioSemestralEmEdicao
  );

  const dadosRelatorioSemestral = useSelector(
    store => store.relatorioSemestralPAP.dadosRelatorioSemestral
  );

  const desabilitarCampos = useSelector(
    store => store.relatorioSemestralPAP.desabilitarCampos
  );

  const onClickSalvar = () => {
    return servicoSalvarRelatorioSemestral.validarSalvarRelatorioSemestral(
      true
    );
  };

  const perguntaAoSalvar = async () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const onClickVoltar = async () => {
    if (!desabilitarCampos && relatorioSemestralEmEdicao) {
      const confirmado = await perguntaAoSalvar();
      if (confirmado) {
        const salvou = await onClickSalvar();
        if (salvou) {
          history.push(URL_HOME);
        }
      } else {
        history.push(URL_HOME);
      }
    } else {
      history.push(URL_HOME);
    }
  };

  const recarregarDados = () => {
    dispatch(limparDadosParaSalvarRelatorioSemestral());
    dispatch(setRelatorioSemestralEmEdicao(false));

    const dados = dadosRelatorioSemestral;
    dispatch(setDadosRelatorioSemestral({ ...dados }));
  };

  const onClickCancelar = async () => {
    if (relatorioSemestralEmEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        recarregarDados();
      }
    }
  };
  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => onClickVoltar && onClickVoltar()} />
      </Col>
      <Col>
        <Button
          id={SGP_BUTTON_CANCELAR}
          label="Cancelar"
          color={Colors.Roxo}
          border
          onClick={onClickCancelar}
          disabled={
            desabilitarCampos ||
            !relatorioSemestralEmEdicao ||
            !alunosRelatorioSemestral ||
            alunosRelatorioSemestral.length < 1 ||
            !alunosRelatorioSemestral
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
          onClick={onClickSalvar}
          disabled={
            ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ||
            desabilitarCampos ||
            !relatorioSemestralEmEdicao
          }
        />
      </Col>
    </Row>
  );
};

export default BotoesAcoesRelatorioSemestral;
