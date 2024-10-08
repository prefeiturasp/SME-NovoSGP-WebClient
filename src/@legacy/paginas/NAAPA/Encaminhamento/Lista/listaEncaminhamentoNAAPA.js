import { SGP_RADIO_EXIBIR_ENCAMINHAMENTOS_NAAPA_ENCERRADOS } from '@/@legacy/constantes/ids/radio';
import situacaoNAAPA from '@/@legacy/dtos/situacaoNAAPA';
import {
  OrdenacaoListEncaminhamentoNAAPAEnum,
  OrdenacaoListEncaminhamentoNAAPAEnumDisplay,
} from '@/core/enum/ordenacao-list-encaminhamento-naapa-enum';
import { ROUTES } from '@/core/enum/routes';
import { Col, Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  CampoData,
  CampoTexto,
  Card,
  CheckboxComponent,
  Loader,
  RadioGroupButton,
  SelectComponent,
} from '~/componentes';
import { Cabecalho, FiltroHelper } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_CHECKBOX_EXIBIR_HISTORICO } from '~/constantes/ids/checkbox';
import {
  SGP_DATE_ABERTURA_QUEIXA_FIM,
  SGP_DATE_ABERTURA_QUEIXA_INICIO,
} from '~/constantes/ids/date';
import { SGP_INPUT_NOME_CRIANCA_ESTUDANTE } from '~/constantes/ids/input';
import {
  SGP_SELECT_ANO_LETIVO,
  SGP_SELECT_DRE,
  SGP_SELECT_PRIORIDADE,
  SGP_SELECT_SITUACAO_ENCAMINHAMENTO,
  SGP_SELECT_TURMA,
  SGP_SELECT_UE,
} from '~/constantes/ids/select';
import { AbrangenciaServico, erros, verificaSomenteConsulta } from '~/servicos';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import { ordenarDescPor, verificarDataFimMaiorInicio } from '~/utils';
import { BotaoOrdenacaoListaEncaminhamentoNAAPA } from './components/ordenacao';
import ListaEncaminhamentoNAAPABotoesAcao from './listaEncaminhamentoNAAPABotoesAcao';
import ListaEncaminhamentoNAAPAPaginada from './listaEncaminhamentoNAAPAPaginada';

const ListaEncaminhamentoNAAPA = () => {
  const location = useLocation();

  const usuario = useSelector(state => state.usuario);
  const { permissoes } = usuario;
  const { podeIncluir } = permissoes?.[ROUTES.ENCAMINHAMENTO_NAAPA];

  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [anoLetivo, setAnoLetivo] = useState();
  const [dre, setDre] = useState();
  const [ue, setUe] = useState();
  const [turmaId, setTurmaId] = useState();
  const [codigoNomeAluno, setCodigoNomeAluno] = useState('');
  const [dataAberturaQueixaInicio, setDataAberturaQueixaInicio] = useState();
  const [dataAberturaQueixaFim, setDataAberturaQueixaFim] = useState();
  const [situacao, setSituacao] = useState();
  const [prioridade, setPrioridade] = useState();
  const [exibirEncaminhamentosEncerrados, setExibirEncaminhamentosEncerrados] =
    useState(false);

  const [codigoNomeAlunoExibicao, setCodigoNomeAlunoExibicao] = useState('');
  const [timeoutDebounce, setTimeoutDebounce] = useState();

  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaSituacoes, setListaSituacoes] = useState([]);
  const [listaPrioridades, setListaPrioridades] = useState([]);

  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);

  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [
    idsEncaminhamentoNAAPASelecionados,
    setIdsEncaminhamentoNAAPASelecionados,
  ] = useState([]);

  const [ordenacoesSelecionadas, setOrdenacoesSelecionadas] = useState([
    {
      value: OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixaDesc,
      label:
        OrdenacaoListEncaminhamentoNAAPAEnumDisplay[
          OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixaDesc
        ],
    },
  ]);

  const dadosRouteState = location.state;

  const opcoesEncerrados = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false },
  ];

  useEffect(() => {
    if (dadosRouteState?.anoLetivo) {
      setConsideraHistorico(!!dadosRouteState.consideraHistorico);
      setAnoLetivo(dadosRouteState.anoLetivo);
    }

    if (dadosRouteState?.dre?.codigo) setDre(dadosRouteState.dre);

    if (dadosRouteState?.ue?.codigo) setUe(dadosRouteState.ue);

    if (dadosRouteState?.turmaId) setTurmaId(dadosRouteState.turmaId);

    if (dadosRouteState?.codigoNomeAluno) {
      setCodigoNomeAlunoExibicao(dadosRouteState.codigoNomeAluno);
      setCodigoNomeAluno(dadosRouteState.codigoNomeAluno);
    }

    if (dadosRouteState?.dataAberturaQueixaInicio)
      setDataAberturaQueixaInicio(
        window.moment(dadosRouteState.dataAberturaQueixaInicio)
      );

    if (dadosRouteState?.dataAberturaQueixaFim)
      setDataAberturaQueixaFim(
        window.moment(dadosRouteState.dataAberturaQueixaFim)
      );

    if (dadosRouteState?.situacao) setSituacao(dadosRouteState.situacao);

    if (dadosRouteState?.prioridade) setPrioridade(dadosRouteState.prioridade);

    if (dadosRouteState?.exibirEncaminhamentosEncerrados)
      setExibirEncaminhamentosEncerrados(
        dadosRouteState.exibirEncaminhamentosEncerrados
      );

    if (dadosRouteState?.ordenacoesSelecionadas?.length)
      setOrdenacoesSelecionadas(dadosRouteState.ordenacoesSelecionadas);
  }, [dadosRouteState]);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(
      permissoes?.[ROUTES.ENCAMINHAMENTO_NAAPA]
    );
    setSomenteConsulta(soConsulta);
  }, [permissoes]);

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);
    const anosLetivo = await FiltroHelper.obterAnosLetivos({
      consideraHistorico,
    })
      .catch(e => erros(e))
      .finally(() => setCarregandoAnosLetivos(false));

    if (anosLetivo?.length) {
      const anosOrdenados = ordenarDescPor(anosLetivo, 'valor');
      setListaAnosLetivo(anosOrdenados);
      setAnoLetivo(anosLetivo[0].valor);
      return;
    }
    setListaAnosLetivo([]);
    setAnoLetivo();
  }, [consideraHistorico]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const obterDres = useCallback(async () => {
    setCarregandoDres(true);
    const resposta = await AbrangenciaServico.buscarDres(
      `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoDres(false));

    if (resposta?.data?.length) {
      const lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));

      if (lista?.length === 1) {
        setDre(lista[0]);
      }

      setListaDres(lista);
    } else {
      setDre();
      setListaDres([]);
    }
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    }
  }, [anoLetivo, obterDres]);

  const obterUes = useCallback(async () => {
    setCarregandoUes(true);
    const resposta = await AbrangenciaServico.buscarUes(
      dre?.codigo,
      `v1/abrangencias/${consideraHistorico}/dres/${
        dre?.codigo
      }/ues?anoLetivo=${anoLetivo}&consideraNovasUEs=${true}`,
      true
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoUes(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      if (lista?.length === 1) {
        setUe(lista[0]);
      } else if (lista?.length > 1) {
        const ueTodos = { nome: 'Todas', codigo: OPCAO_TODOS, id: OPCAO_TODOS };
        lista.unshift(ueTodos);

        if (
          !dadosRouteState?.ue?.codigo ||
          dadosRouteState?.ue?.codigo === OPCAO_TODOS
        ) {
          setUe(ueTodos);
        }
      }

      setListaUes(lista);
    } else {
      setUe();
      setListaUes([]);
    }
  }, [dre, anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (dre?.codigo) {
      obterUes();
    }
  }, [dre, obterUes]);

  const obterTurmas = useCallback(async () => {
    if (ue?.codigo === OPCAO_TODOS) {
      const turmaTodas = { id: OPCAO_TODOS, nomeFiltro: 'Todas' };
      setTurmaId(OPCAO_TODOS);
      setListaTurmas([turmaTodas]);
      return;
    }

    setCarregandoTurmas(true);
    const retorno = await AbrangenciaServico.buscarTurmas(
      ue?.codigo,
      0,
      '',
      anoLetivo,
      consideraHistorico,
      false,
      [1]
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoTurmas(false));

    if (retorno?.data?.length) {
      const lista = retorno?.data;
      setListaTurmas(lista);
    } else {
      setListaTurmas([]);
    }
  }, [anoLetivo, consideraHistorico, ue]);

  useEffect(() => {
    if (ue?.codigo) {
      obterTurmas();
    }
  }, [ue, obterTurmas]);

  const atualizarSituacoes = situacoes => {
    const novasListaSituacoes = situacoes.filter(
      situacao => situacao?.id !== situacaoNAAPA.Encerrado
    );

    return novasListaSituacoes;
  };

  useEffect(() => {
    ServicoNAAPA.buscarSituacoes().then(resposta => {
      if (resposta?.data?.length) {
        const lista = atualizarSituacoes(resposta.data);
        setListaSituacoes(lista);
      } else {
        setListaSituacoes([]);
      }
    });
    ServicoNAAPA.buscarPrioridades().then(resposta => {
      if (resposta?.data?.length) {
        setListaPrioridades(resposta.data);
      } else {
        setListaPrioridades([]);
      }
    });
  }, []);

  const limparCamposSemConsulta = () => {
    setCodigoNomeAluno('');
    setCodigoNomeAlunoExibicao('');
    setDataAberturaQueixaInicio('');
    setDataAberturaQueixaFim('');
    setSituacao();
    setPrioridade('');
  };

  const onCheckedConsideraHistorico = e => {
    setListaAnosLetivo([]);
    setAnoLetivo();

    setListaDres([]);
    setDre();

    setListaUes([]);
    setUe();

    setListaTurmas([]);
    setTurmaId();

    limparCamposSemConsulta();
    setConsideraHistorico(e.target.checked);
  };

  const onChangeAnoLetivo = ano => {
    setListaDres([]);
    setDre();

    setListaUes([]);
    setUe();

    setListaTurmas([]);
    setTurmaId();

    limparCamposSemConsulta();
    setAnoLetivo(ano);
  };

  const onChangeDre = dreCodigo => {
    setListaUes([]);
    setUe();

    setListaTurmas([]);
    setTurmaId();

    limparCamposSemConsulta();

    const dreAtual = listaDres?.find(d => d?.codigo === dreCodigo);
    setDre(dreAtual);
  };

  const onChangeUe = ueCodigo => {
    setListaTurmas([]);
    setTurmaId();

    limparCamposSemConsulta();

    const ueAual = listaUes?.find(d => d?.codigo === ueCodigo);
    setUe(ueAual);
  };

  const onChangeTurma = valor => {
    limparCamposSemConsulta();

    setTurmaId(valor);
  };

  const validarDebounce = useCallback(
    (texto, onChange) => {
      if (timeoutDebounce) {
        clearTimeout(timeoutDebounce);
      }
      const timeout = setTimeout(() => {
        onChange(texto);
      }, 700);

      setTimeoutDebounce(timeout);
    },
    [timeoutDebounce]
  );

  const onChangeDebounce = (text, setValue) => {
    if (text?.length >= 3 || !text) {
      validarDebounce(text, setValue);
    }
  };

  const onChangeCodigoNomeAluno = e => {
    setCodigoNomeAlunoExibicao(e?.target?.value);
    onChangeDebounce(e?.target?.value, setCodigoNomeAluno);
  };

  const dataFimMaiorInicio = verificarDataFimMaiorInicio(
    dataAberturaQueixaInicio,
    dataAberturaQueixaFim
  );
  const onSelecionarItems = items =>
    setIdsEncaminhamentoNAAPASelecionados(items?.map(item => item?.id));

  const obterDadosFiltros = () => {
    return {
      consideraHistorico,
      anoLetivo,
      dre,
      ue,
      turmaId,
      codigoNomeAluno,
      codigoNomeAlunoExibicao,
      situacao,
      prioridade,
      exibirEncaminhamentosEncerrados,
      dataAberturaQueixaInicio: dataAberturaQueixaInicio
        ? dataAberturaQueixaInicio?.toJSON()
        : undefined,
      dataAberturaQueixaFim: dataAberturaQueixaFim
        ? dataAberturaQueixaFim?.toJSON()
        : undefined,
      ordenacoesSelecionadas,
    };
  };

  return (
    <>
      <Cabecalho pagina="Encaminhamento NAAPA">
        <ListaEncaminhamentoNAAPABotoesAcao
          podeIncluir={podeIncluir}
          somenteConsulta={somenteConsulta}
          idsSelecionados={idsEncaminhamentoNAAPASelecionados}
          obterDadosFiltros={obterDadosFiltros}
        />
      </Cabecalho>

      <Card padding="24px 24px">
        <Row gutter={[16, 16]} style={{ maxWidth: '100%', margin: 0 }}>
          <Col span={24}>
            <CheckboxComponent
              id={SGP_CHECKBOX_EXIBIR_HISTORICO}
              label="Exibir histórico?"
              onChangeCheckbox={onCheckedConsideraHistorico}
              checked={consideraHistorico}
            />
          </Col>

          <Col sm={24} md={8} lg={4}>
            <Loader loading={carregandoAnosLetivos} ignorarTip>
              <SelectComponent
                valueText="desc"
                label="Ano letivo"
                valueOption="valor"
                placeholder="Ano letivo"
                lista={listaAnosLetivo}
                valueSelect={anoLetivo}
                id={SGP_SELECT_ANO_LETIVO}
                onChange={onChangeAnoLetivo}
                disabled={listaAnosLetivo?.length === 1}
              />
            </Loader>
          </Col>

          <Col sm={24} md={24} lg={10}>
            <Loader loading={carregandoDres} ignorarTip>
              <SelectComponent
                showSearch
                label="Diretoria Regional de Educação (DRE)"
                valueText="nome"
                id={SGP_SELECT_DRE}
                valueOption="codigo"
                onChange={onChangeDre}
                lista={listaDres || []}
                placeholder="Selecione uma DRE"
                disabled={listaDres?.length === 1}
                valueSelect={dre?.codigo || undefined}
              />
            </Loader>
          </Col>

          <Col sm={24} md={24} lg={10}>
            <Loader loading={carregandoUes} ignorarTip>
              <SelectComponent
                showSearch
                valueText="nome"
                id={SGP_SELECT_UE}
                valueOption="codigo"
                onChange={onChangeUe}
                lista={listaUes || []}
                label="Unidade Escolar (UE)"
                placeholder="Selecione uma UE"
                valueSelect={ue?.codigo || undefined}
                disabled={!dre?.codigo || listaUes?.length === 1}
              />
            </Loader>
          </Col>

          <Col sm={24} md={12}>
            <Loader loading={carregandoTurmas} ignorarTip>
              <SelectComponent
                showSearch
                label="Turma"
                placeholder="Turma"
                lista={listaTurmas}
                id={SGP_SELECT_TURMA}
                valueSelect={turmaId}
                valueOption="id"
                valueText="nomeFiltro"
                onChange={onChangeTurma}
                disabled={!ue?.codigo || ue?.codigo === OPCAO_TODOS}
              />
            </Loader>
          </Col>

          <Col sm={24} md={12}>
            <CampoTexto
              allowClear
              iconeBusca
              desabilitado={!ue?.codigo}
              value={codigoNomeAlunoExibicao}
              label="Criança/Estudante"
              onChange={onChangeCodigoNomeAluno}
              id={SGP_INPUT_NOME_CRIANCA_ESTUDANTE}
              placeholder="Procure pelo código ou nome da Criança/Estudante"
            />
          </Col>

          <Col sm={24} md={12} lg={12} xl={6}>
            <CampoData
              desabilitado={!ue?.codigo}
              formatoData="DD/MM/YYYY"
              placeholder="Data inicial"
              valor={dataAberturaQueixaInicio}
              label="Data de abertura da queixa"
              id={SGP_DATE_ABERTURA_QUEIXA_INICIO}
              onChange={setDataAberturaQueixaInicio}
            />
          </Col>

          <Col sm={24} md={12} lg={12} xl={6} style={{ marginTop: '25px' }}>
            <CampoData
              temErro={!dataFimMaiorInicio}
              formatoData="DD/MM/YYYY"
              placeholder="Data final"
              desabilitado={!ue?.codigo}
              valor={dataAberturaQueixaFim}
              id={SGP_DATE_ABERTURA_QUEIXA_FIM}
              onChange={setDataAberturaQueixaFim}
              mensagemErro="Data fim deve ser maior que a data início"
            />
          </Col>

          <Col sm={24} lg={24} xl={12}>
            <SelectComponent
              allowClear
              valueOption="id"
              valueText="descricao"
              lista={listaSituacoes}
              disabled={!ue?.codigo}
              onChange={setSituacao}
              valueSelect={situacao}
              label="Situação do encaminhamento"
              id={SGP_SELECT_SITUACAO_ENCAMINHAMENTO}
              placeholder="Situação do encaminhamento"
            />
          </Col>

          <Col sm={24} lg={12}>
            <SelectComponent
              allowClear
              valueOption="id"
              label="Prioridade"
              valueText="nome"
              disabled={!ue?.codigo}
              placeholder="Prioridade"
              lista={listaPrioridades}
              onChange={setPrioridade}
              valueSelect={prioridade}
              id={SGP_SELECT_PRIORIDADE}
            />
          </Col>

          <Col sm={24} lg={12}>
            <RadioGroupButton
              desabilitado={!ue?.codigo}
              value={exibirEncaminhamentosEncerrados}
              label="Apresentar encaminhamentos encerrados"
              opcoes={opcoesEncerrados}
              id={SGP_RADIO_EXIBIR_ENCAMINHAMENTOS_NAAPA_ENCERRADOS}
              onChange={e =>
                setExibirEncaminhamentosEncerrados(e?.target?.value)
              }
            />
          </Col>

          <Col xs={24} sm={12}>
            <BotaoOrdenacaoListaEncaminhamentoNAAPA
              disabled={!ue?.codigo}
              setOrdenacoesSelecionadas={setOrdenacoesSelecionadas}
              ordenacoesSelecionadas={ordenacoesSelecionadas}
              opcoesParaRemover={
                ue?.codigo !== OPCAO_TODOS
                  ? [OrdenacaoListEncaminhamentoNAAPAEnum.UE]
                  : []
              }
            />
          </Col>

          <Col sm={24}>
            <ListaEncaminhamentoNAAPAPaginada
              ue={ue}
              dre={dre}
              turmaId={turmaId}
              situacao={situacao}
              anoLetivo={anoLetivo}
              codigoNomeAluno={codigoNomeAluno}
              prioridade={prioridade}
              consideraHistorico={consideraHistorico}
              dataAberturaQueixaFim={dataAberturaQueixaFim}
              dataAberturaQueixaInicio={dataAberturaQueixaInicio}
              onSelecionarItems={onSelecionarItems}
              exibirEncaminhamentosEncerrados={exibirEncaminhamentosEncerrados}
              obterDadosFiltros={obterDadosFiltros}
              ordenacoesSelecionadas={ordenacoesSelecionadas}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ListaEncaminhamentoNAAPA;
