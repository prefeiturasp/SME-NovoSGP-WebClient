import { SelectPerfis } from '@/@legacy/componentes-sgp/inputs/perfis';
import { SGP_INPUT_TITULO } from '@/@legacy/constantes/ids/input';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { Auditoria, CampoTexto, JoditEditor } from '~/componentes';
import { Dre, Ue } from '~/componentes-sgp/inputs';
import UploadArquivos from '~/componentes-sgp/UploadArquivos/uploadArquivos';
import { SGP_UPLOAD_INFORMES } from '~/constantes/ids/upload';
import { erros, sucesso } from '~/servicos';
import ServicoArmazenamento from '~/servicos/Componentes/ServicoArmazenamento';

const InformesCadastroForm = props => {
  const { form, desabilitarCampos, setExibirLoader } = props;

  const auditoria = form?.initialValues?.auditoria;
  const textoInicial = form?.initialValues?.texto;
  const modoEdicao = form?.values?.modoEdicao;
  const TAMANHO_MAXIMO_UPLOAD = 10;
  const TOTAL_ARQUIVOS_UPLOAD = 10;

  const editorRef = useRef(null);

  useEffect(() => {
    if (!modoEdicao && editorRef?.current?.setEditorValue) {
      editorRef?.current?.setEditorValue(textoInicial);
    }
  }, [modoEdicao, textoInicial]);

  const tiposArquivosPermitidos =
    '.doc, .docx, .xls, .xlsx, .pdf, .png, .jpeg , .jpg';
  const textoFormatoUpload =
    'Permitido somente um arquivo. Tipo permitido doc, docx, xls, xlsx, PDF, PNG, JPEG e JPG';

  const onRemoveFile = async arquivo => {
    if (!desabilitarCampos) {
      const codigoArquivo = arquivo?.xhr;
      if (arquivo.arquivoId) {
        form.setFieldValue('listaArquivos', []);
        sucesso(`Arquivo ${arquivo.name} removido com sucesso`);
        return true;
      }
      if (!codigoArquivo) return false;

      setExibirLoader(true);

      const resposta = await ServicoArmazenamento.removerArquivo(
        codigoArquivo
      ).catch(e => erros(e));

      setExibirLoader(false);

      if (resposta?.status === 200) {
        sucesso(`Arquivo ${arquivo.name} removido com sucesso`);
        return true;
      }
      return false;
    }
    return false;
  };

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Dre form={form} disabled={desabilitarCampos} />
        </Col>

        <Col xs={24} md={12}>
          <Ue form={form} disabled={desabilitarCampos} />
        </Col>

        <Col xs={24} md={12}>
          <SelectPerfis
            multiple
            form={form}
            disabled={desabilitarCampos}
            labelRequired
          />
        </Col>

        <Col xs={24} md={12}>
          <CampoTexto
            id={SGP_INPUT_TITULO}
            form={form}
            label="Título"
            placeholder="Título"
            name="titulo"
            type="input"
            maxLength={100}
            labelRequired
            desabilitado={desabilitarCampos}
            onChange={() => {
              form.setFieldValue('modoEdicao', true);
            }}
          />
        </Col>

        <Col xs={24}>
          <JoditEditor
            ref={editorRef}
            label="Texto"
            form={form}
            value={textoInicial}
            name="texto"
            readonly={desabilitarCampos}
            desabilitar={desabilitarCampos}
            labelRequired
            onChange={() => {
              form.setFieldValue('modoEdicao', true);
            }}
          />
        </Col>
        <Col span={24}>
          <UploadArquivos
            form={form}
            name="listaArquivos"
            id={SGP_UPLOAD_INFORMES}
            desabilitarGeral={desabilitarCampos}
            desabilitarUpload={false}
            textoFormatoUpload={textoFormatoUpload}
            tiposArquivosPermitidos={tiposArquivosPermitidos}
            onRemove={onRemoveFile}
            urlUpload="v1/informes/upload"
            tamanhoMaximoArquivo={TAMANHO_MAXIMO_UPLOAD}
            totalDeUploads={TOTAL_ARQUIVOS_UPLOAD}
            defaultFileList={form?.initialValues?.listaArquivos || []}
            label="Arquivo"
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

InformesCadastroForm.propTypes = {
  form: PropTypes.oneOfType([PropTypes.any]),
  desabilitarCampos: PropTypes.bool,
  setExibirLoader: PropTypes.oneOfType([PropTypes.any]),
};

InformesCadastroForm.defaultProps = {
  form: null,
  desabilitarCampos: false,
  setExibirLoader: null,
};

export default InformesCadastroForm;
