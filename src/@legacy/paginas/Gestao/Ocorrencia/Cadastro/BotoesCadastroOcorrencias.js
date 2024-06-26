/* eslint-disable react/prop-types */
import React from 'react';
import { Col, Row } from 'antd';
import { Button, Colors } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_IMPRIMIR,
} from '~/constantes/ids/button';
import { confirmar, erros, ServicoOcorrencias, sucesso } from '~/servicos';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import { ROUTES } from '@/core/enum/routes';
import { useNavigate } from 'react-router-dom';

const BotoesCadastroOcorrencias = props => {
  const {
    form,
    initialValues,
    ocorrenciaId,
    modoEdicao,
    setModoEdicao,
    somenteConsulta,
    desabilitar,
    podeExcluir,
    listaUes,
  } = props;

  const navigate = useNavigate();

  const { anoLetivo, dreId, ueId, turmaId, codigosAlunos } = form?.values;

  const dreCodigo = ocorrenciaId
    ? form?.initialValues?.dreCodigo
    : listaUes?.find(d => Number(d?.id) === Number(dreId))?.codigo;

  const ueCodigo = ocorrenciaId
    ? form?.initialValues?.ueCodigo
    : listaUes?.find(d => Number(d?.id) === Number(ueId))?.codigo;

  const ehTurmaAnoAnterior = anoLetivo
    ? anoLetivo?.toString() !== window.moment().format('YYYY')
    : false;

  const validaAntesDoSubmit = () => {
    const arrayCampos = Object.keys(initialValues);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });
    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length === 0) {
        form.submitForm(form);
      }
    });
  };

  const onClickVoltar = async () => {
    if (modoEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );
      if (confirmado) {
        validaAntesDoSubmit(form);
      } else {
        navigate(ROUTES.OCORRENCIAS);
      }
    } else {
      navigate(ROUTES.OCORRENCIAS);
    }
  };

  const onClickCancelar = async () => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );

      if (confirmou) {
        form.setFieldValue('dataOcorrencia', initialValues?.dataOcorrencia);
        form.setFieldValue('horaOcorrencia', initialValues?.horaOcorrencia);
        form.setFieldValue('ocorrenciaTipoId', initialValues?.ocorrenciaTipoId);
        form.setFieldValue('titulo', initialValues?.titulo);
        form.setFieldValue('descricao', initialValues?.descricao);
        form.setFieldValue('codigosAlunos', initialValues?.codigosAlunos);
        form.setFieldValue(
          'codigosServidores',
          initialValues?.codigosServidores
        );
        setModoEdicao(false);
      }
    }
  };

  const onClickGerar = async () => {
    const params = {
      dreCodigo,
      ueCodigo,
      turmaId,
      ocorrenciasIds: [ocorrenciaId],
    };
    const retorno = await ServicoOcorrencias.gerar(params).catch(e => erros(e));

    if (retorno?.status === 200) {
      sucesso(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
      );
    }
  };

  const onClickExcluir = async () => {
    const confirmado = await confirmar(
      'Atenção',
      'Você tem certeza que deseja excluir este registro?'
    );
    if (confirmado) {
      const parametros = { data: [ocorrenciaId] };
      const retorno = await ServicoOcorrencias.excluir(parametros).catch(e =>
        erros(e)
      );
      if (retorno?.status === 200) {
        sucesso('Registro excluído com sucesso');
        navigate(ROUTES.OCORRENCIAS);
      }
    }
  };

  const desabilitarCadastrar =
    ehTurmaAnoAnterior ||
    somenteConsulta ||
    desabilitar ||
    (ocorrenciaId && !modoEdicao);

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={onClickVoltar} />
      </Col>
      <Col>
        <Button
          id={SGP_BUTTON_IMPRIMIR}
          icon="print"
          color={Colors.Azul}
          semMargemDireita
          border
          onClick={onClickGerar}
          disabled={!ocorrenciaId || !codigosAlunos?.length || modoEdicao}
        />
      </Col>
      <Col>
        <Button
          id={SGP_BUTTON_CANCELAR}
          label="Cancelar"
          color={Colors.Azul}
          border
          onClick={onClickCancelar}
          disabled={
            !modoEdicao || ehTurmaAnoAnterior || somenteConsulta || desabilitar
          }
        />
      </Col>
      {ocorrenciaId ? (
        <Col>
          <BotaoExcluirPadrao
            onClick={onClickExcluir}
            disabled={ehTurmaAnoAnterior || somenteConsulta || !podeExcluir}
          />
        </Col>
      ) : (
        <></>
      )}
      <Col>
        <Button
          id={SGP_BUTTON_ALTERAR_CADASTRAR}
          label={ocorrenciaId ? 'Alterar' : 'Cadastrar'}
          color={Colors.Roxo}
          border
          bold
          onClick={() => validaAntesDoSubmit(form)}
          disabled={desabilitarCadastrar}
        />
      </Col>
    </Row>
  );
};

export default BotoesCadastroOcorrencias;
