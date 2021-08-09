import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import { Divider } from 'antd';
import {
  Auditoria,
  Button,
  CampoData,
  CampoTexto,
  Colors,
  JoditEditor,
  Loader,
  SelectAutocomplete,
  SelectComponent,
} from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';

import { ModalidadeDTO } from '~/dtos';
import {
  AbrangenciaServico,
  erros,
  ServicoFiltroRelatorio,
  ServicoComunicados,
  ServicoCalendarios,
} from '~/servicos';

import { OPCAO_TODOS } from '~/constantes';
import { onchangeMultiSelect } from '~/utils';

import MensagemRodape from '../MensagemRodape/mensagemRodape';
import ListaAlunos from '../ListaAlunos/listaAlunos';
import ListaDestinatarios from '../ListaDestinatarios/listaDestinatarios';
import ServicoComunicadoEvento from '~/servicos/Paginas/AcompanhamentoEscolar/ComunicadoEvento/ServicoComunicadoEvento';

const Filtros = ({ onChangeFiltros }) => {
  const [alunoEspecifico, setAlunoEspecifico] = useState();
  const [anoAtual] = useState(window.moment().format('YYYY'));
  const [anoLetivo, setAnoLetivo] = useState();
  const [anosEscolares, setAnosEscolares] = useState();
  const [buscou, setBuscou] = useState(false);
  const [buscouFiltrosAvancados, setBuscouFiltrosAvancados] = useState(false);
  const [carregandoAnosEscolares, setCarregandoAnosEscolares] = useState(false);
  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoModalidade, setCarregandoModalidade] = useState(false);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [carregandoTipoEscola, setCarregandoTipoEscola] = useState(false);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [dreCodigo, setDreCodigo] = useState();
  const [dreId, setDreId] = useState();
  const [ehDataValida, setEhDataValida] = useState(true);
  const [listaAnosEscolares, setListaAnosEscolares] = useState([]);
  const [listaAnosLetivo, setListaAnosLetivo] = useState({});
  const [listaDres, setListaDres] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [listaTipoEscola, setListaTipoEscola] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [modalidades, setModalidades] = useState();
  const [modoEdicaoConsulta, setModoEdicaoConsulta] = useState(false);
  const [semestre, setSemestre] = useState();
  const [tipoEscola, setTipoEscola] = useState();
  const [titulo, setTitulo] = useState();
  const [turmasCodigo, setTurmasCodigo] = useState();
  const [ueCodigo, setUeCodigo] = useState();
  const [ueId, setUeId] = useState();

  const [
    bloquearCamposCalendarioEventos,
    setBloquearCamposCalendarioEventos,
  ] = useState(false);
  const [idComunicado, setIdComunicado] = useState();
  const [carregandoTipoCalendario, setCarregandoTipoCalendario] = useState(
    false
  );
  const [listaTipoCalendario, setListaTipoCalendario] = useState([]);
  const [valorTipoCalendario, setValorTipoCalendario] = useState('');
  const [tipoCalendarioSelecionado, setTipoCalendarioSelecionado] = useState(
    ''
  );
  const [pesquisaTipoCalendario, setPesquisaTipoCalendario] = useState('');

  const [carregandoEventos, setCarregandoEventos] = useState(false);
  const [listaEvento, setListaEvento] = useState([]);
  const [selecionouEvento, setSelecionouEvento] = useState(false);
  const [valorEvento, setValorEvento] = useState('');
  const [eventoSelecionado, setEventoSelecionado] = useState('');
  const [pesquisaEvento, setPesquisaEvento] = useState('');
  const [novoRegistro, setNovoRegistro] = useState(true);
  const [dataEnvio, setDataEnvio] = useState();
  const [dataExpiracao, setDataExpiracao] = useState();
  const [descricaoComunicado, setDescricaoComunicado] = useState('');
  const [auditoria, setAuditoria] = useState({});
  const [exibirTotalReponsaveis, setExibirTotalReponsaveis] = useState(false);

  const [alunosLoader, setAlunosLoader] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [alunosSelecionados, setAlunosSelecionado] = useState([]);
  const [linhasSelecionadas, setLinhasSelecionadas] = useState();
  const [modalAlunosVisivel, setModalAlunosVisivel] = useState(false);
  const [carregouAlunos, setCarregouAlunos] = useState(true);

  const temModalidadeEja = modalidades?.find(
    item => String(item) === String(ModalidadeDTO.EJA)
  );
  const temSemestre = temModalidadeEja ? semestre : true;
  const ehTodasModalidade = modalidades?.find(item => item === OPCAO_TODOS);
  const ehTodosAnosEscolares = anosEscolares?.find(
    item => item === OPCAO_TODOS
  );
  const ehTodasUe = ueCodigo === OPCAO_TODOS;

  const opcoesAlunos = [
    { id: OPCAO_TODOS, nome: 'Todos' },
    { id: '1', nome: 'Crianças/Estudantes Selecionados' },
  ];

  const estudantesDesabilitados = useMemo(() => {
    return (
      (turmasCodigo?.length !== 1 || turmasCodigo[0] === OPCAO_TODOS) ?? true
    );
  }, [turmasCodigo]);

  const valorPadrao = useMemo(() => {
    const dataParcial = moment().format('MM-DD');
    const dataInteira = moment(`${dataParcial}-${anoLetivo}`, 'MM-DD-YYYY');
    return dataInteira;
  }, [anoLetivo]);
  const ANO_MINIMO = '2021';

  const limparCampos = (limpar = false) => {
    setListaUes([]);
    setUeId();
    setUeCodigo();

    setListaModalidades([]);
    setModalidades();

    setListaSemestres([]);
    setSemestre();
    setBuscou(false);

    setValorTipoCalendario();
    setTipoCalendarioSelecionado();
    setListaTipoCalendario([]);

    if (limpar) {
      setDreCodigo();
      setDreId();
      setUeId();
      setUeCodigo();
    }
  };

  const onChangeAnoLetivo = ano => {
    setAnoLetivo(ano);
    limparCampos();
  };

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);
    const retorno = await ServicoComunicados.obterAnosLetivos(ANO_MINIMO)
      .catch(e => erros(e))
      .finally(() => setCarregandoAnosLetivos(false));

    const anoSelecionado = retorno?.data.anosLetivosHistorico?.length
      ? retorno?.data.anosLetivosHistorico.map(item => ({
          desc: item,
          valor: item,
        }))
      : [];
    setAnoLetivo(retorno?.data?.anoLetivoAtual);
    setListaAnosLetivo(anoSelecionado);
  }, []);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const onChangeDre = dre => {
    const id = listaDres.find(d => d.valor === dre)?.id;
    setDreId(id);
    setDreCodigo(dre);
    limparCampos();
  };

  const obterDres = useCallback(async () => {
    if (anoLetivo) {
      setCarregandoDres(true);
      const resposta = await AbrangenciaServico.buscarDres(
        `v1/abrangencias/false/dres?anoLetivo=${anoLetivo}`
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoDres(false));

      if (resposta?.data?.length) {
        const lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));

        if (lista?.length === 1) {
          setDreCodigo(lista[0].codigo);
          setDreId(lista[0].id);
        } else {
          lista.unshift({ codigo: OPCAO_TODOS, nome: 'Todas' });
        }
        setListaDres(lista);
        return;
      }
      setDreCodigo(undefined);
      setDreId(undefined);
      setListaDres([]);
    }
  }, [anoLetivo]);

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    }
  }, [anoLetivo, obterDres]);

  const onChangeUe = ue => {
    const ueSelecionada = listaUes.find(d => d.valor === ue);
    setUeId(ueSelecionada?.id);
    setUeCodigo(ue);
    setListaModalidades([]);
    setModalidades();
    setBuscou(false);

    setValorTipoCalendario();
    setTipoCalendarioSelecionado();
    setListaTipoCalendario([]);
  };

  const obterUes = useCallback(async () => {
    if (dreCodigo) {
      const ueTodos = { nome: 'Todas', codigo: OPCAO_TODOS };
      if (dreCodigo === OPCAO_TODOS) {
        setListaUes([ueTodos]);
        setUeCodigo(OPCAO_TODOS);
        return;
      }

      setCarregandoUes(true);
      const resposta = await AbrangenciaServico.buscarUes(
        dreCodigo,
        `v1/abrangencias/false/dres/${dreCodigo}/ues?anoLetivo=${anoLetivo}&consideraNovasUEs=${true}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoUes(false));

      if (resposta?.data) {
        const lista = resposta.data;
        if (lista?.length === 1) {
          setUeId(lista[0].id);
          setUeCodigo(lista[0].codigo);
        } else {
          lista.unshift(ueTodos);
        }

        setListaUes(lista);
        return;
      }
      setListaUes([]);
    }
  }, [anoLetivo, dreCodigo]);

  useEffect(() => {
    if (dreCodigo) {
      obterUes();
      return;
    }
    setUeId();
    setListaUes([]);
  }, [dreCodigo, obterUes]);

  const onChangeModalidade = valor => {
    setModalidades(valor);
    setBuscou(false);
    setSemestre();

    setListaTipoEscola([]);
    setTipoEscola();

    setListaAnosEscolares([]);
    setAnosEscolares();

    setListaTurmas([]);
    setTurmasCodigo();

    setValorTipoCalendario();
    setTipoCalendarioSelecionado();
    setListaTipoCalendario();

    setListaEvento([]);
    setEventoSelecionado();
  };

  const obterModalidades = useCallback(async ue => {
    if (ue) {
      setCarregandoModalidade(true);
      const {
        data,
      } = await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(
        ue,
        true
      ).finally(() => setCarregandoModalidade(false));

      if (data?.length) {
        const lista = data.map(item => ({
          desc: item.descricao,
          valor: String(item.valor),
        }));

        if (lista?.length === 1) {
          onChangeModalidade([lista[0].valor]);
        } else {
          lista.unshift({
            desc: 'Todas',
            valor: OPCAO_TODOS,
          });
        }
        setListaModalidades(lista);
      }
    }
  }, []);

  useEffect(() => {
    if (anoLetivo && dreCodigo && ueCodigo) {
      obterModalidades(ueCodigo);
      return;
    }
    setModalidades();
    setListaModalidades([]);
  }, [obterModalidades, dreCodigo, anoLetivo, ueCodigo]);

  const onChangeSemestre = valor => {
    setBuscou(false);
    setSemestre(valor);
  };

  const obterSemestres = useCallback(
    async (modalidadeSelecionada, anoLetivoSelecionado) => {
      setCarregandoSemestres(true);
      const retorno = await AbrangenciaServico.obterSemestres(
        false,
        anoLetivoSelecionado,
        modalidadeSelecionada
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoSemestres(false));

      if (retorno?.data?.length) {
        const lista = retorno.data.map(periodo => ({
          desc: periodo,
          valor: periodo,
        }));

        if (lista?.length === 1) {
          setSemestre(lista[0].valor);
        }
        setListaSemestres(lista);
      }
    },
    []
  );

  useEffect(() => {
    if (
      modalidades &&
      anoLetivo &&
      String(modalidades) === String(ModalidadeDTO.EJA)
    ) {
      obterSemestres(modalidades, anoLetivo);
      return;
    }
    setSemestre();
    setListaSemestres([]);
  }, [obterSemestres, modalidades, anoLetivo]);

  const filtrar = useCallback(() => {
    const params = {
      anoLetivo,
      dreCodigo,
      ueCodigo,
      modalidades,
      semestre: semestre || 0,
      tipoEscola,
      anosEscolares,
      turmasCodigo,
      tipoCalendarioId: tipoCalendarioSelecionado,
      eventoId: eventoSelecionado,
      dataEnvio,
      dataExpiracao,
      alunosSelecionados,
      titulo,
      descricaoComunicado,
    };

    onChangeFiltros(params);
    setBuscou(true);
  }, [
    anoLetivo,
    dreCodigo,
    ueCodigo,
    modalidades,
    semestre,
    tipoEscola,
    anosEscolares,
    turmasCodigo,
    tipoCalendarioSelecionado,
    eventoSelecionado,
    dataEnvio,
    dataExpiracao,
    alunosSelecionados,
    titulo,
    descricaoComunicado,
    onChangeFiltros,
  ]);

  const ObterTiposEscola = useCallback(async () => {
    const todosTipoEscola = {
      valor: OPCAO_TODOS,
      desc: 'Todos',
    };
    if (ehTodasUe) {
      setListaTipoEscola([todosTipoEscola]);
      setTipoEscola([OPCAO_TODOS]);
      return;
    }
    setCarregandoTipoEscola(true);
    const response = await ServicoComunicados.obterTipoEscola(
      dreCodigo,
      ueCodigo
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoTipoEscola(false));

    const dados = response.data.length
      ? response.data.map(item => ({
          valor: item.codTipoEscola,
          desc: item.descricao,
          id: item.id,
        }))
      : [];

    if (dados?.length > 1) {
      dados.unshift(todosTipoEscola);
    }
    setListaTipoEscola(dados);

    const dadoTipoEscola = dados?.length === 1 ? String(dados[0].valor) : '';
    setTipoEscola([dadoTipoEscola]);
  }, [dreCodigo, ueCodigo, ehTodasUe]);

  useEffect(() => {
    if (dreCodigo && ueCodigo && modalidades?.length) {
      ObterTiposEscola();
    }
  }, [ObterTiposEscola, dreCodigo, ueCodigo, modalidades]);

  const ObterAnosEscolares = useCallback(async () => {
    const todosAnosEscolares = {
      valor: OPCAO_TODOS,
      desc: 'Todos',
    };
    if (ehTodasModalidade) {
      setListaAnosEscolares([todosAnosEscolares]);
      setAnosEscolares([OPCAO_TODOS]);
      return;
    }

    setCarregandoAnosEscolares(true);
    const response = await ServicoComunicados.buscarAnosPorModalidade(
      modalidades,
      ueCodigo
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoAnosEscolares(false));

    const dados = response?.data?.length
      ? response.data.map(item => ({
          valor: item.ano,
          desc: item.descricao,
        }))
      : [];
    const dadosSelecionados = dados?.length === 1 ? dados[0].valor : dados;
    if (dados?.length > 1) {
      dados.unshift(todosAnosEscolares);
    }
    setListaAnosEscolares(dadosSelecionados);
  }, [modalidades, ueCodigo, ehTodasModalidade]);

  useEffect(() => {
    if (ueCodigo && modalidades?.length) {
      ObterAnosEscolares();
    }
  }, [ObterAnosEscolares, modalidades, ueCodigo]);

  const onChangeAnosEscolares = valor => {
    setAnosEscolares(valor);
    setTurmasCodigo();
    setListaTurmas([]);
    setBuscou(false);
  };

  const obterTurmas = useCallback(async () => {
    const todasTurmas = { valor: OPCAO_TODOS, desc: 'Todas' };
    if (ehTodasModalidade || ehTodosAnosEscolares || ehTodasUe) {
      setListaTurmas([todasTurmas]);
      setTurmasCodigo([OPCAO_TODOS]);
      return;
    }
    setCarregandoTurmas(true);

    const retorno = await ServicoComunicados.obterTurmas(
      anoLetivo,
      ueCodigo,
      semestre,
      modalidades,
      anosEscolares
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoTurmas(false));

    if (retorno?.data?.length) {
      const lista = [];
      if (retorno.data.length > 1) {
        lista.push(todasTurmas);
      }
      retorno.data.map(item =>
        lista.push({
          desc: item.descricaoTurma,
          valor: item.valor,
        })
      );
      setListaTurmas(lista);
      if (lista.length === 1) {
        setTurmasCodigo([String(lista[0].valor)]);
      }
    }
  }, [
    anoLetivo,
    anosEscolares,
    semestre,
    ueCodigo,
    modalidades,
    ehTodasModalidade,
    ehTodosAnosEscolares,
    ehTodasUe,
  ]);

  useEffect(() => {
    if (ueCodigo && modalidades?.length && anosEscolares?.length) {
      obterTurmas();
    }
  }, [anosEscolares, ueCodigo, modalidades, obterTurmas]);

  const selecionaAlunosEspecificos = valorTurma => {
    const ehTodasTurma = valorTurma?.find(item => item === OPCAO_TODOS);
    const validacaoTurma = ehTodasTurma || valorTurma?.length > 1;
    const valorAlunoEspecifico = validacaoTurma ? OPCAO_TODOS : undefined;

    setAlunoEspecifico(valorAlunoEspecifico);
  };

  const onChangeTurma = valor => {
    setTurmasCodigo(valor);
    selecionaAlunosEspecificos(valor);
    setCarregouAlunos(false);
    setBuscou(false);
  };

  const selecionaTipoCalendario = descricao => {
    const tipo = listaTipoCalendario?.find(
      item => item.descricao === descricao
    );

    if (tipo?.id) {
      setValorTipoCalendario(tipo.descricao);
      setTipoCalendarioSelecionado(tipo.id);
    }
  };

  const obterTiposCalendario = useCallback(async () => {
    setCarregandoTipoCalendario(true);

    const retorno = await ServicoComunicados.obterTiposCalendario(
      anoLetivo,
      pesquisaTipoCalendario,
      modalidades
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoTipoCalendario(false));

    const dados = retorno?.data || [];

    setListaTipoCalendario(dados);
    const dadoTipoCalendario = dados?.length === 1 ? dados[0].id : undefined;
    const dadoValorCalendario =
      dados?.length === 1 ? dados[0].descricao : undefined;
    setTipoCalendarioSelecionado(dadoTipoCalendario);
    setValorTipoCalendario(dadoValorCalendario);
  }, [pesquisaTipoCalendario, anoLetivo, modalidades]);

  useEffect(() => {
    if (ueCodigo && modalidades?.length) {
      obterTiposCalendario();
    }
  }, [ueCodigo, modalidades, obterTiposCalendario]);

  const selecionaEvento = nome => {
    const evento = listaEvento?.find(item => item.nome === nome);

    if (evento?.id) {
      setSelecionouEvento(true);
      setValorEvento(nome);
      setEventoSelecionado(evento.id);
    }
  };

  const obterEventos = useCallback(async () => {
    setCarregandoEventos(true);
    const retorno = await ServicoComunicadoEvento.listarPor({
      tipoCalendario: tipoCalendarioSelecionado,
      anoLetivo,
      codigoDre: dreCodigo,
      codigoUe: ueCodigo,
      modalidades,
    })
      .catch(e => erros(e))
      .finally(() => setCarregandoEventos(false));

    const dados = retorno?.data?.length ? retorno?.data : [];

    console.log(dados);
    setListaEvento(dados);
    if (retorno?.data?.length === 1) {
      setValorEvento(retorno?.data?.nome);
      setEventoSelecionado(retorno?.data?.id);
    }
  }, [tipoCalendarioSelecionado, anoLetivo, dreCodigo, ueCodigo, modalidades]);

  useEffect(() => {
    if (tipoCalendarioSelecionado && ueCodigo && modalidades?.length) {
      obterEventos();
    }
  }, [tipoCalendarioSelecionado, ueCodigo, modalidades, obterEventos]);

  const onChangeDataEnvio = valor => {
    setDataEnvio(valor);
    setBuscou(false);
  };

  const onChangeDataExpiracao = valor => {
    setDataExpiracao(valor);
    setBuscou(false);
  };

  const desabilitarDatas = current => {
    if (current && anoLetivo) {
      const ano = moment(`${anoLetivo}-01-01`);
      return current < moment().startOf('day') || current > ano.endOf('year');
    }
    return false;
  };

  const verificarData = useCallback(() => {
    if (!dataEnvio || !dataExpiracao) return true;
    return (
      moment(dataEnvio, 'MM-DD-YYYY') <= moment(dataExpiracao, 'MM-DD-YYYY')
    );
  }, [dataEnvio, dataExpiracao]);

  useEffect(() => {
    const dataValida = verificarData();
    setEhDataValida(dataValida);
  }, [dataEnvio, dataExpiracao, verificarData]);

  const onChangeTitulo = e => {
    setTitulo(e?.target?.value);
    setBuscou(false);
  };

  const onChangeDescricaoComunicado = descricao => {
    setDescricaoComunicado(descricao);
    setBuscou(false);
    // handleModoEdicao();
  };

  const ObterAlunos = useCallback(async () => {
    setAlunosLoader(true);
    const retorno = await ServicoComunicados.obterAlunos(
      turmasCodigo,
      anoLetivo
    )
      .catch(e => erros(e))
      .finally(() => setAlunosLoader(false));
    const dados = retorno?.data?.length ? retorno.data : [];
    setAlunos(dados);
  }, [turmasCodigo, anoLetivo]);

  useEffect(() => {
    if (modalAlunosVisivel && !carregouAlunos) {
      ObterAlunos();
      setCarregouAlunos(true);
    }
    if (!modalAlunosVisivel && !carregouAlunos) {
      setCarregouAlunos(false);
    }
  }, [ObterAlunos, modalAlunosVisivel, carregouAlunos]);

  useEffect(() => {
    if (!buscou) {
      filtrar();
    }
  }, [filtrar, buscou, anoLetivo, dreCodigo, ueCodigo, modalidades, semestre]);

  return (
    <>
      <div className="row py-3">
        <div className="col-sm-12 col-md-2 pr-0">
          <Loader loading={carregandoAnosLetivos} ignorarTip>
            <SelectComponent
              label="Ano Letivo"
              lista={listaAnosLetivo}
              valueOption="valor"
              valueText="desc"
              disabled
              onChange={onChangeAnoLetivo}
              valueSelect={anoLetivo}
              placeholder="Ano letivo"
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-5 pr-0">
          <Loader loading={carregandoDres} ignorarTip>
            <SelectComponent
              label="Diretoria Regional de Educação (DRE)"
              lista={listaDres}
              valueOption="codigo"
              valueText="nome"
              disabled={!anoLetivo || listaDres?.length === 1}
              onChange={onChangeDre}
              valueSelect={dreCodigo}
              placeholder="Diretoria Regional De Educação (DRE)"
              showSearch
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-5">
          <Loader loading={carregandoUes} ignorarTip>
            <SelectComponent
              id="ue"
              label="Unidade Escolar (UE)"
              lista={listaUes}
              valueOption="codigo"
              valueText="nome"
              disabled={!dreCodigo || listaUes?.length === 1}
              onChange={onChangeUe}
              valueSelect={ueCodigo}
              placeholder="Unidade Escolar (UE)"
              showSearch
            />
          </Loader>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-12 col-md-4 pr-0">
          <Loader loading={carregandoModalidade} ignorarTip>
            <SelectComponent
              id="drop-modalidade"
              label="Modalidade"
              lista={listaModalidades}
              valueOption="valor"
              valueText="desc"
              disabled={
                !ueCodigo ||
                listaModalidades?.length === 1 ||
                !listaModalidades?.length
              }
              onChange={valores => {
                onchangeMultiSelect(valores, modalidades, onChangeModalidade);
              }}
              valueSelect={modalidades}
              placeholder="Modalidade"
              multiple
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-4 pr-0">
          <Loader loading={carregandoSemestres} ignorarTip>
            <SelectComponent
              id="drop-semestre"
              lista={listaSemestres}
              valueOption="valor"
              valueText="desc"
              label="Semestre"
              disabled={
                !modalidades ||
                listaSemestres?.length === 1 ||
                String(modalidades) !== String(ModalidadeDTO.EJA)
              }
              valueSelect={semestre}
              onChange={onChangeSemestre}
              placeholder="Semestre"
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-4">
          <Loader loading={carregandoTipoEscola} ignorarTip>
            <SelectComponent
              id="tipo-escola"
              lista={listaTipoEscola}
              valueOption="valor"
              valueText="desc"
              label="Tipo de escola"
              disabled={
                !modalidades ||
                !listaTipoEscola?.length ||
                listaTipoEscola?.length === 1
              }
              valueSelect={tipoEscola}
              onChange={valores => {
                onchangeMultiSelect(valores, tipoEscola, setTipoEscola);
                setBuscouFiltrosAvancados(false);
              }}
              placeholder="Selecione o tipo de escola"
              showSearch
              multiple
            />
          </Loader>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-12 col-md-2 pr-0">
          <Loader loading={carregandoAnosEscolares} ignorarTip>
            <SelectComponent
              id="select-ano-escolar"
              lista={listaAnosEscolares}
              valueOption="valor"
              valueText="desc"
              label="Ano"
              disabled={
                !modalidades?.length ||
                !listaAnosEscolares.length ||
                listaAnosEscolares?.length === 1 ||
                ehTodasModalidade
              }
              valueSelect={anosEscolares}
              onChange={valores => {
                onchangeMultiSelect(
                  valores,
                  anosEscolares,
                  onChangeAnosEscolares
                );
                setBuscouFiltrosAvancados(false);
              }}
              placeholder="Selecione o ano"
              multiple
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-4 pr-0">
          <Loader loading={carregandoTurmas} ignorarTip>
            <SelectComponent
              multiple
              id="turma"
              lista={listaTurmas}
              valueOption="valor"
              valueText="desc"
              label="Turma"
              disabled={
                !modalidades ||
                listaTurmas?.length === 1 ||
                !anosEscolares?.length ||
                ehTodasModalidade ||
                ehTodosAnosEscolares ||
                (temModalidadeEja && semestre)
              }
              valueSelect={turmasCodigo}
              onChange={valores => {
                onchangeMultiSelect(valores, turmasCodigo, onChangeTurma);
                setBuscouFiltrosAvancados(false);
              }}
              placeholder="Turma"
              showSearch
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-4 pr-0">
          <SelectComponent
            name="alunos"
            label="Crianças/Estudantes"
            placeholder="Selec. a(s) criança(s)/estudante(s)"
            valueSelect={alunoEspecifico}
            lista={opcoesAlunos}
            valueOption="id"
            valueText="nome"
            disabled={estudantesDesabilitados || modoEdicaoConsulta}
            allowClear={false}
            onChange={tipoAluno => {
              setAlunoEspecifico(tipoAluno);
            }}
          />
        </div>
        <div className="col-sm-12 col-md-2 mt-4">
          <Button
            id="botao-criancas-estudantes"
            label="Crianças/estudantes"
            color={Colors.Azul}
            onClick={() => setModalAlunosVisivel(true)}
            border
            className="mr-3"
            width="100%"
            disabled={!alunoEspecifico || alunoEspecifico === OPCAO_TODOS}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-3 pr-0">
          <Loader loading={carregandoTipoCalendario} ignorarTip>
            <SelectAutocomplete
              id="select-tipo-calendario"
              name="tipoCalendarioId"
              className="col-md-12"
              label="Tipo de calendário"
              placeholder="Selecione um calendário"
              valueField="id"
              textField="descricao"
              showList
              isHandleSearch
              lista={listaTipoCalendario}
              disabled={idComunicado || !modalidades?.length}
              onSelect={selecionaTipoCalendario}
              onChange={selecionaTipoCalendario}
              value={valorTipoCalendario}
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-3 pr-0">
          <Loader loading={carregandoEventos} ignorarTip>
            <SelectAutocomplete
              id="select-evento"
              name="eventoId"
              className="col-md-12"
              key="select-evento-key"
              label="Evento"
              placeholder="Selecione um evento"
              valueField="id"
              textField="nome"
              showList
              isHandleSearch
              disabled={
                idComunicado ||
                !tipoCalendarioSelecionado ||
                !listaEvento?.length
              }
              lista={listaEvento.filter(
                item => item.nome.toLowerCase().indexOf(valorEvento) > -1
              )}
              onSelect={selecionaEvento}
              onChange={selecionaEvento}
              value={valorEvento}
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-3 pr-0">
          <CampoData
            label="Data de envio"
            formatoData="DD/MM/YYYY"
            placeholder="Selecione a data"
            onChange={onChangeDataEnvio}
            desabilitarData={desabilitarDatas}
            valor={dataEnvio}
            valorPadrao={valorPadrao}
          />
        </div>
        <div className="col-sm-12 col-md-3">
          <CampoData
            label="Data de expiração"
            formatoData="DD/MM/YYYY"
            placeholder="Selecione a data"
            onChange={onChangeDataExpiracao}
            desabilitarData={desabilitarDatas}
            valor={dataExpiracao}
            valorPadrao={valorPadrao}
            temErro={!ehDataValida}
            mensagemErro="Data de expiração deve ser maior que a data de envio"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <Divider />
        </div>
      </div>
      {!!alunosSelecionados.length && (
        <div className="row mb-4">
          <div className="col-sm-12">
            <ListaDestinatarios
              alunosSelecionados={alunosSelecionados}
              dadosAlunos={alunos}
              removerAlunos={codigoAluno => {
                setAlunosSelecionado(
                  alunosSelecionados.filter(item => item !== codigoAluno)
                );
              }}
            />
          </div>
        </div>
      )}
      <div className="row mb-3">
        <div className="col-sm-12">
          <CampoTexto
            label="Título"
            name="titulo"
            placeholder="Pesquise pelo título do comunicado"
            value={titulo}
            onChange={onChangeTitulo}
            maxLength={50}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <JoditEditor
            label="Descrição"
            name="descricao"
            value={descricaoComunicado}
            onChange={valor => {
              onChangeDescricaoComunicado(valor);
            }}
            // desabilitar={somenteConsulta}
            permiteInserirArquivo={false}
          />
        </div>
        {auditoria && (
          <div className="col-sm-12 mt-1">
            <Auditoria
              ignorarMarginTop
              criadoEm={auditoria.criadoEm}
              criadoPor={auditoria.criadoPor}
              criadoRf={auditoria.criadoRF}
              alteradoPor={auditoria.alteradoPor}
              alteradoEm={auditoria.alteradoEm}
              alteradoRf={auditoria.alteradoRF}
            />
          </div>
        )}
        {exibirTotalReponsaveis && (
          <div className="col-sm-12">
            <MensagemRodape>
              Os responsáveis de 10364 crianças/estudantes poderão receber este
              comunicado.
            </MensagemRodape>
          </div>
        )}
      </div>

      {modalAlunosVisivel && (
        <ListaAlunos
          alunosLoader={alunosLoader}
          alunosSelecionados={alunosSelecionados}
          dadosAlunos={alunos}
          linhasSelecionadas={linhasSelecionadas}
          modalAlunosVisivel={modalAlunosVisivel}
          onConfirm={alunosSel => {
            setAlunosSelecionado([...alunosSelecionados, ...alunosSel]);
          }}
          setLinhasSelecionadas={setLinhasSelecionadas}
          setModalAlunosVisivel={setModalAlunosVisivel}
          // modoEdicaoConsulta={modoEdicaoConsulta}
        />
      )}
    </>
  );
};

Filtros.propTypes = {
  onChangeFiltros: PropTypes.func,
};

Filtros.defaultProps = {
  onChangeFiltros: () => {},
};

export default Filtros;
