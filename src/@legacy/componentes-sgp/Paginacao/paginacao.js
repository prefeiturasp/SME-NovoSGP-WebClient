import { Pagination } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const Paginacao = props => {
  const {
    numeroRegistros,
    onChangePaginacao,
    mostrarNumeroLinhas,
    onChangeNumeroLinhas,
    resetInitialState,
    setResetInitialState,
    pageSize,
    ...rest
  } = props;

  const initialState = {
    defaultCurrent: 1,
    total: numeroRegistros,
    current: 1,
    pageSize,
    showSizeChanger: mostrarNumeroLinhas,
    onShowSizeChanger: mostrarNumeroLinhas,
  };

  const [paginaAtual, setPaginaAtual] = useState(initialState);

  const executaPaginacao = pagina => {
    onChangePaginacao(pagina);
    const novaPagina = { ...paginaAtual };
    novaPagina.current = pagina;
    setPaginaAtual(novaPagina);
  };

  useEffect(() => {
    setPaginaAtual(estadoAntigo => ({
      ...estadoAntigo,
      total: numeroRegistros,
      pageSize,
    }));
  }, [numeroRegistros, pageSize]);

  useEffect(() => {
    if (resetInitialState) {
      setPaginaAtual(initialState);
      if (setResetInitialState) setResetInitialState(false);
    }
  }, [resetInitialState]);

  return (
    <Pagination
      {...rest}
      {...paginaAtual}
      onChange={executaPaginacao}
      onShowSizeChange={onChangeNumeroLinhas}
    />
  );
};

Paginacao.propTypes = {
  numeroPagina: PropTypes.oneOfType([PropTypes.any]),
  numeroRegistros: PropTypes.oneOfType([PropTypes.any]),
  onChangePaginacao: PropTypes.func,
  mostrarNumeroLinhas: PropTypes.bool,
  resetInitialState: PropTypes.bool,
  onChangeNumeroLinhas: PropTypes.func,
  pageSize: PropTypes.number,
};

Paginacao.defaultProps = {
  numeroPagina: 1,
  numeroRegistros: 10,
  onChangePaginacao: () => {},
  mostrarNumeroLinhas: false,
  resetInitialState: false,
  onChangeNumeroLinhas: () => {},
  pageSize: 10,
};

export default Paginacao;
