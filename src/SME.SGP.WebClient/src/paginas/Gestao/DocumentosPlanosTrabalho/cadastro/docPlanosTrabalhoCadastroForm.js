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
import { ComponenteCurricular } from '~/componentes-sgp/inputs/componenteCurricular';
import { TIPO_CLASSIFICACAO, TIPO_DOCUMENTO } from '~/constantes';
import { SGP_UPLOAD_DOCUMENTOS_PLANOS_DE_TRABALHO } from '~/constantes/ids/upload';

const DocPlanosTrabalhoCadastroForm = props => {
  const { form, desabilitarCampos, idDocumentosPlanoTrabalho } = props;

  const usuario = useSelector(store => store.usuario);

  const auditoria = form?.initialValues?.auditoria;
  const classificacaoId = form?.values?.classificacaoId;

  const ehClassificacaoDocumentosTurma =
    classificacaoId?.toString() === TIPO_CLASSIFICACAO.DOCUMENTOS_DA_TURMA;

  const desabilitarUpload = !ehClassificacaoDocumentosTurma
    ? form?.values?.listaArquivos?.length > 0
    : false;

  const tiposArquivosDocTurma =
    '.docx,.doc,.xls,.xlsx,.ppt,.pptx,.txt,.pdf,.jpeg,.jpg,.png';

  const tiposArquivosPermitidos = ehClassificacaoDocumentosTurma
    ? tiposArquivosDocTurma
    : '.pdf';

  const textoFormatoUpload = ehClassificacaoDocumentosTurma
    ? ''
    : 'Permitido somente um arquivo. Tipo permitido PDF';

  const onRemoveFile = async arquivo => {
    if (!desabilitarCampos) {
      const codigoArquivo = arquivo?.xhr;

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

  const limparDadosLocalizados = () => {
    form.setFieldValue('professorRf', '');
    form.setFieldValue('professorNome', '');
    form.setFieldValue('usuarioId', '');
  };

  const onChangeTipoDocumento = tipo => {
    limparDadosLocalizados();

    if (tipo === TIPO_DOCUMENTO.DOCUMENTOS) {
      setTimeout(() => {
        form.setFieldValue('professorRf', usuario.rf);
      }, 600);
    }
  };

  const onChangeClassificacao = id => {
    if (form.values.tipoDocumentoId?.toString() === TIPO_DOCUMENTO.DOCUMENTOS) {
      if (id === TIPO_CLASSIFICACAO.DOCUMENTOS_DA_TURMA) {
        limparDadosLocalizados();
      } else if (
        !form?.values?.professorNome ||
        form?.values?.professorRf !== usuario.rf
      ) {
        limparDadosLocalizados();

        setTimeout(() => {
          form.setFieldValue('professorRf', usuario.rf);
        }, 600);
      }
    } else {
      limparDadosLocalizados();
    }
  };

  return (
    <Col span={24}>
      {!idDocumentosPlanoTrabalho && (
        <Row gutter={[16, 16]}>
          <Col sm={24}>
            <ExibirHistorico form={form} disabled={desabilitarCampos} />
          </Col>
        </Row>
      )}

      <Row gutter={[16, 16]}>
        <Col sm={24} md={8} lg={4}>
          <AnoLetivo
            form={form}
            disabled={desabilitarCampos || !!idDocumentosPlanoTrabalho}
          />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Dre
            form={form}
            disabled={desabilitarCampos || !!idDocumentosPlanoTrabalho}
            mostrarOpcaoTodas={false}
          />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Ue
            form={form}
            disabled={desabilitarCampos || !!idDocumentosPlanoTrabalho}
            mostrarOpcaoTodas={false}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col sm={24} md={12}>
          <TipoDocumento
            form={form}
            disabled={desabilitarCampos || !!idDocumentosPlanoTrabalho}
            onChange={onChangeTipoDocumento}
            labelRequired
          />
        </Col>
        <Col sm={24} md={12}>
          <ClassificacaoDocumento
            form={form}
            disabled={desabilitarCampos || !!idDocumentosPlanoTrabalho}
            onChange={onChangeClassificacao}
            labelRequired
          />
        </Col>
      </Row>
      {ehClassificacaoDocumentosTurma && (
        <Row gutter={[16, 16]}>
          <Col sm={24} md={12} lg={8}>
            <Modalidade
              form={form}
              mostrarOpcaoTodas={false}
              disabled={desabilitarCampos || !!idDocumentosPlanoTrabalho}
            />
          </Col>

          <Col sm={24} md={12} lg={6}>
            <Semestre form={form} />
          </Col>

          <Col sm={24} md={12} lg={10}>
            <Turma
              form={form}
              mostrarOpcaoTodas={false}
              disabled={desabilitarCampos || !!idDocumentosPlanoTrabalho}
            />
          </Col>
          <Col sm={24} md={12} lg={24}>
            <ComponenteCurricular
              form={form}
              disabled={desabilitarCampos || !!idDocumentosPlanoTrabalho}
            />
          </Col>
        </Row>
      )}
      <Row gutter={[16, 16]}>
        <Localizador
          novaEstrutura
          desabilitado={
            !form.values.tipoDocumentoId ||
            (form.values.tipoDocumentoId === TIPO_DOCUMENTO.DOCUMENTOS &&
              classificacaoId?.toString() !==
                TIPO_CLASSIFICACAO.DOCUMENTOS_DA_TURMA) ||
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
                (form.values.tipoDocumentoId === TIPO_DOCUMENTO.DOCUMENTOS &&
                  classificacaoId?.toString() !==
                    TIPO_CLASSIFICACAO.DOCUMENTOS_DA_TURMA) ||
                desabilitarCampos
              );
              if (estaEmModoEdicao) {
                form.setFieldValue('modoEdicao', true);
              }
            }
          }}
          buscarOutrosCargos={
            !!(
              form.values.tipoDocumentoId === TIPO_DOCUMENTO.DOCUMENTOS &&
              classificacaoId?.toString() !==
                TIPO_CLASSIFICACAO.DOCUMENTOS_DA_TURMA
            )
          }
          labelRequired
        />
      </Row>
      <Row gutter={[16, 16]}>
        <Col sm={24}>
          <UploadArquivos
            form={form}
            name="listaArquivos"
            id={SGP_UPLOAD_DOCUMENTOS_PLANOS_DE_TRABALHO}
            desabilitarGeral={desabilitarCampos}
            desabilitarUpload={desabilitarUpload}
            textoFormatoUpload={textoFormatoUpload}
            tiposArquivosPermitidos={tiposArquivosPermitidos}
            onRemove={onRemoveFile}
            urlUpload="v1/armazenamento/documentos/upload"
            defaultFileList={form?.initialValues?.listaArquivos || []}
            label="Arquivo"
            labelRequired
            onChangeListaArquivos={() => {
              form.setFieldValue('modoEdicao', true);
            }}
          />
        </Col>
      </Row>
      <Row gutter={[24]}>
        {auditoria?.criadoEm && <Auditoria {...auditoria} />}
      </Row>
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
