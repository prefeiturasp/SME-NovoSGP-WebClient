import PropTypes from 'prop-types';
import React, { useState } from 'react';
import TransferenciaLista from '~/componentes-sgp/TranferenciaLista/transferenciaLista';

const ListaRecomendacoes = props => {
  const { dadosRecomendacao, titulo, setDadosDireita, dadosDireita } = props;

  const somenteConsulta = false;
  const periodoAberto = true;

  const [dadosEsquerda, setDadosEsquerda] = useState(dadosRecomendacao);
  const [idsSelecionadsEsquerda, setIdsSelecionadsEsquerda] = useState([]);
  const [idsSelecionadsDireita, setIdsSelecionadsDireita] = useState([]);

  const parametrosListaEsquerda = {
    titleHeight: '30px',
    title: titulo,
    columns: [
      {
        title: 'Descrição',
        dataIndex: 'descricao',
      },
    ],
    dataSource: dadosEsquerda,
    onSelectRow: setIdsSelecionadsEsquerda,
    selectedRowKeys: idsSelecionadsEsquerda,
    selectMultipleRows: periodoAberto && !somenteConsulta,
  };

  const parametrosListaDireita = {
    titleHeight: '30px',
    columns: [
      {
        title: 'Descrição',
        dataIndex: 'descricao',
        className: 'desc-descricao',
      },
    ],
    dataSource: dadosDireita,
    onSelectRow: setIdsSelecionadsDireita,
    selectedRowKeys: idsSelecionadsDireita,
    selectMultipleRows: periodoAberto && !somenteConsulta,
  };

  const obterListaComIdsSelecionados = (list, ids) => {
    return list.filter(item => ids.find(id => String(id) === String(item.id)));
  };

  const obterListaSemIdsSelecionados = (list, ids) => {
    return list.filter(item => !ids.find(id => String(id) === String(item.id)));
  };

  const onClickAdicionar = () => {
    if (idsSelecionadsEsquerda?.length && !somenteConsulta) {
      const novaListaDireita = obterListaComIdsSelecionados(
        dadosEsquerda,
        idsSelecionadsEsquerda
      );

      const novaListaEsquerda = obterListaSemIdsSelecionados(
        dadosEsquerda,
        idsSelecionadsEsquerda
      );

      setDadosEsquerda([...novaListaEsquerda]);
      setDadosDireita([...novaListaDireita, ...dadosDireita]);

      setIdsSelecionadsEsquerda([]);
    }
  };

  const onClickRemover = async () => {
    if (idsSelecionadsDireita?.length && !somenteConsulta) {
      const novaListaEsquerda = obterListaComIdsSelecionados(
        dadosDireita,
        idsSelecionadsDireita
      );

      const novaListaDireita = obterListaSemIdsSelecionados(
        dadosDireita,
        idsSelecionadsDireita
      );

      setDadosEsquerda([...novaListaEsquerda, ...dadosEsquerda]);
      setDadosDireita([...novaListaDireita]);

      setIdsSelecionadsDireita([]);
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

ListaRecomendacoes.propTypes = {
  dadosRecomendacao: PropTypes.oneOfType([PropTypes.array]),
  titulo: PropTypes.string,
  setDadosDireita: PropTypes.func,
  dadosDireita: PropTypes.oneOfType([PropTypes.array]),
};

ListaRecomendacoes.defaultProps = {
  dadosRecomendacao: [],
  titulo: '',
  dadosDireita: [],
  setDadosDireita: () => [],
};

export default ListaRecomendacoes;
