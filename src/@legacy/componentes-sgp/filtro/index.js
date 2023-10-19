import { Checkbox } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shortid from 'shortid';
import {
  removerTurma,
  selecionarTurma,
  setRecarregarFiltroPrincipal,
  turmasUsuario,
} from '~/redux/modulos/usuario/actions';

import {
  SGP_BUTTON_FILTRO_PRINCIPAL_APLICAR,
  SGP_BUTTON_FILTRO_PRINCIPAL_EXPANDIR_RETRAIR_FILTRO,
  SGP_CAMPO_FILTRO_PRINCIPAL_PESQUISAR_TURMA,
  SGP_SELECT_FILTRO_PRINCIPAL_ANOLETIVO,
  SGP_SELECT_FILTRO_PRINCIPAL_DRE,
  SGP_SELECT_FILTRO_PRINCIPAL_MODALIDADE,
  SGP_SELECT_FILTRO_PRINCIPAL_PERIODO,
  SGP_SELECT_FILTRO_PRINCIPAL_TURMA,
  SGP_SELECT_FILTRO_PRINCIPAL_UE,
} from '../../constantes/ids/filtro-principal';

import { Loader } from '~/componentes';
import Button from '~/componentes/button';
import { Colors } from '~/componentes/colors';
import Grid from '~/componentes/grid';
import SelectComponent from '~/componentes/select';
import { TOKEN_EXPIRADO } from '~/constantes';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import {
  limparDadosFiltro,
  salvarAnosLetivos,
  salvarDres,
  salvarModalidades,
  salvarPeriodos,
  salvarTurmas,
  salvarUnidadesEscolares,
} from '~/redux/modulos/filtro/actions';
import { setTrocouPerfil } from '~/redux/modulos/perfil/actions';
import { erro } from '~/servicos/alertas';
import api from '~/servicos/api';
import { ordenarDescPor, validarAcaoTela, verificarTelaEdicao } from '~/utils';
import FiltroHelper from './helper';
import {
  Busca,
  Campo,
  Container,
  Fechar,
  ItemLista,
  SetaFunction,
} from './index.css';

const Filtro = () => {
  const dispatch = useDispatch();
  const [alternarFocoCampo, setAlternarFocoCampo] = useState(false);
  const [alternarFocoBusca, setAlternarFocoBusca] = useState(false);

  const Seta = SetaFunction(alternarFocoBusca);

  const divBuscaRef = useRef();
  const campoBuscaRef = useRef();

  const [carregandoModalidades, setCarregandoModalidades] = useState(false);
  const [carregandoPeriodos, setCarregandoPeriodos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);

  const usuarioStore = useSelector(state => state.usuario);
  const trocouPerfil = useSelector(state => state.perfil)?.trocouPerfil;
  const dadosFiltroAutenticacaoFrequencia = useSelector(
    state => state.turmaFiltroAutenticacaoFrequencia
  )?.dadosFiltroAutenticacaoFrequencia;

  const turmaUsuarioSelecionada = usuarioStore.turmaSelecionada;
  const recarregarFiltroPrincipal = usuarioStore?.recarregarFiltroPrincipal;
  const [campoAnoLetivoDesabilitado, setCampoAnoLetivoDesabilitado] =
    useState(true);
  const [campoModalidadeDesabilitado, setCampoModalidadeDesabilitado] =
    useState(true);
  const [campoPeriodoDesabilitado, setCampoPeriodoDesabilitado] =
    useState(true);
  const [campoDreDesabilitado, setCampoDreDesabilitado] = useState(true);
  const [campoUnidadeEscolarDesabilitado, setCampoUnidadeEscolarDesabilitado] =
    useState(true);
  const [campoTurmaDesabilitado, setCampoTurmaDesabilitado] = useState(true);

  const anosLetivoStore = useSelector(state => state.filtro.anosLetivos);
  const [anosLetivos, setAnosLetivos] = useState(anosLetivoStore || []);
  const [anoLetivoSelecionado, setAnoLetivoSelecionado] = useState(
    turmaUsuarioSelecionada ? turmaUsuarioSelecionada.anoLetivo : ''
  );

  const modalidadesStore = useSelector(state => state.filtro.modalidades);
  const [modalidades, setModalidades] = useState(modalidadesStore);
  const [modalidadeSelecionada, setModalidadeSelecionada] = useState(
    turmaUsuarioSelecionada ? turmaUsuarioSelecionada.modalidade : ''
  );

  const periodosStore = useSelector(state => state.filtro.periodos);
  const [periodos, setPeriodos] = useState(periodosStore);
  const [periodoSelecionado, setPeriodoSelecionado] = useState(
    turmaUsuarioSelecionada
      ? turmaUsuarioSelecionada.periodo || undefined
      : undefined
  );

  const dresStore = useSelector(state => state.filtro.dres);
  const [dres, setDres] = useState(dresStore);
  const [dreSelecionada, setDreSelecionada] = useState(
    turmaUsuarioSelecionada ? turmaUsuarioSelecionada.dre : ''
  );
  const [aplicouFiltro, setAplicouFiltro] = useState(false);

  const unidadesEscolaresStore = useSelector(
    state => state.filtro.unidadesEscolares
  );
  const [unidadesEscolares, setUnidadesEscolares] = useState(
    unidadesEscolaresStore
  );
  const [unidadeEscolarSelecionada, setUnidadeEscolarSelecionada] = useState(
    turmaUsuarioSelecionada ? turmaUsuarioSelecionada.unidadeEscolar : ''
  );

  const turmasStore = useSelector(state => state.filtro.turmas);
  const [turmas, setTurmas] = useState(turmasStore);
  const [turmaSelecionada, setTurmaSelecionada] = useState(
    turmaUsuarioSelecionada ? turmaUsuarioSelecionada.turma : ''
  );

  const [textoAutocomplete, setTextoAutocomplete] = useState(
    turmaUsuarioSelecionada ? turmaUsuarioSelecionada.desc : ''
  );
  const [resultadosFiltro, setResultadosFiltro] = useState([]);

  const [consideraHistorico, setConsideraHistorico] = useState(
    !!dadosFiltroAutenticacaoFrequencia?.turma?.historica ||
      !!turmaUsuarioSelecionada.consideraHistorico
  );

  const ehEJAOuCelp =
    Number(modalidadeSelecionada) === ModalidadeEnum.EJA ||
    Number(modalidadeSelecionada) === ModalidadeEnum.CELP;

  const aplicarFiltro = useCallback(
    async (
      consideraHist,
      anoLetivo,
      mod,
      dre,
      ue,
      turmaAtual,
      listaModalidades,
      listaTurmas,
      listaUes,
      periodo
    ) => {
      const emEdicao = verificarTelaEdicao();
      if (emEdicao) {
        const pararAcao = await validarAcaoTela();
        if (pararAcao) return;
      }

      if (anoLetivo && mod && dre && ue && turmaAtual) {
        const modalidadeDesc = listaModalidades.find(
          item => item.valor.toString() === `${mod}`
        );

        const turmaSelecionadaCompleta = listaTurmas.find(
          item => item?.valor?.toString() === turmaAtual
        );

        const unidadeEscolarDesc = listaUes.find(
          unidade => unidade.valor === ue
        );

        setTextoAutocomplete(
          `${modalidadeDesc ? modalidadeDesc.desc : 'Modalidade'} - ${
            turmaSelecionadaCompleta ? turmaSelecionadaCompleta.desc : 'Turma'
          } - ${
            unidadeEscolarDesc ? unidadeEscolarDesc.desc : 'Unidade Escolar'
          }`
        );

        setAlternarFocoBusca(false);
        setAplicouFiltro(true);

        if (!turmaSelecionadaCompleta) return;
        const turma = {
          anoLetivo,
          modalidade: mod,
          dre,
          unidadeEscolar: ue,
          turma: turmaAtual,
          ano: turmaSelecionadaCompleta.ano,
          desc: `${anoLetivo} - ${
            turmaSelecionadaCompleta &&
            turmaSelecionadaCompleta.modalidadeTurmaNome
              ? turmaSelecionadaCompleta.modalidadeTurmaNome
              : ''
          } - ${
            unidadeEscolarDesc && unidadeEscolarDesc.desc
              ? unidadeEscolarDesc.desc
              : ''
          }`,
          periodo: periodo || 0,
          consideraHistorico: consideraHist,
          ensinoEspecial: turmaSelecionadaCompleta.ensinoEspecial,
          id: turmaSelecionadaCompleta.id,
        };

        dispatch(turmasUsuario(listaTurmas));
        dispatch(selecionarTurma(turma));

        setTextoAutocomplete(turma.desc);
      }
    },
    [dispatch]
  );

  const [podeRemoverTurma, setPodeRemoverTurma] = useState(true);

  useEffect(() => {
    if (
      anosLetivos.length === 1 &&
      anoLetivoSelecionado &&
      modalidades.length === 1 &&
      modalidadeSelecionada &&
      dres.length === 1 &&
      dreSelecionada &&
      unidadesEscolares.length === 1 &&
      unidadeEscolarSelecionada &&
      turmas.length === 1 &&
      turmaSelecionada
    ) {
      aplicarFiltro(
        consideraHistorico,
        anoLetivoSelecionado,
        modalidadeSelecionada,
        dreSelecionada,
        unidadeEscolarSelecionada,
        turmaSelecionada,
        modalidades,
        turmas,
        unidadesEscolares,
        periodoSelecionado
      );
      setPodeRemoverTurma(false);
    }
  }, [
    aplicarFiltro,
    consideraHistorico,
    modalidades,
    periodoSelecionado,
    anoLetivoSelecionado,
    anosLetivos.length,
    dreSelecionada,
    dres.length,
    modalidadeSelecionada,
    modalidades.length,
    turmaSelecionada,
    turmas,
    unidadeEscolarSelecionada,
    unidadesEscolares,
  ]);

  useEffect(() => {
    if (
      dadosFiltroAutenticacaoFrequencia?.turma?.codigo &&
      anoLetivoSelecionado &&
      modalidadeSelecionada &&
      dreSelecionada &&
      unidadeEscolarSelecionada &&
      turmaSelecionada
    ) {
      aplicarFiltro(
        consideraHistorico,
        anoLetivoSelecionado,
        modalidadeSelecionada,
        dreSelecionada,
        unidadeEscolarSelecionada,
        turmaSelecionada,
        modalidades,
        turmas,
        unidadesEscolares,
        periodoSelecionado
      );
      setPodeRemoverTurma(false);
    }
  }, [
    aplicarFiltro,
    consideraHistorico,
    anoLetivoSelecionado,
    modalidadeSelecionada,
    periodoSelecionado,
    dreSelecionada,
    unidadeEscolarSelecionada,
    turmaSelecionada,
    dadosFiltroAutenticacaoFrequencia,
  ]);

  const reabilitarCampos = () => {
    setCampoDreDesabilitado(false);
    setCampoAnoLetivoDesabilitado(false);
    setCampoModalidadeDesabilitado(false);
    setCampoPeriodoDesabilitado(false);
    setCampoTurmaDesabilitado(false);
    setCampoUnidadeEscolarDesabilitado(false);
    setAplicouFiltro(false);
  };

  useEffect(() => {
    setAnoLetivoSelecionado(turmaUsuarioSelecionada.anoLetivo || undefined);
    setModalidadeSelecionada(turmaUsuarioSelecionada.modalidade || undefined);
    setPeriodoSelecionado(turmaUsuarioSelecionada.periodo || undefined);
    setDreSelecionada(turmaUsuarioSelecionada.dre || undefined);
    setUnidadeEscolarSelecionada(
      turmaUsuarioSelecionada.unidadeEscolar || undefined
    );
    setTurmaSelecionada(turmaUsuarioSelecionada.turma || undefined);
    setTextoAutocomplete(turmaUsuarioSelecionada.desc || undefined);

    const consideraHistoricoAtual =
      !!dadosFiltroAutenticacaoFrequencia?.turma?.historica ||
      !!turmaUsuarioSelecionada.consideraHistorico;

    setConsideraHistorico(consideraHistoricoAtual);

    if (!turmaUsuarioSelecionada.length) setCampoAnoLetivoDesabilitado(false);
  }, [
    turmaUsuarioSelecionada.anoLetivo,
    turmaUsuarioSelecionada.consideraHistorico,
    turmaUsuarioSelecionada.desc,
    turmaUsuarioSelecionada.dre,
    turmaUsuarioSelecionada.length,
    turmaUsuarioSelecionada.modalidade,
    turmaUsuarioSelecionada.periodo,
    turmaUsuarioSelecionada.turma,
    turmaUsuarioSelecionada.unidadeEscolar,
  ]);

  const campoVazio = campo => !campo || campo === '';

  /*
  Sessão onde obtem os dados no backend

  ObterAnosLetivos
  ObterModalidade
  ObterPeriodos
  ObterDres
  ObterUnidadesEscolares
  ObterTurmas
 */

  const obterAnosLetivos = useCallback(
    async deveSalvarAnosLetivos => {
      if (!deveSalvarAnosLetivos) return;

      const anosLetivo = await FiltroHelper.obterAnosLetivos({
        consideraHistorico,
      });

      if (!anosLetivo.length) {
        const anoAtual = window.moment().format('YYYY');

        anosLetivo.push({
          desc: anoAtual,
          valor: anoAtual,
        });
      }

      const anosOrdenados = ordenarDescPor(anosLetivo, 'valor');
      dispatch(salvarAnosLetivos(anosOrdenados));
      setAnosLetivos(anosOrdenados);
    },
    [consideraHistorico, dispatch]
  );

  const obterModalidades = useCallback(
    async deveSalvarModalidade => {
      setCarregandoModalidades(true);

      const modalidadesLista = await FiltroHelper.obterModalidades({
        consideraHistorico,
        anoLetivoSelecionado,
      });

      if (deveSalvarModalidade) {
        setModalidades(modalidadesLista);
        dispatch(salvarModalidades(modalidadesLista));
        setCampoModalidadeDesabilitado(modalidadesLista.length === 1);
      }

      setCarregandoModalidades(false);
      return modalidadesLista;
    },
    [anoLetivoSelecionado, consideraHistorico, dispatch]
  );

  const obterPeriodos = useCallback(
    async deveSalvarPeriodos => {
      if (campoVazio(anoLetivoSelecionado) || campoVazio(modalidadeSelecionada))
        return [];

      setCarregandoPeriodos(true);

      const periodo = await FiltroHelper.obterPeriodos({
        consideraHistorico,
        modalidadeSelecionada,
        anoLetivoSelecionado,
      });

      setCarregandoPeriodos(false);

      if (!ModalidadeEnum) {
        setCampoPeriodoDesabilitado(true);
        return [];
      }

      if (!deveSalvarPeriodos) return [];

      dispatch(salvarPeriodos(periodo));
      setPeriodos(periodo);
      setCampoPeriodoDesabilitado(periodo.length === 1);

      return [];
    },
    [anoLetivoSelecionado, consideraHistorico, dispatch, modalidadeSelecionada]
  );

  const obterDres = useCallback(
    async (estado, periodo) => {
      if (campoVazio(anoLetivoSelecionado) || campoVazio(modalidadeSelecionada))
        return [];

      setCarregandoDres(true);

      const listaDres = await FiltroHelper.obterDres({
        consideraHistorico,
        modalidadeSelecionada,
        periodoSelecionado: periodo,
        anoLetivoSelecionado,
      });

      if (estado) {
        dispatch(salvarDres(listaDres));
        setDres(listaDres);
        setCampoDreDesabilitado(listaDres.length === 1);
      }

      setCarregandoDres(false);
      return listaDres;
    },
    [anoLetivoSelecionado, consideraHistorico, dispatch, modalidadeSelecionada]
  );

  const obterUnidadesEscolares = useCallback(
    async (deveSalvarUes, periodo) => {
      if (
        campoVazio(anoLetivoSelecionado) ||
        campoVazio(modalidadeSelecionada) ||
        campoVazio(dreSelecionada)
      )
        return [];

      setCarregandoUes(true);

      const ues = await FiltroHelper.obterUnidadesEscolares({
        consideraHistorico,
        modalidadeSelecionada,
        dreSelecionada,
        periodoSelecionado: periodo,
        anoLetivoSelecionado,
      });

      if (!ues) {
        setDreSelecionada();
        setCampoDreDesabilitado(true);
        setCarregandoUes(false);
        erro('Esta DRE não possui unidades escolares da modalidade escolhida');
        return [];
      }

      if (deveSalvarUes) {
        dispatch(salvarUnidadesEscolares(ues));
        setUnidadesEscolares(ues);
        setCampoUnidadeEscolarDesabilitado(ues.length === 1);
      }

      setCarregandoUes(false);
      return ues;
    },
    [
      anoLetivoSelecionado,
      consideraHistorico,
      dispatch,
      dreSelecionada,
      modalidadeSelecionada,
    ]
  );

  const obterTurmas = useCallback(
    async deveSalvarTurmas => {
      if (
        campoVazio(anoLetivoSelecionado) ||
        campoVazio(modalidadeSelecionada) ||
        campoVazio(dreSelecionada) ||
        campoVazio(unidadeEscolarSelecionada)
      )
        return [];

      let periodo = null;

      if (ehEJAOuCelp) {
        periodo = periodoSelecionado;
      }

      setCarregandoTurmas(true);

      let existeErroTokenExpirado = false;
      const listaTurmas = await FiltroHelper.obterTurmas({
        consideraHistorico,
        modalidadeSelecionada,
        unidadeEscolarSelecionada,
        periodoSelecionado: periodo,
        anoLetivoSelecionado,
      }).catch(e => {
        if (e?.message.indexOf(TOKEN_EXPIRADO) >= 0) {
          existeErroTokenExpirado = true;
        }
      });

      if (existeErroTokenExpirado) return [];
      if ((!listaTurmas || listaTurmas.length === 0) && aplicouFiltro) {
        setUnidadeEscolarSelecionada();
        setCampoUnidadeEscolarDesabilitado(true);
        erro('Esta unidade escolar não possui turmas da modalidade escolhida');
        return [];
      }

      if (deveSalvarTurmas) {
        dispatch(salvarTurmas(listaTurmas));
        setTurmas(listaTurmas);
        setCampoTurmaDesabilitado(listaTurmas.length === 1);
      }

      setCarregandoTurmas(false);
      return listaTurmas;
    },

    [
      anoLetivoSelecionado,
      consideraHistorico,
      dispatch,
      dreSelecionada,
      modalidadeSelecionada,
      periodoSelecionado,
      unidadeEscolarSelecionada,
      ehEJAOuCelp,
    ]
  );

  /* Sessão dos useEffect que buscam Anos, Modalidades, Periodos, Dres, Unidades Escolares e Turmas */

  useEffect(() => {
    let estado = true;

    obterAnosLetivos(estado && !(anosLetivos && anosLetivos.length));

    return () => {
      estado = false;
      return estado;
    };
  }, [anosLetivos, obterAnosLetivos]);

  useEffect(() => {
    let estado = true;
    const retornoEstado = () => {
      estado = false;
      return estado;
    };

    if (anoLetivoSelecionado) {
      obterModalidades(estado);
      return retornoEstado;
    }

    setModalidadeSelecionada();
    setCampoModalidadeDesabilitado(true);

    return retornoEstado;
  }, [anoLetivoSelecionado, obterModalidades]);

  useEffect(() => {
    let estado = true;
    const retornoEstado = () => {
      estado = false;
      return estado;
    };

    if (!anoLetivoSelecionado || !modalidadeSelecionada) {
      setPeriodoSelecionado(undefined);
      setDreSelecionada();
      setCampoPeriodoDesabilitado(true);
      setCampoDreDesabilitado(true);
      return retornoEstado;
    }

    if (ehEJAOuCelp) {
      obterPeriodos(estado);
      setCampoDreDesabilitado(true);
      return retornoEstado;
    }

    obterDres(estado);
    return retornoEstado;
  }, [
    anoLetivoSelecionado,
    modalidadeSelecionada,
    obterDres,
    obterPeriodos,
    ehEJAOuCelp,
  ]);

  useEffect(() => {
    let estado = true;
    const retornoEstado = () => {
      estado = false;
      return estado;
    };

    if (!anoLetivoSelecionado || !modalidadeSelecionada) {
      setPeriodoSelecionado(undefined);
      setDreSelecionada();
      setCampoPeriodoDesabilitado(true);
      setCampoDreDesabilitado(true);
      return retornoEstado;
    }

    if (
      modalidadeSelecionada.toString() !== ModalidadeEnum.EJA.toString() ||
      modalidadeSelecionada.toString() !== ModalidadeEnum.CELP.toString()
    )
      return retornoEstado;

    if (periodoSelecionado) {
      obterDres(estado);
      return retornoEstado;
    }

    setDreSelecionada();
    setCampoDreDesabilitado(true);
    return retornoEstado;
  }, [
    anoLetivoSelecionado,
    modalidadeSelecionada,
    obterDres,
    periodoSelecionado,
  ]);

  useEffect(() => {
    let estado = true;
    const retornoEstado = () => {
      estado = false;
      return estado;
    };

    if (!anoLetivoSelecionado || !modalidadeSelecionada || !dreSelecionada) {
      setUnidadeEscolarSelecionada();
      setCampoUnidadeEscolarDesabilitado(true);
      return retornoEstado;
    }

    let periodo = null;
    if (ehEJAOuCelp) {
      periodo = periodoSelecionado;
    }

    obterUnidadesEscolares(estado, periodo);

    return retornoEstado;
  }, [
    anoLetivoSelecionado,
    dreSelecionada,
    modalidadeSelecionada,
    obterUnidadesEscolares,
    periodoSelecionado,
    ehEJAOuCelp,
  ]);

  useEffect(() => {
    if (
      anoLetivoSelecionado &&
      modalidadeSelecionada &&
      dreSelecionada &&
      unidadeEscolarSelecionada
    ) {
      obterTurmas(true);
    }
  }, [
    anoLetivoSelecionado,
    dreSelecionada,
    modalidadeSelecionada,
    obterTurmas,
    unidadeEscolarSelecionada,
  ]);

  /* Sessão que seleciona automaticamente no filtro se houver apenas 1 registro */

  useEffect(() => {
    if (anosLetivos?.length) {
      if (anosLetivos.length === 1) {
        setAnoLetivoSelecionado(anosLetivos[0].valor);
      } else if (dadosFiltroAutenticacaoFrequencia?.turma?.anoLetivo) {
        setAnoLetivoSelecionado(
          dadosFiltroAutenticacaoFrequencia.turma.anoLetivo
        );
      }
    }
    setCampoAnoLetivoDesabilitado(anosLetivos?.length === 1);
  }, [anosLetivos, dadosFiltroAutenticacaoFrequencia]);

  useEffect(() => {
    if (modalidades?.length) {
      if (modalidades.length === 1) {
        setModalidadeSelecionada(modalidades[0].valor);
      } else if (dadosFiltroAutenticacaoFrequencia?.turma?.modalidadeCodigo) {
        setModalidadeSelecionada(
          dadosFiltroAutenticacaoFrequencia.turma.modalidadeCodigo
        );
      }
      setCampoModalidadeDesabilitado(modalidades?.length === 1);
    }
  }, [modalidades, dadosFiltroAutenticacaoFrequencia]);

  useEffect(() => {
    if (periodos?.length) {
      if (periodos.length === 1) {
        setPeriodoSelecionado(periodos[0].valor);
      } else if (dadosFiltroAutenticacaoFrequencia?.turma?.semestre) {
        setPeriodoSelecionado(dadosFiltroAutenticacaoFrequencia.turma.semestre);
      }
    }
  }, [periodos, dadosFiltroAutenticacaoFrequencia]);

  useEffect(() => {
    if (dres?.length) {
      if (dres.length === 1) {
        setDreSelecionada(dres[0].valor);
      } else if (dadosFiltroAutenticacaoFrequencia?.turma?.dreCodigo) {
        setDreSelecionada(dadosFiltroAutenticacaoFrequencia.turma.dreCodigo);
      }
    }
  }, [dres, dadosFiltroAutenticacaoFrequencia]);

  useEffect(() => {
    if (unidadesEscolares?.length) {
      if (unidadesEscolares.length === 1) {
        setUnidadeEscolarSelecionada(unidadesEscolares[0].valor);
      } else if (dadosFiltroAutenticacaoFrequencia?.turma?.ueCodigo) {
        setUnidadeEscolarSelecionada(
          dadosFiltroAutenticacaoFrequencia.turma.ueCodigo
        );
      }
    }
  }, [unidadesEscolares, dadosFiltroAutenticacaoFrequencia]);

  useEffect(() => {
    if (turmas?.length) {
      if (turmas.length === 1) {
        setTurmaSelecionada(turmas[0].valor);
      } else if (dadosFiltroAutenticacaoFrequencia?.turma?.codigo) {
        setTurmaSelecionada(dadosFiltroAutenticacaoFrequencia.turma.codigo);
      }

      setCampoTurmaDesabilitado(turmas?.length === 1);
    }
  }, [turmas, dadosFiltroAutenticacaoFrequencia]);

  useEffect(() => {
    dispatch(limparDadosFiltro());
    obterAnosLetivos(true);
  }, [consideraHistorico, dispatch, obterAnosLetivos]);

  const limparCamposSelecionados = useCallback(() => {
    setAnoLetivoSelecionado('');
    setModalidadeSelecionada('');
    setDreSelecionada('');
    setPeriodoSelecionado(undefined);
    setUnidadeEscolarSelecionada('');
    setTurmaSelecionada('');
    setAplicouFiltro(false);
  }, []);

  const aoSelecionarHistorico = () => {
    setConsideraHistorico(!consideraHistorico);
    limparCamposSelecionados();
  };

  const limparFiltro = useCallback(() => {
    dispatch(limparDadosFiltro());
    dispatch(removerTurma());
    limparCamposSelecionados();
    setTextoAutocomplete('');
    obterAnosLetivos(true);
  }, [dispatch, limparCamposSelecionados, obterAnosLetivos]);

  const recarregarFiltro = useCallback(async () => {
    if (usuarioStore && usuarioStore.ehProfessorCj) {
      if (
        usuarioStore.turmaSelecionada &&
        usuarioStore.turmaSelecionada.turma &&
        usuarioStore.turmasUsuario &&
        usuarioStore.turmasUsuario.length
      ) {
        const turmaBkp = { ...usuarioStore.turmaSelecionada };
        const listaModalidades = await obterModalidades(false);

        let continuar = true;

        if (listaModalidades.length <= 0) {
          limparFiltro();
          continuar = false;
        }

        if (listaModalidades && listaModalidades.length) {
          const modalidadeNaLista = listaModalidades.find(
            item => String(item.valor) === String(turmaBkp.modalidade)
          );

          if (!modalidadeNaLista) {
            limparFiltro();
            continuar = false;
          }
        }
        if (!continuar) {
          return;
        }

        const listaDres = await obterDres(false, turmaBkp.periodo);
        if (listaDres && listaDres.length) {
          const dreNaLista = listaDres.find(
            item => String(item.valor) === String(turmaBkp.dre)
          );
          if (!dreNaLista) {
            limparFiltro();
            continuar = false;
          }
        }
        if (!continuar) {
          return;
        }

        const periodo =
          turmaBkp.modalidade.toString() === ModalidadeEnum.EJA.toString() ||
          turmaBkp.modalidade.toString() === ModalidadeEnum.CELP.toString()
            ? turmaBkp.periodo
            : null;
        const listaUes = await obterUnidadesEscolares(false, periodo);
        if (listaUes && listaUes.length) {
          const ueNaLista = listaUes.find(
            item => String(item.valor) === String(turmaBkp.unidadeEscolar)
          );
          if (!ueNaLista) {
            limparFiltro();
            continuar = false;
          }
        }
        if (!continuar) {
          return;
        }

        const listaTurmas = await obterTurmas(false);
        if (listaTurmas && listaTurmas.length) {
          const turmaNaLista = listaTurmas.find(
            item => String(item.valor) === String(turmaBkp.turma)
          );
          if (!turmaNaLista) {
            limparFiltro();
            continuar = false;
          }
        }
        if (!continuar) {
          return;
        }

        // MODALIDADES
        setModalidades(listaModalidades);
        dispatch(salvarModalidades(listaModalidades));
        setCampoModalidadeDesabilitado(listaModalidades.length === 1);

        // DRES
        dispatch(salvarDres(listaDres));
        setDres(listaDres);
        setCampoDreDesabilitado(listaDres.length === 1);

        // UES
        dispatch(salvarUnidadesEscolares(listaUes));
        setUnidadesEscolares(listaUes);
        setCampoUnidadeEscolarDesabilitado(listaUes.length === 1);

        // TURMAS
        dispatch(salvarTurmas(listaTurmas));
        setTurmas(listaTurmas);
        setCampoTurmaDesabilitado(listaTurmas.length === 1);
      } else {
        limparFiltro();
      }
    } else if (
      !(usuarioStore.turmaSelecionada && usuarioStore.turmaSelecionada.turma)
    ) {
      limparFiltro();
    }
  });

  useEffect(() => {
    if (trocouPerfil) {
      recarregarFiltro();
      dispatch(setTrocouPerfil(false));
    }
  }, [trocouPerfil, recarregarFiltro]);

  const mostrarEsconderBusca = () => {
    setAlternarFocoBusca(!alternarFocoBusca);
    setAlternarFocoCampo(false);
  };

  useEffect(() => {
    const controlaClickFora = evento => {
      if (
        evento.target.nodeName !== 'svg' &&
        evento.target.nodeName !== 'path' &&
        !evento.target.classList.contains('fa-caret-down') &&
        !document.getElementById('containerFiltro').contains(evento.target)
      ) {
        setAlternarFocoBusca(!alternarFocoBusca);
      }
      setAlternarFocoCampo(false);
    };

    if (!turmaUsuarioSelecionada && !alternarFocoBusca && alternarFocoCampo)
      campoBuscaRef.current.focus();
    if (alternarFocoBusca)
      document.addEventListener('click', controlaClickFora);
    return () => document.removeEventListener('click', controlaClickFora);
  }, [alternarFocoBusca, alternarFocoCampo, turmaUsuarioSelecionada]);

  useEffect(() => {
    if (!turmaUsuarioSelecionada) campoBuscaRef.current.focus();
    if (!textoAutocomplete) setResultadosFiltro([]);
  }, [textoAutocomplete, turmaUsuarioSelecionada]);

  useEffect(() => {
    if (!turmaUsuarioSelecionada) campoBuscaRef.current.focus();
  }, [resultadosFiltro, turmaUsuarioSelecionada]);

  const onChangeAutocomplete = () => {
    const texto = campoBuscaRef.current.value;
    setTextoAutocomplete(texto);

    if (texto.length >= 2) {
      api
        .get(`v1/abrangencias/${consideraHistorico}/${texto}`)
        .then(resposta => {
          if (resposta.data) {
            setResultadosFiltro(resposta.data);
          }
        });
    }
  };

  const selecionaTurmaAutocomplete = resultado => {
    setTextoAutocomplete(resultado.descricaoFiltro);
    const turma = {
      anoLetivo: resultado.anoLetivo,
      modalidade: resultado.codigoModalidade,
      dre: resultado.codigoDre,
      unidadeEscolar: resultado.codigoUe,
      turma: resultado.codigoTurma,
      desc: resultado.descricaoFiltro,
      periodo: resultado.semestre,
      consideraHistorico,
      ano: resultado.ano,
      ensinoEspecial: resultado.ensinoEspecial,
      id: resultado.turmaId,
    };

    dispatch(selecionarTurma(turma));
    dispatch(turmasUsuario(turmas));

    setResultadosFiltro([]);
  };

  let selecionado = -1;

  const aoPressionarTeclaBaixoAutocomplete = evento => {
    if (resultadosFiltro && resultadosFiltro.length > 0) {
      const resultados = document.querySelectorAll('.list-group-item');
      if (resultados && resultados.length > 0) {
        if (evento.key === 'ArrowUp') {
          if (selecionado > 0) selecionado -= 1;
        } else if (evento.key === 'ArrowDown') {
          if (selecionado < resultados.length - 1) selecionado += 1;
        }
        resultados.forEach(resultado =>
          resultado.classList.remove('selecionado')
        );
        if (resultados[selecionado]) {
          resultados[selecionado].classList.add('selecionado');
          campoBuscaRef.current.focus();
        }
      }
    }
  };

  const Filtrar = () => {
    if (resultadosFiltro) {
      if (resultadosFiltro.length === 1) {
        setModalidadeSelecionada(
          resultadosFiltro[0].codigoModalidade.toString()
        );
        setDreSelecionada(resultadosFiltro[0].codigoDre);
        setUnidadeEscolarSelecionada(resultadosFiltro[0].codigoUe);
        setTurmaSelecionada(resultadosFiltro[0].codigoTurma);
        selecionaTurmaAutocomplete(resultadosFiltro[0]);
      } else {
        const itemSelecionado = document.querySelector(
          '.list-group-item.selecionado'
        );
        if (itemSelecionado) {
          const indice = itemSelecionado.getAttribute('tabindex');
          if (indice) {
            const resultado = resultadosFiltro[indice];
            if (resultado) {
              setModalidadeSelecionada(resultado.codigoModalidade.toString());
              setDreSelecionada(resultado.codigoDre);
              setUnidadeEscolarSelecionada(resultado.codigoUe);
              setTurmaSelecionada(resultado.codigoTurma);
              selecionaTurmaAutocomplete(resultado);
            }
          }
        }
      }
    }
  };

  const aoSubmeterAutocomplete = evento => {
    evento.preventDefault();
    Filtrar();
  };

  const aoFocarBusca = () => {
    if (alternarFocoBusca) {
      setAlternarFocoBusca(false);
      setAlternarFocoCampo(true);
    }
  };

  const aoTrocarAnoLetivo = ano => {
    if (ano !== anoLetivoSelecionado) setModalidadeSelecionada();

    setAnoLetivoSelecionado(ano);
    setAplicouFiltro(false);
    if (turmas) {
      setTurmaSelecionada('');
      setTurmas([]);
      setCampoTurmaDesabilitado(true);
    }
  };

  const aoTrocarModalidade = valor => {
    if (valor !== modalidadeSelecionada) {
      setDreSelecionada();
      setPeriodoSelecionado(undefined);
      setAplicouFiltro(false);
      if (turmas) {
        setTurmaSelecionada('');
        setTurmas([]);
        setCampoTurmaDesabilitado(true);
      }
    }

    setModalidadeSelecionada(valor);
  };

  const aoTrocarPeriodo = periodo => {
    if (periodo !== periodoSelecionado) {
      setDreSelecionada();
      setAplicouFiltro(false);
    }

    setPeriodoSelecionado(periodo || undefined);
  };

  const aoTrocarDre = dre => {
    if (dre !== dreSelecionada) {
      setUnidadeEscolarSelecionada();
      setAplicouFiltro(false);
      if (turmas) {
        setTurmas([]);
        setCampoTurmaDesabilitado(true);
      }
    }

    setDreSelecionada(dre);
  };

  const aoTrocarUnidadeEscolar = unidade => {
    if (unidade !== unidadeEscolarSelecionada) {
      setTurmaSelecionada();
      obterTurmas();
      setAplicouFiltro(false);
    }

    setUnidadeEscolarSelecionada(unidade);
  };

  const aoTrocarTurma = turma => {
    setAplicouFiltro(false);
    setTurmaSelecionada(turma);
  };

  const removerTurmaSelecionada = async () => {
    const pararAcao = await validarAcaoTela();
    if (pararAcao) return;

    dispatch(removerTurma());
    setModalidadeSelecionada();
    setPeriodoSelecionado(undefined);
    setDreSelecionada();
    setUnidadeEscolarSelecionada();
    setTurmaSelecionada();
    setTextoAutocomplete('');
    setAnoLetivoSelecionado();

    reabilitarCampos();
  };

  useEffect(() => {
    if (!alternarFocoBusca) {
      if (!anoLetivoSelecionado && turmaUsuarioSelecionada.length) {
        setAnoLetivoSelecionado(turmaUsuarioSelecionada.anoLetivo);
        setCampoAnoLetivoDesabilitado(false);
      }

      if (
        turmaUsuarioSelecionada.anoLetivo &&
        anoLetivoSelecionado &&
        String(turmaUsuarioSelecionada.anoLetivo) !==
          String(anoLetivoSelecionado)
      )
        setAnoLetivoSelecionado(turmaUsuarioSelecionada.anoLetivo);

      if (
        turmaUsuarioSelecionada.modalidade &&
        modalidadeSelecionada &&
        String(turmaUsuarioSelecionada.modalidade) !==
          String(modalidadeSelecionada)
      )
        setModalidadeSelecionada(turmaUsuarioSelecionada.modalidade);

      if (
        turmaUsuarioSelecionada.periodo &&
        periodoSelecionado &&
        String(turmaUsuarioSelecionada.periodo) !== String(periodoSelecionado)
      )
        setPeriodoSelecionado(turmaUsuarioSelecionada.periodo || undefined);

      if (
        turmaUsuarioSelecionada.dre &&
        dreSelecionada &&
        String(turmaUsuarioSelecionada.dre) !== String(dreSelecionada)
      )
        setDreSelecionada(turmaUsuarioSelecionada.dre);

      if (
        turmaUsuarioSelecionada.unidadeEscolar &&
        unidadeEscolarSelecionada &&
        turmaUsuarioSelecionada.unidadeEscolar &&
        unidadeEscolarSelecionada
      )
        setUnidadeEscolarSelecionada(turmaUsuarioSelecionada.unidadeEscolar);

      if (
        turmaUsuarioSelecionada.turma &&
        turmaSelecionada &&
        String(turmaUsuarioSelecionada.turma) !== String(turmaSelecionada)
      )
        setTurmaSelecionada(turmaUsuarioSelecionada.turma);

      setTextoAutocomplete(turmaUsuarioSelecionada.desc);

      const consideraHistoricoAtual =
        !!dadosFiltroAutenticacaoFrequencia?.turma?.historica ||
        !!turmaUsuarioSelecionada.consideraHistorico;

      setConsideraHistorico(consideraHistoricoAtual);
    }
  }, [
    alternarFocoBusca,
    turmaUsuarioSelecionada.anoLetivo,
    turmaUsuarioSelecionada.consideraHistorico,
    turmaUsuarioSelecionada.desc,
    turmaUsuarioSelecionada.dre,
    turmaUsuarioSelecionada.length,
    turmaUsuarioSelecionada.modalidade,
    turmaUsuarioSelecionada.periodo,
    turmaUsuarioSelecionada.turma,
    turmaUsuarioSelecionada.unidadeEscolar,
  ]);

  useEffect(() => {
    if (recarregarFiltroPrincipal) {
      recarregarFiltro();
      aplicarFiltro(
        turmaUsuarioSelecionada.consideraHistorico,
        turmaUsuarioSelecionada.anoLetivo,
        turmaUsuarioSelecionada.modalidade,
        turmaUsuarioSelecionada.dre,
        turmaUsuarioSelecionada.unidadeEscolar,
        turmaUsuarioSelecionada.turma,
        modalidadesStore,
        turmasStore,
        unidadesEscolaresStore,
        turmaUsuarioSelecionada.periodo
      );

      dispatch(setRecarregarFiltroPrincipal(false));
    }
  }, [
    dispatch,
    aplicarFiltro,
    recarregarFiltroPrincipal,
    turmaUsuarioSelecionada.consideraHistorico,
    turmaUsuarioSelecionada.anoLetivo,
    turmaUsuarioSelecionada.modalidade,
    turmaUsuarioSelecionada.dre,
    turmaUsuarioSelecionada.unidadeEscolar,
    turmaUsuarioSelecionada.turma,
    modalidadesStore,
    turmasStore,
    unidadesEscolaresStore,
    turmaUsuarioSelecionada.periodo,
  ]);

  return (
    <Container className="position-relative w-100" id="containerFiltro">
      <form className="w-100" onSubmit={aoSubmeterAutocomplete}>
        <div className="form-group mb-0 w-100 position-relative">
          <Busca className="fa fa-search fa-lg bg-transparent position-absolute text-center" />
          <Campo
            id={SGP_CAMPO_FILTRO_PRINCIPAL_PESQUISAR_TURMA}
            type="text"
            className="form-control form-control-lg rounded d-flex px-5 border-0 fonte-14"
            placeholder="Pesquisar Turma"
            ref={campoBuscaRef}
            onFocus={aoFocarBusca}
            onChange={onChangeAutocomplete}
            onKeyDown={aoPressionarTeclaBaixoAutocomplete}
            readOnly={!!turmaUsuarioSelecionada.turma}
            value={textoAutocomplete || ''}
          />
          {!!turmaUsuarioSelecionada.turma && podeRemoverTurma && (
            <Fechar
              className="fa fa-times position-absolute"
              onClick={removerTurmaSelecionada}
            />
          )}
          <Seta
            id={SGP_BUTTON_FILTRO_PRINCIPAL_EXPANDIR_RETRAIR_FILTRO}
            className="fa fa-caret-down rounded-circle position-absolute text-center"
            onClick={mostrarEsconderBusca}
          />
        </div>
        {resultadosFiltro.length > 0 && (
          <div className="container d-block position-absolute bg-white shadow rounded mt-1 p-0">
            <div className="list-group">
              {resultadosFiltro.map((resultado, indice) => {
                return (
                  <ItemLista
                    key={shortid.generate()}
                    className="list-group-item list-group-item-action border-0 rounded-0"
                    onClick={() => selecionaTurmaAutocomplete(resultado)}
                    tabIndex={indice}
                  >
                    {resultado.descricaoFiltro}
                  </ItemLista>
                );
              })}
            </div>
          </div>
        )}
        {alternarFocoBusca && (
          <div
            ref={divBuscaRef}
            className="container d-block position-absolute bg-white shadow rounded mt-1 px-3 pt-4 pb-1"
          >
            <div className="form-row">
              <Grid cols={12} className="form-group">
                <Checkbox
                  checked={consideraHistorico}
                  onChange={aoSelecionarHistorico}
                >
                  Exibir histórico?
                </Checkbox>
              </Grid>
            </div>
            <div className="form-row">
              <Grid cols={3} className="form-group">
                <SelectComponent
                  id={SGP_SELECT_FILTRO_PRINCIPAL_ANOLETIVO}
                  className="fonte-14"
                  onChange={aoTrocarAnoLetivo}
                  lista={anosLetivos}
                  containerVinculoId="containerFiltro"
                  valueOption="valor"
                  valueText="desc"
                  valueSelect={
                    anoLetivoSelecionado && `${anoLetivoSelecionado}`
                  }
                  placeholder="Ano"
                  disabled={campoAnoLetivoDesabilitado}
                />
              </Grid>
              <Grid
                cols={modalidadeSelecionada && ehEJAOuCelp ? 5 : 9}
                className="form-group"
              >
                <Loader loading={carregandoModalidades} tip="">
                  <SelectComponent
                    id={SGP_SELECT_FILTRO_PRINCIPAL_MODALIDADE}
                    className="fonte-14"
                    onChange={aoTrocarModalidade}
                    lista={modalidades}
                    valueOption="valor"
                    containerVinculoId="containerFiltro"
                    valueText="desc"
                    valueSelect={
                      modalidadeSelecionada && `${modalidadeSelecionada}`
                    }
                    placeholder="Modalidade"
                    disabled={campoModalidadeDesabilitado}
                  />
                </Loader>
              </Grid>
              {modalidadeSelecionada && ehEJAOuCelp && (
                <Grid cols={4} className="form-group">
                  <Loader loading={carregandoPeriodos} tip="">
                    <SelectComponent
                      id={SGP_SELECT_FILTRO_PRINCIPAL_PERIODO}
                      className="fonte-14"
                      onChange={aoTrocarPeriodo}
                      lista={periodos}
                      valueOption="valor"
                      containerVinculoId="containerFiltro"
                      valueText="desc"
                      valueSelect={
                        periodoSelecionado && `${periodoSelecionado}`
                      }
                      placeholder="Período"
                      disabled={campoPeriodoDesabilitado}
                    />
                  </Loader>
                </Grid>
              )}
            </div>
            <div className="form-group">
              <Loader loading={carregandoDres} tip="">
                <SelectComponent
                  className="fonte-14"
                  id={SGP_SELECT_FILTRO_PRINCIPAL_DRE}
                  onChange={aoTrocarDre}
                  lista={dres}
                  valueOption="valor"
                  containerVinculoId="containerFiltro"
                  valueText="desc"
                  valueSelect={dreSelecionada && `${dreSelecionada}`}
                  placeholder="Diretoria Regional De Educação (DRE)"
                  disabled={campoDreDesabilitado}
                  showSearch
                />
              </Loader>
            </div>
            <div className="form-group">
              <Loader loading={carregandoUes} tip="">
                <SelectComponent
                  className="fonte-14"
                  id={SGP_SELECT_FILTRO_PRINCIPAL_UE}
                  onChange={aoTrocarUnidadeEscolar}
                  lista={unidadesEscolares}
                  valueOption="valor"
                  containerVinculoId="containerFiltro"
                  valueText="desc"
                  valueSelect={
                    unidadeEscolarSelecionada && `${unidadeEscolarSelecionada}`
                  }
                  placeholder="Unidade Escolar (UE)"
                  disabled={campoUnidadeEscolarDesabilitado}
                  showSearch
                />
              </Loader>
            </div>
            <div className="form-row d-flex justify-content-between">
              <Grid cols={9} className="form-group">
                <Loader loading={carregandoTurmas} tip="">
                  <SelectComponent
                    id={SGP_SELECT_FILTRO_PRINCIPAL_TURMA}
                    className="fonte-14"
                    onChange={aoTrocarTurma}
                    lista={turmas}
                    valueOption="valor"
                    valueText="desc"
                    containerVinculoId="containerFiltro"
                    valueSelect={turmaSelecionada && `${turmaSelecionada}`}
                    placeholder="Turma"
                    disabled={
                      !unidadeEscolarSelecionada || campoTurmaDesabilitado
                    }
                    showSearch
                  />
                </Loader>
              </Grid>
              <Grid cols={3} className="form-group text-right">
                <Button
                  id={SGP_BUTTON_FILTRO_PRINCIPAL_APLICAR}
                  label="Aplicar filtro"
                  color={Colors.Roxo}
                  className="ml-auto"
                  bold
                  onClick={() =>
                    aplicarFiltro(
                      consideraHistorico,
                      anoLetivoSelecionado,
                      modalidadeSelecionada,
                      dreSelecionada,
                      unidadeEscolarSelecionada,
                      turmaSelecionada,
                      modalidades,
                      turmas,
                      unidadesEscolares,
                      periodoSelecionado
                    )
                  }
                />
              </Grid>
            </div>
          </div>
        )}
      </form>
    </Container>
  );
};

export default Filtro;
