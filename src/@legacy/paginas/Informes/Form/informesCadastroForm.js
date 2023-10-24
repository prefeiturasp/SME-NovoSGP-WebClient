import { SelectPerfis } from '@/@legacy/componentes-sgp/inputs/perfis';
import { SGP_INPUT_TITULO } from '@/@legacy/constantes/ids/input';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { Auditoria, CampoTexto, JoditEditor } from '~/componentes';
import { Dre, Ue } from '~/componentes-sgp/inputs';

const InformesCadastroForm = props => {
  const { form, desabilitarCampos } = props;

  const auditoria = form?.initialValues?.auditoria;
  const textoInicial = form?.initialValues?.texto;
  const modoEdicao = form?.values?.modoEdicao;

  const editorRef = useRef(null);

  useEffect(() => {
    if (!modoEdicao && editorRef?.current?.setEditorValue) {
      editorRef?.current?.setEditorValue(textoInicial);
    }
  }, [modoEdicao, textoInicial]);

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
            label="Texo"
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
