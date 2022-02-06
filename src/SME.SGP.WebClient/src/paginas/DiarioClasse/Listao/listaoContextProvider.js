import PropTypes from 'prop-types';
import React, { useState } from 'react';
import ListaoContext from './listaoContext';

const ListaoContextProvider = ({ children }) => {
  // LISTÃO LISTAGEM FILTROS
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
  const [carregarFiltrosSalvos, setCarregarFiltrosSalvos] = useState(false);
  const [
    componenteCurricularInicial,
    setComponenteCurricularInicial,
  ] = useState();

  // LISTÃO OPERAÇÃO
  const [componenteCurricular, setComponenteCurricular] = useState();
  const [listaComponenteCurricular, setListaComponenteCurricular] = useState(
    []
  );
  const [bimestreOperacoes, setBimestreOperacoes] = useState();
  const [tabAtual, setTabAtual] = useState();
  const [periodoAbertoListao, setPeriodoAbertoListao] = useState(true);
  const [somenteConsultaListao, setSomenteConsultaListao] = useState(false);
  const [permissaoLista, setPermissaoLista] = useState();
  const [listaoEhInfantil, setListaoEhInfantil] = useState(false);
  const [exibirLoaderGeral, setExibirLoaderGeral] = useState(false);

  // TAB FREQUÊNCIA
  const [listaPeriodos, setListaPeriodos] = useState([]);
  const [periodo, setPeriodo] = useState();
  const [listaTiposFrequencia, setListaTiposFrequencia] = useState([]);
  const [dadosFrequencia, setDadosFrequencia] = useState();
  const [dadosIniciaisFrequencia, setDadosIniciaisFrequencia] = useState();

  // TAB PLANO AULA
  const [dadosPlanoAula, setDadosPlanoAula] = useState([]);
  const [dadosIniciaisPlanoAula, setDadosIniciaisPlanoAula] = useState([]);
  const [listaObjetivosAprendizagem, setListaObjetivosAprendizagem] = useState(
    []
  );
  const [errosPlanoAulaListao, setErrosPlanoAulaListao] = useState([]);
  const [
    executarObterPlanoAulaPorPeriodo,
    setExecutarObterPlanoAulaPorPeriodo,
  ] = useState(false);

  // TAB DIÁRIO DE BORDO
  const [
    componenteCurricularDiarioBordo,
    setComponenteCurricularDiarioBordo,
  ] = useState();
  const [
    listaComponentesCurricularesDiario,
    setListaComponentesCurricularesDiario,
  ] = useState();
  const [dadosDiarioBordo, setDadosDiarioBordo] = useState([]);
  const [dadosIniciaisDiarioBordo, setDadosIniciaisDiarioBordo] = useState([]);
  const [errosDiarioBordoListao, setErrosDiarioBordoListao] = useState([]);
  const [idDiarioBordoAtual, setIdDiarioBordoAtual] = useState();

  // TAB AVALIAÇÃO
  const [dadosAvaliacao, setDadosAvaliacao] = useState();
  const [dadosIniciaisAvaliacao, setDadosIniciaisAvaliacao] = useState();
  const [dadosPeriodosAvaliacao, setDadosPeriodosAvaliacao] = useState();

  // TAB FECHAMENTO
  const [dadosFechamento, setDadosFechamento] = useState();
  const [dadosIniciaisFechamento, setDadosIniciaisFechamento] = useState();
  const [componentesRegenciaListao, setComponentesRegenciaListao] = useState(
    []
  );
  const [
    exibirModalJustificativaFechamento,
    setExibirModalJustificativaFechamento,
  ] = useState(false);

  const limparTabFechamento = () => {
    setDadosFechamento();
    setDadosIniciaisFechamento();
    setComponentesRegenciaListao([]);
  };

  const limparTabFrequencia = () => {
    setDadosFrequencia();
    setListaTiposFrequencia([]);
    setDadosIniciaisFrequencia();
  };

  const limparTabAvaliacao = () => {
    setDadosAvaliacao();
    setDadosIniciaisAvaliacao();
    setDadosPeriodosAvaliacao();
  };

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
    limparTabFrequencia();
    limparTabAvaliacao();
    limparTabFechamento();
  };

  return (
    <ListaoContext.Provider
      value={{
        // LISTÃO LISTAGEM FILTROS
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
        carregarFiltrosSalvos,
        setCarregarFiltrosSalvos,
        componenteCurricularInicial,
        setComponenteCurricularInicial,
        // LISTÃO OPERAÇÃO
        limparTelaListao,
        componenteCurricular,
        setComponenteCurricular,
        listaComponenteCurricular,
        setListaComponenteCurricular,
        bimestreOperacoes,
        setBimestreOperacoes,
        tabAtual,
        setTabAtual,
        periodoAbertoListao,
        setPeriodoAbertoListao,
        somenteConsultaListao,
        setSomenteConsultaListao,
        listaoEhInfantil,
        setListaoEhInfantil,
        exibirLoaderGeral,
        setExibirLoaderGeral,
        permissaoLista,
        setPermissaoLista,
        // TAB FREQUÊNCIA
        listaPeriodos,
        setListaPeriodos,
        periodo,
        setPeriodo,
        listaTiposFrequencia,
        setListaTiposFrequencia,
        dadosFrequencia,
        setDadosFrequencia,
        dadosIniciaisFrequencia,
        setDadosIniciaisFrequencia,
        // TAB PLANO AULA
        dadosPlanoAula,
        setDadosPlanoAula,
        dadosIniciaisPlanoAula,
        setDadosIniciaisPlanoAula,
        listaObjetivosAprendizagem,
        setListaObjetivosAprendizagem,
        errosPlanoAulaListao,
        setErrosPlanoAulaListao,
        executarObterPlanoAulaPorPeriodo,
        setExecutarObterPlanoAulaPorPeriodo,
        // TAB DIÁRIO DE BORDO
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
        idDiarioBordoAtual,
        setIdDiarioBordoAtual,
        // TAB AVALIAÇÃO
        dadosAvaliacao,
        setDadosAvaliacao,
        dadosIniciaisAvaliacao,
        setDadosIniciaisAvaliacao,
        dadosPeriodosAvaliacao,
        setDadosPeriodosAvaliacao,
        // TAB FECHAMENTO
        dadosFechamento,
        setDadosFechamento,
        dadosIniciaisFechamento,
        setDadosIniciaisFechamento,
        componentesRegenciaListao,
        setComponentesRegenciaListao,
        exibirModalJustificativaFechamento,
        setExibirModalJustificativaFechamento,
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
