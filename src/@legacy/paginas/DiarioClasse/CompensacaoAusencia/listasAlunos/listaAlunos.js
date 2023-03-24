import PropTypes from 'prop-types';
import React from 'react';
import { DataTable, Label } from '~/componentes';
import { SGP_TABLE_LISTA_ALUNOS } from '~/constantes/ids/table';
import { formatarFrequencia, ordenarPor } from '~/utils/funcoes/gerais';

import { CardTabelaAlunos } from '../styles';

const ListaAlunos = props => {
  const { lista, idsAlunos, onSelectRow } = props;

  const listaOrdenada = ordenarPor(lista, 'nome');

  const montaExibicaoPercentual = (frequencia, dadosAluno) => {
    const frequenciaFormatada = formatarFrequencia(frequencia);
    if (dadosAluno.alerta) {
      return (
        <>
          {frequenciaFormatada}
          <i
            className="fas fa-exclamation-triangle"
            style={{ color: '#b40c02' }}
          />
        </>
      );
    }
    return frequenciaFormatada;
  };

  const colunasListaAlunos = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      ellipsis: true,
    },
    {
      title: 'Frequência',
      dataIndex: 'percentualFrequencia',
      render: (frequencia, dadosAluno) =>
        montaExibicaoPercentual(frequencia, dadosAluno),
    },
    {
      title: 'Faltas',
      dataIndex: 'quantidadeFaltasTotais',
    },
  ];

  const onSelectRowAlunos = ids => {
    onSelectRow(ids);
  };
  return (
    <>
      <Label text="" />
      <CardTabelaAlunos>
        <DataTable
          scroll={{ y: 420 }}
          id={SGP_TABLE_LISTA_ALUNOS}
          selectedRowKeys={idsAlunos}
          onSelectRow={onSelectRowAlunos}
          columns={colunasListaAlunos}
          dataSource={listaOrdenada}
          selectMultipleRows
          onClickRow={() => {}}
          pagination={false}
          pageSize={9999}
        />
      </CardTabelaAlunos>
    </>
  );
};

ListaAlunos.propTypes = {
  lista: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  idsAlunos: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  onSelectRow: PropTypes.func,
};

ListaAlunos.defaultProps = {
  lista: [],
  idsAlunos: [],
  onSelectRow: () => {},
};

export default ListaAlunos;
