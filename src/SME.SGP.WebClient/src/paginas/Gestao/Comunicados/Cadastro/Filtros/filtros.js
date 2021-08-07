import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import { Divider } from 'antd';
import {
  Button,
  CampoData,
  CampoTexto,
  CheckboxComponent,
  Colors,
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
} from '~/servicos';

import { OPCAO_TODOS } from '~/constantes';
import { onchangeMultiSelect } from '~/utils';

const Filtros = ({ onChangeFiltros }) => {
  const [alunoEspecifico, setAlunoEspecifico] = useState();
  const [anoAtual] = useState(window.moment().format('YYYY'));
  const [anoLetivo, setAnoLetivo] = useState();
  const [anosEscolares, setAnosEscolares] = useState();
  const [anosEscolaresId, setAnosEscolaresId] = useState();
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
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [dataEnvioFim, setDataEnvioFim] = useState();
  const [dataEnvioInicio, setDataEnvioInicio] = useState();
  const [dataExpiracaoFim, setDataExpiracaoFim] = useState();
  const [dataExpiracaoInicio, setDataExpiracaoInicio] = useState();
  const [dreCodigo, setDreCodigo] = useState();
  const [dreId, setDreId] = useState();
  const [ehDataValida, setEhDataValida] = useState(true);
  const [
    habilitaConsideraHistorico,
    setHabilitaConsideraHistorico,
  ] = useState();
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
  const [listaCalendario, setListaCalendario] = useState([]);
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

  const temModalidadeEja = modalidades?.find(
    item => String(item) === String(ModalidadeDTO.EJA)
  );
  const temSemestre = temModalidadeEja ? semestre : true;
  const ehTodasModalidade = modalidades?.find(item => item === OPCAO_TODOS);
  const ehTodosAnosEscolares = anosEscolares?.find(
    item => item === OPCAO_TODOS
  );

  const opcoesAlunos = [
    { id: '1', nome: 'Todos' },
    { id: '2', nome: 'Alunos Especificados' },
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

    if (limpar) {
      setDreCodigo();
      setDreId();
      setUeId();
      setUeCodigo();
    }
  };

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
    setAnoLetivo(anoAtual);
    limparCampos(true);
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
    setHabilitaConsideraHistorico(retorno?.data?.temHistorico);
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
        `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoDres(false));

      if (resposta?.data?.length) {
        const lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));

        if (lista?.length === 1) {
          setDreCodigo(lista[0].valor);
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
  }, [anoLetivo, consideraHistorico]);

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
        `v1/abrangencias/${consideraHistorico}/dres/${dreCodigo}/ues?anoLetivo=${anoLetivo}&consideraNovasUEs=${true}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoUes(false));

      if (resposta?.data) {
        const lista = resposta.data;
        if (lista?.length === 1) {
          setUeId(lista[0].id);
          setUeCodigo(lista[0].valor);
        } else {
          lista.unshift(ueTodos);
        }

        setListaUes(lista);
        return;
      }
      setListaUes([]);
    }
  }, [anoLetivo, dreCodigo, consideraHistorico]);

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
        consideraHistorico,
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
    [consideraHistorico]
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
      dreId,
      dreCodigo,
      ueId,
      ueCodigo,
      modalidades,
      semestre: semestre || 0,
    };

    onChangeFiltros(params);
    setBuscou(true);
  }, [
    anoLetivo,
    dreId,
    dreCodigo,
    ueId,
    ueCodigo,
    modalidades,
    semestre,
    onChangeFiltros,
  ]);

  const ObterTiposEscola = useCallback(async () => {
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
      dados.unshift({
        valor: OPCAO_TODOS,
        desc: 'Todos',
      });
    }
    setListaTipoEscola(dados);
    if (dados?.length === 1) {
      setTipoEscola([String(dados[0].valor)]);
    }
  }, [dreCodigo, ueCodigo]);

  useEffect(() => {
    if (
      dreCodigo &&
      ueCodigo &&
      modalidades?.length &&
      !listaTipoEscola?.length &&
      !carregandoTipoEscola
    ) {
      ObterTiposEscola();
    }
  }, [
    ObterTiposEscola,
    dreCodigo,
    ueCodigo,
    modalidades,
    listaTipoEscola,
    carregandoTipoEscola,
  ]);

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
    if (
      modalidades?.length &&
      ueCodigo &&
      !listaAnosEscolares?.length &&
      !carregandoAnosEscolares
    ) {
      ObterAnosEscolares();
    }
  }, [
    ObterAnosEscolares,
    modalidades,
    ueCodigo,
    listaAnosEscolares,
    carregandoAnosEscolares,
  ]);

  const onChangeAnosEscolares = valor => {
    setAnosEscolares(valor);
    setTurmasCodigo();
    setListaTurmas([]);
    setBuscouFiltrosAvancados(false);
  };

  const obterTurmas = useCallback(async () => {
    const todasTurmas = { valor: OPCAO_TODOS, desc: 'Todas' };

    if (ehTodasModalidade) {
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
  ]);

  useEffect(() => {
    if (
      ueCodigo &&
      modalidades?.length &&
      anosEscolares?.length &&
      !listaTurmas?.length &&
      !carregandoTurmas
    ) {
      obterTurmas();
    }
  }, [
    anosEscolares,
    ueCodigo,
    modalidades,
    listaTurmas,
    carregandoTurmas,
    obterTurmas,
  ]);

  const selecionaTipoCalendario = (descricao, form, tipoCalend, onChange) => {
    let tipo = '';

    if (tipoCalend) {
      tipo = tipoCalend;
    } else {
      tipo = listaCalendario?.find(t => {
        return t.descricao === descricao;
      });
    }

    if (tipo?.id) {
      setValorTipoCalendario(tipo.descricao);
      setTipoCalendarioSelecionado(tipo.id);
      if (form && form.setFieldValue) {
        form.setFieldValue('tipoCalendarioId', tipo.descricao);
      }
    } else {
      setValorTipoCalendario('');
      setTipoCalendarioSelecionado();
      if (form && form.setFieldValue) {
        form.setFieldValue('tipoCalendarioId', '');
      }
    }

    if (onChange) {
      // selecionaEvento('', form);
    }
  };

  const selecionaEvento = (nome, form, onChange, tipoEvento) => {
    let evento = '';

    if (tipoEvento) {
      evento = tipoEvento;
    } else {
      evento = listaEvento?.find(t => {
        return t.nome === nome;
      });
    }

    if (evento?.id) {
      setSelecionouEvento(true);
      setValorEvento(evento.nome);
      setEventoSelecionado(evento);
      if (form && form.setFieldValue) {
        form.setFieldValue('eventoId', evento.nome);
      }
    } else if (!onChange) {
      setSelecionouEvento(false);
      setValorEvento('');
      setEventoSelecionado('');
      if (form && form.setFieldValue) {
        form.setFieldValue('eventoId', '');
      }
    }

    if (onChange && !evento) {
      setValorEvento(nome);
    }
  };

  const onChangeDataEnvio = valor => {
    setDataEnvio(valor);
  };

  const onChangeDataExpiracao = valor => {
    setDataExpiracao(valor);
  };

  const desabilitarDatas = current => {
    if (current && anoLetivo) {
      const ano = moment(`${anoLetivo}-01-01`);
      return current < ano.startOf('year') || current > ano.endOf('year');
    }
    return false;
  };

  const verificarData = useCallback(() => {
    if (!dataEnvio || !dataExpiracao) return true;
    return (
      moment(dataEnvio, 'MM-DD-YYYY') < moment(dataExpiracao, 'MM-DD-YYYY')
    );
  }, [dataEnvio, dataExpiracao]);

  useEffect(() => {
    const dataValida = verificarData();
    setEhDataValida(dataValida);
  }, [dataEnvio, dataExpiracao, verificarData]);

  const onChangeTitulo = e => {
    setTitulo(e?.target?.value);
  };

  useEffect(() => {
    if (!buscou) {
      filtrar();
    }
  }, [filtrar, buscou, anoLetivo, dreCodigo, ueCodigo, modalidades, semestre]);

  return (
    <>
      <div className="row mb-2">
        <div className="col-12">
          <CheckboxComponent
            label="Exibir histórico?"
            onChangeCheckbox={onChangeConsideraHistorico}
            checked={consideraHistorico}
            disabled={!habilitaConsideraHistorico}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-12 col-md-2 pr-0">
          <Loader loading={carregandoAnosLetivos} ignorarTip>
            <SelectComponent
              label="Ano Letivo"
              lista={listaAnosLetivo}
              valueOption="valor"
              valueText="desc"
              disabled={!consideraHistorico || listaAnosLetivo?.length === 1}
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
                onchangeMultiSelect(valores, turmasCodigo, setTurmasCodigo);
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
            onClick={() => {}}
            border
            className="mr-3"
            width="100%"
            disabled={!alunoEspecifico || alunoEspecifico !== '2'}
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
              lista={listaCalendario}
              disabled={idComunicado || bloquearCamposCalendarioEventos}
              onSelect={valor => selecionaTipoCalendario(valor, '', '', true)}
              onChange={valor => selecionaTipoCalendario(valor, '', '', true)}
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
              disabled={idComunicado || bloquearCamposCalendarioEventos}
              lista={listaEvento.filter(
                item => item.nome.toLowerCase().indexOf(valorEvento) > -1
              )}
              onSelect={valor => selecionaEvento(valor, '')}
              onChange={valor => selecionaEvento(valor, '', true)}
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
      <div className="row">
        <div className="col-sm-12">
          <CampoTexto
            label="Título"
            name="titulo"
            placeholder="Pesquise pelo título do comunicado"
            value={titulo}
            onChange={onChangeTitulo}
          />
        </div>
      </div>
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
