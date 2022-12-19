import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  ExibirHistorico,
  AnoLetivo,
  Dre,
  Ue,
  Modalidade,
  Semestre,
  Turma,
} from '~/componentes-sgp/inputs';
import { ClassificacaoDocumento } from '~/componentes-sgp/inputs/classificacaoDocumento';
import { TipoDocumento } from '~/componentes-sgp/inputs/tipoDocumento';
import UploadArquivos from '~/componentes-sgp/UploadArquivos/uploadArquivos';
import { erros, sucesso } from '~/servicos';
import ServicoArmazenamento from '~/servicos/Componentes/ServicoArmazenamento';
import { Auditoria, Localizador } from '~/componentes';

const DocPlanosTrabalhoCadastroForm = props => {
  const { form, desabilitarCampos, idDocumentosPlanoTrabalho } = props;

  const usuario = useSelector(store => store.usuario);

  const TIPO_DOCUMENTO = {
    DOCUMENTOS: '2',
  };

  const auditoria = form?.initialValues?.auditoria;

  const onRemoveFile = async arquivo => {
    if (!desabilitarCampos) {
      const codigoArquivo = arquivo.xhr;

      if (arquivo.documentoId) {
        form.setFieldValue('listaArquivos', []);
        sucesso(`Arquivo ${arquivo.name} removido com sucesso`);
        return true;
      }

      const resposta = await ServicoArmazenamento.removerArquivo(
        codigoArquivo
      ).catch(e => erros(e));

      if (resposta?.status === 200) {
        sucesso(`Arquivo ${arquivo.name} removido com sucesso`);
        return true;
      }
      return false;
    }
    return false;
  };

  const onChangeTipoDocumento = tipo => {
    form.setFieldValue('professorRf', '');
    form.setFieldValue('professorNome', '');
    form.setFieldValue('usuarioId', '');

    if (tipo === TIPO_DOCUMENTO.DOCUMENTOS) {
      setTimeout(() => {
        form.setFieldValue('professorRf', usuario.rf);
      }, 600);
    }
  };

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col sm={24}>
          <ExibirHistorico form={form} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col sm={24} md={8} lg={4}>
          <AnoLetivo form={form} />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Dre form={form} mostrarOpcaoTodas={false} />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Ue form={form} mostrarOpcaoTodas={false} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col sm={24} md={12}>
          <TipoDocumento form={form} onChange={onChangeTipoDocumento} />
        </Col>
        <Col sm={24} md={12}>
          <ClassificacaoDocumento form={form} />
        </Col>
      </Row>

      {/* <Row gutter={[16, 16]}>
        <Col sm={24} md={12} lg={8}>
          <Modalidade form={form} mostrarOpcaoTodas={false} />
        </Col>

        <Col sm={24} md={12} lg={6}>
          <Semestre form={form} />
        </Col>

        <Col sm={24} lg={10}>
          <Turma form={form} mostrarOpcaoTodas={false} />
        </Col>
      </Row> */}
      <Row gutter={[16, 16]}>
        <Localizador
          novaEstrutura
          desabilitado={
            !form.values.tipoDocumentoId ||
            form.values.tipoDocumentoId === TIPO_DOCUMENTO.DOCUMENTOS ||
            !!idDocumentosPlanoTrabalho ||
            desabilitarCampos
          }
          dreId={form.values.dreCodigo}
          ueId={form.values.ueCodigo}
          anoLetivo={form.values.anoLetivo}
          rfEdicao={form.values.professorRf}
          showLabel
          form={form}
          onChange={valor => {
            const campos = Object.keys(valor);
            const onChangeManual = campos.find(
              item => item === 'professorNome'
            );
            if (
              !idDocumentosPlanoTrabalho &&
              onChangeManual === 'professorNome'
            ) {
              const estaEmModoEdicao = !(
                !form.values.tipoDocumentoId ||
                form.values.tipoDocumentoId === TIPO_DOCUMENTO.DOCUMENTOS ||
                desabilitarCampos
              );
              if (estaEmModoEdicao) {
                form.setFieldValue('modoEdicao', true);
              }
            }
          }}
          buscarOutrosCargos={
            form.values.tipoDocumentoId === TIPO_DOCUMENTO.DOCUMENTOS
          }
          labelRequired
        />
      </Row>
      <Row gutter={[16, 16]}>
        <Col sm={24}>
          <UploadArquivos
            form={form}
            name="listaArquivos"
            id="lista-arquivos"
            desabilitarGeral={desabilitarCampos}
            desabilitarUpload={form?.values?.listaArquivos.length > 0}
            textoFormatoUpload="Permitido somente um arquivo. Tipo permitido PDF"
            tiposArquivosPermitidos=".pdf"
            onRemove={onRemoveFile}
            urlUpload="v1/armazenamento/documentos/upload"
            defaultFileList={form?.initialValues?.listaArquivos}
            label="Arquivo"
            labelRequired
            onChangeListaArquivos={() => {
              form.setFieldValue('modoEdicao', true);
            }}
          />
        </Col>
      </Row>
      {auditoria?.criadoRF && (
        <Auditoria
          {...auditoria}
          criadoRf={auditoria.criadoRF}
          alteradoRf={auditoria.alteradoRF}
        />
      )}
    </Col>
  );
};

DocPlanosTrabalhoCadastroForm.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
  desabilitarCampos: PropTypes.bool,
  idDocumentosPlanoTrabalho: PropTypes.oneOfType([PropTypes.any]),
};

DocPlanosTrabalhoCadastroForm.defaultProps = {
  form: null,
  desabilitarCampos: false,
  idDocumentosPlanoTrabalho: 0,
};

export default DocPlanosTrabalhoCadastroForm;
