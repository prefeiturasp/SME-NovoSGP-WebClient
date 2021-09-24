import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useSelector } from 'react-redux';

import {
  Loader,
  Card,
  Button,
  Colors,
  CheckboxComponent,
  SelectComponent,
  RadioGroupButton,
} from '~/componentes';
import {
  AlertaModalidadeInfantil,
  Cabecalho,
  FiltroHelper,
} from '~/componentes-sgp';

import { OPCAO_TODOS } from '~/constantes/constantes';
import {
  ModalidadeDTO,
  statusAcompanhamentoConselhoClasse,
  statusAcompanhamentoFechamento,
} from '~/dtos';
import modalidadeDTO from '~/dtos/modalidade';
import { onchangeMultiSelect } from '~/utils';

import {
  AbrangenciaServico,
  ehTurmaInfantil,
  erros,
  history,
  ServicoRelatorioAcompanhamentoFechamento,
  ServicoFiltroRelatorio,
  sucesso,
} from '~/servicos';

const AcompanhamentoFechamento = () => {
  const [anoAtual] = useState(window.moment().format('YYYY'));
  const [anoLetivo, setAnoLetivo] = useState();
  const [bimestres, setBimestres] = useState();
  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoBimestres, setCarregandoBimestres] = useState(false);
  const [carregandoGeral, setCarregandoGeral] = useState(false);
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [desabilitarGerar, setDesabilitarGerar] = useState(true);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoModalidade, setCarregandoModalidade] = useState(false);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [
    carregandoSituacaoConselhoClasse,
    setCarregandoSituacaoConselhoClasse,
  ] = useState(false);
  const [
    carregandoSituacaoFechamento,
    setCarregandoSituacaoFechamento,
  ] = useState(false);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [clicouBotaoGerar, setClicouBotaoGerar] = useState(false);
  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [dreCodigo, setDreCodigo] = useState();
  const [escolheuModalidadeInfantil, setEscolheuModalidadeInfantil] = useState(
    false
  );
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaBimestres, setListaBimestres] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [listaTurmasPorSemestre, setListaTurmasPorSemestre] = useState([]);
  const [listaSituacaoFechamento, setListaSituacaoFechamento] = useState([]);
  const [
    listaSituacaoConselhoClasse,
    setListaSituacaoConselhoClasse,
  ] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [modalidade, setModalidade] = useState();
  const [semestre, setSemestre] = useState();
  const [situacaoConselhoClasse, setSituacaoConselhoClasse] = useState();
  const [situacaoFechamento, setSituacaoFechamento] = useState();
  const [turmasCodigo, setTurmasCodigo] = useState('');
  const [ueCodigo, setUeCodigo] = useState();
  const [listarPendencias, setListarPendencias] = useState(false);
  const [
    desabilitarListarPendencias,
    setDesabilitarListarPendencias,
  ] = useState(true);

  const OPCAO_TODAS = useMemo(
    () => ({ valor: OPCAO_TODOS, desc: 'Todas' }),
    []
  );

  const opcoesRadioSimNao = [
    { label: 'Não', value: false },
    { label: 'Sim', value: true },
  ];

  const desabilitarCampoSituacao = dreCodigo === OPCAO_TODOS;

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const limparCampos = (limparDre = false, limparUe = false) => {
    setListaModalidades([]);
    setModalidade();

    setListaSemestres([]);
    setSemestre();
    setListaTurmasPorSemestre({});

    setListaTurmas([]);
    setTurmasCodigo();

    setSituacaoFechamento(undefined);

    setSituacaoConselhoClasse(undefined);

    setListarPendencias(false);

    if (limparDre) {
      setDreCodigo();
    }

    if (limparUe) {
      setListaUes([]);
      setUeCodigo();
    }
  };

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
    setAnoLetivo(anoAtual);
    limparCampos(true, true);
  };

  const onChangeAnoLetivo = ano => {
    setAnoLetivo(ano);
    limparCampos(true, true);
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

  const onChangeDre = dre => {
    setDreCodigo(dre);
    limparCampos(false, true);
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
            valor: item.codigo,
            abrev: item.abreviacao,
            id: item.id,
          }))
          .sort(FiltroHelper.ordenarLista('desc'));

        if (lista?.length === 1) {
          setDreCodigo(lista[0].valor);
        }
        setListaDres(lista);
        return;
      }
      setDreCodigo(undefined);
      setListaDres([]);
    }
  }, [anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (anoLetivo) {
      obterDres();
    }
  }, [anoLetivo, obterDres]);

  const onChangeUe = ue => {
    setUeCodigo(ue);
    limparCampos();

    const ueSelecionada = listaUes?.find(item => item.valor === ue);
    setEscolheuModalidadeInfantil(ueSelecionada?.ehInfantil);
  };

  const obterUes = useCallback(async () => {
    const OPCAO_TODAS_UE = {
      desc: 'Todas',
      valor: '-99',
      id: 0,
      ehInfantil: false,
    };
    if (anoLetivo && dreCodigo) {
      setCarregandoUes(true);
      const resposta = await AbrangenciaServico.buscarUes(
        dreCodigo,
        `v1/abrangencias/${consideraHistorico}/dres/${dreCodigo}/ues?anoLetivo=${anoLetivo}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoUes(false));

      if (resposta?.data) {
        const lista = resposta.data.map(item => ({
          desc: item.nome,
          valor: String(item.codigo),
          id: item.id,
          ehInfantil: item.ehInfantil,
        }));

        if (lista?.length === 1) {
          setUeCodigo(lista[0].valor);
        } else {
          lista.unshift(OPCAO_TODAS_UE);
        }

        setListaUes(lista);
        return;
      }
    }
    setListaUes([]);
  }, [dreCodigo, anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (dreCodigo) {
      obterUes();
      return;
    }
    setListaUes([]);
  }, [dreCodigo, obterUes]);

  const onChangeModalidade = valor => {
    setTurmasCodigo();
    setModalidade(valor);
    setBimestres(undefined);
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
        const lista = data
          .map(item => ({
            desc: item.descricao,
            valor: String(item.valor),
          }))
          .filter(
            item => String(item.valor) !== String(modalidadeDTO.INFANTIL)
          );

        setListaModalidades(lista);
        if (lista?.length === 1) {
          setModalidade(lista[0].valor);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (anoLetivo && ueCodigo && !escolheuModalidadeInfantil) {
      obterModalidades(ueCodigo);
      return;
    }
    setModalidade();
    setListaModalidades([]);
  }, [obterModalidades, anoLetivo, ueCodigo, escolheuModalidadeInfantil]);

  const onChangeSemestre = valor => {
    setSemestre(valor);
    setClicouBotaoGerar(false);
  };

  const obterSemestres = useCallback(
    async (modalidadeSelecionada, anoLetivoSelecionado, ue) => {
      setCarregandoSemestres(true);

      const [primeiroSemestre, segundoSemestre] = await Promise.all([
        AbrangenciaServico.buscarTurmas(
          ue,
          modalidadeSelecionada,
          1,
          anoLetivoSelecionado,
          consideraHistorico,
          false
        ),
        AbrangenciaServico.buscarTurmas(
          ue,
          modalidadeSelecionada,
          2,
          anoLetivoSelecionado,
          consideraHistorico,
          false
        ),
      ])
        .catch(e => erros(e))
        .finally(() => setCarregandoSemestres(false));

      const lista = [];
      const listaTurmasSemestre = {};

      if (primeiroSemestre?.data?.length) {
        lista.push({ desc: 1, valor: 1 });
        listaTurmasSemestre[1] = primeiroSemestre.data;
      }

      if (segundoSemestre?.data?.length) {
        lista.push({ desc: 2, valor: 2 });
        listaTurmasSemestre[2] = segundoSemestre.data;
      }

      if (lista?.length === 1) {
        setSemestre(lista[0].valor);
      }

      setListaSemestres(lista);
      setListaTurmasPorSemestre(listaTurmasSemestre);
    },
    [consideraHistorico]
  );

  const obterSemestresEja = useCallback(
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
        const lista = retorno.data.map(periodo => {
          return { desc: periodo, valor: periodo };
        });

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
      modalidade &&
      anoLetivo &&
      String(modalidade) === String(ModalidadeDTO.EJA)
    ) {
      if (ueCodigo === OPCAO_TODOS) {
        obterSemestresEja(modalidade, anoLetivo);
        return;
      }
      obterSemestres(modalidade, anoLetivo, ueCodigo);
      return;
    }
    setSemestre();
    setListaSemestres([]);
  }, [
    obterAnosLetivos,
    obterSemestres,
    obterSemestresEja,
    modalidade,
    ueCodigo,
    anoLetivo,
  ]);

  const onChangeTurma = valor => {
    setTurmasCodigo(valor);
    setBimestres(undefined);
    setClicouBotaoGerar(false);
  };

  const obterTurmasEJA = useCallback(
    async (semestreSelecionado, listaTurmasPorSemestreSelecionada) => {
      if (
        Object.keys(listaTurmasPorSemestreSelecionada)?.length &&
        semestreSelecionado
      ) {
        const lista = listaTurmasPorSemestreSelecionada[
          semestreSelecionado
        ].map(item => ({
          desc: item.nome,
          valor: item.codigo,
          nomeFiltro: item.nomeFiltro,
        }));
        lista.unshift({ nomeFiltro: 'Todas', valor: OPCAO_TODOS });

        setListaTurmas(lista);

        if (lista?.length === 1) {
          setTurmasCodigo(lista[0].valor);
        }
        return;
      }
      setListaTurmas([]);
      setListaTurmasPorSemestre({});
    },
    []
  );

  const obterTurmas = useCallback(
    async OPCAO_TODAS_TURMA => {
      if (dreCodigo && ueCodigo && modalidade) {
        setCarregandoTurmas(true);
        const retorno = await AbrangenciaServico.buscarTurmas(
          ueCodigo,
          modalidade,
          '',
          anoLetivo,
          consideraHistorico,
          false
        )
          .catch(e => erros(e))
          .finally(() => setCarregandoTurmas(false));

        if (retorno?.data?.length) {
          const lista = retorno.data.map(item => ({
            desc: item.nome,
            valor: item.codigo,
            id: item.id,
            ano: item.ano,
            nomeFiltro: item.nomeFiltro,
          }));

          if (lista.length === 1) {
            setTurmasCodigo([String(lista[0].valor)]);
          } else {
            lista.unshift(OPCAO_TODAS_TURMA);
          }

          setListaTurmas(lista);
        }
      }
    },
    [dreCodigo, ueCodigo, consideraHistorico, anoLetivo, modalidade]
  );

  useEffect(() => {
    const temModalidadeEja = Number(modalidade) === ModalidadeDTO.EJA;
    const OPCAO_TODAS_TURMA = { valor: OPCAO_TODOS, nomeFiltro: 'Todas' };
    if (ueCodigo === OPCAO_TODOS) {
      setListaTurmas([OPCAO_TODAS_TURMA]);
      setTurmasCodigo([OPCAO_TODAS_TURMA.valor]);
      return;
    }
    if (modalidade && ueCodigo && !temModalidadeEja) {
      obterTurmas(OPCAO_TODAS_TURMA);
      return;
    }
    if (
      modalidade &&
      ueCodigo &&
      temModalidadeEja &&
      Object.keys(listaTurmasPorSemestre)?.length &&
      semestre
    ) {
      obterTurmasEJA(semestre, listaTurmasPorSemestre);
    }
  }, [
    modalidade,
    ueCodigo,
    semestre,
    listaTurmasPorSemestre,
    obterTurmasEJA,
    obterTurmas,
  ]);

  const onChangeBimestre = valor => {
    setBimestres(valor);
    setClicouBotaoGerar(false);
  };

  const obterBimestres = useCallback(async () => {
    setCarregandoBimestres(true);
    const retorno = await ServicoFiltroRelatorio.obterBimestres({
      modalidadeId: modalidade,
      opcaoTodos: true,
      opcaoFinal: true,
    })
      .catch(e => erros(e))
      .finally(setCarregandoBimestres(false));

    if (retorno?.data) {
      const lista = retorno.data.map(item => ({
        desc: item.descricao,
        valor: item.valor,
      }));
      setListaBimestres(lista);
    }
  }, [modalidade]);

  useEffect(() => {
    if (modalidade) {
      obterBimestres();
      return;
    }
    setListaBimestres([]);
    setBimestres(undefined);
  }, [modalidade, obterBimestres]);

  const onChangeSituacaoFechamento = valor => {
    setSituacaoFechamento(valor);
    setClicouBotaoGerar(false);
  };

  const obterSituacaoFechamento = useCallback(async () => {
    setCarregandoSituacaoFechamento(true);

    const retorno = await ServicoFiltroRelatorio.obterSituacaoFechamento(true)
      .catch(e => erros(e))
      .finally(setCarregandoSituacaoFechamento(false));

    if (retorno?.data) {
      const lista = retorno.data.map(item => ({
        desc: item.descricao,
        valor: item.codigo,
      }));
      lista.unshift(OPCAO_TODAS);
      setListaSituacaoFechamento(lista);
    }
  }, [OPCAO_TODAS]);

  useEffect(() => {
    if (
      !listaSituacaoFechamento?.length &&
      bimestres?.length &&
      !desabilitarCampoSituacao
    ) {
      obterSituacaoFechamento(statusAcompanhamentoFechamento);
    }
  }, [
    obterSituacaoFechamento,
    bimestres,
    dreCodigo,
    desabilitarCampoSituacao,
    listaSituacaoFechamento,
  ]);

  const onChangeSituacaoConselhoClasse = valor => {
    setSituacaoConselhoClasse(valor);
    setClicouBotaoGerar(false);
  };

  const obterSituacaoConselhoClasse = useCallback(async () => {
    setCarregandoSituacaoConselhoClasse(true);

    const retorno = await ServicoFiltroRelatorio.obterSituacaoConselhoClasse()
      .catch(e => erros(e))
      .finally(setCarregandoSituacaoConselhoClasse(false));

    if (retorno?.data) {
      const lista = retorno.data.map(item => ({
        desc: item.descricao,
        valor: item.codigo,
      }));
      lista.unshift(OPCAO_TODAS);
      setListaSituacaoConselhoClasse(lista);
    }
  }, [OPCAO_TODAS]);

  useEffect(() => {
    if (
      !listaSituacaoConselhoClasse?.length &&
      situacaoFechamento &&
      !desabilitarCampoSituacao
    ) {
      obterSituacaoConselhoClasse(statusAcompanhamentoConselhoClasse);
    }
  }, [
    situacaoFechamento,
    obterSituacaoConselhoClasse,
    desabilitarCampoSituacao,
    listaSituacaoConselhoClasse,
  ]);

  const onChangeListarPendencias = e => {
    setListarPendencias(e.target.value);
    setClicouBotaoGerar(false);
  };

  useEffect(() => {
    const infantil = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    setDesabilitarCampos(infantil);
    setEscolheuModalidadeInfantil(infantil);
  }, [turmaSelecionada, modalidadesFiltroPrincipal, modalidade]);

  useEffect(() => {
    const desabilitarSituacaoFechamento =
      dreCodigo !== OPCAO_TODOS && !situacaoFechamento;
    const desabilitarSituacaoConselhoClasse =
      dreCodigo !== OPCAO_TODOS && !situacaoConselhoClasse;

    const desabilitar =
      !anoLetivo ||
      !dreCodigo ||
      !ueCodigo ||
      !modalidade ||
      (String(modalidade) === String(modalidadeDTO.EJA) ? !semestre : false) ||
      !turmasCodigo?.length ||
      !bimestres?.length ||
      desabilitarSituacaoFechamento ||
      desabilitarSituacaoConselhoClasse ||
      escolheuModalidadeInfantil ||
      clicouBotaoGerar;

    setDesabilitarGerar(desabilitar);
  }, [
    anoLetivo,
    dreCodigo,
    ueCodigo,
    modalidade,
    semestre,
    turmasCodigo,
    bimestres,
    situacaoFechamento,
    situacaoConselhoClasse,
    escolheuModalidadeInfantil,
    clicouBotaoGerar,
  ]);

  useEffect(() => {
    const desabilitar = ueCodigo === OPCAO_TODOS || !situacaoConselhoClasse;
    setDesabilitarListarPendencias(desabilitar);
  }, [ueCodigo, situacaoConselhoClasse]);

  const onClickVoltar = () => history.push('/');

  const onClickCancelar = () => limparCampos(true, true);

  const gerar = async () => {
    setCarregandoGeral(true);
    setClicouBotaoGerar(true);

    const params = {
      anoLetivo,
      dreCodigo,
      ueCodigo,
      modalidade,
      semestre,
      turmasCodigo,
      bimestres,
      situacaoFechamento,
      situacaoConselhoClasse,
      listarPendencias,
    };

    await ServicoRelatorioAcompanhamentoFechamento.gerar(params)
      .then(() => {
        sucesso(
          'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
        );
      })
      .catch(e => erros(e))
      .finally(setCarregandoGeral(false));
  };

  return (
    <>
      <AlertaModalidadeInfantil
        exibir={escolheuModalidadeInfantil}
        validarModalidadeFiltroPrincipal={false}
      />
      <Cabecalho
        pagina="Relatório de acompanhamento do fechamento"
        classes="mb-2"
      />
      <Loader loading={carregandoGeral} ignorarTip>
        <Card>
          <div className="col-md-12 p-0">
            <div className="row mb-2">
              <div className="col-sm-12 d-flex justify-content-end">
                <Button
                  id="botao-voltar"
                  label="Voltar"
                  icon="arrow-left"
                  color={Colors.Azul}
                  onClick={onClickVoltar}
                  border
                  className="mr-3"
                />
                <Button
                  id="btn-cancelar"
                  label="Cancelar"
                  color={Colors.Azul}
                  border
                  bold
                  className="mr-3"
                  onClick={onClickCancelar}
                  disabled={desabilitarCampos || !dreCodigo}
                />
                <Button
                  id="btn-gerar"
                  icon="print"
                  label="Gerar"
                  color={Colors.Roxo}
                  bold
                  className="mr-0"
                  onClick={gerar}
                  disabled={desabilitarCampos || desabilitarGerar}
                />
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
            <div className="row mb-2">
              <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 pr-0">
                <Loader loading={carregandoAnosLetivos} ignorarTip>
                  <SelectComponent
                    label="Ano Letivo"
                    lista={listaAnosLetivo}
                    valueOption="valor"
                    valueText="desc"
                    disabled={
                      !consideraHistorico ||
                      listaAnosLetivo?.length === 1 ||
                      desabilitarCampos
                    }
                    onChange={onChangeAnoLetivo}
                    valueSelect={anoLetivo}
                    placeholder="Ano letivo"
                  />
                </Loader>
              </div>
              <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5 pr-0">
                <Loader loading={carregandoDres} ignorarTip>
                  <SelectComponent
                    label="Diretoria Regional de Educação (DRE)"
                    lista={listaDres}
                    valueOption="valor"
                    valueText="desc"
                    disabled={
                      !anoLetivo || listaDres?.length === 1 || desabilitarCampos
                    }
                    onChange={onChangeDre}
                    valueSelect={dreCodigo}
                    placeholder="Diretoria Regional De Educação (DRE)"
                    showSearch
                  />
                </Loader>
              </div>
              <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5">
                <Loader loading={carregandoUes} ignorarTip>
                  <SelectComponent
                    id="ue"
                    label="Unidade Escolar (UE)"
                    lista={listaUes}
                    valueOption="valor"
                    valueText="desc"
                    disabled={
                      !dreCodigo || listaUes?.length === 1 || desabilitarCampos
                    }
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
                      desabilitarCampos
                    }
                    onChange={onChangeModalidade}
                    valueSelect={modalidade}
                    placeholder="Modalidade"
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
                      !modalidade ||
                      listaSemestres?.length === 1 ||
                      String(modalidade) !== String(ModalidadeDTO.EJA) ||
                      desabilitarCampos
                    }
                    valueSelect={semestre}
                    onChange={onChangeSemestre}
                    placeholder="Semestre"
                  />
                </Loader>
              </div>
              <div className="col-sm-12 col-md-4">
                <Loader loading={carregandoTurmas} ignorarTip>
                  <SelectComponent
                    multiple
                    id="turma"
                    lista={listaTurmas}
                    valueOption="valor"
                    valueText="nomeFiltro"
                    label="Turmas"
                    disabled={
                      !modalidade ||
                      listaTurmas?.length === 1 ||
                      desabilitarCampos
                    }
                    valueSelect={turmasCodigo}
                    onChange={valores => {
                      onchangeMultiSelect(valores, turmasCodigo, onChangeTurma);
                    }}
                    placeholder="Turma"
                    showSearch
                  />
                </Loader>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-12 col-md-4 pr-0">
                <Loader loading={carregandoBimestres} ignorarTip>
                  <SelectComponent
                    lista={listaBimestres}
                    valueOption="valor"
                    valueText="desc"
                    label="Bimestre"
                    disabled={
                      !turmasCodigo?.length ||
                      listaBimestres?.length === 1 ||
                      desabilitarCampos
                    }
                    valueSelect={bimestres}
                    onChange={valores => {
                      onchangeMultiSelect(valores, bimestres, onChangeBimestre);
                    }}
                    placeholder="Selecione o bimestre"
                    multiple
                  />
                </Loader>
              </div>
              <div className="col-sm-12 col-md-4 pr-0">
                <Loader loading={carregandoSituacaoFechamento} ignorarTip>
                  <SelectComponent
                    lista={listaSituacaoFechamento}
                    valueOption="valor"
                    valueText="desc"
                    label="Situação do fechamento"
                    disabled={
                      !turmasCodigo?.length ||
                      !bimestres ||
                      desabilitarCampos ||
                      desabilitarCampoSituacao
                    }
                    valueSelect={situacaoFechamento}
                    onChange={onChangeSituacaoFechamento}
                    placeholder="Situação do fechamento"
                  />
                </Loader>
              </div>
              <div className="col-sm-12 col-md-4">
                <Loader loading={carregandoSituacaoConselhoClasse} ignorarTip>
                  <SelectComponent
                    lista={listaSituacaoConselhoClasse}
                    valueOption="valor"
                    valueText="desc"
                    label="Situação do conselho de classe"
                    disabled={
                      !turmasCodigo?.length ||
                      !bimestres ||
                      !situacaoFechamento ||
                      desabilitarCampos ||
                      desabilitarCampoSituacao
                    }
                    valueSelect={situacaoConselhoClasse}
                    onChange={onChangeSituacaoConselhoClasse}
                    placeholder="Situação do conselho de classe"
                  />
                </Loader>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <RadioGroupButton
                  label="Listar pendências"
                  opcoes={opcoesRadioSimNao}
                  valorInicial
                  onChange={onChangeListarPendencias}
                  value={listarPendencias}
                  desabilitado={desabilitarListarPendencias}
                />
              </div>
            </div>
          </div>
        </Card>
      </Loader>
    </>
  );
};

export default AcompanhamentoFechamento;
