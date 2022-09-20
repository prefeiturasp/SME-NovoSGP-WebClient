import * as moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckboxComponent,
  Loader,
  RadioGroupButton,
  SelectComponent,
} from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import Card from '~/componentes/card';
import { ModalidadeDTO } from '~/dtos';
import AbrangenciaServico from '~/servicos/Abrangencia';
import { erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import history from '~/servicos/history';
import ServicoFiltroRelatorio from '~/servicos/Paginas/FiltroRelatorio/ServicoFiltroRelatorio';
import ServicoComponentesCurriculares from '~/servicos/Paginas/ComponentesCurriculares/ServicoComponentesCurriculares';
import ServicoRelatorioPlanejamentoDiario from '~/servicos/Paginas/Relatorios/DiarioClasse/PlanejamentoDiario/ServicoRelatorioPlanejamentoDiario';
import ServicoPeriodoEscolar from '~/servicos/Paginas/Calendario/ServicoPeriodoEscolar';

import FiltroHelper from '~componentes-sgp/filtro/helper';
import { OPCAO_TODOS } from '~/constantes/constantes';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { URL_HOME } from '~/constantes';

const RelatorioPlanejamentoDiario = () => {
  const [exibirLoader, setExibirLoader] = useState(false);

  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [
    listaComponentesCurriculares,
    setListaComponentesCurriculares,
  ] = useState([]);
  const [
    componentesCurricularesDisponiveis,
    setComponentesCurricularesDisponiveis,
  ] = useState([]);
  const [listaBimestres, setListaBimestres] = useState([]);
  const [bimestres, setBimestres] = useState([]);
  const [anoLetivo, setAnoLetivo] = useState();
  const [codigoDre, setCodigoDre] = useState();
  const [codigoUe, setCodigoUe] = useState();
  const [modalidadeId, setModalidadeId] = useState();
  const [semestre, setSemestre] = useState();
  const [turmaId, setTurmaId] = useState();
  const [habilitarDatasFuturas, setHabilitarDatasFuturas] = useState(false);
  const [listarDataFutura, setListarDataFutura] = useState(false);
  const [exibirDetalhamento, setExibirDetalhamento] = useState(false);
  const [componenteCurricularId, setComponenteCurricularId] = useState();
  const [bimestre, setBimestre] = useState();

  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [clicouBotaoGerar, setClicouBotaoGerar] = useState(false);
  const [desabilitarGerar, setDesabilitarGerar] = useState(true);

  const opcoesRadioSimNao = [
    { label: 'Não', value: false },
    { label: 'Sim', value: true },
  ];

  const onChangeAnoLetivo = async valor => {
    setCodigoDre();
    setCodigoUe();
    setModalidadeId();
    setTurmaId();
    setAnoLetivo(valor);
    setListarDataFutura(false);
    setExibirDetalhamento(false);
  };

  const onChangeDre = valor => {
    setCodigoDre(valor);
    setCodigoUe();
    setModalidadeId();
    setTurmaId();
    setCodigoUe(undefined);
    setListarDataFutura(false);
    setExibirDetalhamento(false);
  };

  const onChangeUe = valor => {
    setModalidadeId();
    setTurmaId();
    setCodigoUe(valor);
    setListarDataFutura(false);
    setExibirDetalhamento(false);
  };

  const onChangeModalidade = valor => {
    setTurmaId();
    setModalidadeId(valor);
    setListarDataFutura(false);
    setExibirDetalhamento(false);
  };

  const onChangeComponenteCurricular = valor => {
    setComponenteCurricularId(valor);
    setClicouBotaoGerar(false);
  };

  const onChangeBimestre = valor => {
    setBimestre(valor);
    setClicouBotaoGerar(false);
  };

  const onChangeSemestre = valor => {
    setSemestre(valor);
    setClicouBotaoGerar(false);
  };

  const onChangeTurma = valor => {
    setTurmaId(valor);
    setListarDataFutura(false);
    setExibirDetalhamento(false);
    setClicouBotaoGerar(false);
  };

  const [anoAtual] = useState(moment().format('YYYY'));

  const obterDres = useCallback(async () => {
    if (anoLetivo) {
      setExibirLoader(true);
      const resposta = await AbrangenciaServico.buscarDres(
        `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`,
        consideraHistorico
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

      if (resposta?.data?.length) {
        const lista = resposta.data.map(item => ({
          desc: item.nome,
          valor: String(item.codigo),
          abrev: item.abreviacao,
        }));

        setListaDres(lista);

        if (lista && lista.length && lista.length === 1) {
          setCodigoDre(lista[0].valor);
        }
      } else {
        setListaDres([]);
        setCodigoDre(undefined);
      }
    }
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    obterDres();
  }, [obterDres, anoLetivo, consideraHistorico]);

  useEffect(() => {
    let desabilitar =
      !anoLetivo ||
      !codigoDre ||
      !codigoUe ||
      !componenteCurricularId?.length ||
      clicouBotaoGerar;

    const temDreUeSelecionada = codigoDre && codigoUe;

    if (!desabilitar && temDreUeSelecionada && !modalidadeId) {
      desabilitar = true;
    }

    if (
      !desabilitar &&
      temDreUeSelecionada &&
      modalidadeId &&
      modalidadeId === ModalidadeDTO.EJA &&
      !semestre
    ) {
      desabilitar = true;
    }

    if (!desabilitar && codigoDre && codigoUe && !turmaId) {
      desabilitar = true;
    }

    if (!desabilitar && codigoDre && codigoUe && turmaId && !bimestre) {
      desabilitar = true;
    }

    setDesabilitarGerar(desabilitar);
  }, [
    anoLetivo,
    codigoDre,
    codigoUe,
    turmaId,
    modalidadeId,
    semestre,
    bimestre,
    componenteCurricularId,
    clicouBotaoGerar,
  ]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consideraHistorico, listaAnosLetivo]);

  const obterUes = useCallback(async () => {
    if (codigoDre) {
      setExibirLoader(true);
      const resposta = await AbrangenciaServico.buscarUes(
        codigoDre,
        `v1/abrangencias/${consideraHistorico}/dres/${codigoDre}/ues?anoLetivo=${anoLetivo}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

      if (resposta?.data?.length) {
        const lista = resposta.data.map(item => ({
          desc: item.nome,
          valor: String(item.codigo),
        }));

        if (lista && lista.length && lista.length === 1) {
          setCodigoUe(lista[0].valor);
        }

        setListaUes(lista);
      } else {
        setListaUes([]);
      }
    }
  }, [consideraHistorico, anoLetivo, codigoDre]);

  useEffect(() => {
    if (codigoDre) {
      obterUes();
    } else {
      setCodigoUe();
      setListaUes([]);
    }
  }, [codigoDre, anoLetivo, consideraHistorico, obterUes]);

  const obterModalidades = async (ue, ano) => {
    if (ue && ano) {
      setExibirLoader(true);
      const {
        data,
      } = await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(ue);

      if (data) {
        const lista = data.map(item => ({
          desc: item.descricao,
          valor: String(item.valor),
        }));

        if (lista && lista.length && lista.length === 1) {
          setModalidadeId(lista[0].valor);
        }
        setListaModalidades(lista);
      }
      setExibirLoader(false);
    }
  };

  useEffect(() => {
    if (anoLetivo && codigoUe) {
      obterModalidades(codigoUe, anoLetivo);
    } else {
      setModalidadeId();
      setListaModalidades([]);
    }
  }, [anoLetivo, codigoUe]);

  const obterBimestres = async () => {
    if (modalidadeId && anoLetivo) {
      const bimestresResponse = await ServicoPeriodoEscolar.obterPeriodosPorAnoLetivoModalidade(
        modalidadeId,
        anoLetivo
      ).catch(e => erros(e));
      if (bimestresResponse?.data) {
        const lista = bimestresResponse.data.map(v => {
          return {
            valor: v.bimestre,
            desc: v.bimestre,
          };
        });
        lista.unshift({ valor: OPCAO_TODOS, desc: 'Todos' });
        setListaBimestres(lista);
        setBimestres(bimestresResponse.data);
        setBimestre();
      }
    }
  };

  useEffect(() => {
    obterBimestres();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalidadeId, anoLetivo]);

  const checarPeriodoEhMaior = data => {
    return moment(moment(data).format('YYYY-MM-DD')).isAfter(
      moment().format('YYYY-MM-DD')
    );
  };

  const checarPeriodoFinalBimestre = async () => {
    setHabilitarDatasFuturas(false);
    setListarDataFutura(false);
    if (bimestre !== OPCAO_TODOS && bimestre) {
      const bimestreSelecionado = bimestres.filter(
        b => b.bimestre === Number(bimestre)
      );
      if (checarPeriodoEhMaior(bimestreSelecionado[0]?.periodoFim)) {
        setHabilitarDatasFuturas(true);
      }
    }
  };

  useEffect(() => {
    checarPeriodoFinalBimestre();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bimestre]);

  const obterTurmas = useCallback(async () => {
    if (codigoDre && codigoUe && modalidadeId) {
      setExibirLoader(true);
      const { data } = await AbrangenciaServico.buscarTurmas(
        codigoUe,
        modalidadeId,
        '',
        anoLetivo,
        consideraHistorico
      );
      if (data) {
        const turmas = [];

        data.map(item =>
          turmas.push({
            desc: item.nome,
            valor: item.codigo,
            id: item.id,
            ano: item.ano,
            nomeFiltro: item.nomeFiltro,
          })
        );

        if (turmas.length > 1) {
          turmas.unshift({ valor: OPCAO_TODOS, nomeFiltro: 'Todas' });
        }
        setListaTurmas(turmas);
        if (turmas.length === 1) {
          setTurmaId(turmas[0].valor);
        }
      }
      setExibirLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalidadeId]);

  useEffect(() => {
    if (modalidadeId && codigoUe && codigoDre) {
      obterTurmas();
    } else {
      setTurmaId();
      setListaTurmas([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalidadeId]);

  const obterComponentesCurriculares = useCallback(async () => {
    let turmas = [];
    if (turmaId === OPCAO_TODOS) {
      turmas = listaTurmas
        .filter(item => item.valor !== OPCAO_TODOS)
        .map(a => a.valor);
    } else {
      turmas = [turmaId];
    }

    setExibirLoader(true);
    const componentes = await ServicoComponentesCurriculares.obterComponentesPorListaDeTurmas(
      turmas
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (componentes?.data?.length) {
      const lista = [];
      if (turmaId === OPCAO_TODOS || componentes.data.length > 1) {
        lista.push({ valor: OPCAO_TODOS, desc: 'Todos' });
      }
      componentes.data.map(item =>
        lista.push({
          desc: item.nome,
          valor: item.codigo,
        })
      );
      const listaComponentesDisponiveis = componentes.data.map(
        item => item.codigo
      );
      setListaComponentesCurriculares(lista);
      setComponentesCurricularesDisponiveis(listaComponentesDisponiveis);
      if (lista.length === 1) {
        setComponenteCurricularId(lista[0].valor);
      }

      if (turmaId === OPCAO_TODOS || componentes.data.length > 1) {
        setComponenteCurricularId(OPCAO_TODOS);
      }
    } else {
      setListaComponentesCurriculares([]);
    }
  }, [turmaId, listaTurmas]);

  useEffect(() => {
    if (codigoUe && turmaId) {
      obterComponentesCurriculares();
    } else {
      setComponenteCurricularId();
      setListaComponentesCurriculares([]);
    }
  }, [codigoUe, turmaId, obterComponentesCurriculares]);

  const obterAnosLetivos = useCallback(async () => {
    setExibirLoader(true);

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
    setExibirLoader(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoAtual, consideraHistorico]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos, consideraHistorico]);

  const obterSemestres = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await api.get(
      `v1/abrangencias/${consideraHistorico}/semestres?anoLetivo=${anoLetivo}&modalidade=${modalidadeId ||
        0}`
    );
    if (retorno && retorno.data) {
      const lista = retorno.data.map(periodo => {
        return { desc: periodo, valor: periodo };
      });

      if (lista && lista.length && lista.length === 1) {
        setSemestre(lista[0].valor);
      }
      setListaSemestres(lista);
    }
    setExibirLoader(false);
  }, [modalidadeId, anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (
      modalidadeId &&
      anoLetivo &&
      String(modalidadeId) === String(ModalidadeDTO.EJA)
    ) {
      obterSemestres();
    } else {
      setSemestre();
      setListaSemestres([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obterAnosLetivos, modalidadeId, anoLetivo, consideraHistorico]);

  const cancelar = async () => {
    await setCodigoUe();
    await setCodigoDre();
    await setTurmaId();
    await setSemestre();
    await setModalidadeId();
    await setTurmaId();
    await setComponenteCurricularId();
    await setBimestre();
    await setListarDataFutura(false);
    await setExibirDetalhamento(false);
    validarValorPadraoAnoLetivo(listaAnosLetivo);
  };

  const gerar = async () => {
    let componentesDisponiveis;
    if (componenteCurricularId !== OPCAO_TODOS) {
      componentesDisponiveis = [componenteCurricularId];
    } else {
      componentesDisponiveis = componentesCurricularesDisponiveis;
    }
    const params = {
      modalidadeTurma: modalidadeId,
      codigoDre,
      bimestre,
      codigoUe,
      anoLetivo,
      semestre,
      ano: anoLetivo,
      codigoTurma: turmaId,
      listarDataFutura,
      exibirDetalhamento,
      componenteCurricular: componenteCurricularId,
      componentesCurricularesDisponiveis: componentesDisponiveis,
    };

    setExibirLoader(true);
    setClicouBotaoGerar(true);

    const retorno = await ServicoRelatorioPlanejamentoDiario.gerar(params)
      .catch(e => erros(e))
      .finally(setExibirLoader(false));
    if (retorno && retorno.status === 200) {
      sucesso(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
      );
    }
  };

  return (
    <Loader loading={exibirLoader}>
      <Cabecalho pagina="Relatório de controle de planejamento diário">
        <BotoesAcaoRelatorio
          onClick={() => {
            history.push(URL_HOME);
          }}
          onClickCancelar={cancelar}
          onClickGerar={gerar}
          desabilitarBtnGerar={desabilitarGerar}
        />
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-2">
              <CheckboxComponent
                label="Exibir histórico?"
                onChangeCheckbox={e => {
                  setAnoLetivo();
                  setCodigoDre();
                  setConsideraHistorico(e.target.checked);
                }}
                checked={consideraHistorico}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-2 col-xl-2 mb-2">
              <SelectComponent
                id="drop-ano-letivo"
                label="Ano Letivo"
                lista={listaAnosLetivo}
                valueOption="valor"
                valueText="desc"
                disabled={listaAnosLetivo?.length === 1}
                onChange={onChangeAnoLetivo}
                valueSelect={anoLetivo}
                placeholder="Ano letivo"
              />
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5 mb-2">
              <SelectComponent
                id="drop-dre"
                label="Diretoria Regional de Educação (DRE)"
                lista={listaDres}
                valueOption="valor"
                valueText="desc"
                disabled={!anoLetivo || listaDres?.length === 1}
                onChange={onChangeDre}
                valueSelect={codigoDre}
                placeholder="Diretoria Regional De Educação (DRE)"
                showSearch
              />
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5 mb-2">
              <SelectComponent
                id="drop-ue"
                label="Unidade Escolar (UE)"
                lista={listaUes}
                valueOption="valor"
                valueText="desc"
                disabled={!codigoDre || listaUes?.length === 1}
                onChange={onChangeUe}
                valueSelect={codigoUe}
                placeholder="Unidade Escolar (UE)"
                showSearch
              />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-2">
              <SelectComponent
                id="drop-modalidade"
                label="Modalidade"
                lista={listaModalidades}
                valueOption="valor"
                valueText="desc"
                disabled={!codigoUe || listaModalidades?.length === 1}
                onChange={onChangeModalidade}
                valueSelect={modalidadeId}
                placeholder="Modalidade"
              />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-2 col-xl-4 mb-2">
              <SelectComponent
                id="drop-semestre"
                lista={listaSemestres}
                valueOption="valor"
                valueText="desc"
                label="Semestre"
                disabled={
                  !modalidadeId ||
                  listaSemestres?.length === 1 ||
                  String(modalidadeId) !== String(ModalidadeDTO.EJA)
                }
                valueSelect={semestre}
                onChange={onChangeSemestre}
                placeholder="Semestre"
              />
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6 col-xl-4 mb-2">
              <SelectComponent
                id="drop-turma"
                lista={listaTurmas}
                valueOption="valor"
                valueText="nomeFiltro"
                label="Turma"
                disabled={!modalidadeId || listaTurmas?.length === 1}
                valueSelect={turmaId}
                placeholder="Turma"
                onChange={onChangeTurma}
                showSearch
              />
            </div>
            <div className="col-sm-12 col-md-8 col-lg-8 col-xl-3  mb-2">
              <SelectComponent
                id="drop-componente-curricular"
                lista={listaComponentesCurriculares}
                valueOption="valor"
                valueText="desc"
                label="Componente curricular"
                disabled={
                  !modalidadeId || listaComponentesCurriculares?.length === 1
                }
                valueSelect={componenteCurricularId}
                onChange={onChangeComponenteCurricular}
                placeholder="Componente curricular"
              />
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4  mb-2">
              <SelectComponent
                id="drop-bimestre"
                lista={listaBimestres}
                valueOption="valor"
                valueText="desc"
                label="Bimestre"
                disabled={!modalidadeId}
                valueSelect={bimestre}
                onChange={onChangeBimestre}
                placeholder="Bimestre"
              />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-3 col-xl-2 mb-2">
              <RadioGroupButton
                id="radio-datas-futuras"
                label="Listar datas futuras"
                opcoes={opcoesRadioSimNao}
                valorInicial
                onChange={e => {
                  setListarDataFutura(e.target.value);
                  setClicouBotaoGerar(false);
                }}
                desabilitado={
                  !turmaId ||
                  turmaId === OPCAO_TODOS ||
                  bimestre === OPCAO_TODOS ||
                  !habilitarDatasFuturas
                }
                value={listarDataFutura}
              />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-3 col-xl-2 mb-2">
              <RadioGroupButton
                id="radio-exibir-detalhamento"
                label="Exibir detalhamento"
                opcoes={opcoesRadioSimNao}
                valorInicial
                onChange={e => {
                  setExibirDetalhamento(e.target.value);
                  setClicouBotaoGerar(false);
                }}
                value={exibirDetalhamento}
                desabilitado={!turmaId || turmaId === OPCAO_TODOS}
              />
            </div>
          </div>
        </div>
      </Card>
    </Loader>
  );
};

export default RelatorioPlanejamentoDiario;
