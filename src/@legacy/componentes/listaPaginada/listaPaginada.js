import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

// Componentes
import { Table } from 'antd';

import { api, erros } from '~/servicos';

import { Container } from './listaPaginada.css';

const ListaPaginada = props => {
  const {
    url,
    filtro,
    colunaChave,
    colunas,
    onClick,
    multiSelecao,
    onSelecionarLinhas,
    selecionarItems,
    filtroEhValido,
    paramArrayFormat,
    temPaginacao,
    setLista,
    showSizeChanger,
    naoFiltrarQuandoCarregando,
    mapearNovoDto,
    id,
    disabledCheckboxRow,
    expandIcon,
    expandedRowKeys,
    expandedRowRender,
    limparDados,
  } = props;

  const [carregando, setCarregando] = useState(false);
  const [total, setTotal] = useState(0);
  const [linhas, setLinhas] = useState([]);
  const [linhasSelecionadas, setLinhasSelecionadas] = useState([]);

  const paginacaoDefault = {
    defaultPageSize: 10,
    pageSize: 10,
    total: 0,
    showSizeChanger,
    pageSizeOptions: ['10', '20', '50', '100'],
    locale: { items_per_page: 'Linhas' },
    current: 1,
  };

  const [paginaAtual, setPaginaAtual] = useState(paginacaoDefault);

  useEffect(() => {
    if (limparDados) {
      setLinhas([]);
      setCarregando(false);
      setTotal(0);
      setLinhasSelecionadas([]);
      setPaginaAtual({ ...paginacaoDefault });
    }
  }, [limparDados]);

  const obterUrlBusca = pagina => {
    return `${url}?numeroPagina=${pagina.current}&numeroRegistros=${pagina.pageSize}`;
  };

  const [urlBusca, setUrlBusca] = useState(obterUrlBusca(paginaAtual));

  const selecionaItems = selecionadas => {
    if (selecionarItems && linhas) {
      const items = linhas.filter(
        item => selecionadas.indexOf(item[colunaChave]) >= 0
      );
      selecionarItems(items);
    }
  };

  const selecionar = ids => {
    setLinhasSelecionadas(ids);
    if (onSelecionarLinhas) onSelecionarLinhas(ids);
    selecionaItems(ids);
  };

  const selecaoLinha = {
    selectedRowKeys: linhasSelecionadas,
    onChange: ids => selecionar(ids),
    getCheckboxProps: record => ({
      disabled: disabledCheckboxRow ? disabledCheckboxRow(record) : false,
    }),
  };

  const selecionarLinha = linha => {
    if (disabledCheckboxRow && disabledCheckboxRow(linha)) return;

    let selecionadas = [...linhasSelecionadas];
    if (selecionadas.indexOf(linha[colunaChave]) >= 0) {
      selecionadas.splice(selecionadas.indexOf(linha[colunaChave]), 1);
    } else if (multiSelecao) {
      selecionadas.push(linha[colunaChave]);
    } else {
      selecionadas = [];
      selecionadas.push(linha[colunaChave]);
    }
    setLinhasSelecionadas(selecionadas);
    if (onSelecionarLinhas) onSelecionarLinhas(selecionadas);
    selecionaItems(selecionadas);
  };

  const clicarLinha = (row, colunaClicada) => {
    if (onClick) {
      onClick(row, colunaClicada);
    }
  };

  const defineUrlBusca = pagina => {
    setUrlBusca(obterUrlBusca(pagina));
  };

  const filtrar = () => {
    if (naoFiltrarQuandoCarregando && carregando) return;
    let statusCode = 0;
    selecionar([]);
    setCarregando(true);
    api
      .get(urlBusca, {
        params: filtro,
        paramsSerializer: {
          serialize: params => {
            return queryString.stringify(params, {
              arrayFormat: paramArrayFormat,
              skipEmptyString: true,
              skipNull: true,
            });
          },
        },
      })
      .then(resposta => {
        statusCode = resposta.status;
        setLinhas([]);
        setTotal(resposta.data.totalRegistros);
        let items = resposta?.data?.items;
        if (items?.length) {
          if (mapearNovoDto) {
            items = mapearNovoDto(items);
          }
          setLinhas([...items]);
          if (setLista) {
            setLista(items, linhas);
          }
        } else {
          setLista([], linhas);
        }
      })
      .catch(e => {
        if (statusCode !== 204) {
          erros(e);
        }
      })
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    if (!limparDados && filtroEhValido) {
      filtrar();
    }
  }, [limparDados, filtroEhValido, paginaAtual]);

  useEffect(() => {
    const novaPagina = { ...paginaAtual };
    novaPagina.current = 1;
    setPaginaAtual(novaPagina);
    defineUrlBusca(novaPagina);
  }, [filtro]);

  const executaPaginacao = pagina => {
    const novaPagina = { ...paginaAtual, ...pagina };
    if (pagina.total < pagina.pageSize) {
      novaPagina.current = 1;
    }
    setPaginaAtual(novaPagina);
    defineUrlBusca(novaPagina);
  };

  return (
    <Container className="table-responsive">
      <Table
        id={id}
        className={multiSelecao ? '' : 'ocultar-coluna-multi-selecao'}
        rowKey={colunaChave}
        rowSelection={selecaoLinha}
        columns={colunas}
        dataSource={linhas}
        onRow={row => ({
          onClick: colunaClicada => {
            if (
              colunaClicada &&
              colunaClicada.target &&
              colunaClicada.target.className === 'ant-table-selection-column'
            ) {
              selecionarLinha(row);
            } else {
              clicarLinha(row, colunaClicada);
            }
          },
        })}
        pagination={
          temPaginacao
            ? {
                defaultPageSize: paginaAtual.defaultPageSize,
                pageSize: paginaAtual.pageSize,
                total,
                showSizeChanger,
                pageSizeOptions: ['10', '20', '50', '100'],
                locale: { items_per_page: '' },
                current: paginaAtual.current,
              }
            : false
        }
        bordered
        size="middle"
        locale={{ emptyText: 'Sem dados' }}
        onHeaderRow={() => {
          return {
            onClick: colunaClicada => {
              if (
                colunaClicada &&
                colunaClicada.target &&
                colunaClicada.target.className === 'ant-table-selection-column'
              ) {
                const checkboxSelecionarTodos = document
                  .getElementsByClassName('ant-table-selection')[0]
                  .getElementsByClassName('ant-checkbox-wrapper')[0]
                  .getElementsByClassName('ant-checkbox')[0]
                  .getElementsByClassName('ant-checkbox-input')[0];

                checkboxSelecionarTodos.click();
              }
            },
          };
        }}
        onChange={executaPaginacao}
        loading={carregando}
        expandIconAsCell={false}
        expandable={{
          expandedRowRender,
          expandIcon,
          expandedRowKeys,
          showExpandColumn: false,
        }}
      />
    </Container>
  );
};

ListaPaginada.propTypes = {
  colunas: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  multiSelecao: PropTypes.oneOfType([PropTypes.bool]),
  onClick: PropTypes.oneOfType([PropTypes.func]),
  onSelecionarLinhas: PropTypes.oneOfType([PropTypes.func]),
  selecionarItems: PropTypes.oneOfType([PropTypes.func]),
  url: PropTypes.string,
  colunaChave: PropTypes.string,
  filtro: PropTypes.oneOfType([PropTypes.object]),
  filtroEhValido: PropTypes.bool,
  paramArrayFormat: PropTypes.oneOfType([PropTypes.string]),
  temPaginacao: PropTypes.oneOfType([PropTypes.bool]),
  setLista: PropTypes.oneOfType([PropTypes.func]),
  showSizeChanger: PropTypes.oneOfType([PropTypes.bool]),
  naoFiltrarQuandoCarregando: PropTypes.oneOfType([PropTypes.bool]),
  mapearNovoDto: PropTypes.oneOfType([PropTypes.func]),
  id: PropTypes.string,
  disabledCheckboxRow: PropTypes.oneOfType([PropTypes.func]),
  expandIcon: PropTypes.oneOfType([PropTypes.any]),
  expandedRowKeys: PropTypes.oneOfType([PropTypes.any]),
  expandedRowRender: PropTypes.oneOfType([PropTypes.any]),
  limparDados: PropTypes.oneOfType([PropTypes.bool]),
};

ListaPaginada.defaultProps = {
  colunas: [],
  multiSelecao: false,
  onClick: () => {},
  onSelecionarLinhas: () => {},
  selecionarItems: () => {},
  url: '',
  colunaChave: 'id',
  filtro: null,
  filtroEhValido: true,
  paramArrayFormat: 'brackets',
  temPaginacao: true,
  setLista: () => {},
  showSizeChanger: true,
  naoFiltrarQuandoCarregando: true,
  mapearNovoDto: null,
  id: '',
  disabledCheckboxRow: null,
  expandIcon: null,
  expandedRowKeys: [],
  expandedRowRender: null,
  limparDados: false,
};

export default ListaPaginada;
