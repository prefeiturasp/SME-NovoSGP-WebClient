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

  // Utilizado para carregar os filtros novamente quando voltar para a tela de listagem de componentes!
  const [carregarFiltrosSalvos, setCarregarFiltrosSalvos] = useState(false);

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
  const [periodoAbertoListao, setPeriodoAbertoListao] = useState(true);
  const [somenteConsultaListao, setSomenteConsultaListao] = useState(false);
  const [listaoEhInfantil, setListaoEhInfantil] = useState(false);
  const [exibirLoaderGeral, setExibirLoaderGeral] = useState(false);

  // TAB FREQUÊNCIA
  const [listaPeriodos, setListaPeriodos] = useState([]);
  const [listaTiposFrequencia, setListaTiposFrequencia] = useState([]);
  const [periodo, setPeriodo] = useState();
  const [dadosFrequencia, setDadosFrequencia] = useState();
  const [dadosIniciaisFrequencia, setDadosIniciaisFrequencia] = useState();

  // TAB PLANO AULA
  const [dadosPlanoAula, setDadosPlanoAula] = useState([]);
  const [dadosIniciaisPlanoAula, setDadosIniciaisPlanoAula] = useState([]);
  const [listaObjetivosAprendizagem, setListaObjetivosAprendizagem] = useState(
    []
  );
  const [errosPlanoAulaListao, setErrosPlanoAulaListao] = useState([]);

  const limparTelaListao = () => {
    setComponenteCurricular();
    setBimestreOperacoes();
    setListaComponenteCurricular([]);
    setExibirLoaderGeral(false);
    setListaoEhInfantil(false);
    setPeriodoAbertoListao(true);
    setSomenteConsultaListao(false);
    setListaPeriodos([]);
    setPeriodo();
    setDadosFrequencia();
    setListaTiposFrequencia([]);
    setDadosIniciaisFrequencia();
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
        // TELA LISTÃO
        componenteCurricular,
        setComponenteCurricular,
        bimestreOperacoes,
        setBimestreOperacoes,
        listaComponenteCurricular,
        setListaComponenteCurricular,
        exibirLoaderGeral,
        setExibirLoaderGeral,
        listaoEhInfantil,
        setListaoEhInfantil,
        periodoAbertoListao,
        setPeriodoAbertoListao,
        somenteConsultaListao,
        setSomenteConsultaListao,
        // TAB FREQUÊNCIA,
        listaPeriodos,
        setListaPeriodos,
        periodo,
        setPeriodo,
        dadosFrequencia,
        setDadosFrequencia,
        listaTiposFrequencia,
        setListaTiposFrequencia,
        dadosIniciaisFrequencia,
        setDadosIniciaisFrequencia,
        limparTelaListao,
        // TAB PLANO AULA,
        dadosPlanoAula,
        setDadosPlanoAula,
        dadosIniciaisPlanoAula,
        setDadosIniciaisPlanoAula,
        listaObjetivosAprendizagem,
        setListaObjetivosAprendizagem,
        errosPlanoAulaListao,
        setErrosPlanoAulaListao,
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
