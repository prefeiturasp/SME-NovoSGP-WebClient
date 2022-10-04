import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Card,
  CheckboxComponent,
  Colors,
  Loader,
  RadioGroupButton,
  SelectComponent,
} from '~/componentes';
import {
  AlertaPermiteSomenteTurmaInfantil,
  Cabecalho,
  FiltroHelper,
} from '~/componentes-sgp';
import { SGP_SELECT_COMPONENTE_CURRICULAR } from '~/componentes-sgp/filtro/idsCampos';
import { ANO_INICIO_INFANTIL, OPCAO_TODOS } from '~/constantes/constantes';
import { ModalidadeDTO } from '~/dtos';
import {
  AbrangenciaServico,
  ehTurmaInfantil,
  erros,
  history,
  ServicoComponentesCurriculares,
  ServicoFiltroRelatorio,
  ServicoRelatorioDevolutivas,
  sucesso,
} from '~/servicos';

const RelatorioDevolutivas = () => {
  const [anoAtual] = useState(window.moment().format('YYYY'));
  const [anoLetivo, setAnoLetivo] = useState();
  const [bimestres, setBimestres] = useState(undefined);
  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoModalidade, setCarregandoModalidade] = useState(false);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [desabilitarGerar, setDesabilitarGerar] = useState(true);
  const [dreId, setDreId] = useState();
  const [exibirConteudoDevolutiva, setExibirConteudoDevolutiva] = useState(
    false
  );
  const [exibirLoaderGeral, setExibirLoaderGeral] = useState(false);

  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaBimestre, setListaBimestre] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaUes, setListaUes] = useState([]);

  const [modalidadeId, setModalidadeId] = useState();
  const [naoEhInfantil, setNaoEhInfantil] = useState(false);
  const [turmaId, setTurmaId] = useState();
  const [ueId, setUeId] = useState();
  const [alterouCampos, setAlterouCampos] = useState(true);
  const [recarregar, setRecarregar] = useState(false);

  const [carregandoComponentes, setCarregandoComponentes] = useState(false);
  const [
    listaComponenteCurriculares,
    setListaComponenteCurriculares,
  ] = useState();
  const [componenteCurricular, setComponenteCurricular] = useState();

  const { turmaSelecionada } = useSelector(store => store.usuario);

  const opcoesRadioSimNao = [
    { label: 'Não', value: false },
    { label: 'Sim', value: true },
  ];

  const limparFiltrosSelecionados = naolimparFiltroInicial => {
    setRecarregar(true);
    if (!naolimparFiltroInicial) {
      setConsideraHistorico(false);
      setAnoLetivo(anoAtual);
    }
    setDreId();
    setListaDres([]);
    setUeId();
    setListaUes([]);
    setListaTurmas([]);
    setTurmaId();
    setListaComponenteCurriculares([]);
    setComponenteCurricular();

    setNaoEhInfantil(false);
  };

  const onClickVoltar = () => {
    history.push('/');
  };

  const onClickCancelar = () => {
    setAnoLetivo(anoAtual);
    limparFiltrosSelecionados();
  };

  const gerar = async () => {
    setExibirLoaderGeral(true);
    setDesabilitarGerar(true);
    setAlterouCampos(false);

    const ue = listaUes.find(item => String(item.valor) === String(ueId));
    const turmasParaConsulta = [];
    if (turmaId?.length === 1 && turmaId[0] === OPCAO_TODOS) {
      turmasParaConsulta.push(turmaId[0]);
    } else {
      turmaId.forEach(codigoTurma => {
        const turma = listaTurmas.find(t => t.valor === codigoTurma);
        if (turma) {
          turmasParaConsulta.push(turma.id);
        }
      });
    }

    const params = {
      ano: anoLetivo,
      dreId,
      ueId: ue?.id,
      turmas: turmasParaConsulta,
      exibirDetalhes: exibirConteudoDevolutiva,
      componenteCurricular,
    };

    if (Number(anoLetivo) <= ANO_INICIO_INFANTIL) {
      params.bimestres = bimestres;
    }

    const retorno = await ServicoRelatorioDevolutivas.gerar(params)
      .catch(e => erros(e))
      .finally(setExibirLoaderGeral(false));
    if (retorno?.status === 200) {
      sucesso(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
      );
    }
  };

  const onCheckedConsideraHistorico = () => {
    limparFiltrosSelecionados(true);
    setConsideraHistorico(!consideraHistorico);
    setAnoLetivo(anoAtual);
  };

  const onChangeAnoLetivo = ano => {
    setAnoLetivo(ano);
    limparFiltrosSelecionados(true);
  };

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);
    let anosLetivos = [];

    const anosLetivoComHistorico = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: true,
    });
    const anosLetivoSemHistorico = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: false,
    });

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

    if (anosLetivos && anosLetivos.length) {
      const temAnoAtualNaLista = anosLetivos.find(
        item => String(item.valor) === String(anoAtual)
      );
      if (temAnoAtualNaLista) setAnoLetivo(anoAtual);
      else setAnoLetivo(anosLetivos[0].valor);
    }

    setListaAnosLetivo(anosLetivos);
    setCarregandoAnosLetivos(false);
  }, [anoAtual]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

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
        return;
      }
      setDreId(undefined);
      setListaDres([]);
    }
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (anoLetivo || recarregar) {
      obterDres();
      setRecarregar(false);
    }
  }, [anoLetivo, recarregar, obterDres]);

  const onChangeDre = dre => {
    setDreId(dre);

    setListaUes([]);
    setUeId();

    setListaTurmas([]);
    setTurmaId();

    setListaComponenteCurriculares([]);
    setComponenteCurricular();
  };

  const onChangeUe = ue => {
    setUeId(ue);

    setListaTurmas([]);
    setTurmaId();

    setListaComponenteCurriculares([]);
    setComponenteCurricular();
    if (!ue) {
      setNaoEhInfantil(false);
    }
  };

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

        setListaUes(lista);
        return;
      }
      setListaUes([]);
    }
  }, [dreId, anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (dreId) {
      obterUes();
      return;
    }
    setUeId();
    setListaUes([]);
  }, [dreId, obterUes]);

  const onChangeModalidade = valor => {
    setTurmaId();
    setModalidadeId(valor);

    setListaComponenteCurriculares([]);
    setComponenteCurricular();
  };

  const verificarAbrangencia = data => {
    const modalidadeInfatil = data.filter(
      item => String(item.valor) === String(ModalidadeDTO.INFANTIL)
    );
    if (!modalidadeInfatil.length) {
      setNaoEhInfantil(true);
    }
  };

  const obterModalidades = useCallback(async ue => {
    if (ue) {
      setCarregandoModalidade(true);
      const {
        data,
      } = await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(
        ue
      ).finally(() => setCarregandoModalidade(false));

      if (data?.length) {
        const lista = data.map(item => ({
          desc: item.descricao,
          valor: String(item.valor),
        }));

        setListaModalidades(lista);
        let naoInfantil = true;
        if (lista?.length === 1) {
          if (String(lista[0].valor) === String(ModalidadeDTO.INFANTIL)) {
            setModalidadeId(lista[0].valor);
            naoInfantil = false;
          }
          setNaoEhInfantil(naoInfantil);
          return;
        }
        verificarAbrangencia(data);
      }
    }
  }, []);

  useEffect(() => {
    if (anoLetivo && ueId) {
      obterModalidades(ueId);
      return;
    }
    setModalidadeId();
    setListaModalidades([]);
  }, [obterModalidades, anoLetivo, ueId]);

  const onChangeTurma = valor => {
    setTurmaId(valor);
    setBimestres([]);
    if (!valor?.length) {
      setListaComponenteCurriculares([]);
      setComponenteCurricular();
    }
  };

  const onchangeMultiSelect = (valores, valoreAtual, funSetarNovoValor) => {
    const opcaoTodosJaSelecionado = valoreAtual
      ? valoreAtual.includes(OPCAO_TODOS)
      : false;
    if (opcaoTodosJaSelecionado) {
      const listaSemOpcaoTodos = valores.filter(v => v !== OPCAO_TODOS);
      funSetarNovoValor(listaSemOpcaoTodos);
    } else if (valores.includes(OPCAO_TODOS)) {
      funSetarNovoValor([OPCAO_TODOS]);
    } else {
      funSetarNovoValor(valores);
    }
  };

  const obterTurmas = useCallback(async () => {
    if (dreId && ueId && modalidadeId) {
      setCarregandoTurmas(true);
      const { data } = await AbrangenciaServico.buscarTurmas(
        ueId,
        modalidadeId,
        '',
        anoLetivo,
        consideraHistorico
      ).finally(() => setCarregandoTurmas(false));
      if (data) {
        const lista = [];
        if (data.length > 1) {
          lista.push({
            desc: 'Todas',
            valor: OPCAO_TODOS,
            id: OPCAO_TODOS,
            nomeFiltro: 'Todas',
          });
        }
        data.map(item =>
          lista.push({
            desc: item.nome,
            valor: item.codigo,
            id: item.id,
            ano: item.ano,
            nomeFiltro: item.nomeFiltro,
          })
        );
        setListaTurmas(lista);
        if (lista.length === 1) {
          setTurmaId([lista[0].id]);
        }
      }
    }
  }, [ueId, dreId, consideraHistorico, anoLetivo, modalidadeId]);

  useEffect(() => {
    if (ueId && !naoEhInfantil) {
      obterTurmas();
      return;
    }
    setTurmaId();
    setListaTurmas([]);

    setListaComponenteCurriculares([]);
    setComponenteCurricular();
  }, [ueId, obterTurmas, naoEhInfantil]);

  const onChangeBimestre = valor => setBimestres(valor);

  const obterBimestres = useCallback(() => {
    const bi = [];
    bi.push({ desc: '1º', valor: 1 });
    bi.push({ desc: '2º', valor: 2 });

    if (modalidadeId !== ModalidadeDTO.EJA) {
      bi.push({ desc: '3º', valor: 3 });
      bi.push({ desc: '4º', valor: 4 });
    }

    bi.unshift({ desc: 'Todos', valor: -99 });
    setListaBimestre(bi);
  }, [modalidadeId]);

  useEffect(() => {
    if (modalidadeId) {
      obterBimestres();
      return;
    }
    setListaBimestre([]);
    setBimestres(undefined);
  }, [modalidadeId, obterBimestres]);

  useEffect(() => {
    const ehInfatil = ehTurmaInfantil(ModalidadeDTO, turmaSelecionada);
    if (Object.keys(turmaSelecionada).length) {
      setNaoEhInfantil(!ehInfatil);
      return;
    }
    setNaoEhInfantil(false);
  }, [turmaSelecionada]);

  useEffect(() => {
    const desabilitar =
      !anoLetivo ||
      !dreId ||
      !ueId ||
      !turmaId?.length ||
      !componenteCurricular ||
      !alterouCampos;

    if (Number(anoLetivo) <= ANO_INICIO_INFANTIL) {
      setDesabilitarGerar(desabilitar || !bimestres?.length);
    } else {
      setDesabilitarGerar(desabilitar);
    }
  }, [
    anoLetivo,
    dreId,
    ueId,
    turmaId,
    bimestres,
    alterouCampos,
    componenteCurricular,
  ]);

  const obterComponentesCurriculares = useCallback(async () => {
    const turmasSelOpTodos = turmaId?.find(
      codigoTurma => codigoTurma === OPCAO_TODOS
    );

    let codigosTurmas = turmaId;

    if (turmasSelOpTodos) {
      codigosTurmas = listaTurmas
        ?.filter?.(turma => turma?.valor !== OPCAO_TODOS)
        ?.map?.(t => t?.valor);
    }

    setCarregandoComponentes(true);
    const componentes = await ServicoComponentesCurriculares.obterComponentesPorListaDeTurmas(
      codigosTurmas
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoComponentes(false));

    if (componentes?.data?.length) {
      const lista = componentes.data;

      if (lista.length > 1) {
        lista.unshift({ codigo: OPCAO_TODOS, nome: 'Todos' });
      }

      setListaComponenteCurriculares(lista);
      if (lista.length === 1) {
        setComponenteCurricular(lista[0].codigo);
      }
    } else {
      setListaComponenteCurriculares([]);
    }
  }, [turmaId, listaTurmas]);

  useEffect(() => {
    if (turmaId?.length) {
      obterComponentesCurriculares();
    } else {
      setComponenteCurricular();
      setListaComponenteCurriculares([]);
    }
  }, [turmaId]);

  return (
    <Loader loading={exibirLoaderGeral}>
      {naoEhInfantil && (
        <AlertaPermiteSomenteTurmaInfantil
          marginBottom={3}
          exibir={naoEhInfantil}
        />
      )}
      <Cabecalho pagina="Relatório de devolutivas" />
      <Card>
        <div className="col-md-12 p-0">
          <div className="row mb-5">
            <div className="col-sm-12 d-flex justify-content-end">
              <Button
                id="btn-voltar"
                label="Voltar"
                icon="arrow-left"
                color={Colors.Azul}
                border
                className="mr-2"
                onClick={onClickVoltar}
              />
              <Button
                id="btn-cancelar"
                label="Cancelar"
                color={Colors.Roxo}
                border
                bold
                className="mr-2"
                onClick={onClickCancelar}
              />
              <Button
                id="btn-gerar"
                icon="print"
                label="Gerar"
                color={Colors.Azul}
                border
                bold
                className="mr-0"
                onClick={gerar}
                disabled={desabilitarGerar}
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-sm-12">
              <CheckboxComponent
                id="exibir-historico"
                label="Exibir histórico?"
                onChangeCheckbox={onCheckedConsideraHistorico}
                checked={consideraHistorico}
                disabled={naoEhInfantil}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 mb-2">
              <Loader loading={carregandoAnosLetivos} ignorarTip>
                <SelectComponent
                  id="drop-ano-letivo"
                  label="Ano Letivo"
                  lista={listaAnosLetivo}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    !consideraHistorico ||
                    naoEhInfantil ||
                    listaAnosLetivo?.length === 1
                  }
                  onChange={onChangeAnoLetivo}
                  valueSelect={anoLetivo}
                  placeholder="Ano letivo"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-5 col-xl-5 mb-2">
              <Loader loading={carregandoDres} tip="">
                <SelectComponent
                  id="dre"
                  label="Diretoria Regional de Educação (DRE)"
                  lista={listaDres}
                  valueOption="valor"
                  valueText="desc"
                  disabled={
                    naoEhInfantil || !anoLetivo || listaDres?.length === 1
                  }
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
                  id="ue"
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
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-4 mb-2">
              <Loader loading={carregandoModalidade} ignorarTip>
                <SelectComponent
                  id="drop-modalidade"
                  label="Modalidade"
                  lista={listaModalidades}
                  valueOption="valor"
                  valueText="desc"
                  disabled
                  onChange={onChangeModalidade}
                  valueSelect={modalidadeId}
                  placeholder="Modalidade"
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-8 mb-2">
              <Loader loading={carregandoTurmas} ignorarTip>
                <SelectComponent
                  multiple
                  id="turma"
                  lista={listaTurmas}
                  valueOption="valor"
                  valueText="nomeFiltro"
                  label="Turma"
                  disabled={!modalidadeId || listaTurmas?.length === 1}
                  valueSelect={turmaId}
                  onChange={valores => {
                    onchangeMultiSelect(valores, turmaId, onChangeTurma);
                  }}
                  placeholder="Turma"
                  showSearch
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-4 mb-2">
              <Loader loading={carregandoComponentes} ignorarTip>
                <SelectComponent
                  label="Componente curricular"
                  id={SGP_SELECT_COMPONENTE_CURRICULAR}
                  lista={listaComponenteCurriculares}
                  valueOption="codigo"
                  valueText="nome"
                  valueSelect={componenteCurricular}
                  onChange={valor => {
                    setComponenteCurricular(valor);
                    setAlterouCampos(true);
                  }}
                  placeholder="Selecione um componente curricular"
                  disabled={
                    !turmaId?.length ||
                    listaComponenteCurriculares?.length === 1
                  }
                />
              </Loader>
            </div>
            {Number(anoLetivo) <= ANO_INICIO_INFANTIL && (
              <div className="col-sm-12 col-md-4 mb-2">
                <SelectComponent
                  lista={listaBimestre}
                  valueOption="valor"
                  valueText="desc"
                  label="Bimestre"
                  disabled={!modalidadeId || listaBimestre?.length === 1}
                  valueSelect={bimestres}
                  multiple
                  onChange={valores => {
                    setAlterouCampos(true);
                    onchangeMultiSelect(valores, bimestres, onChangeBimestre);
                  }}
                  placeholder="Selecione o bimestre"
                />
              </div>
            )}
            <div className="col-sm-12 col-md-4 mb-2">
              <RadioGroupButton
                label="Exibir conteúdo da devolutiva"
                opcoes={opcoesRadioSimNao}
                valorInicial
                onChange={e => {
                  setAlterouCampos(true);
                  setExibirConteudoDevolutiva(e.target.value);
                }}
                value={exibirConteudoDevolutiva}
                desabilitado={!dreId || !ueId || !turmaId || !bimestres}
              />
            </div>
          </div>
        </div>
      </Card>
    </Loader>
  );
};

export default RelatorioDevolutivas;
