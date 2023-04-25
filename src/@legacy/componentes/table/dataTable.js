import { Table } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import shortid from 'shortid';
import { Container } from './dataTable.css';

const DataTable = props => {
  const {
    selectedRowKeys,
    columns,
    dataSource,
    onSelectRow,
    onClickRow,
    selectMultipleRows,
    pageSize,
    pagination,
    locale,
    idLinha,
    loading,
    id,
    scroll,
    semHover,
    expandIconColumnIndex,
    expandedRowRender,
    onClickExpandir,
    expandedRowKeys,
    expandIcon,
    tableResponsive,
    gerarIdUnico,
    ...rest
  } = props;

  const rowSelection = {
    selectedRowKeys,
    onChange: ids => {
      onSelectRow(ids);
    },
  };

  const selectRow = row => {
    let selected = [...selectedRowKeys];
    if (selected.indexOf(row[idLinha]) >= 0) {
      selected.splice(selected.indexOf(row[idLinha]), 1);
    } else if (selectMultipleRows) {
      selected.push(row[idLinha]);
    } else {
      selected = [];
      selected.push(row[idLinha]);
    }
    onSelectRow(selected);
  };

  const clickRow = row => {
    if (onClickRow) {
      onClickRow(row);
    }
  };

  const gerarColunaId = array => {
    return array.map(item => {
      item.id = shortid.generate();
      return item;
    });
  };

  return (
    <Container
      className={tableResponsive ? 'table-responsive' : ''}
      semHover={semHover}
      temEventoOnClickRow={!!onClickRow}
      tableResponsive={tableResponsive}
    >
      <Table
        {...rest}
        id={id}
        scroll={scroll}
        rowKey={idLinha}
        rowSelection={selectMultipleRows ? rowSelection : null}
        columns={columns}
        dataSource={gerarIdUnico ? gerarColunaId(dataSource) : dataSource}
        onRow={row => ({
          onClick: colunaClicada => {
            if (
              colunaClicada &&
              colunaClicada.target &&
              colunaClicada.target.className === 'ant-table-selection-column'
            ) {
              selectRow(row);
            } else {
              clickRow(row);
            }
          },
        })}
        pagination={
          typeof pagination === 'object'
            ? { ...pagination, items_per_page: '' }
            : pagination
        }
        pageSize={{ pageSize }}
        bordered
        size="middle"
        locale={locale}
        onHeaderRow={() => {
          return {
            onClick: colunaClicada => {
              if (
                colunaClicada &&
                colunaClicada.target &&
                colunaClicada.target.className === 'ant-table-selection-column'
              ) {
                const checkboxSelecionarTodos = document
                  .getElementById(id)
                  .getElementsByClassName('ant-table-selection')[0]
                  .getElementsByClassName('ant-checkbox-wrapper')[0]
                  .getElementsByClassName('ant-checkbox')[0]
                  .getElementsByClassName('ant-checkbox-input')[0];

                checkboxSelecionarTodos.click();
              }
            },
          };
        }}
        loading={loading}
        expandedRowRender={expandedRowRender}
        expandIconColumnIndex={expandIconColumnIndex}
        expandIconAsCell={false}
        expandIcon={expandIcon}
        onExpand={onClickExpandir}
        expandedRowKeys={expandedRowKeys}
      />
    </Container>
  );
};

DataTable.propTypes = {
  selectedRowKeys: PropTypes.oneOfType([PropTypes.array]),
  onSelectRow: PropTypes.func,
  dataSource: PropTypes.oneOfType([PropTypes.array]),
  columns: PropTypes.oneOfType([PropTypes.array]),
  selectMultipleRows: PropTypes.bool,
  pageSize: PropTypes.number,
  pagination: PropTypes.bool,
  onClickRow: PropTypes.func,
  locale: PropTypes.oneOfType([PropTypes.any]),
  idLinha: PropTypes.string,
  id: PropTypes.string,
  scroll: PropTypes.oneOfType([PropTypes.any]),
  semHover: PropTypes.bool,
  expandIconColumnIndex: PropTypes.oneOfType([PropTypes.number]),
  expandedRowRender: PropTypes.oneOfType([PropTypes.any]),
  onClickExpandir: PropTypes.func,
  expandedRowKeys: PropTypes.oneOfType([PropTypes.array]),
  expandIcon: PropTypes.oneOfType([PropTypes.any]),
  tableResponsive: PropTypes.bool,
  loading: PropTypes.bool,
  gerarIdUnico: PropTypes.bool,
};

DataTable.defaultProps = {
  selectedRowKeys: [],
  onSelectRow: () => {},
  dataSource: [],
  columns: [],
  selectMultipleRows: false,
  pageSize: 10,
  pagination: { locale: { items_per_page: '' } },
  onClickRow: null,
  locale: { emptyText: 'Sem dados' },
  idLinha: 'id',
  id: 'componente-tabela-sgp',
  scroll: {},
  semHover: false,
  expandIconColumnIndex: -1,
  expandedRowRender: null,
  onClickExpandir: null,
  expandedRowKeys: [],
  expandIcon: null,
  tableResponsive: true,
  loading: false,
  gerarIdUnico: false,
};

export default DataTable;
