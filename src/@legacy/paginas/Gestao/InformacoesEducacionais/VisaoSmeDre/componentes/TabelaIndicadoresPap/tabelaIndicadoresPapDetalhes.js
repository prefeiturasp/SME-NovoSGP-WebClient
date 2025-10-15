import React, { useMemo } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import styles from './tabelaIndicadoresPapDetalhes.css';

const TabelaIndicadoresPapDetalhes = ({ dados }) => {
  const dataSource = dados?.quantidadesPorTipoPap || [];
  const nomeDificuldade1 = dados?.nomeDificuldadeTop1 || 'Leitura';
  const nomeDificuldade2 = dados?.nomeDificuldadeTop2 || 'Resolução de problema';
  const columns = useMemo(() => [
    {
      title: 'Tipo do PAP',
      dataIndex: 'tipoPapNome',
      key: 'tipoPapNome',
      align: 'center',
      onHeaderCell: () => ({ className: 'geral' }),
    },
    {
      title: 'Qtde. de turmas',
      dataIndex: 'totalTurmas',
      key: 'totalTurmas',
      align: 'center',
      onHeaderCell: () => ({ className: 'geral' }),
    },
    {
      title: 'Qtde. de estudantes',
      dataIndex: 'totalAlunos',
      key: 'totalAlunos',
      align: 'center',
      onHeaderCell: () => ({ className: 'geral' }),
    },
    {
      title: 'Estudantes com menos de 75% de frequência',
      dataIndex: 'totalAlunosComFrequenciaInferiorLimite',
      key: 'totalAlunosComFrequenciaInferiorLimite',
      align: 'center',
      onHeaderCell: () => ({ className: 'geral' }),
    },
    {
      title: 'Dificuldade',
      onHeaderCell: () => ({ className: 'geral' }),
      children: [
        {
          title: nomeDificuldade1,
          dataIndex: 'totalAlunosDificuldadeTop1',
          key: 'totalAlunosDificuldadeTop1',
          align: 'center',
          onHeaderCell: () => ({ className: 'coluna-dificuldade' }),
        },
        {
          title: nomeDificuldade2,
          dataIndex: 'totalAlunosDificuldadeTop2',
          key: 'totalAlunosDificuldadeTop2',
          align: 'center',
          onHeaderCell: () => ({ className: 'coluna-dificuldade' }),
        },
        {
          title: 'Outros',
          dataIndex: 'totalAlunosDificuldadeOutras',
          key: 'totalAlunosDificuldadeOutras',
          align: 'center',
          onHeaderCell: () => ({ className: 'coluna-dificuldade' }),
        },
      ],
    },
  ], [nomeDificuldade1, nomeDificuldade2]);

  return (
    <Table
      bordered
      pagination={false}
      dataSource={dataSource}
      rowKey={record => record.tipoPap}
      columns={columns}
      className="customTable"
    />
  );
};

TabelaIndicadoresPapDetalhes.propTypes = {
  dados: PropTypes.shape({
    nomeDificuldadeTop1: PropTypes.string,
    nomeDificuldadeTop2: PropTypes.string,
    quantidadesPorTipoPap: PropTypes.arrayOf(
      PropTypes.shape({
        tipoPap: PropTypes.number,
        tipoPapNome: PropTypes.string,
        totalTurmas: PropTypes.number,
        totalAlunos: PropTypes.number,
        totalAlunosComFrequenciaInferiorLimite: PropTypes.number,
        totalAlunosDificuldadeTop1: PropTypes.number,
        totalAlunosDificuldadeTop2: PropTypes.number,
        totalAlunosDificuldadeOutras: PropTypes.number,
      })
    ),
  }),
};

TabelaIndicadoresPapDetalhes.defaultProps = {
  dados: null,
};

export default TabelaIndicadoresPapDetalhes;
