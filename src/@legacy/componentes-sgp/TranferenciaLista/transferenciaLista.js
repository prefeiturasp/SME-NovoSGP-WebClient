import { Col } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import shortid from 'shortid';
import { DataTable, Label } from '~/componentes';
import {
  SGP_BUTTON_ADICIONAR_TRANSFERENCIA_LISTA,
  SGP_BUTTON_REMOVER_TRANSFERENCIA_LISTA,
} from '~/constantes/ids/button';
import {
  CardLista,
  ColunaBotaoLista,
  BotaoLista,
} from './transferenciaLista.css';

const TransferenciaLista = props => {
  const { listaEsquerda, listaDireita, onClickAdicionar, onClickRemover } =
    props;

  const propPadrao = {
    id: shortid.generate(),
    onSelectRow: () => {},
    columns: [],
    dataSource: [],
    selectedRowKeys: [],
    selectMultipleRows: false,
    pagination: false,
    scroll: { y: 400 },
    title: '',
  };

  return (
    <>
      <div className="mt-2" style={{ display: 'flex' }}>
        <Col span={11}>
          <div style={{ height: listaEsquerda?.titleHeight || '50px' }}>
            <Label text={listaEsquerda?.title || ''} />
          </div>
          <CardLista>
            <DataTable
              scroll={listaEsquerda.scroll || propPadrao.scroll}
              id={listaEsquerda.id || shortid.generate()}
              onSelectRow={listaEsquerda.onSelectRow || propPadrao.onSelectRow}
              columns={listaEsquerda.columns || propPadrao.columns}
              dataSource={listaEsquerda.dataSource || propPadrao.dataSource}
              pagination={listaEsquerda.pagination || propPadrao.pagination}
              selectedRowKeys={
                listaEsquerda.selectedRowKeys || propPadrao.selectedRowKeys
              }
              selectMultipleRows={
                listaEsquerda.selectMultipleRows ||
                propPadrao.selectMultipleRows
              }
            />
          </CardLista>
        </Col>
        <ColunaBotaoLista span={2}>
          <BotaoLista
            id={SGP_BUTTON_ADICIONAR_TRANSFERENCIA_LISTA}
            className="mb-2"
            onClick={() => {
              if (
                !listaEsquerda?.disabilitarBotaoAdicionar &&
                listaEsquerda.selectMultipleRows
              )
                onClickAdicionar();
            }}
            disabled={
              !listaEsquerda.selectMultipleRows ||
              listaEsquerda?.disabilitarBotaoAdicionar
            }
          >
            <i className="fas fa-chevron-right" />
          </BotaoLista>
          <BotaoLista
            id={SGP_BUTTON_REMOVER_TRANSFERENCIA_LISTA}
            onClick={() => {
              if (listaDireita.selectMultipleRows) onClickRemover();
            }}
            disabled={!listaDireita.selectMultipleRows}
          >
            <i className="fas fa-chevron-left" />
          </BotaoLista>
        </ColunaBotaoLista>
        <Col span={11}>
          <div style={{ height: listaDireita?.titleHeight || '50px' }}>
            <Label text={listaDireita?.title || ''} />
          </div>
          <CardLista>
            <DataTable
              scroll={listaDireita.scroll || propPadrao.scroll}
              id={listaDireita.id || shortid.generate()}
              onSelectRow={listaDireita.onSelectRow || propPadrao.onSelectRow}
              columns={listaDireita.columns || propPadrao.columns}
              dataSource={listaDireita.dataSource || propPadrao.dataSource}
              pagination={listaDireita.pagination || propPadrao.pagination}
              selectedRowKeys={
                listaDireita.selectedRowKeys || propPadrao.selectedRowKeys
              }
              selectMultipleRows={
                listaDireita.selectMultipleRows || propPadrao.selectMultipleRows
              }
            />
          </CardLista>
        </Col>
      </div>
    </>
  );
};

TransferenciaLista.propTypes = {
  listaEsquerda: PropTypes.oneOfType([PropTypes.object]),
  listaDireita: PropTypes.oneOfType([PropTypes.object]),
  onClickAdicionar: PropTypes.func,
  onClickRemover: PropTypes.func,
};

TransferenciaLista.defaultProps = {
  listaEsquerda: {},
  listaDireita: {},
  onClickAdicionar: () => {},
  onClickRemover: () => {},
};

export default TransferenciaLista;
