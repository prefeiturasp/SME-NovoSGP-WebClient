import PropTypes from 'prop-types';
import React, { useState } from 'react';
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
  const [periodoAbertoListao, setPeriodoAbertoListao] = useState(true);
  const [somenteConsultaListao, setSomenteConsultaListao] = useState(false);

  // Utilizado para carregar os filtros novamente quando voltar para a tela de listagem de componentes!
  const [carregarFiltrosSalvos, setCarregarFiltrosSalvos] = useState(false);
  const [exibirLoaderGeral, setExibirLoaderGeral] = useState(false);

  // TAB FREQUÊNCIA
  const [listaPeriodos, setListaPeriodos] = useState([]);
  const [listaTiposFrequencia, setListaTiposFrequencia] = useState([]);
  const [periodo, setPeriodo] = useState();
  const [dadosFrequencia, setDadosFrequencia] = useState();
  const [dadosIniciaisFrequencia, setDadosIniciaisFrequencia] = useState();

  const [
    componenteCurricularDiarioBordo,
    setComponenteCurricularDiarioBordo,
  ] = useState();
  const [
    listaComponentesCurricularesDiario,
    setListaComponentesCurricularesDiario,
  ] = useState();
  const [listaoEhInfantil, setListaoEhInfantil] = useState(false);

  const [dadosDiarioBordo, setDadosDiarioBordo] = useState([]);
  const [dadosIniciaisDiarioBordo, setDadosIniciaisDiarioBordo] = useState([]);
  const [dadosAlteradosDiarioBordo, setDadosAlteradosDiarioBordo] = useState(
    []
  );
  const [errosDiarioBordoListao, setErrosDiarioBordoListao] = useState([]);

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

  const FILTROS = {
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
  };

  const TELA_LISTAO = {
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
  };

  const TAB_FREQUENCIA = {
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
  };

  const TAB_DIARIO_BORDO = {
    componenteCurricularDiarioBordo,
    setComponenteCurricularDiarioBordo,
    listaComponentesCurricularesDiario,
    setListaComponentesCurricularesDiario,
    dadosDiarioBordo,
    setDadosDiarioBordo,
    dadosIniciaisDiarioBordo,
    setDadosIniciaisDiarioBordo,
    errosDiarioBordoListao,
    setErrosDiarioBordoListao,
    dadosAlteradosDiarioBordo,
    setDadosAlteradosDiarioBordo,
  };

  return (
    <ListaoContext.Provider
      value={{
        ...FILTROS,
        ...TELA_LISTAO,
        ...TAB_FREQUENCIA,
        ...TAB_DIARIO_BORDO,
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
