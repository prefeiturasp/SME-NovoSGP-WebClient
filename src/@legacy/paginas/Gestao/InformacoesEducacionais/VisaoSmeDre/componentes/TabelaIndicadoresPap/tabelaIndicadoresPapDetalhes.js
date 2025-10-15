import { Table } from 'antd';
import PropTypes from 'prop-types';
import styles from './tabelaIndicadoresPapDetalhes.css';

const TabelaIndicadoresPapDetalhes = ({ dados }) => {
  const columns = [
    {
      title: 'Tipo do PAP',
      dataIndex: 'tipoPapNome',
      key: 'tipoPapNome',
      align: 'center',
      onHeaderCell: () => ({ className: 'geral' }),
    },
    {
      title: 'Qtde. de turmas',
      dataIndex: 'quantidadeTurmas',
      key: 'quantidadeTurmas',
      align: 'center',
      onHeaderCell: () => ({ className: 'geral' }),
    },
    {
      title: 'Qtde. de estudantes',
      dataIndex: 'quantidadeEstudantes',
      key: 'quantidadeEstudantes',
      align: 'center',
      onHeaderCell: () => ({ className: 'geral' }),
    },
    {
      title: 'Estudantes com menos de 75% de frequência',
      dataIndex: 'quantidadeEstudantesComFrequenciaInferiorLimite',
      key: 'quantidadeEstudantesComFrequenciaInferiorLimite',
      align: 'center',
      onHeaderCell: () => ({ className: 'geral' }),
    },
    {
      title: 'Dificuldade',
      onHeaderCell: () => ({ className: 'geral' }),
      children: [
        {
          title: ({ record }) => record?.nomeDificuldadeTop1 || 'Leitura',
          dataIndex: 'quantidadeEstudantesDificuldadeTop1',
          key: 'quantidadeEstudantesDificuldadeTop1',
          align: 'center',
          onHeaderCell: () => ({ className: 'coluna-dificuldade' }),
        },
        {
          title: ({ record }) =>
            record?.nomeDificuldadeTop2 || 'Resolução de problema',
          dataIndex: 'quantidadeEstudantesDificuldadeTop2',
          key: 'quantidadeEstudantesDificuldadeTop2',
          align: 'center',
          onHeaderCell: () => ({ className: 'coluna-dificuldade' }),
        },
        {
          title: 'Outros',
          dataIndex: 'outrasDificuldadesAprendizagem',
          key: 'outrasDificuldadesAprendizagem',
          align: 'center',
          onHeaderCell: () => ({ className: 'coluna-dificuldade' }),
        },
      ],
    },
  ];

  return (
    <Table
      bordered
      pagination={false}
      dataSource={dados}
      rowKey={record => record.tipoPap}
      columns={columns}
      className="customTable"
    />
  );
};

TabelaIndicadoresPapDetalhes.propTypes = {
  dados: PropTypes.array.isRequired,
};

export default TabelaIndicadoresPapDetalhes;
