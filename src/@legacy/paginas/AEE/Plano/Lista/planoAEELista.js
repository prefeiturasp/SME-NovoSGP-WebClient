import * as moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'antd';
import { Cabecalho, NomeEstudanteLista } from '~/componentes-sgp';
import AbrangenciaServico from '~/servicos/Abrangencia';
import {
  CheckboxComponent,
  ListaPaginada,
  Loader,
  RadioGroupButton,
  SelectComponent,
} from '~/componentes';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import LocalizadorEstudante from '~/componentes/LocalizadorEstudante';
import { URL_HOME } from '~/constantes/url';
import { RotasDto, situacaoPlanoAEE } from '~/dtos';
import { setDadosIniciaisLocalizarEstudante } from '~/redux/modulos/collapseLocalizarEstudante/actions';
import { setTypePlanoAEECadastro } from '~/redux/modulos/planoAEE/actions';

import { erros, verificaSomenteConsulta } from '~/servicos';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';
import FiltroHelper from '~/componentes-sgp/filtro/helper';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_SELECT_ANO_LETIVO,
  SGP_SELECT_DRE,
  SGP_SELECT_ESTUDANTE_CRIANCA,
  SGP_SELECT_RESPONSAVEL,
  SGP_SELECT_SITUACAO,
  SGP_SELECT_TURMA,
  SGP_SELECT_UE,
} from '~/constantes/ids/select';
import { SGP_CHECKBOX_EXIBIR_HISTORICO } from '~/constantes/ids/checkbox';
import BtnImpressaoListaPlanoAEE from './btnImpressaoListaPlanoAEE';
import { useNavigate } from 'react-router-dom';
import { OPCAO_TODOS } from '@/@legacy/constantes';
import ServicoEncaminhamentoAEE from '@/@legacy/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';
import { SGP_RADIO_EXIBIR_PLANOS_ENCERRADOS } from '@/@legacy/constantes/ids/radio';

const PlanoAEELista = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [filtro, setFiltro] = useState({});

  const [anoAtual] = useState(window.moment().format('YYYY'));

  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaSituacao, setListaSituacao] = useState([]);
  const [listaResponsavel, setListaResponsavel] = useState([]);

  const [responsaveisPAAI, setResponsaveisPAAI] = useState([]);

  const [anoLetivo, setAnoLetivo] = useState();
  const [dreId, setDreId] = useState();
  const [ueId, setUeId] = useState();
  const [turmaId, setTurmaId] = useState();
  const [situacao, setSituacao] = useState();
  const [exibirPlanosEncerrados, setExibirPlanosEncerrados] = useState(false);
  const [responsavelSelecionado, setResponsavelSelecionado] = useState();
  const [responsavelPAAISelecionado, setResponsavelPAAISelecionado] =
    useState();

  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoAnos, setCarregandoAnos] = useState(false);
  const [carregandoSituacao, setCarregandoSituacao] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [carregandoResponsaveisPAAI, setCarregandoResponsaveisPAAI] =
    useState(false);
  const [carregandoResponsavel, setCarregandoResponsavel] = useState(false);

  const [alunoLocalizadorSelecionado, setAlunoLocalizadorSelecionado] =
    useState();

  const [idsPlanosSelecionados, setIdsPlanosSelecionados] = useState([]);

  const usuario = useSelector(store => store.usuario);
  const permissoesTela = usuario.permissoes[RotasDto.RELATORIO_AEE_PLANO];
  const somenteConsulta = useSelector(store => store.navegacao.somenteConsulta);

  const opcoesEncerrados = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false },
  ];

  const colunas = [
    {
      title: 'Nº',
      dataIndex: 'numero',
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
      render: (_, record) => (
        <NomeEstudanteLista
          nome={record?.nome}
          exibirSinalizacao={record?.ehAtendidoAEE}
        />
      ),
    },
    {
      title: 'Turma',
      dataIndex: 'turma',
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
    },
    {
      title: 'Data de cadastro',
      dataIndex: 'criadoEm',
      render: data => {
        let dataFormatada = '';
        if (data) {
          dataFormatada = moment(data).format('DD/MM/YYYY HH:mm');
        }
        return <span> {dataFormatada}</span>;
      },
    },
    {
      title: 'Versão',
      dataIndex: 'versao',
    },
    {
      title: 'Responsável',
      dataIndex: 'responsavel',
      render: (_, record) => (
        <span>
          {record.nomeReponsavel} - {record.rfReponsavel}
        </span>
      ),
    },
    {
      title: 'PAAI responsável',
      dataIndex: 'paaiResponsavel',
      render: (_, record) => (
        <>
          {record?.nomePaaiReponsavel ? (
            <span>
              {record.nomePaaiReponsavel} - {record.rfPaaiReponsavel}
            </span>
          ) : (
            ''
          )}
        </>
      ),
    },
    {
      title: 'UE',
      dataIndex: 'ue',
    },
  ];

  const obterUes = useCallback(async () => {
    if (anoLetivo && dreId) {
      setCarregandoUes(true);
      const resposta = await AbrangenciaServico.buscarUes(
        dreId,
        `v1/abrangencias/${consideraHistorico}/dres/${dreId}/ues?anoLetivo=${anoLetivo}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoUes(false));

      if (resposta?.data) {
        const lista = resposta.data.map(item => ({
          desc: item.nome,
          valor: String(item.codigo),
          id: item.id,
        }));

        if (lista?.length === 1) {
          setUeId(lista[0].valor);
        }

        if (lista?.length > 1) {
          const todasUE = {
            valor: OPCAO_TODOS,
            id: OPCAO_TODOS,
            desc: 'Todas',
          };
          lista.unshift(todasUE);
        }

        setListaUes(lista);
      } else {
        setListaUes([]);
      }
    }
  }, [dreId, anoLetivo, consideraHistorico]);

  const filtrar = (
    dre,
    ue,
    turma,
    aluno,
    situa,
    exibirEncerrados,
    responsavelRf,
    paaiResponsavelRf
  ) => {
    if (anoLetivo && dre && listaDres?.length) {
      const dreSelecionada = listaDres.find(
        item => String(item.valor) === String(dre)
      );

      const ueSelecionada = listaUes.find(
        item => String(item.valor) === String(ue)
      );

      const turmaSelecionada = listaTurmas.find(
        item => String(item.codigo) === String(turma)
      );

      const params = {
        dreId: dreSelecionada ? dreSelecionada?.id : '',
        alunoCodigo: aluno,
        situacao: situa,
        exibirEncerrados,
      };

      params.ueId = ueSelecionada?.id || 0;

      if (responsavelRf) {
        params.responsavelRf = responsavelRf;
      }

      if (paaiResponsavelRf) {
        params.paaiReponsavelRf = paaiResponsavelRf;
      }

      if (turmaSelecionada?.id) {
        params.turmaId = turmaSelecionada?.id;
      }
      setFiltro({ ...params });
    } else {
      setFiltro({});
    }
  };

  const limparFiltrosSelecionados = () => {
    setDreId();
    setListaDres([]);

    setUeId();
    setListaUes([]);

    setListaTurmas([]);
    setTurmaId();

    setAlunoLocalizadorSelecionado();

    setSituacao();

    setResponsavelSelecionado();

    setResponsavelPAAISelecionado();
  };

  const onClickVoltar = () => {
    navigate(URL_HOME);
  };

  const onClickNovo = () => {
    if (!somenteConsulta && permissoesTela.podeIncluir) {
      dispatch(setTypePlanoAEECadastro(true));
      navigate(`${RotasDto.RELATORIO_AEE_PLANO}/novo`);
    }
  };

  const onCheckedConsideraHistorico = e => {
    limparFiltrosSelecionados();
    setConsideraHistorico(e.target.checked);
  };

  const validarValorPadraoAnoLetivo = lista => {
    if (lista?.length) {
      const temAnoAtualNaLista = lista.find(
        item => String(item.valor) === String(anoAtual)
      );
      if (temAnoAtualNaLista) {
        setAnoLetivo(anoAtual);
      } else {
        setAnoLetivo(lista[0].valor);
      }
    } else {
      setAnoLetivo();
    }
  };

  useEffect(() => {
    validarValorPadraoAnoLetivo(listaAnosLetivo);
  }, [consideraHistorico, listaAnosLetivo]);

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnos(true);

    const anosLetivos = await FiltroHelper.obterAnosLetivos({
      consideraHistorico,
    });

    if (!anosLetivos.length) {
      anosLetivos.push({
        desc: anoAtual,
        valor: anoAtual,
      });
    }

    validarValorPadraoAnoLetivo(anosLetivos);

    setListaAnosLetivo(anosLetivos);
    setCarregandoAnos(false);
  }, [anoAtual, consideraHistorico]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos, consideraHistorico]);

  const onChangeAnoLetivo = ano => {
    setAnoLetivo(ano);

    limparFiltrosSelecionados();
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
        const lista = resposta.data
          .map(item => ({
            desc: item.nome,
            valor: String(item.codigo),
            abrev: item.abreviacao,
            id: item.id,
          }))
          .sort(FiltroHelper.ordenarLista('desc'));
        setListaDres(lista);

        if (lista && lista.length && lista.length === 1) {
          setDreId(lista[0].valor);
        }
      } else {
        setListaDres([]);
        setDreId(undefined);
      }
    }
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    setResponsavelSelecionado();

    setResponsavelPAAISelecionado();

    if (dreId) {
      obterUes();
    } else {
      setUeId();
      setListaUes([]);
    }
  }, [dreId, obterUes]);

  const onChangeDre = dre => {
    setDreId(dre);
    dispatch(setDadosIniciaisLocalizarEstudante({ ueId, dreId: dre }));

    setListaUes([]);
    setUeId();

    setListaTurmas([]);
    setTurmaId();

    setResponsavelPAAISelecionado();
    setResponsavelSelecionado();
  };

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    }
  }, [anoLetivo, obterDres]);

  const onChangeUe = ue => {
    setTurmaId();
    setListaTurmas([]);

    setUeId(ue);
    dispatch(setDadosIniciaisLocalizarEstudante({ ueId: ue, dreId }));
  };

  const onChangeTurma = valor => {
    setTurmaId(valor);
    setAlunoLocalizadorSelecionado();
  };

  const onChangeLocalizadorEstudante = aluno => {
    if (aluno?.alunoCodigo && aluno?.alunoNome) {
      setAlunoLocalizadorSelecionado(aluno?.alunoCodigo);
    } else {
      setAlunoLocalizadorSelecionado();
    }
  };

  const obterTurmas = useCallback(async () => {
    if (anoLetivo && ueId) {
      setCarregandoTurmas(true);
      const resposta = await AbrangenciaServico.buscarTurmas(
        ueId,
        0,
        '',
        anoLetivo,
        consideraHistorico
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoTurmas(false));

      if (resposta?.data) {
        setListaTurmas(resposta.data);

        if (resposta?.data?.length === 1) {
          setTurmaId(resposta.data[0].codigo);
        }
      }
    }
  }, [anoLetivo, ueId]);

  useEffect(() => {
    if (ueId) {
      obterTurmas();
    } else {
      setTurmaId();
      setListaTurmas([]);
    }
  }, [ueId, obterTurmas]);

  const atualizarSituacoes = situacoes => {
    const novasListaSituacoes = situacoes.filter(
      situacao =>
        situacao?.codigo !== situacaoPlanoAEE.Encerrado &&
        situacao?.codigo !== situacaoPlanoAEE.EncerradoAutomaticamente
    );

    return novasListaSituacoes;
  };

  const obterSituacoes = useCallback(async () => {
    setCarregandoSituacao(true);
    const resposta = await ServicoPlanoAEE.obterSituacoes()
      .catch(e => erros(e))
      .finally(() => setCarregandoSituacao(false));
    if (resposta?.data?.length) {
      const lista = atualizarSituacoes(resposta.data);
      setListaSituacao(lista);
    } else {
      setListaSituacao([]);
    }
  }, []);

  useEffect(() => {
    obterSituacoes();
  }, [obterSituacoes]);

  const onChangeSituacao = valor => {
    setSituacao(valor);
  };

  const onClickEditar = item => {
    navigate(`${RotasDto.RELATORIO_AEE_PLANO}/editar/${item.id}`);
  };

  useEffect(() => {
    if (dreId && listaDres?.length && listaUes?.length) {
      filtrar(
        dreId,
        ueId,
        turmaId,
        alunoLocalizadorSelecionado,
        situacao,
        exibirPlanosEncerrados,
        responsavelSelecionado,
        responsavelPAAISelecionado
      );
    } else {
      setFiltro({});
    }
  }, [
    dreId,
    ueId,
    listaDres,
    listaUes,
    turmaId,
    alunoLocalizadorSelecionado,
    situacao,
    exibirPlanosEncerrados,
    responsavelSelecionado,
    responsavelPAAISelecionado,
  ]);

  useEffect(() => {
    verificaSomenteConsulta(permissoesTela);
  }, [permissoesTela]);

  const onSelecionarItems = items =>
    setIdsPlanosSelecionados(items?.map(item => item?.planoAeeVersaoId));

  const obterResponsaveisPAAI = useCallback(async () => {
    setCarregandoResponsaveisPAAI(true);

    const resposta =
      await ServicoEncaminhamentoAEE.obterResponsaveisPAAIPesquisa(null, dreId)
        .catch(e => erros(e))
        .finally(() => setCarregandoResponsaveisPAAI(false));

    const dados = resposta?.data?.items;
    if (dados?.length) {
      const listaResp = dados.map(item => {
        return {
          ...item,
          codigoRF: item.codigoRf,
          nomeServidorFormatado: `${item.nomeServidor} - ${item.codigoRf}`,
        };
      });
      if (listaResp?.length === 1) {
        setResponsavelPAAISelecionado(listaResp[0].codigoRF);
      }
      setResponsaveisPAAI(listaResp);
    }
  }, [dreId]);

  useEffect(() => {
    if (dreId) {
      obterResponsaveisPAAI();
    } else {
      setResponsaveisPAAI([]);
    }
  }, [dreId, obterResponsaveisPAAI]);

  const onChangePAAI = rf => {
    const funcionario = responsaveisPAAI?.find(r => r?.codigoRF === rf);

    if (funcionario?.codigoRF && funcionario?.nomeServidor) {
      setResponsavelPAAISelecionado(funcionario?.codigoRF);
    } else {
      setResponsavelPAAISelecionado();
    }
  };

  const onChangeResponsavel = valor => {
    setResponsavelSelecionado(valor);
  };

  const obterResponsaveis = useCallback(async () => {
    if (dreId) {
      const dreSelecionada = listaDres.find(d => d?.valor === dreId);

      const ueSelecionada = ueId ? listaUes.find(d => d?.valor === ueId) : 0;

      const turmaSelecionada = turmaId
        ? listaTurmas.find(d => d?.codigo === turmaId)
        : 0;

      setCarregandoResponsavel(true);
      setResponsavelSelecionado();

      const resposta = await ServicoPlanoAEE.obterResponsaveis(
        dreSelecionada?.id,
        !ueSelecionada?.id || ueSelecionada?.id === OPCAO_TODOS
          ? 0
          : ueSelecionada?.id,
        turmaSelecionada ? turmaSelecionada?.id : 0,
        alunoLocalizadorSelecionado,
        situacao,
        exibirPlanosEncerrados
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoResponsavel(false));

      if (resposta?.data?.length) {
        const lista = resposta.data.map(item => {
          return {
            ...item,
            codigoRf: String(item.codigoRf),
            nomeFormatado: `${item.nomeServidor} - ${item.codigoRf}`,
          };
        });

        setListaResponsavel(lista);
      } else {
        setListaResponsavel([]);
      }
    }
  }, [
    dreId,
    ueId,
    turmaId,
    alunoLocalizadorSelecionado,
    situacao,
    exibirPlanosEncerrados,
    listaUes,
  ]);

  useEffect(() => {
    if (dreId && listaUes.length) {
      obterResponsaveis();
    }
  }, [obterResponsaveis, dreId, listaUes]);

  return (
    <>
      <Cabecalho pagina="Plano AEE">
        <Row gutter={[8, 8]} type="flex">
          <Col>
            <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
          </Col>
          <Col>
            <BtnImpressaoListaPlanoAEE
              idsPlanosSelecionados={idsPlanosSelecionados}
            />
          </Col>
          <Col>
            <Button
              id={SGP_BUTTON_NOVO}
              label="Novo"
              color={Colors.Roxo}
              border
              bold
              onClick={onClickNovo}
              disabled={somenteConsulta || !permissoesTela.podeIncluir}
            />
          </Col>
        </Row>
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-12 mb-4">
              <CheckboxComponent
                id={SGP_CHECKBOX_EXIBIR_HISTORICO}
                label="Exibir histórico?"
                onChangeCheckbox={onCheckedConsideraHistorico}
                checked={consideraHistorico}
              />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-2 col-xl-2 mb-2">
              <Loader loading={carregandoAnos} tip="">
                <SelectComponent
                  id={SGP_SELECT_ANO_LETIVO}
                  label="Ano Letivo"
                  lista={listaAnosLetivo}
                  valueOption="valor"
                  valueText="desc"
                  disabled={listaAnosLetivo?.length === 1}
                  onChange={onChangeAnoLetivo}
                  valueSelect={anoLetivo}
                  placeholder="Ano letivo"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5 mb-2">
              <Loader loading={carregandoDres} tip="">
                <SelectComponent
                  id={SGP_SELECT_DRE}
                  label="Diretoria Regional de Educação (DRE)"
                  lista={listaDres}
                  valueOption="valor"
                  valueText="desc"
                  disabled={!anoLetivo || listaDres?.length === 1}
                  onChange={onChangeDre}
                  valueSelect={dreId}
                  placeholder="Diretoria Regional De Educação (DRE)"
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5 mb-2">
              <Loader loading={carregandoUes} tip="">
                <SelectComponent
                  id={SGP_SELECT_UE}
                  label="Unidade Escolar (UE)"
                  lista={listaUes}
                  valueOption="valor"
                  valueText="desc"
                  disabled={!dreId || listaUes?.length === 1}
                  onChange={onChangeUe}
                  valueSelect={ueId}
                  placeholder="Unidade Escolar (UE)"
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6 col-xl-5 mb-2">
              <Loader loading={carregandoTurmas} tip="">
                <SelectComponent
                  id={SGP_SELECT_TURMA}
                  lista={listaTurmas}
                  valueOption="codigo"
                  valueText="nomeFiltro"
                  label="Turma"
                  disabled={listaTurmas?.length === 1}
                  valueSelect={turmaId}
                  onChange={onChangeTurma}
                  placeholder="Turma"
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6 col-xl-7 mb-2">
              <div className="row">
                <LocalizadorEstudante
                  id={SGP_SELECT_ESTUDANTE_CRIANCA}
                  showLabel
                  ueId={ueId}
                  onChange={onChangeLocalizadorEstudante}
                  anoLetivo={anoLetivo}
                  desabilitado={!dreId || !ueId || ueId === OPCAO_TODOS}
                  exibirCodigoEOL={false}
                  codigoTurma={turmaId}
                  placeholder="Procure pelo nome da Criança/Estudante"
                />
              </div>
            </div>
            <div className="col-sm-12 col-md-6 mb-2">
              <Loader loading={carregandoSituacao} tip="">
                <SelectComponent
                  id={SGP_SELECT_SITUACAO}
                  label="Situação"
                  lista={listaSituacao}
                  valueOption="codigo"
                  valueText="descricao"
                  disabled={listaSituacao?.length === 1}
                  onChange={onChangeSituacao}
                  valueSelect={situacao}
                  placeholder="Situação"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-6 mb-2">
              <RadioGroupButton
                value={exibirPlanosEncerrados}
                label="Exibir planos encerrados"
                opcoes={opcoesEncerrados}
                id={SGP_RADIO_EXIBIR_PLANOS_ENCERRADOS}
                onChange={e => {
                  setExibirPlanosEncerrados(e?.target?.value);
                }}
              />
            </div>
            <div className="col-sm-12 mb-2">
              <Loader loading={carregandoResponsavel} tip="">
                <SelectComponent
                  id={SGP_SELECT_RESPONSAVEL}
                  label="Responsável"
                  lista={listaResponsavel}
                  valueOption="codigoRf"
                  valueText="nomeFormatado"
                  onChange={onChangeResponsavel}
                  valueSelect={responsavelSelecionado}
                  placeholder="Responsável"
                />
              </Loader>
            </div>
            <div className="col-sm-12 mb-4">
              <Loader loading={carregandoResponsaveisPAAI} tip="">
                <SelectComponent
                  placeholder="Pesquise por nome ou RF"
                  label="PAAI responsável"
                  valueOption="codigoRF"
                  valueText="nomeServidorFormatado"
                  lista={responsaveisPAAI}
                  showSearch
                  valueSelect={responsavelPAAISelecionado}
                  onChange={onChangePAAI}
                  searchValue
                  disabled={!dreId || responsaveisPAAI?.length === 1}
                />
              </Loader>
            </div>
            {anoLetivo && dreId && listaDres?.length ? (
              <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-2">
                <ListaPaginada
                  multiSelecao
                  url="v1/plano-aee"
                  id="lista-alunos"
                  colunas={colunas}
                  filtro={filtro}
                  filtroEhValido={
                    !!(
                      anoLetivo &&
                      dreId &&
                      filtro.dreId &&
                      listaDres?.length &&
                      listaUes?.length
                    )
                  }
                  temPaginacao
                  onClick={onClickEditar}
                  selecionarItems={onSelecionarItems}
                />
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export default PlanoAEELista;
