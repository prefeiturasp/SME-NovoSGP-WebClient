import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Colors } from '~/componentes';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
} from '~/constantes/ids/button';
import { RotasDto } from '~/dtos';
import { confirmar, erro, erros, history, sucesso } from '~/servicos';
import ServicoArmazenamento from '~/servicos/Componentes/ServicoArmazenamento';
import ServicoDocumentosPlanosTrabalho from '~/servicos/Paginas/Gestao/DocumentosPlanosTrabalho/ServicoDocumentosPlanosTrabalho';

const DocPlanosTrabalhoCadastroBotoesAcoes = props => {
  const {
    form,
    initialValues,
    setExibirLoader,
    idDocumentosPlanoTrabalho,
    desabilitarCampos,
    podeExcluir,
  } = props;

  const modoEdicao = !!form?.values?.modoEdicao;
  const listaUes = form?.values?.listaUes;
  const listaArquivos = form?.values?.listaArquivos;

  const desabilitarExcluir = !idDocumentosPlanoTrabalho || !podeExcluir;

  const desabilitarCadastrar =
    desabilitarCampos || (idDocumentosPlanoTrabalho && !modoEdicao);

  const onClickVoltar = async () => {
    if (!desabilitarCampos && modoEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja voltar para tela de listagem agora?'
      );
      if (confirmado) {
        if (listaArquivos?.length) {
          listaArquivos.forEach(arquivo => {
            if (!arquivo?.documentoId) {
              ServicoArmazenamento.removerArquivo(arquivo?.xhr);
            }
          });
        }
        history.push(RotasDto.DOCUMENTOS_PLANOS_TRABALHO);
      }
    } else {
      history.push(RotasDto.DOCUMENTOS_PLANOS_TRABALHO);
    }
  };
  const onClickCancelar = async () => {
    if (!desabilitarCampos && modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) {
        if (listaArquivos?.length) {
          let contador = 0;
          listaArquivos.forEach(arquivo => {
            if (!arquivo?.documentoId) {
              ServicoArmazenamento.removerArquivo(arquivo?.xhr)
                .then(() => {
                  contador = +1;

                  if (contador === listaArquivos?.length) {
                    form.setFieldValue('listaArquivos', null);
                    form.setFieldValue('modoEdicao', false);
                    form.resetForm();
                  }
                })
                .catch(e => erros(e));
            } else {
              contador = +1;
            }
          });

          if (contador === listaArquivos?.length) {
            form.setFieldValue('listaArquivos', null);
            form.setFieldValue('modoEdicao', false);
            form.resetForm();
          }
        } else {
          form.setFieldValue('listaArquivos', null);
          form.setFieldValue('modoEdicao', false);
          form.resetForm();
        }
      }
    }
  };

  const onClickExcluir = async () => {
    const confirmado = await confirmar(
      'Atenção',
      'Você tem certeza que deseja excluir este registro?'
    );
    if (confirmado) {
      setExibirLoader(true);
      const resultado = await ServicoDocumentosPlanosTrabalho.excluirDocumento(
        idDocumentosPlanoTrabalho
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

      if (resultado && resultado.status === 200) {
        sucesso('Registro excluído com sucesso!');
        history.push(RotasDto.DOCUMENTOS_PLANOS_TRABALHO);
      }
    }
  };

  const onClickCadastrar = async valores => {
    const {
      ueCodigo,
      usuarioId,
      classificacaoId,
      tipoDocumentoId,
      anoLetivo,
    } = valores;

    const ueSelecionada = listaUes.find(
      item => String(item.valor) === String(ueCodigo)
    );

    setExibirLoader(true);
    const existeRegistro = await ServicoDocumentosPlanosTrabalho.validacaoUsuarioDocumento(
      idDocumentosPlanoTrabalho || 0,
      tipoDocumentoId,
      classificacaoId,
      usuarioId,
      ueSelecionada.id
    ).catch(e => {
      erros(e);
      setExibirLoader(false);
    });

    if (existeRegistro?.status !== 200) {
      setExibirLoader(false);
      return;
    }

    if (existeRegistro?.data) {
      erro(
        `Este RF já está vinculado a outro registro do mesmo tipo e classificação no ano letivo ${anoLetivo}`
      );
      setExibirLoader(false);
      return;
    }

    // const arquivoCodigo = listaDeArquivos[0].xhr;
    const params = {
      // arquivoCodigo,
      ueId: ueSelecionada.id,
      tipoDocumentoId,
      classificacaoId,
      usuarioId,
      anoLetivo,
    };

    const resposta = await ServicoDocumentosPlanosTrabalho.salvarDocumento(
      params,
      idDocumentosPlanoTrabalho
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta && resposta.status === 200) {
      sucesso(
        `Registro ${
          idDocumentosPlanoTrabalho ? 'alterado' : 'salvo'
        } com sucesso`
      );
      history.push(RotasDto.DOCUMENTOS_PLANOS_TRABALHO);
    }
  };

  const validaAntesDoSubmit = () => {
    const arrayCampos = Object.keys(initialValues);
    arrayCampos.forEach(campo => {
      form.setFieldTouched(campo, true, true);
    });

    form.validateForm().then(() => {
      if (form.isValid || Object.keys(form.errors).length === 0) {
        onClickCadastrar(form?.values);
      }
    });
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
          onClick={() => onClickCancelar(form)}
          disabled={!modoEdicao}
        />
      </Col>
      <Col>
        <BotaoExcluirPadrao
          disabled={desabilitarExcluir}
          onClick={onClickExcluir}
        />
      </Col>
      <Col>
        <Button
          id={SGP_BUTTON_ALTERAR_CADASTRAR}
          label={idDocumentosPlanoTrabalho ? 'Alterar' : 'Cadastrar'}
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

DocPlanosTrabalhoCadastroBotoesAcoes.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
  initialValues: PropTypes.oneOfType([PropTypes.any]),
  idDocumentosPlanoTrabalho: PropTypes.oneOfType([PropTypes.any]),
  setExibirLoader: PropTypes.oneOfType([PropTypes.any]),
  desabilitarCampos: PropTypes.bool,
  podeExcluir: PropTypes.bool,
};

DocPlanosTrabalhoCadastroBotoesAcoes.defaultProps = {
  form: null,
  initialValues: {},
  idDocumentosPlanoTrabalho: 0,
  setExibirLoader: null,
  desabilitarCampos: false,
  podeExcluir: false,
};

export default DocPlanosTrabalhoCadastroBotoesAcoes;