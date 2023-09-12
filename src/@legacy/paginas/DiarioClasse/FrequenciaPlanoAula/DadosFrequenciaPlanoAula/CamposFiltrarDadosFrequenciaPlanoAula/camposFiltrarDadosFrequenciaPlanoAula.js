import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CampoData } from '~/componentes';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import SelectComponent from '~/componentes/select';
import { SGP_BUTTON_PROXIMA_AULA } from '~/constantes/ids/button';
import { SGP_DATE_SELECIONAR_DATA_FREQUENCIA_PLANO_AULA } from '~/constantes/ids/date';
import { SGP_SELECT_COMPONENTE_CURRICULAR } from '~/constantes/ids/select';
import { salvarDadosAulaFrequencia } from '~/redux/modulos/calendarioProfessor/actions';
import {
  limparDadosFrequenciaPlanoAula,
  setAtualizarDatas,
  setAulaIdFrequenciaPlanoAula,
  setAulaIdPodeEditar,
  setComponenteCurricularFrequenciaPlanoAula,
  setDataSelecionadaFrequenciaPlanoAula,
  setExibirLoaderFrequenciaPlanoAula,
} from '~/redux/modulos/frequenciaPlanoAula/actions';
import { confirmar, erros } from '~/servicos';
import ServicoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoFrequencia';
import ServicoDisciplina from '~/servicos/Paginas/ServicoDisciplina';
import servicoSalvarFrequenciaPlanoAula from '../../servicoSalvarFrequenciaPlanoAula';
import ModalSelecionarAulaFrequenciaPlanoAula from '../ModalSelecionarAula/modalSelecionarAulaFrequenciaPlanoAula';
import { setLimparTurmaFiltroAutenticacaoFrequencia } from '@/@legacy/redux/modulos/turmaFiltroAutenticacaoFrequencia/actions';

const CamposFiltrarDadosFrequenciaPlanoAula = () => {
  const dispatch = useDispatch();

  const [bloquearProximo, setBloquearProximo] = useState(true);

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const componenteCurricular = useSelector(
    state => state.frequenciaPlanoAula.componenteCurricular
  );

  const modoEdicaoFrequencia = useSelector(
    state => state.frequenciaPlanoAula.modoEdicaoFrequencia
  );

  const modoEdicaoPlanoAula = useSelector(
    state => state.frequenciaPlanoAula.modoEdicaoPlanoAula
  );

  const dataSelecionada = useSelector(
    state => state.frequenciaPlanoAula.dataSelecionada
  );

  const aulaId = useSelector(state => state.frequenciaPlanoAula.aulaId);

  const dadosAulaFrequencia = useSelector(
    state => state.calendarioProfessor.dadosAulaFrequencia
  );

  const atualizarDatas = useSelector(
    state => state.frequenciaPlanoAula.atualizarDatas
  );

  const dadosFiltroAutenticacaoFrequencia = useSelector(
    state => state.turmaFiltroAutenticacaoFrequencia
  )?.dadosFiltroAutenticacaoFrequencia;

  const [listaComponenteCurricular, setListaComponenteCurricular] = useState(
    []
  );
  const [codigoComponenteCurricular, setCodigoComponenteCurricular] =
    useState(undefined);

  const [listaDatasAulas, setListaDatasAulas] = useState();
  const [diasParaHabilitar, setDiasParaHabilitar] = useState();
  const [diasParaSinalizar, setDiasParaSinalizar] = useState();
  const [aulasParaSelecionar, setAulasParaSelecionar] = useState([]);
  const [exibirModalSelecionarAula, setExibirModalSelecionarAula] =
    useState(false);

  const valorPadrao = useMemo(() => {
    const ano = turmaSelecionada.anoLetivo;
    const dataParcial = moment().format('MM-DD');
    const dataInteira = moment(`${dataParcial}-${ano}`, 'MM-DD-YYYY');
    return dataInteira;
  }, [turmaSelecionada.anoLetivo]);

  const obterDatasDeAulasDisponiveis = useCallback(async () => {
    dispatch(setExibirLoaderFrequenciaPlanoAula(true));

    const codComponenteCurricular =
      componenteCurricular?.codDisciplinaPai || componenteCurricular?.id;

    const datasDeAulas =
      turmaSelecionada && turmaSelecionada.turma && codComponenteCurricular
        ? await ServicoFrequencia.obterDatasDeAulasPorCalendarioTurmaEComponenteCurricular(
            turmaSelecionada.turma,
            codComponenteCurricular
          )
            .finally(() => dispatch(setExibirLoaderFrequenciaPlanoAula(false)))
            .catch(e => erros(e))
        : [];

    if (datasDeAulas && datasDeAulas.data && datasDeAulas.data.length) {
      setListaDatasAulas(datasDeAulas.data);
      const habilitar = [];
      const sinalizar = [];
      datasDeAulas.data.forEach(itemDatas => {
        const dataFormatada = moment(itemDatas.data).format('YYYY-MM-DD');
        itemDatas.aulas.forEach(itemAulas => {
          if (itemAulas.possuiFrequenciaRegistrada) {
            sinalizar.push(moment(dataFormatada));
          }
        });
        habilitar.push(dataFormatada);
      });
      setDiasParaHabilitar(habilitar);
      setDiasParaSinalizar(sinalizar);
      dispatch(setAtualizarDatas(false));
    } else {
      setListaDatasAulas();
      setDiasParaHabilitar();
      dispatch(setExibirLoaderFrequenciaPlanoAula(false));
    }
  }, [turmaSelecionada, componenteCurricular, dispatch]);

  const obterListaComponenteCurricular = useCallback(async () => {
    dispatch(setExibirLoaderFrequenciaPlanoAula(true));
    const resposta =
      turmaSelecionada && turmaSelecionada.turma
        ? await ServicoDisciplina.obterDisciplinasPorTurma(
            turmaSelecionada.turma
          )
            .finally(() => dispatch(setExibirLoaderFrequenciaPlanoAula(false)))
            .catch(e => erros(e))
        : [];

    const lista = resposta.data;

    if (lista?.length) {
      setListaComponenteCurricular(lista);
      if (lista.length === 1) {
        const componente = lista[0];
        dispatch(setComponenteCurricularFrequenciaPlanoAula(componente));
      } else if (
        dadosFiltroAutenticacaoFrequencia?.componenteCurricularCodigo
      ) {
        const componenteNaLista = lista.find(
          item =>
            String(item?.codigoComponenteCurricular) ===
            String(
              dadosFiltroAutenticacaoFrequencia?.componenteCurricularCodigo
            )
        );

        if (componenteNaLista) {
          dispatch(
            setComponenteCurricularFrequenciaPlanoAula(componenteNaLista)
          );
        }
        dispatch(setLimparTurmaFiltroAutenticacaoFrequencia());
      }
    } else {
      setListaComponenteCurricular([]);
      dispatch(setComponenteCurricularFrequenciaPlanoAula(undefined));
      dispatch(setExibirLoaderFrequenciaPlanoAula(false));
    }
  }, [turmaSelecionada, dispatch]);

  const resetarInfomacoes = useCallback(() => {
    dispatch(limparDadosFrequenciaPlanoAula());
  }, [dispatch]);

  // Inicio, quando tem turma selecionada realizar a consulta da lista de componentes curriculares!
  useEffect(() => {
    if (turmaSelecionada && turmaSelecionada.turma) {
      obterListaComponenteCurricular();
    } else {
      dispatch(setComponenteCurricularFrequenciaPlanoAula(undefined));
      setListaComponenteCurricular([]);
    }
  }, [obterListaComponenteCurricular, turmaSelecionada, dispatch]);

  // Quando selecionar o componente curricular vai realizar a consulta das das que tem aulas cadastrada para essa turma!
  useEffect(() => {
    if (codigoComponenteCurricular && turmaSelecionada?.turma) {
      obterDatasDeAulasDisponiveis();
    }
  }, [codigoComponenteCurricular]);

  useEffect(() => {
    if (atualizarDatas) {
      obterDatasDeAulasDisponiveis();
    }
  }, [atualizarDatas]);

  // Quando tem valor do componente curricular no redux vai setar o id no componente select!
  useEffect(() => {
    if (
      listaComponenteCurricular &&
      listaComponenteCurricular.length &&
      componenteCurricular
    ) {
      setCodigoComponenteCurricular(String(componenteCurricular.id));
    } else {
      setCodigoComponenteCurricular(undefined);
    }
  }, [componenteCurricular, listaComponenteCurricular]);

  const pergutarParaSalvar = () => {
    return confirmar(
      'Atenção',
      '',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
  };

  const onChangeComponenteCurricular = useCallback(
    async codigoComponenteCurricularId => {
      if (!codigoComponenteCurricularId) {
        dispatch(salvarDadosAulaFrequencia());
      }

      const aposValidarSalvar = () => {
        resetarInfomacoes();
        if (codigoComponenteCurricularId) {
          const componente = listaComponenteCurricular.find(
            item =>
              String(item.codigoComponenteCurricular) ===
                codigoComponenteCurricularId ||
              String(item.id) === codigoComponenteCurricularId ||
              String(item.CodigoComponenteCurricularTerritorioSaber) ===
                codigoComponenteCurricularId ||
              String(item.codDisciplinaPai) === codigoComponenteCurricularId
          );
          dispatch(setComponenteCurricularFrequenciaPlanoAula(componente));
        } else {
          dispatch(setComponenteCurricularFrequenciaPlanoAula(undefined));
        }

        if (!codigoComponenteCurricularId) {
          setListaDatasAulas();
          setDiasParaHabilitar();
          dispatch(setDataSelecionadaFrequenciaPlanoAula());
        }
      };

      if (modoEdicaoFrequencia || modoEdicaoPlanoAula) {
        const confirmarParaSalvar = await pergutarParaSalvar();
        if (confirmarParaSalvar) {
          const salvou =
            await servicoSalvarFrequenciaPlanoAula.validarSalvarFrequenciPlanoAula();

          if (salvou) {
            aposValidarSalvar();
          }
        } else {
          aposValidarSalvar();
          // TODO
          // resetarPlanoAula();
        }
      } else {
        aposValidarSalvar();
      }
    },
    [
      dispatch,
      modoEdicaoFrequencia,
      modoEdicaoPlanoAula,
      listaComponenteCurricular,
      resetarInfomacoes,
    ]
  );

  const obterAulaSelecionada = useCallback(
    async data => {
      if (listaDatasAulas) {
        const aulaDataSelecionada = listaDatasAulas.find(item => {
          return (
            window.moment(item.data).format('DD/MM/YYYY') ===
            window.moment(data).format('DD/MM/YYYY')
          );
        });

        return aulaDataSelecionada;
      }
      return null;
    },
    [listaDatasAulas]
  );

  useEffect(() => {
    if (aulaId) {
      ServicoFrequencia.obterListaFrequencia();
    }
  }, [aulaId]);

  const validaSeTemIdAula = useCallback(
    async (data, dadosAulaCalendario) => {
      if (dadosAulaCalendario) {
        // Quando usuário pode visualizar uma aula por data selecionada!
        dispatch(setAulaIdFrequenciaPlanoAula(dadosAulaCalendario?.aulaId));
        dispatch(setAulaIdPodeEditar(dadosAulaCalendario?.podeEditarAula));
      } else {
        const aulaDataSelecionada = await obterAulaSelecionada(data);
        if (aulaDataSelecionada && aulaDataSelecionada.aulas.length === 1) {
          // Quando usuário pode visualizar uma aula por data selecionada!
          dispatch(
            setAulaIdFrequenciaPlanoAula(aulaDataSelecionada.aulas[0].aulaId)
          );
          dispatch(
            setAulaIdPodeEditar(aulaDataSelecionada?.aulas?.[0]?.podeEditar)
          );
          // Após setar o id vai disparar evento para buscar lista de frequencia!
        } else if (
          aulaDataSelecionada &&
          aulaDataSelecionada.aulas.length > 1
        ) {
          // Quando usuário pode visualizar mais aulas por data selecionada!
          setAulasParaSelecionar(aulaDataSelecionada.aulas);
          setExibirModalSelecionarAula(true);
        }
      }
    },
    [obterAulaSelecionada, dispatch]
  );

  const onChangeData = useCallback(
    async (data, dadosAulaCalendario) => {
      let salvou = true;
      if (modoEdicaoFrequencia || modoEdicaoPlanoAula) {
        const confirmarParaSalvar = await pergutarParaSalvar();
        if (confirmarParaSalvar) {
          salvou =
            await servicoSalvarFrequenciaPlanoAula.validarSalvarFrequenciPlanoAula();
        }
      }

      if (salvou) {
        resetarInfomacoes();
        await validaSeTemIdAula(data, dadosAulaCalendario);
        dispatch(setDataSelecionadaFrequenciaPlanoAula(data));
      }
    },
    [
      modoEdicaoFrequencia,
      modoEdicaoPlanoAula,
      validaSeTemIdAula,
      dispatch,
      resetarInfomacoes,
    ]
  );

  const onClickFecharModal = () => {
    setExibirModalSelecionarAula(false);
  };

  const onClickSelecionarAula = aulaDataSelecionada => {
    setExibirModalSelecionarAula(false);
    if (aulaDataSelecionada) {
      // Após setar o id vai disparar evento para buscar lista de frequencia! -
      dispatch(setAulaIdFrequenciaPlanoAula(aulaDataSelecionada.aulaId));
      dispatch(setAulaIdPodeEditar(aulaDataSelecionada.podeEditar));
    }
  };

  // Executa quando vir da tela do calendario!
  useEffect(() => {
    if (
      dadosAulaFrequencia &&
      Object.entries(dadosAulaFrequencia).length &&
      dadosAulaFrequencia.disciplinaId &&
      listaComponenteCurricular &&
      listaComponenteCurricular.length &&
      !codigoComponenteCurricular
    ) {
      onChangeComponenteCurricular(String(dadosAulaFrequencia.disciplinaId));
    }
    if (
      dadosAulaFrequencia &&
      Object.entries(dadosAulaFrequencia).length &&
      dadosAulaFrequencia.dia &&
      diasParaHabilitar &&
      diasParaHabilitar.length &&
      !dataSelecionada
    ) {
      onChangeData(window.moment(dadosAulaFrequencia.dia), {
        ...dadosAulaFrequencia,
      });
      dispatch(salvarDadosAulaFrequencia());
    }
  }, [
    dadosAulaFrequencia,
    listaComponenteCurricular,
    dataSelecionada,
    diasParaHabilitar,
    onChangeComponenteCurricular,
    onChangeData,
    codigoComponenteCurricular,
  ]);

  const onClickProximaAula = async () => {
    const datasOrdenadas = diasParaHabilitar.sort(
      (a, b) => Date.parse(new Date(a)) - Date.parse(new Date(b))
    );
    const proximoIndice =
      datasOrdenadas.findIndex(
        data =>
          window.moment(data).format('DD/MM/YYYY') ===
          window.moment(dataSelecionada).format('DD/MM/YYYY')
      ) + 1;
    await onChangeData(window.moment(datasOrdenadas[proximoIndice]));
  };

  useEffect(() => {
    if (diasParaHabilitar && dataSelecionada) {
      const datasOrdenadas = diasParaHabilitar.sort(
        (a, b) => Date.parse(new Date(a)) - Date.parse(new Date(b))
      );
      const indiceAtual = datasOrdenadas.findIndex(
        data =>
          window.moment(data).format('DD/MM/YYYY') ===
          window.moment(dataSelecionada).format('DD/MM/YYYY')
      );
      const qtdeItems = datasOrdenadas.length - 1;
      setBloquearProximo(indiceAtual >= qtdeItems);
    }
  }, [diasParaHabilitar, dataSelecionada]);

  return (
    <>
      <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
        <SelectComponent
          id={SGP_SELECT_COMPONENTE_CURRICULAR}
          lista={listaComponenteCurricular}
          valueOption="id"
          valueText="nome"
          valueSelect={codigoComponenteCurricular}
          onChange={onChangeComponenteCurricular}
          placeholder="Selecione um componente curricular"
          disabled={
            !turmaSelecionada.turma ||
            (listaComponenteCurricular &&
              listaComponenteCurricular.length === 1)
          }
        />
      </div>
      <div className="col-sm-12 col-md-4 col-lg-3 col-xl-3 mb-3">
        <CampoData
          id={SGP_DATE_SELECIONAR_DATA_FREQUENCIA_PLANO_AULA}
          valor={dataSelecionada}
          onChange={onChangeData}
          placeholder="DD/MM/AAAA"
          formatoData="DD/MM/YYYY"
          desabilitado={
            !listaComponenteCurricular ||
            !listaComponenteCurricular.length ||
            !codigoComponenteCurricular ||
            !diasParaHabilitar
          }
          diasParaHabilitar={diasParaHabilitar}
          diasParaSinalizar={diasParaSinalizar}
          valorPadrao={valorPadrao}
        />
      </div>
      <div className="col-sm-12 col-md-4 col-lg-3 col-xl-3 mb-3">
        <Button
          id={SGP_BUTTON_PROXIMA_AULA}
          label="Próxima aula"
          icon="arrow-right"
          color={Colors.Azul}
          border
          className="mr-3"
          disabled={bloquearProximo}
          onClick={onClickProximaAula}
        />
      </div>
      <ModalSelecionarAulaFrequenciaPlanoAula
        visivel={exibirModalSelecionarAula}
        aulasParaSelecionar={aulasParaSelecionar}
        onClickFecharModal={onClickFecharModal}
        onClickSelecionarAula={onClickSelecionarAula}
      />
    </>
  );
};

export default CamposFiltrarDadosFrequenciaPlanoAula;
