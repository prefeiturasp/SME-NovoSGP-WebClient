/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import { ListaPaginada } from '~/componentes';
import { SGP_TABLE_HISTORICO_ATENDIMENTO } from '~/constantes/ids/table';
import { Titulo } from './style';

const ListaHistoricoAtendimentosPaginada = ({
  atualizarTabela,
  setAtendimentoId,
}) => {
  const routeMatch = useRouteMatch();

  const [filtros, setFiltros] = useState();

  const encaminhamentoNAAPAId = routeMatch.params?.id;

  const filtroEhValido = !!encaminhamentoNAAPAId;

  const colunas = [
    {
      title: 'Data',
      dataIndex: 'dataAtendimento',
      render: data => (data ? window.moment(data).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Tipo de atendimento',
      dataIndex: 'tipoAtendimento',
    },
    {
      title: 'Usuário',
      render: (_, dadosLinha) =>
        `${dadosLinha?.auditoria?.criadoPor} (${dadosLinha?.auditoria?.criadoRF})`,
    },
  ];

  const onClickLinha = linha => {
    setAtendimentoId(linha?.auditoria?.id);
  };

  const filtrar = useCallback(() => {
    const params = {
      encaminhamentoId: encaminhamentoNAAPAId,
    };

    setFiltros({ ...params });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atualizarTabela]);

  useEffect(() => {
    if (atualizarTabela) {
      filtrar();
    }
  }, [atualizarTabela, filtrar]);

  const exibirTabela = true;

  return exibirTabela ? (
    <>
      <Titulo>Histórico dos atendimentos</Titulo>

      <ListaPaginada
        filtro={filtros}
        colunas={colunas}
        filtroEhValido={filtroEhValido}
        id={SGP_TABLE_HISTORICO_ATENDIMENTO}
        onClick={linha => onClickLinha(linha)}
        url={`v1/encaminhamento-naapa/${encaminhamentoNAAPAId}/secoes-itinerancia`}
      />
    </>
  ) : (
    <></>
  );
};

ListaHistoricoAtendimentosPaginada.propTypes = {
  atualizarTabela: PropTypes.bool,
  setAtendimentoId: PropTypes.func,
};

ListaHistoricoAtendimentosPaginada.defaultProps = {
  setAtendimentoId: () => null,
  atualizarTabela: false,
};

export default ListaHistoricoAtendimentosPaginada;
