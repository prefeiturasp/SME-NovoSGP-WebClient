import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import React from 'react';
import {
  AnoLetivo,
  Dre,
  ExibirHistorico,
  Modalidade,
  Semestre,
  Turma,
  Ue,
} from '~/componentes-sgp/inputs';
import {
  CRIANCAS_ESTUDANTES_SELECIONADOS,
  OPCAO_TODOS,
} from '@/@legacy/constantes';
import { SelectComponent } from '@/@legacy/componentes';
import { SGP_SELECT_ESTUDANTE_CRIANCA } from '@/@legacy/constantes/ids/select';
import { Meses } from '@/@legacy/componentes-sgp/inputs/meses';
import { FormatoRelatorio } from '@/@legacy/componentes-sgp/inputs/formato-arquivo-relatorio';
import RelatorioControleFrequenciaMensalEstudantes from './relatorioControleFrequenciaMensalEstudantes';

const RelatorioControleFrequenciaMensalForm = props => {
  const { form, onChangeCampos } = props;

  const opcaoExibirCriancasEstudantes = [
    { value: OPCAO_TODOS, label: 'Todas crianças/estudante' },
    {
      value: CRIANCAS_ESTUDANTES_SELECIONADOS,
      label: 'Crianças/estudantes selecionados',
    },
  ];

  return (
    <Col sm={24}>
      <Row gutter={[16, 8]}>
        <Col sm={24}>
          <ExibirHistorico form={form} onChange={() => onChangeCampos()} />
        </Col>

        <Col sm={24} md={8} lg={4}>
          <AnoLetivo form={form} onChange={() => onChangeCampos()} />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Dre
            form={form}
            mostrarOpcaoTodas={false}
            onChange={() => onChangeCampos()}
          />
        </Col>

        <Col sm={24} md={24} lg={10}>
          <Ue
            form={form}
            mostrarOpcaoTodas={false}
            onChange={() => onChangeCampos()}
          />
        </Col>

        <Col sm={24} md={12} lg={8}>
          <Modalidade
            form={form}
            mostrarOpcaoTodas={false}
            onChange={() => onChangeCampos()}
          />
        </Col>

        <Col sm={24} md={12} lg={6}>
          <Semestre form={form} onChange={() => onChangeCampos()} />
        </Col>

        <Col sm={24} lg={10}>
          <Turma
            form={form}
            mostrarOpcaoTodas={false}
            onChange={() => onChangeCampos()}
          />
        </Col>

        <Col sm={24} md={12} lg={10}>
          <SelectComponent
            form={form}
            name="criancasEstudantes"
            label="Crianças/Estudantes"
            lista={opcaoExibirCriancasEstudantes}
            valueOption="value"
            valueText="label"
            id={SGP_SELECT_ESTUDANTE_CRIANCA}
            onChange={() => onChangeCampos()}
            placeholder="Estudantes"
            labelRequired
            disabled={!form?.values?.turmaCodigo}
          />
        </Col>

        <Col sm={24} md={12} lg={10}>
          <Meses form={form} onChange={() => onChangeCampos()} />
        </Col>

        <Col sm={24} md={12} lg={4}>
          <FormatoRelatorio
            form={form}
            onChange={() => onChangeCampos()}
            disabled
          />
        </Col>

        {form?.values?.turmaCodigo &&
        form?.values?.criancasEstudantes ===
          CRIANCAS_ESTUDANTES_SELECIONADOS ? (
          <Col sm={24}>
            <RelatorioControleFrequenciaMensalEstudantes form={form} />
          </Col>
        ) : (
          <></>
        )}
      </Row>
    </Col>
  );
};

RelatorioControleFrequenciaMensalForm.propTypes = {
  onChangeCampos: PropTypes.func,
  form: PropTypes.oneOfType([PropTypes.any]),
};

RelatorioControleFrequenciaMensalForm.defaultProps = {
  form: null,
  onChangeCampos: () => null,
};

export default RelatorioControleFrequenciaMensalForm;
