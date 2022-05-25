import PropTypes from 'prop-types';
import React, { useState } from 'react';
import TransferenciaLista from '~/componentes-sgp/TranferenciaLista/transferenciaLista';

const ListaTransferenciaResponsaveis = props => {
  const {
    dadosEsquerda,
    setDadosEsquerda,
    setDadosDireita,
    dadosDireita,
    podeConsultar,
  } = props;

  const [idsSelecionadosEsquerda, setIdsSelecionadosEsquerda] = useState([]);
  const [idsSelecionadosDireita, setIdsSelecionadosDireita] = useState([]);

  const parametrosListaEsquerda = {
    titleHeight: '30px',
    title: `UEs sem atribuição`,
    columns: [
      {
        title: 'Código',
        dataIndex: 'codigo',
      },
      {
        title: 'Descrição',
        dataIndex: 'nome',
      },
    ],
    dataSource: dadosEsquerda,
    onSelectRow: setIdsSelecionadosEsquerda,
    selectedRowKeys: idsSelecionadosEsquerda,
    selectMultipleRows: podeConsultar,
  };

  const parametrosListaDireita = {
    titleHeight: '30px',
    title: 'UEs atribuídas ao Responsável',
    columns: [
      {
        title: 'Código',
        dataIndex: 'codigo',
      },
      {
        title: 'Descrição',
        dataIndex: 'nome',
      },
    ],
    dataSource: dadosDireita,
    onSelectRow: setIdsSelecionadosDireita,
    selectedRowKeys: idsSelecionadosDireita,
    selectMultipleRows: podeConsultar,
  };

  const obterListaComIdsSelecionados = (list, ids) =>
    list.filter(item => ids.find(id => String(id) === String(item.id)));

  const obterListaSemIdsSelecionados = (list, ids) =>
    list.filter(item => !ids.find(id => String(id) === String(item.id)));

  const onClickAdicionar = () => {
    if (idsSelecionadosEsquerda?.length && podeConsultar) {
      const novaListaDireita = obterListaComIdsSelecionados(
        dadosEsquerda,
        idsSelecionadosEsquerda
      );

      const novaListaEsquerda = obterListaSemIdsSelecionados(
        dadosEsquerda,
        idsSelecionadosEsquerda
      );

      setDadosEsquerda([...novaListaEsquerda]);
      setDadosDireita([...novaListaDireita, ...dadosDireita]);

      setIdsSelecionadosEsquerda([]);
    }
  };

  const onClickRemover = async () => {
    if (idsSelecionadosDireita?.length && podeConsultar) {
      const novaListaEsquerda = obterListaComIdsSelecionados(
        dadosDireita,
        idsSelecionadosDireita
      );

      const novaListaDireita = obterListaSemIdsSelecionados(
        dadosDireita,
        idsSelecionadosDireita
      );

      setDadosEsquerda([...novaListaEsquerda, ...dadosEsquerda]);
      setDadosDireita([...novaListaDireita]);

      setIdsSelecionadosDireita([]);
    }
  };

  return (
    <TransferenciaLista
      listaEsquerda={parametrosListaEsquerda}
      listaDireita={parametrosListaDireita}
      onClickAdicionar={onClickAdicionar}
      onClickRemover={onClickRemover}
    />
  );
};

ListaTransferenciaResponsaveis.propTypes = {
  setDadosDireita: PropTypes.func,
  dadosDireita: PropTypes.oneOfType([PropTypes.array]),
  setDadosEsquerda: PropTypes.func,
  dadosEsquerda: PropTypes.oneOfType([PropTypes.array]),
  podeConsultar: PropTypes.bool,
};

ListaTransferenciaResponsaveis.defaultProps = {
  dadosDireita: [],
  setDadosDireita: () => [],
  dadosEsquerda: [],
  setDadosEsquerda: () => [],
  podeConsultar: true,
};

export default ListaTransferenciaResponsaveis;
