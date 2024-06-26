import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Card,
  CheckboxComponent,
  Loader,
  Localizador,
  RadioGroupButton,
  SelectComponent,
} from '~/componentes';
import { Cabecalho, FiltroHelper } from '~/componentes-sgp';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { OPCAO_TODOS } from '~/constantes';

import { tipoPendenciasGruposDto } from '~/dtos';
import {
  api,
  erros,
  sucesso,
  AbrangenciaServico,
  ServicoRelatorioPendencias,
  ServicoComponentesCurriculares,
  ServicoFiltroRelatorio,
} from '~/servicos';

import { onchangeMultiSelect } from '~/utils/funcoes/gerais';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';

const RelatorioPendencias = () => {
  const navigate = useNavigate();

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
  const [listaComponentesCurriculares, setListaComponentesCurriculares] =
    useState([]);
  const [listaBimestres, setListaBimestres] = useState([]);
  const [usuarioRf, setUsuarioRf] = useState(undefined);
  const [anoLetivo, setAnoLetivo] = useState(undefined);
  const [dreId, setDreId] = useState(undefined);
  const [ueId, setUeId] = useState(undefined);
  const [modalidadeId, setModalidadeId] = useState(undefined);
  const [semestre, setSemestre] = useState(undefined);
  const [turmaId, setTurmaId] = useState(undefined);
  const [componentesCurricularesId, setComponentesCurricularesId] =
    useState(undefined);
  const [bimestre, setBimestre] = useState(undefined);
  const [clicouBotaoGerar, setClicouBotaoGerar] = useState(false);
  const [desabilitarBtnGerar, setDesabilitarBtnGerar] = useState(true);
  const [carregandoTipoPendenciaGrupo, setCarregandoTipoPendenciaGrupo] =
    useState(false);
  const [listaTipoPendenciaGrupos, setListaTipoPendenciaGrupos] =
    useState(true);
  const [tipoPendenciaGrupo, setTipoPendenciaGrupo] = useState();
  const [exibirPendenciasResolvidas, setExibirPendenciasResolvidas] =
    useState(false);
  const [carregandoBimestres, setCarregandoBimestres] = useState(false);
  const [
    desabilitarExibirPendenciasResolvidas,
    setDesabilitarExibirPendenciasResolvidas,
  ] = useState(true);
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);

  const opcaoExibirPendenciasResolvidas = [
    { value: false, label: 'Não' },
    { value: true, label: 'Sim' },
  ];

  const ehEjaOuCelp =
    Number(modalidadeId) === ModalidadeEnum.EJA ||
    Number(modalidadeId) === ModalidadeEnum.CELP;

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
    setUsuarioRf();
    setModoEdicao(true);
  };

  const onChangeAnoLetivo = async valor => {
    setDreId();
    setUeId();
    setAnoLetivo(valor);
    limparCampos();
    setModoEdicao(true);
  };

  const onChangeDre = valor => {
    setDreId(valor);
    setUeId();
    setUeId(undefined);
    limparCampos();
    setModoEdicao(true);
  };

  const onChangeUe = valor => {
    setUeId(valor);
    limparCampos();
    setModoEdicao(true);
  };

  const onChangeModalidade = valor => {
    limparCampos();
    setModalidadeId(valor);
    setModoEdicao(true);
  };

  const onChangeSemestre = valor => {
    setSemestre(valor);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeTurma = valor => {
    setTurmaId(valor);
    setComponentesCurricularesId();
    setBimestre();
    setTipoPendenciaGrupo();
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeComponenteCurricular = valor => {
    setComponentesCurricularesId(valor);
    setBimestre();
    setTipoPendenciaGrupo();
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeBimestre = valor => {
    setBimestre(valor);
    setTipoPendenciaGrupo();
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeTipoPendenciaGrupo = valor => {
    setTipoPendenciaGrupo(valor);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeLocalizador = valores => {
    setUsuarioRf(valores?.professorRf);
    setClicouBotaoGerar(false);
  };

  const obterDres = useCallback(async () => {
    setCarregandoDres(true);
    const retorno = await AbrangenciaServico.buscarDres(
      `v1/abrangencias/${consideraHistorico}/dres?anoLetivo=${anoLetivo}`
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoDres(false));
    if (retorno?.data?.length) {
      const lista = retorno.data
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
      const { data } =
        await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(ue)
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
            lista.push({ valor: OPCAO_TODOS, nomeFiltro: 'Todas' });
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
            setTurmaId([lista[0].valor]);
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

    const anosLetivos = await FiltroHelper.obterAnosLetivos({
      consideraHistorico,
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

    setListaAnosLetivo(anosLetivos);
    setCarregandoAnos(false);
  }, [consideraHistorico, anoAtual]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const ehInfantil = Number(modalidadeId) === ModalidadeEnum.INFANTIL;

  const escolherChamadaEndpointComponeteCurricular = useCallback(
    (ueCodigo, turmas) => {
      if (ehInfantil) {
        return ServicoComponentesCurriculares.obterComponentesPorListaDeTurmas(
          turmas,
          true
        );
      }

      return ServicoComponentesCurriculares.obterComponentesPorUeTurmas(
        ueCodigo,
        turmas
      );
    },
    [ehInfantil]
  );

  const obterComponentesCurriculares = useCallback(
    async (ueCodigo, idsTurma, lista) => {
      if (idsTurma?.length > 0) {
        setCarregandoComponentesCurriculares(true);
        const ehOpcaoTodas = idsTurma.find(item => item === OPCAO_TODOS);
        const turmas = [].concat(
          ehOpcaoTodas
            ? lista.map(a => a.valor).filter(item => item !== OPCAO_TODOS)
            : idsTurma
        );
        const disciplinas = await escolherChamadaEndpointComponeteCurricular(
          ueCodigo,
          turmas
        )
          .catch(e => erros(e))
          .finally(() => setCarregandoComponentesCurriculares(false));

        if (disciplinas?.data?.length) {
          const nomeParametro = ehInfantil ? 'nome' : 'descricao';
          const listaDisciplinas = disciplinas.data.map(item => ({
            codigo: String(item.codigo),
            descricao: item[nomeParametro],
          }));

          if (listaDisciplinas?.length > 1) {
            listaDisciplinas.unshift({
              descricao: 'Todos',
              codigo: OPCAO_TODOS,
            });
          }

          if (disciplinas.data.length > 1) {
            setListaComponentesCurriculares(listaDisciplinas);
            return;
          }
          setListaComponentesCurriculares(listaDisciplinas);
          setComponentesCurricularesId(String(disciplinas?.data[0]?.codigo));
        }
        return;
      }
      setComponentesCurricularesId();
      setListaComponentesCurriculares([]);
    },
    [escolherChamadaEndpointComponeteCurricular, ehInfantil]
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
        `v1/abrangencias/${consideraHistorico}/semestres?anoLetivo=${anoLetivoSelecionado}&modalidade=${
          modalidadeSelecionada || 0
        }`
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
    if (modalidadeId && anoLetivo && ehEjaOuCelp) {
      obterSemestres(modalidadeId, anoLetivo);
      return;
    }
    setSemestre();
    setListaSemestres([]);
  }, [obterSemestres, modalidadeId, anoLetivo, ehEjaOuCelp]);

  const obterTipoPendenciaGrupo = useCallback(async () => {
    setCarregandoTipoPendenciaGrupo(true);
    const retorno = await ServicoRelatorioPendencias.obterTipoPendenciasGrupos({
      opcaoTodos: false,
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
    setComponentesCurricularesId();

    setTurmaId(undefined);
    setBimestre();
    setTipoPendenciaGrupo();
    setUsuarioRf();
    setModoEdicao(false);
  };

  useEffect(() => {
    const condicoesComuns = !anoLetivo || !dreId || !ueId || clicouBotaoGerar;

    const consideraSemestre = ehEjaOuCelp && !semestre;

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

    const condicoesFinais =
      condicoesParciaisPreenchidas && usuarioRf && condicoesParciais;

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
    ehEjaOuCelp,
  ]);

  const gerar = async () => {
    setCarregandoGerar(true);
    setClicouBotaoGerar(true);

    let componentesCurriculares = [];
    if (
      componentesCurricularesId ||
      componentesCurricularesId === 0 ||
      componentesCurricularesId === '0'
    ) {
      componentesCurriculares = [componentesCurricularesId];
    }

    const params = {
      exibirHistorico: consideraHistorico,
      anoLetivo,
      dreCodigo: dreId,
      ueCodigo: ueId,
      modalidade: modalidadeId,
      turmasCodigo: turmaId === OPCAO_TODOS ? [] : [].concat(turmaId),
      bimestre,
      componentesCurriculares,
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
      <Cabecalho pagina="Relatório de pendências">
        <BotoesAcaoRelatorio
          onClickVoltar={() => {
            navigate('/');
          }}
          onClickCancelar={cancelar}
          onClickGerar={gerar}
          desabilitarBtnGerar={desabilitarBtnGerar}
          carregandoGerar={carregandoGerar}
          temLoaderBtnGerar
          modoEdicao={modoEdicao}
        />
      </Cabecalho>
      <Card>
        <div className="col-md-12">
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
            <div className="col-sm-12 col-md-6 col-lg-2">
              <Loader loading={carregandoAnos} ignorarTip>
                <SelectComponent
                  id="drop-ano-letivo-rel-pendencias"
                  label="Ano Letivo"
                  lista={listaAnosLetivo}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    !listaAnosLetivo?.length || listaAnosLetivo?.length === 1
                  }
                  onChange={onChangeAnoLetivo}
                  valueSelect={anoLetivo}
                  placeholder="Ano letivo"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5">
              <Loader loading={carregandoDres} ignorarTip>
                <SelectComponent
                  id="drop-dre-rel-pendencias"
                  label="Diretoria Regional de Educação (DRE)"
                  lista={listaDres}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    !anoLetivo || listaDres?.length === 1 || !listaDres?.length
                  }
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
            <div className="col-sm-12 col-md-8 col-lg-4">
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
            <div className="col-sm-12 col-md-4 col-lg-4">
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
                    (Number(modalidadeId) !== ModalidadeEnum.EJA &&
                      Number(modalidadeId) !== ModalidadeEnum.CELP)
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
                  onChange={valores => {
                    onchangeMultiSelect(valores, turmaId, onChangeTurma);
                  }}
                  placeholder="Turma"
                  showSearch
                />
              </Loader>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-12 col-md-9 col-lg-4">
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
            <div className="col-sm-12 col-md-3 col-lg-4">
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
              ueId={ueId}
              rfEdicao={usuarioRf}
              anoLetivo={anoLetivo}
              showLabel
              onChange={onChangeLocalizador}
              colunasNome="4"
              buscarCaracterPartir={5}
              desabilitado={!ueId}
              buscarPorAbrangencia
            />
            <div className="col-sm-12 col-md-4 col-lg-4">
              <RadioGroupButton
                label="Exibir pendências resolvidas"
                opcoes={opcaoExibirPendenciasResolvidas}
                valorInicial
                onChange={e => {
                  setExibirPendenciasResolvidas(e.target.value);
                  setClicouBotaoGerar(false);
                  setModoEdicao(true);
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
