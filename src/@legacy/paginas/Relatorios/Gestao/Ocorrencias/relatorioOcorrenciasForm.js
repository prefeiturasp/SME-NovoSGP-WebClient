import { DataOcorrencia } from '@/@legacy/componentes-sgp/inputs/data-ocorrencia';
import { ImprimirDescricaoOcorrencia } from '@/@legacy/componentes-sgp/inputs/imprimir-descricao-ocorrencia';
import TipoOcorrencia from '@/@legacy/componentes-sgp/inputs/tipo-ocorrencia';
import { OPCAO_TODOS } from '@/@legacy/constantes';
import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import {
  AnoLetivo,
  Dre,
  ExibirHistorico,
  Modalidade,
  Semestre,
  Turma,
  Ue,
} from '~/componentes-sgp/inputs';

const RelatorioOcorrenciasForm = props => {
  const { form, onChangeCampos } = props;

  const ueCodigo = form?.values?.ueCodigo;
  const modalidade = form?.values?.modalidade;

  const desabilitarModalidade = ueCodigo === OPCAO_TODOS;

  useEffect(() => {
    if (form?.setFieldValue && ueCodigo === OPCAO_TODOS) {
      form.setFieldValue('modalidade', OPCAO_TODOS);
    }
  }, [ueCodigo]);

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        <Col sm={24}>
          <ExibirHistorico form={form} onChange={onChangeCampos} />
        </Col>

        <Col sm={24} md={8} lg={4}>
          <AnoLetivo form={form} onChange={onChangeCampos} anoMinimo={2021} />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Dre form={form} onChange={onChangeCampos} />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Ue form={form} onChange={onChangeCampos} />
        </Col>

        <Col sm={24} md={12} lg={8}>
          <Modalidade
            form={form}
            onChange={onChangeCampos}
            disabled={desabilitarModalidade}
          />
        </Col>

        <Col sm={24} md={12} lg={6}>
          <Semestre form={form} onChange={onChangeCampos} />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Turma
            form={form}
            onChange={onChangeCampos}
            name="codigosTurma"
            multiple
            selecionarTodasAoCarregar={modalidade === OPCAO_TODOS}
          />
        </Col>

        <DataOcorrencia
          form={form}
          onChangeDataInicio={onChangeCampos}
          onChangeDataFim={onChangeCampos}
        />

        <Col sm={24} lg={12}>
          <TipoOcorrencia form={form} onChange={onChangeCampos} />
        </Col>

        <Col sm={24} lg={12}>
          <ImprimirDescricaoOcorrencia form={form} onChange={onChangeCampos} />
        </Col>
      </Row>
    </Col>
  );
};

RelatorioOcorrenciasForm.propTypes = {
  onChangeCampos: PropTypes.func,
  form: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioOcorrenciasForm.defaultProps = {
  form: null,
  onChangeCampos: () => null,
};

export default RelatorioOcorrenciasForm;
