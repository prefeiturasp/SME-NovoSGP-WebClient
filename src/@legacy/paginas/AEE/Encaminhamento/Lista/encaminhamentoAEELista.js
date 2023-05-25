import { Col, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CheckboxComponent,
  ListaPaginada,
  Loader,
  RadioGroupButton,
  SelectComponent,
} from '~/componentes';
import { Cabecalho, NomeEstudanteLista } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { SGP_BUTTON_NOVO } from '~/constantes/ids/button';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import LocalizadorEstudante from '~/componentes/LocalizadorEstudante';
import { URL_HOME } from '~/constantes/url';
import { RotasDto, situacaoAEE } from '~/dtos';
import { setDadosIniciaisLocalizarEstudante } from '~/redux/modulos/collapseLocalizarEstudante/actions';
import { verificaSomenteConsulta } from '~/servicos';
import AbrangenciaServico from '~/servicos/Abrangencia';
import { erros } from '~/servicos/alertas';
import ServicoEncaminhamentoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';
import FiltroHelper from '~/componentes-sgp/filtro/helper';
import ModalAvisoNovoEncaminhamentoAEE from './Componentes/AvisoCadastro/modalAvisoCadastro';
import { SGP_CHECKBOX_EXIBIR_HISTORICO } from '~/constantes/ids/checkbox';
import {
  SGP_SELECT_ANO_LETIVO,
  SGP_SELECT_DRE,
  SGP_SELECT_ESTUDANTE_CRIANCA,
  SGP_SELECT_RESPONSAVEL,
  SGP_SELECT_SITUACAO,
  SGP_SELECT_TURMA,
  SGP_SELECT_UE,
} from '~/constantes/ids/select';
import { SGP_TABLE_LISTA_ALUNOS_ENCAMINHAMENTO_AEE } from '~/constantes/ids/table';
import BotaoGerarRelatorioEncaminhamentoAEE from '../BotaoGerarRelatorioEncaminhamentoAEE';
import { useNavigate } from 'react-router-dom';
import { OPCAO_TODOS } from '@/@legacy/constantes';
import { SGP_RADIO_EXIBIR_ENCAMINHAMENTOS_AEE_ENCERRADOS } from '@/@legacy/constantes/ids/radio';

const EncaminhamentoAEELista = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const codigosAlunosSelecionados = useSelector(
    state => state.localizadorEstudante.codigosAluno
  );

  const usuario = useSelector(store => store.usuario);
  const permissoesTela =
    usuario.permissoes[RotasDto.RELATORIO_AEE_ENCAMINHAMENTO];

  const somenteConsulta = useSelector(store => store.navegacao.somenteConsulta);

  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [anoAtual] = useState(window.moment().format('YYYY'));

  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaSituacao, setListaSituacao] = useState([]);
  const [listaResponsavel, setListaResponsavel] = useState([]);

  const [anoLetivo, setAnoLetivo] = useState();
  const [dre, setDre] = useState();
  const [ue, setUe] = useState();
  const [turma, setTurma] = useState();
  const [situacao, setSituacao] = useState();
  const [exibirEncaminhamentosEncerrados, setExibirEncaminhamentosEncerrados] =
    useState(false);
  const [responsavel, setResponsavel] = useState();

  const [alunoLocalizadorSelecionado, setAlunoLocalizadorSelecionado] =
    useState();

  const [filtro, setFiltro] = useState({});

  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoAnos, setCarregandoAnos] = useState(false);
  const [carregandoSituacao, setCarregandoSituacao] = useState(false);
  const [carregandoResponsavel, setCarregandoResponsavel] = useState(false);

  const [idsEncaminhamentosSelecionados, setIdsEncaminhamentosSelecionados] =
    useState([]);

  const opcoesEncerrados = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false },
  ];

  useEffect(() => {
    verificaSomenteConsulta(permissoesTela);
  }, [permissoesTela]);

  useEffect(() => {
    if (codigosAlunosSelecionados?.length > 0) {
      setTurma();
    }
  }, [codigosAlunosSelecionados]);

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
      title: 'Responsável',
      dataIndex: 'responsavel',
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
    },
    {
      title: 'UE',
      dataIndex: 'ue',
    },
  ];

  const filtrar = (
    dreId,
    ueSelecionada,
    turmaId,
    aluno,
    situa,
    exibirEncerrados,
    responsavelRf
  ) => {
    if (anoLetivo && dreId) {
      let ueId = 0;
      if (ueSelecionada && ueSelecionada !== OPCAO_TODOS) {
        ueId = ueSelecionada;
      }

      const params = {
        anoLetivo,
        dreId,
        ueId,
        turmaId,
        alunoCodigo: aluno,
        situacao: situa,
        exibirEncerrados,
      };

      if (responsavelRf) {
        params.responsavelRf = responsavelRf;
      }
      setFiltro({ ...params });
    }
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

  const atualizarSituacoes = situacoes => {
    const novasListaSituacoes = situacoes.filter(
      situacao =>
        situacao?.codigo !== situacaoAEE.Encerrado &&
        situacao?.codigo !== situacaoAEE.EncerradoAutomaticamente
    );

    return novasListaSituacoes;
  };

  const obterSituacoes = useCallback(async () => {
    setCarregandoSituacao(true);
    const resposta = await ServicoEncaminhamentoAEE.obterSituacoes()
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

  const obterResponsaveis = useCallback(async () => {
    if (anoLetivo) {
      setCarregandoResponsavel(true);
      setResponsavel();

      const resposta = await ServicoEncaminhamentoAEE.obterResponsaveis(
        dre?.id,
        !ue?.id || ue?.id === OPCAO_TODOS ? 0 : ue?.id,
        turma?.id,
        alunoLocalizadorSelecionado,
        situacao,
        anoLetivo,
        exibirEncaminhamentosEncerrados
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
    anoLetivo,
    dre,
    ue,
    turma,
    alunoLocalizadorSelecionado,
    situacao,
    exibirEncaminhamentosEncerrados,
  ]);

  useEffect(() => {
    if (dre?.id && listaUes.length) {
      obterResponsaveis();
    }
  }, [obterResponsaveis, ue, listaUes]);

  const [carregandoUes, setCarregandoUes] = useState(false);

  const obterUes = useCallback(async () => {
    if (anoLetivo && dre?.codigo) {
      setCarregandoUes(true);
      const resposta = await AbrangenciaServico.buscarUes(
        dre.codigo,
        `v1/abrangencias/${consideraHistorico}/dres/${dre.codigo}/ues?anoLetivo=${anoLetivo}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoUes(false));

      if (resposta?.data?.length) {
        const lista = resposta.data.map(item => ({
          desc: item.nome,
          codigo: String(item.codigo),
          id: item.id,
        }));

        if (lista?.length === 1) {
          setUe(lista[0]);
        }

        if (lista?.length > 1) {
          const todasUE = {
            codigo: OPCAO_TODOS,
            id: OPCAO_TODOS,
            desc: 'Todas',
          };
          lista.unshift(todasUE);
        }

        filtrar(
          dre?.id,
          lista[0]?.id,
          turma?.id,
          alunoLocalizadorSelecionado,
          situacao,
          exibirEncaminhamentosEncerrados,
          responsavel
        );

        setListaUes(lista);
      } else {
        setListaUes([]);
      }
    }
  }, [dre, anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (dre) {
      obterUes();
    } else {
      setUe();
      setListaUes([]);
    }
  }, [dre, obterUes]);

  const onChangeDre = valor => {
    if (valor) {
      const dreSelecionada = listaDres.find(
        item => String(item.codigo) === String(valor)
      );

      setDre(dreSelecionada);
    } else {
      setDre();
    }

    dispatch(
      setDadosIniciaisLocalizarEstudante({ ueId: ue?.codigo, dreId: valor })
    );

    setListaUes([]);
    setUe();

    setListaTurmas([]);
    setTurma();
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
            codigo: String(item.codigo),
            abrev: item.abreviacao,
            id: item.id,
          }))
          .sort(FiltroHelper.ordenarLista('desc'));
        setListaDres(lista);

        if (lista && lista.length && lista.length === 1) {
          setDre(lista[0]);
        }
      } else {
        setListaDres([]);
        setDre();
      }
    }
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    }
  }, [anoLetivo, obterDres]);

  const obterTurmas = useCallback(async () => {
    if (anoLetivo && ue) {
      setCarregandoTurmas(true);
      const resposta = await AbrangenciaServico.buscarTurmas(
        ue?.codigo,
        0,
        '',
        anoLetivo,
        consideraHistorico
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoTurmas(false));

      if (resposta?.data?.length) {
        setListaTurmas(resposta.data);

        if (resposta?.data?.length === 1) {
          setTurma(resposta.data[0]);
          filtrar(
            dre?.id,
            ue.id,
            resposta.data[0]?.id,
            alunoLocalizadorSelecionado,
            situacao,
            exibirEncaminhamentosEncerrados,
            responsavel
          );
        }
      } else {
        setListaTurmas([]);
      }
    }
  }, [anoLetivo, ue]);

  useEffect(() => {
    if (ue) {
      obterTurmas();
    } else {
      setTurma();
      setListaTurmas([]);
    }
  }, [ue, obterTurmas]);

  const onClickVoltar = () => {
    navigate(URL_HOME);
  };

  const onClickNovo = () => {
    if (!somenteConsulta && permissoesTela.podeIncluir) {
      ServicoEncaminhamentoAEE.obterAvisoModal();
    }
  };

  const onChangeUe = valor => {
    const ueSelecionada = listaUes.find(
      item => String(item.codigo) === String(valor)
    );

    if (ueSelecionada) {
      setUe(ueSelecionada);
    } else {
      setUe();
    }

    dispatch(
      setDadosIniciaisLocalizarEstudante({ ueId: valor, dreId: dre?.codigo })
    );
    setListaTurmas([]);
    setTurma();

    filtrar(
      dre?.id,
      ueSelecionada?.id,
      turma?.id,
      alunoLocalizadorSelecionado,
      situacao,
      exibirEncaminhamentosEncerrados,
      responsavel
    );
  };

  const limparFiltrosSelecionados = () => {
    setAnoLetivo();

    setDre();
    setListaDres([]);

    setUe();
    setListaUes([]);

    setListaTurmas([]);
    setTurma();

    setAlunoLocalizadorSelecionado();

    setSituacao();
  };

  const onChangeAnoLetivo = ano => {
    limparFiltrosSelecionados();
    setAnoLetivo(ano);
  };

  const onChangeTurma = valor => {
    const turmaSelecionada = listaTurmas?.find(
      item => String(item.codigo) === String(valor)
    );

    if (turmaSelecionada) {
      setTurma(turmaSelecionada);
    } else {
      setTurma();
    }

    setAlunoLocalizadorSelecionado();
    filtrar(
      dre?.id,
      ue?.id,
      turmaSelecionada?.id,
      '',
      situacao,
      exibirEncaminhamentosEncerrados,
      responsavel
    );
  };

  const onChangeLocalizadorEstudante = aluno => {
    if (aluno?.alunoCodigo && aluno?.alunoNome) {
      setAlunoLocalizadorSelecionado(aluno?.alunoCodigo);
      filtrar(
        dre?.id,
        ue?.id,
        turma?.id,
        aluno?.alunoCodigo,
        situacao,
        exibirEncaminhamentosEncerrados,
        responsavel
      );
    } else {
      setAlunoLocalizadorSelecionado();
      filtrar(
        dre?.id,
        ue?.id,
        turma?.id,
        '',
        situacao,
        exibirEncaminhamentosEncerrados,
        responsavel
      );
    }
  };

  const onChangeSituacao = valor => {
    setSituacao(valor);
    filtrar(
      dre?.id,
      ue?.id,
      turma?.id,
      alunoLocalizadorSelecionado,
      valor,
      exibirEncaminhamentosEncerrados,
      responsavel
    );
  };

  const onChangeEncaminhamentosEncerrados = e => {
    setExibirEncaminhamentosEncerrados(e?.target?.value);
    filtrar(
      dre?.id,
      ue?.id,
      turma?.id,
      alunoLocalizadorSelecionado,
      situacao,
      e?.target?.value,
      responsavel
    );
  };

  const onChangeResponsavel = valor => {
    setResponsavel(valor);
    filtrar(
      dre?.id,
      ue?.id,
      turma?.id,
      alunoLocalizadorSelecionado,
      situacao,
      exibirEncaminhamentosEncerrados,
      valor
    );
  };

  const onClickEditar = item => {
    navigate(`${RotasDto.RELATORIO_AEE_ENCAMINHAMENTO}/editar/${item.id}`);
  };

  const onCheckedConsideraHistorico = e => {
    limparFiltrosSelecionados();
    setConsideraHistorico(e.target.checked);
  };

  const selecionarEcaminhamentos = selecionados =>
    setIdsEncaminhamentosSelecionados(selecionados?.map(item => item?.id));

  return (
    <>
      <ModalAvisoNovoEncaminhamentoAEE />
      <Cabecalho pagina="Encaminhamento AEE">
        <Row gutter={[8, 8]} type="flex">
          <Col>
            <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
          </Col>
          <Col>
            <Button
              id={SGP_BUTTON_NOVO}
              label="Novo Encaminhamento"
              color={Colors.Roxo}
              border
              bold
              onClick={onClickNovo}
              disabled={somenteConsulta || !permissoesTela.podeIncluir}
            />
          </Col>
          <Col>
            <BotaoGerarRelatorioEncaminhamentoAEE
              ids={idsEncaminhamentosSelecionados}
              disabled={!idsEncaminhamentosSelecionados?.length}
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
                  valueOption="codigo"
                  valueText="desc"
                  disabled={!anoLetivo || listaDres?.length === 1}
                  onChange={onChangeDre}
                  valueSelect={dre?.codigo}
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
                  valueOption="codigo"
                  valueText="desc"
                  disabled={!dre?.codigo || listaUes?.length === 1}
                  onChange={onChangeUe}
                  valueSelect={ue?.codigo}
                  placeholder="Unidade Escolar (UE)"
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
              <Loader loading={carregandoTurmas} tip="">
                <SelectComponent
                  id={SGP_SELECT_TURMA}
                  lista={listaTurmas}
                  valueOption="codigo"
                  valueText="nomeFiltro"
                  label="Turma"
                  disabled={listaTurmas?.length === 1}
                  valueSelect={turma?.codigo}
                  onChange={onChangeTurma}
                  placeholder="Turma"
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-2">
              <div className="row">
                <LocalizadorEstudante
                  id={SGP_SELECT_ESTUDANTE_CRIANCA}
                  showLabel
                  ueId={ue?.codigo}
                  onChange={onChangeLocalizadorEstudante}
                  anoLetivo={anoLetivo}
                  desabilitado={
                    !dre?.codigo || !ue?.codigo || ue?.codigo === OPCAO_TODOS
                  }
                  exibirCodigoEOL={false}
                  codigoTurma={turma?.codigo}
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
                value={exibirEncaminhamentosEncerrados}
                label="Exibir encaminhamentos encerrados"
                opcoes={opcoesEncerrados}
                id={SGP_RADIO_EXIBIR_ENCAMINHAMENTOS_AEE_ENCERRADOS}
                onChange={onChangeEncaminhamentosEncerrados}
              />
            </div>
            <div className="col-sm-12 mb-4">
              <Loader loading={carregandoResponsavel} tip="">
                <SelectComponent
                  id={SGP_SELECT_RESPONSAVEL}
                  label="PAEE/PAAI Responsável"
                  lista={listaResponsavel}
                  valueOption="codigoRf"
                  valueText="nomeFormatado"
                  onChange={onChangeResponsavel}
                  valueSelect={responsavel}
                  placeholder="PAEE/PAAI Responsável"
                />
              </Loader>
            </div>

            {anoLetivo &&
            dre?.codigo &&
            listaDres?.length &&
            listaUes?.length ? (
              <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-2">
                <ListaPaginada
                  multiSelecao
                  url="v1/encaminhamento-aee"
                  id={SGP_TABLE_LISTA_ALUNOS_ENCAMINHAMENTO_AEE}
                  colunas={colunas}
                  filtro={filtro}
                  filtroEhValido={
                    !!(
                      anoLetivo &&
                      dre?.codigo &&
                      filtro.dreId &&
                      listaDres?.length &&
                      listaUes?.length
                    )
                  }
                  temPaginacao
                  onClick={onClickEditar}
                  selecionarItems={selecionarEcaminhamentos}
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

export default EncaminhamentoAEELista;
