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
import TabelaEncaminhamentoNAAPAPaginacao from './tabelaEncaminhamentoNAAPAPaginacao';
import mockTabelaEncaminhamentos from './mockTabelaEncaminhamentos';

const TabelaEncaminhamentoNAAPA = () => {
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

  const [tipo, setTipo] = useState();
  const [suspeitaViolencia, setSuspeitaViolencia] = useState();

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
  const [listaTipos, setListaTipos] = useState([
    { label: 'Todos', value: '' },
    { label: 'Individual', value: 'Individual' },
    { label: 'Institucional', value: 'Institucional' },
  ]);
  const [listaSuspeitaViolencia, setListaSuspeitaViolencia] = useState([
    { label: 'Todos', value: '' },
    { label: 'Sim', value: 'Sim' },
    { label: 'Não', value: 'Não' },
  ]);

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
    if (!dadosRouteState) {
      const item = mockTabelaEncaminhamentos[0];
      setAnoLetivo('2025');
      setDre({ id: '01', codigo: '01', nome: 'DRE Exemplo' });
      setUe({ id: '001', codigo: '001', nome: item.ue });
      setTurmaId(item.turma);
      setCodigoNomeAluno(item.nomeAluno);
      if (
        item.dataAberturaQueixaInicio &&
        item.dataAberturaQueixaInicio !== '-'
      ) {
        setDataAberturaQueixaInicio(
          window.moment(item.dataAberturaQueixaInicio)
        );
      }
      if (item.dataUltimoAtendimento && item.dataUltimoAtendimento !== '-') {
        setDataAberturaQueixaFim(window.moment(item.dataUltimoAtendimento));
      }
      setSituacao(item.situacao);
      setPrioridade('Alta');
      setTipo(item.tipo);
      setSuspeitaViolencia(item.suspeitaViolencia);
      setExibirEncaminhamentosEncerrados(false);
    }
  }, [dadosRouteState]);

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
    if (dadosRouteState?.dataAberturaQueixaInicio) {
      setDataAberturaQueixaInicio(
        window.moment(dadosRouteState.dataAberturaQueixaInicio)
      );
    }
    if (dadosRouteState?.dataAberturaQueixaFim) {
      setDataAberturaQueixaFim(
        window.moment(dadosRouteState.dataAberturaQueixaFim)
      );
    }
    if (dadosRouteState?.situacao) setSituacao(dadosRouteState.situacao);
    if (dadosRouteState?.prioridade) setPrioridade(dadosRouteState.prioridade);
    if (dadosRouteState?.tipo) setTipo(dadosRouteState.tipo);
    if (dadosRouteState?.suspeitaViolencia)
      setSuspeitaViolencia(dadosRouteState.suspeitaViolencia);
    if (dadosRouteState?.exibirEncaminhamentosEncerrados) {
      setExibirEncaminhamentosEncerrados(
        dadosRouteState.exibirEncaminhamentosEncerrados
      );
    }
    if (dadosRouteState?.ordenacoesSelecionadas?.length) {
      setOrdenacoesSelecionadas(dadosRouteState.ordenacoesSelecionadas);
    }
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
      if (!anoLetivo) {
        setAnoLetivo(anosLetivo[0].valor);
      }
      return;
    }
    setListaAnosLetivo([]);
    setAnoLetivo();
  }, [consideraHistorico, anoLetivo]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const obterDres = useCallback(async () => {
    if (!anoLetivo) return;

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
      return;
    }
    setListaDres([]);
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    obterDres();
  }, [obterDres]);

  const obterUes = useCallback(async () => {
    if (!dre?.codigo) return;

    setCarregandoUes(true);
    const resposta = await AbrangenciaServico.buscarUes(
      dre.codigo,
      `v1/abrangencias/${consideraHistorico}/dres/${dre.codigo}/ues?anoLetivo=${anoLetivo}`
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoUes(false));

    if (resposta?.data) {
      const lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));
      setListaUes(lista);
      return;
    }
    setListaUes([]);
  }, [dre, anoLetivo, consideraHistorico]);

  useEffect(() => {
    obterUes();
  }, [obterUes]);

  const obterTurmas = useCallback(async () => {
    if (!ue?.codigo) return;

    setCarregandoTurmas(true);
    const resposta = await AbrangenciaServico.buscarTurmas(
      ue.codigo,
      anoLetivo,
      consideraHistorico
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoTurmas(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;
      setListaTurmas(lista);
      return;
    }
    setListaTurmas([]);
  }, [ue, anoLetivo, consideraHistorico]);

  useEffect(() => {
    obterTurmas();
  }, [obterTurmas]);

  const obterSituacoes = useCallback(async () => {
    const lista = situacaoNAAPA.map(item => ({
      desc: item.desc,
      valor: item.valor,
    }));
    setListaSituacoes(lista);
  }, []);

  useEffect(() => {
    obterSituacoes();
  }, [obterSituacoes]);

  const obterPrioridades = useCallback(async () => {
    const resposta = await ServicoNAAPA.obterPrioridades().catch(e => erros(e));

    if (resposta?.data?.length) {
      setListaPrioridades(resposta.data);
      return;
    }
    setListaPrioridades([]);
  }, []);

  useEffect(() => {
    obterPrioridades();
  }, [obterPrioridades]);

  const onSelecionarItems = items => {
    setIdsEncaminhamentoNAAPASelecionados(items);
  };

  const obterDadosFiltros = () => {
    return {
      consideraHistorico,
      anoLetivo,
      dre,
      ue,
      turmaId,
      codigoNomeAluno,
      dataAberturaQueixaInicio,
      dataAberturaQueixaFim,
      situacao,
      prioridade,
      tipo,
      suspeitaViolencia,
      exibirEncaminhamentosEncerrados,
      ordenacoesSelecionadas,
    };
  };

  const onChangeCodigoNomeAluno = valor => {
    setCodigoNomeAlunoExibicao(valor);

    if (timeoutDebounce) {
      clearTimeout(timeoutDebounce);
    }

    const timeout = setTimeout(() => {
      setCodigoNomeAluno(valor);
    }, 500);

    setTimeoutDebounce(timeout);
  };

  const onClickVoltar = () => {
    navigate(ROUTES.PRINCIPAL);
  };

  const onClickExcluir = () => {};

  const onClickNovo = () => {
    navigate(ROUTES.ENCAMINHAMENTO_NAAPA_NOVO);
  };

  const limparFiltros = () => {
    setConsideraHistorico(false);
    setAnoLetivo();
    setDre();
    setUe();
    setTurmaId();
    setCodigoNomeAluno('');
    setCodigoNomeAlunoExibicao('');
    setDataAberturaQueixaInicio();
    setDataAberturaQueixaFim();
    setSituacao();
    setPrioridade();
    setTipo();
    setSuspeitaViolencia();
    setExibirEncaminhamentosEncerrados(false);
    setOrdenacoesSelecionadas([
      {
        value: OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixaDesc,
        label:
          OrdenacaoListEncaminhamentoNAAPAEnumDisplay[
            OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixaDesc
          ],
      },
    ]);
  };

  return (
    <>
      <Cabecalho pagina="Tabela de Encaminhamentos NAAPA">
        <Row gutter={[8, 8]} type="flex">
          <Col>
            <button
              id="btn-voltar"
              type="button"
              className="btn-voltar-encaminhamento-naapa btn btn-outline-primary me-2"
              onClick={onClickVoltar}
            >
              Voltar
            </button>
          </Col>
          <Col>
            <button
              id="btn-excluir-encaminhamento-naapa"
              type="button"
              className="btn-excluir-encaminhamento-naapa btn btn-outline-primary me-2"
              onClick={onClickExcluir}
              disabled={
                !idsEncaminhamentoNAAPASelecionados?.length || somenteConsulta
              }
            >
              Excluir
            </button>
          </Col>
          <Col>
            <button
              id="btn-novo-encaminhamento-naapa"
              type="button"
              className="btn-novo-encaminhamento-naapa btn btn-primary me-2"
              onClick={onClickNovo}
              disabled={somenteConsulta || !podeIncluir}
            >
              Novo
            </button>
          </Col>
        </Row>
      </Cabecalho>

      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <CheckboxComponent
              id={SGP_CHECKBOX_EXIBIR_HISTORICO}
              label="Exibir histórico"
              onChangeCheckbox={setConsideraHistorico}
              checked={consideraHistorico}
              disabled={!usuario.ehPerfilSmeOuDre}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Loader loading={carregandoAnosLetivos} tip="">
              <SelectComponent
                id={SGP_SELECT_ANO_LETIVO}
                label="Ano letivo"
                lista={listaAnosLetivo}
                valueOption="valor"
                valueText="desc"
                disabled={
                  !listaAnosLetivo?.length || listaAnosLetivo?.length === 1
                }
                onChange={setAnoLetivo}
                valueSelect={anoLetivo}
                placeholder="Selecione o ano"
                showSearch
              />
            </Loader>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Loader loading={carregandoDres} tip="">
              <SelectComponent
                id={SGP_SELECT_DRE}
                label="Diretoria Regional de Educação (DRE)"
                lista={listaDres}
                valueOption="codigo"
                valueText="nome"
                disabled={!listaDres?.length}
                onChange={setDre}
                valueSelect={dre?.codigo}
                placeholder="Selecione uma DRE"
                showSearch
              />
            </Loader>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Loader loading={carregandoUes} tip="">
              <SelectComponent
                id={SGP_SELECT_UE}
                label="Unidade Escolar (UE)"
                lista={listaUes}
                valueOption="codigo"
                valueText="nome"
                disabled={!listaUes?.length}
                onChange={setUe}
                valueSelect={ue?.codigo}
                placeholder="Selecione uma UE"
                showSearch
              />
            </Loader>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Loader loading={carregandoTurmas} tip="">
              <SelectComponent
                id={SGP_SELECT_TURMA}
                label="Turma"
                lista={listaTurmas}
                valueOption="codigo"
                valueText="nome"
                disabled={!listaTurmas?.length}
                onChange={setTurmaId}
                valueSelect={turmaId}
                placeholder="Selecione uma turma"
                showSearch
              />
            </Loader>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <CampoTexto
              id={SGP_INPUT_NOME_CRIANCA_ESTUDANTE}
              label="Criança/Estudante"
              placeholder="Procure pelo código ou nome da criança/estudante"
              iconeBusca
              allowClear
              onChange={onChangeCodigoNomeAluno}
              value={codigoNomeAlunoExibicao}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <CampoData
              id={SGP_DATE_ABERTURA_QUEIXA_INICIO}
              label="Data de abertura da queixa"
              placeholder="Data inicial"
              valor={dataAberturaQueixaInicio}
              onChange={setDataAberturaQueixaInicio}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <CampoData
              id={SGP_DATE_ABERTURA_QUEIXA_FIM}
              placeholder="Data final"
              valor={dataAberturaQueixaFim}
              onChange={setDataAberturaQueixaFim}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <SelectComponent
              id={SGP_SELECT_SITUACAO_ENCAMINHAMENTO}
              label="Situação do encaminhamento"
              lista={listaSituacoes}
              valueOption="valor"
              valueText="desc"
              onChange={setSituacao}
              valueSelect={situacao}
              placeholder="Situação do encaminhamento"
              showSearch
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <SelectComponent
              id={SGP_SELECT_PRIORIDADE}
              label="Prioridade"
              lista={listaPrioridades}
              valueOption="valor"
              valueText="desc"
              onChange={setPrioridade}
              valueSelect={prioridade}
              placeholder="Prioridade"
              showSearch
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <SelectComponent
              id="SGP_SELECT_TIPO"
              label="Tipo"
              lista={listaTipos}
              valueOption="value"
              valueText="label"
              onChange={setTipo}
              valueSelect={tipo}
              placeholder="Selecione o tipo"
              showSearch
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <SelectComponent
              id="SGP_SELECT_SUSPEITA_VIOLENCIA"
              label="Suspeita de violência"
              lista={listaSuspeitaViolencia}
              valueOption="value"
              valueText="label"
              onChange={setSuspeitaViolencia}
              valueSelect={suspeitaViolencia}
              placeholder="Suspeita de violência"
              showSearch
            />
          </Col>

          <Col xs={24}>
            <RadioGroupButton
              id={SGP_RADIO_EXIBIR_ENCAMINHAMENTOS_NAAPA_ENCERRADOS}
              label="Apresentar encaminhamentos encerrados"
              opcoes={opcoesEncerrados}
              onChange={setExibirEncaminhamentosEncerrados}
              value={exibirEncaminhamentosEncerrados}
            />
          </Col>

          <Col sm={24}>
            <TabelaEncaminhamentoNAAPAPaginacao
              ue={ue}
              dre={dre}
              turmaId={turmaId}
              situacao={situacao}
              anoLetivo={anoLetivo}
              codigoNomeAluno={codigoNomeAluno}
              prioridade={prioridade}
              tipo={tipo}
              suspeitaViolencia={suspeitaViolencia}
              consideraHistorico={consideraHistorico}
              dataAberturaQueixaFim={dataAberturaQueixaFim}
              dataAberturaQueixaInicio={dataAberturaQueixaInicio}
              onSelecionarItems={onSelecionarItems}
              exibirEncaminhamentosEncerrados={exibirEncaminhamentosEncerrados}
              obterDadosFiltros={obterDadosFiltros}
              ordenacoesSelecionadas={ordenacoesSelecionadas}
              usarMock={true}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default TabelaEncaminhamentoNAAPA;
