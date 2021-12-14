import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { ModalidadeDTO } from '~/dtos';
import ListaoContext from './listaoContext';

const ListaoContextProvider = ({ children }) => {
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [anoLetivo, setAnoLetivo] = useState();
  const [codigoDre, setCodigoDre] = useState();
  const [codigoUe, setCodigoUe] = useState();
  const [modalidade, setModalidade] = useState();
  const [semestre, setSemestre] = useState();
  const [codigoTurma, setCodigoTurma] = useState();
  const [bimestre, setBimestre] = useState();

  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaBimestres, setListaBimestres] = useState([]);

  const [componenteCurricular, setComponenteCurricular] = useState();
  const [
    componenteCurricularInicial,
    setComponenteCurricularInicial,
  ] = useState();
  const [listaComponenteCurricular, setListaComponenteCurricular] = useState(
    []
  );

  const [bimestreOperacoes, setBimestreOperacoes] = useState();

  const [tabAtual, setTabAtual] = useState();

  // Utilizado para carregar os filtros novamente quando voltar para a tela de listagem de componentes!
  const [carregarFiltrosSalvos, setCarregarFiltrosSalvos] = useState(false);
  const [exibirLoaderGeral, setExibirLoaderGeral] = useState(false);

  const obterBimestres = mod => {
    const bi = [];
    bi.push({ descricao: '1º', valor: 1 });
    bi.push({ descricao: '2º', valor: 2 });

    if (mod !== String(ModalidadeDTO.EJA)) {
      bi.push({ descricao: '3º', valor: 3 });
      bi.push({ descricao: '4º', valor: 4 });
    }
    if (mod !== String(ModalidadeDTO.INFANTIL)) {
      bi.push({ descricao: 'Final', valor: 0 });
    }
    return bi;
  };

  return (
    <ListaoContext.Provider
      value={{
        consideraHistorico,
        setConsideraHistorico,
        anoLetivo,
        setAnoLetivo,
        codigoDre,
        setCodigoDre,
        codigoUe,
        setCodigoUe,
        modalidade,
        setModalidade,
        semestre,
        setSemestre,
        codigoTurma,
        setCodigoTurma,
        bimestre,
        setBimestre,
        listaAnosLetivo,
        setListaAnosLetivo,
        listaDres,
        setListaDres,
        listaUes,
        setListaUes,
        listaModalidades,
        setListaModalidades,
        listaSemestres,
        setListaSemestres,
        listaTurmas,
        setListaTurmas,
        listaBimestres,
        setListaBimestres,
        tabAtual,
        setTabAtual,
        carregarFiltrosSalvos,
        setCarregarFiltrosSalvos,
        componenteCurricularInicial,
        setComponenteCurricularInicial,
        componenteCurricular,
        setComponenteCurricular,
        bimestreOperacoes,
        setBimestreOperacoes,
        listaComponenteCurricular,
        setListaComponenteCurricular,
        obterBimestres,
        exibirLoaderGeral,
        setExibirLoaderGeral,
      }}
    >
      {children}
    </ListaoContext.Provider>
  );
};

ListaoContextProvider.defaultProps = {
  children: {},
};

ListaoContextProvider.propTypes = {
  children: PropTypes.node,
};

export default ListaoContextProvider;
