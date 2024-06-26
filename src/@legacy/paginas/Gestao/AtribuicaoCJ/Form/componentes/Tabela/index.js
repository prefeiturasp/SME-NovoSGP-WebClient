import React from 'react';
import PropTypes from 'prop-types';

// Ant
import { Switch } from 'antd';

// Componentes
import { DataTable } from '~/componentes';

function Tabela({ carregando, lista, onChangeSubstituir, somenteConsulta }) {
  const colunas = [
    {
      title: 'Componente curricular',
      dataIndex: 'disciplina',
      key: 'disciplina',
    },
    {
      title: 'Professor Titular',
      dataIndex: 'professorTitular',
      key: 'professorTitular',
    },
    {
      title: 'Substituir',
      dataIndex: 'substituir',
      key: 'substituir',
      width: '10%',
      align: 'center',
      render: (valor, registro) => {
        return (
          <Switch
            checked={registro.substituir}
            onChange={() => onChangeSubstituir(registro)}
            disabled={somenteConsulta}
          />
        );
      },
    },
  ];

  return (
    <DataTable
      id="lista-disciplinas"
      rowKey="disciplina"
      columns={colunas}
      dataSource={lista}
      pagination={false}
      loading={carregando}
    />
  );
}

Tabela.propTypes = {
  carregando: PropTypes.bool,
  lista: PropTypes.oneOfType([PropTypes.array]),
  onChangeSubstituir: PropTypes.func,
  somenteConsulta: PropTypes.bool,
};

Tabela.defaultProps = {
  carregando: false,
  lista: [],
  onChangeSubstituir: null,
  somenteConsulta: false,
};

export default Tabela;
