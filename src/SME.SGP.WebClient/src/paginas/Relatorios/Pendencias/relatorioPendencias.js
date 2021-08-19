import React, { useCallback, useEffect, useState } from 'react';

import {
  Button,
  Card,
  CheckboxComponent,
  Colors,
  Loader,
  Localizador,
  RadioGroupButton,
  SelectComponent,
} from '~/componentes';
import { Cabecalho, FiltroHelper } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes';

import { ModalidadeDTO, tipoPendenciasGruposDto } from '~/dtos';
import {
  api,
  history,
  erros,
  sucesso,
  AbrangenciaServico,
  ServicoRelatorioPendencias,
  ServicoComponentesCurriculares,
  ServicoFiltroRelatorio,
} from '~/servicos';

import {
  onchangeMultiSelect,
  ordenarListaMaiorParaMenor,
} from '~/utils/funcoes/gerais';

const RelatorioPendencias = () => {
  const [anoAtual] = useState(window.moment().format('YYYY'));
  const [carregandoGerar, setCarregandoGerar] = useState(false);
  const [carregandoAnos, setCarregandoAnos] = useState(false);
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [listaDres, setListaDres] = useState([]);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [listaUes, setListaUes] = useState([]);
  const [carregandoModalidades, setCarregandoModalidades] = useState(false);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [
    carregandoComponentesCurriculares,
    setCarregandoComponentesCurriculares,
  ] = useState(false);
  const [
    listaComponentesCurriculares,
    setListaComponentesCurriculares,
  ] = useState([]);
  const [listaBimestres, setListaBimestres] = useState([]);
  const [usuarioRf, setUsuarioRf] = useState(undefined);
  const [anoLetivo, setAnoLetivo] = useState(undefined);
  const [dreId, setDreId] = useState(undefined);
  const [ueId, setUeId] = useState(undefined);
  const [modalidadeId, setModalidadeId] = useState(undefined);
  const [semestre, setSemestre] = useState(undefined);
  const [turmaId, setTurmaId] = useState(undefined);
  const [componentesCurricularesId, setComponentesCurricularesId] = useState(
    undefined
  );
  const [bimestre, setBimestre] = useState(undefined);
  const [clicouBotaoGerar, setClicouBotaoGerar] = useState(false);
  const [desabilitarBtnGerar, setDesabilitarBtnGerar] = useState(true);
  const [
    carregandoTipoPendenciaGrupo,
    setCarregandoTipoPendenciaGrupo,
  ] = useState(false);
  const [listaTipoPendenciaGrupos, setListaTipoPendenciaGrupos] = useState(
    true
  );
  const [tipoPendenciaGrupo, setTipoPendenciaGrupo] = useState();
  const [exibirPendenciasResolvidas, setExibirPendenciasResolvidas] = useState(
    false
  );
  const [carregandoBimestres, setCarregandoBimestres] = useState(false);
  const [
    desabilitarExibirPendenciasResolvidas,
    setDesabilitarExibirPendenciasResolvidas,
  ] = useState(true);
  const [consideraHistorico, setConsideraHistorico] = useState(false);

  const opcaoExibirPendenciasResolvidas = [
    { value: false, label: 'Não' },
    { value: true, label: 'Sim' },
  ];
  const limparCampos = () => {
    setModalidadeId();
    setTurmaId();
    setComponentesCurricularesId();
    setBimestre();
    setTipoPendenciaGrupo();
    setClicouBotaoGerar(false);
  };

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
    setAnoLetivo(anoAtual);
    setDreId();
    setUeId();
  };

  const onChangeAnoLetivo = async valor => {
    setDreId();
    setUeId();
    setAnoLetivo(valor);
    limparCampos();
  };

  const onChangeDre = valor => {
    setDreId(valor);
    setUeId();
    setUeId(undefined);
    limparCampos();
  };

  const onChangeUe = valor => {
    setUeId(valor);
    limparCampos();
  };

  const onChangeModalidade = valor => {
    limparCampos();
    setModalidadeId(valor);
  };

  const onChangeSemestre = valor => {
    setSemestre(valor);
    setClicouBotaoGerar(false);
  };

  const onChangeTurma = valor => {
    setComponentesCurricularesId();
    setTurmaId(valor);
    setClicouBotaoGerar(false);
  };

  const onChangeComponenteCurricular = valor => {
    setComponentesCurricularesId([valor]);
    setClicouBotaoGerar(false);
  };

  const onChangeBimestre = valor => {
    setBimestre(valor);
    setClicouBotaoGerar(false);
  };

  const onChangeTipoPendenciaGrupo = valor => {
    setTipoPendenciaGrupo(valor);
    setClicouBotaoGerar(false);
  };

  const onChangeLocalizador = valores => {
    setUsuarioRf(valores?.professorRf);
    setClicouBotaoGerar(false);
  };

  const obterDres = useCallback(async () => {
    setCarregandoDres(true);
    const { data } = await AbrangenciaServico.buscarDres(
      `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoDres(false));
    if (data?.length) {
      const lista = data
        .map(item => ({
          desc: item.nome,
          valor: String(item.codigo),
          abrev: item.abreviacao,
        }))
        .sort(FiltroHelper.ordenarLista('desc'));
      setListaDres(lista);

      if (lista?.length === 1) {
        setDreId(lista[0].valor);
      }
      return;
    }
    setListaDres([]);
    setDreId(undefined);
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    }
  }, [obterDres, anoLetivo]);

  const obterUes = useCallback(
    async (dre, ano) => {
      if (dre) {
        setCarregandoUes(true);
        const { data } = await AbrangenciaServico.buscarUes(
          dre,
          `v1/abrangencias/${consideraHistorico}/dres/${dre}/ues?anoLetivo=${ano}`,
          true
        )
          .catch(e => erros(e))
          .finally(() => setCarregandoUes(false));
        if (data) {
          const lista = data.map(item => ({
            desc: item.nome,
            valor: String(item.codigo),
          }));

          if (lista?.length === 1) {
            setUeId(lista[0].valor);
          }

          setListaUes(lista);
          return;
        }
        setListaUes([]);
      }
    },
    [consideraHistorico]
  );

  useEffect(() => {
    if (dreId) {
      obterUes(dreId, anoLetivo);
      return;
    }
    setUeId();
    setListaUes([]);
  }, [dreId, anoLetivo, obterUes]);

  const obterModalidades = async (ue, ano) => {
    if (ue && ano) {
      setCarregandoModalidades(true);
      const {
        data,
      } = await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(ue)
        .catch(e => erros(e))
        .finally(() => setCarregandoModalidades(false));

      if (data) {
        const lista = data.map(item => ({
          desc: item.descricao,
          valor: String(item.valor),
        }));

        if (lista?.length === 1) {
          setModalidadeId(lista[0].valor);
        }
        setListaModalidades(lista);
      }
    }
  };

  useEffect(() => {
    if (anoLetivo && ueId) {
      obterModalidades(ueId, anoLetivo);
      return;
    }
    setModalidadeId();
    setListaModalidades([]);
  }, [anoLetivo, ueId]);

  const obterTurmas = useCallback(
    async (modalidadeSelecionada, ue, ano) => {
      if (ue && modalidadeSelecionada) {
        setCarregandoTurmas(true);
        const { data } = await AbrangenciaServico.buscarTurmas(
          ue,
          modalidadeSelecionada,
          '',
          ano,
          consideraHistorico
        )
          .catch(e => erros(e))
          .finally(() => setCarregandoTurmas(false));

        if (data) {
          const lista = [];
          if (data.length > 1) {
            lista.push({ valor: '0', nomeFiltro: 'Todas' });
          }
          data.map(item =>
            lista.push({
              desc: item.nome,
              valor: item.codigo,
              nomeFiltro: item.nomeFiltro,
            })
          );
          setListaTurmas(lista);
          if (lista.length === 1) {
            setTurmaId(lista[0].valor);
          }
        }
      }
    },
    [consideraHistorico]
  );

  useEffect(() => {
    if (modalidadeId && ueId) {
      obterTurmas(modalidadeId, ueId, anoLetivo);
      return;
    }
    setTurmaId();
    setListaTurmas([]);
  }, [modalidadeId, ueId, anoLetivo, obterTurmas]);

  const obterBimestres = useCallback(async () => {
    setCarregandoBimestres(true);
    const retorno = await ServicoFiltroRelatorio.obterBimestres({
      modalidadeId,
      opcaoTodos: true,
    })
      .catch(e => erros(e))
      .finally(setCarregandoBimestres(false));

    const lista = retorno?.data
      ? retorno.data.map(item => ({
          desc: item.descricao,
          valor: item.valor,
        }))
      : [];
    setListaBimestres(lista);
  }, [modalidadeId]);

  useEffect(() => {
    if (modalidadeId) {
      obterBimestres();
      return;
    }
    setListaBimestres([]);
    setBimestre(undefined);
  }, [modalidadeId, obterBimestres]);

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnos(true);
    let anosLetivos = [];

    const [anosLetivoComHistorico, anosLetivoSemHistorico] = await Promise.all([
      FiltroHelper.obterAnosLetivos({
        consideraHistorico: true,
      }),
      FiltroHelper.obterAnosLetivos({
        consideraHistorico: false,
      }),
    ])
      .catch(e => erros(e))
      .finally(() => setCarregandoAnos(false));
    anosLetivos = anosLetivos.concat(anosLetivoComHistorico);

    anosLetivoSemHistorico.forEach(ano => {
      if (!anosLetivoComHistorico.find(a => a.valor === ano.valor)) {
        anosLetivos.push(ano);
      }
    });

    if (!anosLetivos.length) {
      anosLetivos.push({
        desc: anoAtual,
        valor: anoAtual,
      });
    }

    if (anosLetivos?.length) {
      const temAnoAtualNaLista = anosLetivos.find(
        item => String(item.valor) === String(anoAtual)
      );
      if (temAnoAtualNaLista) setAnoLetivo(anoAtual);
      else setAnoLetivo(anosLetivos[0].valor);
    }

    setListaAnosLetivo(ordenarListaMaiorParaMenor(anosLetivos, 'valor'));
  }, [anoAtual]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const obterComponentesCurriculares = useCallback(
    async (ueCodigo, idsTurma, lista) => {
      if (idsTurma?.length > 0) {
        setCarregandoComponentesCurriculares(true);
        const turmas = [].concat(
          idsTurma[0] === '0'
            ? lista.map(a => a.valor).filter(a => a !== '0')
            : idsTurma
        );
        const disciplinas = await ServicoComponentesCurriculares.obterComponentesPorUeTurmas(
          ueCodigo,
          turmas
        ).catch(e => erros(e));
        let componentesCurriculares = [];
        componentesCurriculares.push({
          codigo: '0',
          descricao: 'Todos',
        });

        if (disciplinas && disciplinas.data && disciplinas.data.length) {
          if (disciplinas.data.length > 1) {
            componentesCurriculares = componentesCurriculares.concat(
              disciplinas.data
            );
            setListaComponentesCurriculares(componentesCurriculares);
          } else {
            setListaComponentesCurriculares(disciplinas.data);
          }
        } else {
          setListaComponentesCurriculares([]);
        }
        setCarregandoComponentesCurriculares(false);
      } else {
        setComponentesCurricularesId(undefined);
        setListaComponentesCurriculares([]);
      }
    },
    []
  );

  useEffect(() => {
    if (ueId && turmaId && listaTurmas) {
      obterComponentesCurriculares(ueId, turmaId, listaTurmas);
    }
  }, [ueId, turmaId, listaTurmas, obterComponentesCurriculares]);

  const obterSemestres = useCallback(
    async (modalidadeSelecionada, anoLetivoSelecionado) => {
      setCarregandoSemestres(true);
      const retorno = await api.get(
        `v1/abrangencias/${consideraHistorico}/semestres?anoLetivo=${anoLetivoSelecionado}&modalidade=${modalidadeSelecionada ||
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
      setCarregandoSemestres(false);
    },
    [consideraHistorico]
  );

  useEffect(() => {
    if (
      modalidadeId &&
      anoLetivo &&
      String(modalidadeId) === String(ModalidadeDTO.EJA)
    ) {
      obterSemestres(modalidadeId, anoLetivo);
      return;
    }
    setSemestre();
    setListaSemestres([]);
  }, [obterSemestres, modalidadeId, anoLetivo]);

  const obterTipoPendenciaGrupo = useCallback(async () => {
    setCarregandoTipoPendenciaGrupo(true);
    const retorno = await ServicoRelatorioPendencias.obterTipoPendenciasGrupos({
      opcaoTodos: true,
    })
      .catch(e => erros(e))
      .finally(() => setCarregandoTipoPendenciaGrupo(false));
    const dados = retorno?.data?.length ? retorno?.data : [];
    setListaTipoPendenciaGrupos(dados);
  }, []);

  useEffect(() => {
    if (dreId && ueId) {
      obterTipoPendenciaGrupo();
      return;
    }
    setTipoPendenciaGrupo();
    setListaTipoPendenciaGrupos([]);
  }, [obterTipoPendenciaGrupo, dreId, ueId]);

  useEffect(() => {
    const ehTodosTipoPendenciaGrupos = tipoPendenciaGrupo?.find(
      item => item === OPCAO_TODOS
    );
    const ehTipoPendenciaGruposFechamento = tipoPendenciaGrupo?.find(
      item => item === tipoPendenciasGruposDto.FECHAMENTO.toString()
    );
    if (ehTipoPendenciaGruposFechamento || ehTodosTipoPendenciaGrupos) {
      setDesabilitarExibirPendenciasResolvidas(false);
      return;
    }
    setDesabilitarExibirPendenciasResolvidas(true);
    setExibirPendenciasResolvidas(false);
  }, [tipoPendenciaGrupo]);

  const cancelar = () => {
    setAnoLetivo(anoAtual);
    if (dreId) {
      obterDres();
      setDreId();
      setListaDres([]);
    }

    setUeId();
    setListaUes([]);

    setModalidadeId();
    setComponentesCurricularesId(undefined);

    setTurmaId(undefined);
    setBimestre();
    setTipoPendenciaGrupo();
    setUsuarioRf();
  };

  useEffect(() => {
    const condicoesComuns =
      !anoLetivo ||
      !dreId ||
      !ueId ||
      !tipoPendenciaGrupo?.length ||
      clicouBotaoGerar;

    const temModalidadeEja = String(modalidadeId) === String(ModalidadeDTO.EJA);
    const consideraSemestre = temModalidadeEja && !semestre;

    const condicoesParciais =
      !modalidadeId ||
      consideraSemestre ||
      !turmaId?.length ||
      !componentesCurricularesId ||
      !bimestre;

    const condicoesParciaisPreenchidas =
      modalidadeId ||
      consideraSemestre ||
      turmaId?.length ||
      componentesCurricularesId ||
      bimestre;

    const condicoes = usuarioRf ? !condicoesParciais : condicoesParciais;

    const condicoesFinais =
      condicoesParciaisPreenchidas && usuarioRf ? !usuarioRf : condicoes;

    const desabilitar = condicoesComuns || condicoesFinais;

    setDesabilitarBtnGerar(desabilitar);
  }, [
    anoLetivo,
    dreId,
    ueId,
    modalidadeId,
    turmaId,
    semestre,
    componentesCurricularesId,
    bimestre,
    tipoPendenciaGrupo,
    usuarioRf,
    clicouBotaoGerar,
  ]);

  const gerar = async () => {
    setCarregandoGerar(true);
    setClicouBotaoGerar(true);

    const params = {
      anoLetivo,
      dreCodigo: dreId,
      ueCodigo: ueId,
      modalidade: modalidadeId,
      turmasCodigo: turmaId === '0' ? [] : [].concat(turmaId),
      bimestre,
      componentesCurriculares:
        componentesCurricularesId?.length === 1 &&
        componentesCurricularesId[0] === '0'
          ? []
          : componentesCurricularesId,
      semestre,
      usuarioRf,
      exibirPendenciasResolvidas,
      tipoPendenciaGrupo,
    };
    await ServicoRelatorioPendencias.gerar(params)
      .then(() => {
        sucesso(
          'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
        );
      })
      .catch(e => erros(e))
      .finally(setCarregandoGerar(false));
  };

  return (
    <>
      <Cabecalho pagina="Relatório de pendências" classes="mb-2" />
      <Card>
        <div className="col-md-12 p-0">
          <div className="row mb-3 pb-4">
            <div className="col-md-12 d-flex justify-content-end justify-itens-end">
              <Button
                id="btn-voltar-rel-pendencias"
                label="Voltar"
                icon="arrow-left"
                color={Colors.Azul}
                border
                className="mr-2"
                onClick={() => {
                  history.push('/');
                }}
              />
              <Button
                id="btn-cancelar-rel-pendencias"
                label="Cancelar"
                color={Colors.Azul}
                border
                bold
                className="mr-2"
                onClick={cancelar}
              />
              <Loader
                loading={carregandoGerar}
                className="d-flex w-auto"
                tip=""
              >
                <Button
                  id="btn-gerar-rel-pendencias"
                  icon="print"
                  label="Gerar"
                  color={Colors.Roxo}
                  bold
                  className="mr-0"
                  onClick={gerar}
                  disabled={desabilitarBtnGerar}
                />
              </Loader>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-12">
              <CheckboxComponent
                label="Exibir histórico?"
                onChangeCheckbox={onChangeConsideraHistorico}
                checked={consideraHistorico}
                disabled={listaAnosLetivo.length === 1}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-12 col-md-6 col-lg-2 pr-0">
              <Loader loading={carregandoAnos} ignorarTip>
                <SelectComponent
                  id="drop-ano-letivo-rel-pendencias"
                  label="Ano Letivo"
                  lista={listaAnosLetivo}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    !consideraHistorico ||
                    !listaAnosLetivo?.length ||
                    listaAnosLetivo?.length === 1
                  }
                  onChange={onChangeAnoLetivo}
                  valueSelect={anoLetivo}
                  placeholder="Ano letivo"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 pr-0">
              <Loader loading={carregandoDres} ignorarTip>
                <SelectComponent
                  id="drop-dre-rel-pendencias"
                  label="Diretoria Regional de Educação (DRE)"
                  lista={listaDres}
                  valueOption="valor"
                  valueText="desc"
                  disabled={!anoLetivo || (listaDres && listaDres.length === 1)}
                  onChange={onChangeDre}
                  valueSelect={dreId}
                  placeholder="Diretoria Regional De Educação (DRE)"
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5">
              <Loader loading={carregandoUes} ignorarTip>
                <SelectComponent
                  id="drop-ue-rel-pendencias"
                  label="Unidade Escolar (UE)"
                  lista={listaUes}
                  valueOption="valor"
                  valueText="desc"
                  disabled={!dreId || (listaUes && listaUes.length === 1)}
                  onChange={onChangeUe}
                  valueSelect={ueId}
                  placeholder="Unidade Escolar (UE)"
                  showSearch
                />
              </Loader>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-12 col-md-8 col-lg-4 pr-0">
              <Loader loading={carregandoModalidades} ignorarTip>
                <SelectComponent
                  id="drop-modalidade-rel-pendencias"
                  label="Modalidade"
                  lista={listaModalidades}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    !ueId || (listaModalidades && listaModalidades.length === 1)
                  }
                  onChange={onChangeModalidade}
                  valueSelect={modalidadeId}
                  placeholder="Modalidade"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4 pr-0">
              <Loader loading={carregandoSemestres} ignorarTip>
                <SelectComponent
                  id="drop-semestre-rel-pendencias"
                  lista={listaSemestres}
                  valueOption="valor"
                  valueText="desc"
                  label="Semestre"
                  disabled={
                    !modalidadeId ||
                    (listaSemestres && listaSemestres.length === 1) ||
                    String(modalidadeId) !== String(ModalidadeDTO.EJA)
                  }
                  valueSelect={semestre}
                  onChange={onChangeSemestre}
                  placeholder="Semestre"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-4">
              <Loader loading={carregandoTurmas} ignorarTip>
                <SelectComponent
                  id="drop-turma-rel-pendencias"
                  lista={listaTurmas}
                  valueOption="valor"
                  valueText="nomeFiltro"
                  label="Turma"
                  disabled={
                    !modalidadeId || (listaTurmas && listaTurmas.length === 1)
                  }
                  multiple
                  valueSelect={turmaId}
                  onChange={valor => {
                    if (valor.includes('0')) {
                      onChangeTurma('0');
                    } else {
                      onChangeTurma(valor);
                    }
                  }}
                  placeholder="Turma"
                  showSearch
                />
              </Loader>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-12 col-md-9 col-lg-4 pr-0">
              <Loader loading={carregandoComponentesCurriculares} ignorarTip>
                <SelectComponent
                  id="drop-componente-curricular-rel-pendencias"
                  lista={listaComponentesCurriculares}
                  valueOption="codigo"
                  valueText="descricao"
                  label="Componente curricular"
                  disabled={
                    !modalidadeId || listaComponentesCurriculares?.length === 1
                  }
                  valueSelect={componentesCurricularesId}
                  onChange={onChangeComponenteCurricular}
                  placeholder="Componente curricular"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-3 col-lg-4 pr-0">
              <Loader loading={carregandoBimestres} ignorarTip>
                <SelectComponent
                  id="drop-bimestre-rel-pendencias"
                  lista={listaBimestres}
                  valueOption="valor"
                  valueText="desc"
                  label="Bimestre"
                  disabled={!modalidadeId}
                  valueSelect={bimestre}
                  onChange={onChangeBimestre}
                  placeholder="Bimestre"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4">
              <Loader loading={carregandoTipoPendenciaGrupo} ignorarTip>
                <SelectComponent
                  multiple
                  label="Tipo de pendência"
                  placeholder="Pendência"
                  lista={listaTipoPendenciaGrupos}
                  disabled={!ueId}
                  valueOption="valor"
                  valueText="descricao"
                  valueSelect={tipoPendenciaGrupo}
                  onChange={valores => {
                    onchangeMultiSelect(
                      valores,
                      tipoPendenciaGrupo,
                      onChangeTipoPendenciaGrupo
                    );
                  }}
                />
              </Loader>
            </div>
          </div>
          <div className="row">
            <Localizador
              classesRF="pr-0"
              dreId={dreId}
              rfEdicao={usuarioRf}
              anoLetivo={anoLetivo}
              showLabel
              onChange={onChangeLocalizador}
              buscarOutrosCargos
              colunasNome="4"
              buscarCaracterPartir={5}
              desabilitado={!ueId}
            />
            <div className="col-sm-12 col-md-4 col-lg-4">
              <RadioGroupButton
                label="Exibir pendências resolvidas"
                opcoes={opcaoExibirPendenciasResolvidas}
                valorInicial
                onChange={e => {
                  setExibirPendenciasResolvidas(e.target.value);
                  setClicouBotaoGerar(false);
                }}
                value={exibirPendenciasResolvidas}
                desabilitado={desabilitarExibirPendenciasResolvidas}
              />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default RelatorioPendencias;
