import PropTypes from 'prop-types';
import React from 'react';
import { DataTable } from '~/componentes';
import Label from '~/componentes/label';
import ColunaDimensionavel from '../ColunaDimensionavel/colunaDimensionavel';
import { SGP_TABLE_INFORMACOES_SRM } from '~/constantes/ids/table';

const InformacoesSrmTabela = props => {
  const { label, questaoAtual, form } = props;

  const valoresFormulario = form?.values?.[questaoAtual.id];
  const dadosTabela = valoresFormulario?.length ? valoresFormulario : [];

  const colunas = [
    {
      title: 'DRE - UE',
      dataIndex: 'DreUe',
    },
    {
      title: 'Turma - Turno',
      dataIndex: 'TurmaTurno',
    },
    {
      title: 'Componente curricular',
      dataIndex: 'ComponenteCurricular',
    },
  ];

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      <Label text={label} />

      <div>
        <DataTable
          columns={colunas}
          pagination={false}
          dataSource={dadosTabela}
          id={SGP_TABLE_INFORMACOES_SRM}
        />
      </div>
    </ColunaDimensionavel>
  );
};

InformacoesSrmTabela.propTypes = {
  label: PropTypes.string,
  form: PropTypes.oneOfType([PropTypes.any]),
  questaoAtual: PropTypes.oneOfType([PropTypes.any]),
};

InformacoesSrmTabela.defaultProps = {
  label: '',
  form: null,
  questaoAtual: null,
};

export default InformacoesSrmTabela;
