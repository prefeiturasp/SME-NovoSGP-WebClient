import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CheckboxComponent, Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';

import {
  setEscolheuModalidadeInfantil,
  setTurmasAcompanhamentoFechamento,
} from '~/redux/modulos/acompanhamentoFechamento/actions';

import { ModalidadeDTO } from '~/dtos';
import { AbrangenciaServico, erros, ServicoFiltroRelatorio } from '~/servicos';
import {
  OPCAO_TODOS,
  BIMESTRE_FINAL,
  ANO_INICIO_INFANTIL,
} from '~/constantes/constantes';

const Filtros = ({ onChangeFiltros, ehInfantil }) => {
  const dispatch = useDispatch();
  const [anoAtual] = useState(window.moment().format('YYYY'));
  const [anoLetivo, setAnoLetivo] = useState();
  const [bimestre, setBimestre] = useState();
  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoBimestres, setCarregandoBimestres] = useState(false);
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
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [dreCodigo, setDreCodigo] = useState();
  const [dreId, setDreId] = useState('');
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaBimestres, setListaBimestres] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [listaSituacaoFechamento, setListaSituacaoFechamento] = useState([]);
  const [
    listaSituacaoConselhoClasse,
    setListaSituacaoConselhoClasse,
  ] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [modalidadeId, setModalidadeId] = useState();
  const [semestre, setSemestre] = useState();
  const [situacaoConselhoClasse, setSituacaoConselhoClasse] = useState();
  const [situacaoFechamento, setSituacaoFechamento] = useState();
  const [turmasId, setTurmasId] = useState('');
  const [ueId, setUeId] = useState('');
  const [ueCodigo, setUeCodigo] = useState();

  const OPCAO_PADRAO = '-99';

  const carregandoAcompanhamentoFechamento = useSelector(
    store => store.acompanhamentoFechamento.carregandoAcompanhamentoFechamento
  );

  const limparCampos = () => {
    setListaUes([]);
    setUeId();
    setUeCodigo();

    setListaModalidades([]);
    setModalidadeId();

    setListaSemestres([]);
    setSemestre();

    setListaTurmas([]);
    setTurmasId();
  };

  const filtrar = (
    valorBimestre,
    valorSituacaoFechamento,
    valorSituacaoConselhoClasse
  ) => {
    const params = {
      anoLetivo,
      dreId,
      ueId,
      modalidadeId,
      semestre: semestre || 0,
      turmasId,
      bimestre: valorBimestre,
      situacaoFechamento: valorSituacaoFechamento || OPCAO_PADRAO,
      situacaoConselhoClasse: valorSituacaoConselhoClasse || OPCAO_PADRAO,
    };

    const temSemestreOuNaoEja =
      String(modalidadeId) !== String(ModalidadeDTO.EJA) || semestre;

    if (
      anoLetivo &&
      dreId &&
      ueId &&
      modalidadeId &&
      turmasId?.length &&
      valorBimestre &&
      temSemestreOuNaoEja &&
      !carregandoAcompanhamentoFechamento
    ) {
      onChangeFiltros(params);
    }
  };

  const onChangeConsideraHistorico = e => {
    dispatch(setTurmasAcompanhamentoFechamento());
    setConsideraHistorico(e.target.checked);
    setAnoLetivo(anoAtual);
  };

  const onChangeAnoLetivo = ano => {
    dispatch(setTurmasAcompanhamentoFechamento());
    setAnoLetivo(ano);
    limparCampos();
  };

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);
    let anosLetivos = [];

    const anosLetivoComHistorico = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: true,
      anoMinimo: ANO_INICIO_INFANTIL,
    });
    const anosLetivoSemHistorico = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: false,
      anoMinimo: ANO_INICIO_INFANTIL,
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
    dispatch(setTurmasAcompanhamentoFechamento());
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
        const lista = resposta.data
          .map(item => ({
            desc: item.nome,
            valor: item.codigo,
            abrev: item.abreviacao,
            id: item.id,
          }))
          .sort(FiltroHelper.ordenarLista('desc'));
        setListaDres(lista);

        if (lista?.length === 1) {
          setDreCodigo(lista[0].valor);
          setDreId(lista[0].id);
        }
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
    dispatch(setTurmasAcompanhamentoFechamento());
    const ueSelecionada = listaUes.find(d => d.valor === ue);
    setUeId(ueSelecionada?.id);
    setUeCodigo(ue);
    setListaModalidades([]);
    setModalidadeId();
    setListaTurmas([]);
    setTurmasId();

    dispatch(setEscolheuModalidadeInfantil(ueSelecionada?.ehInfantil));
    setDesabilitarCampos(ueSelecionada?.ehInfantil);
  };

  const obterUes = useCallback(async () => {
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
          setUeId(lista[0].id);
          setUeCodigo(lista[0].valor);
        }

        setListaUes(lista);
        return;
      }
      setListaUes([]);
    }
  }, [dreCodigo, anoLetivo, consideraHistorico]);

  useEffect(() => {
    if (dreId) {
      obterUes();
      return;
    }
    setUeId();
    setListaUes([]);
  }, [dreId, obterUes]);

  const onChangeModalidade = valor => {
    dispatch(setTurmasAcompanhamentoFechamento());
    setTurmasId();
    setModalidadeId(valor);
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
        if (lista?.length === 1) {
          setModalidadeId(lista[0].valor);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (anoLetivo && ueCodigo && !ehInfantil) {
      obterModalidades(ueCodigo);
      return;
    }
    setModalidadeId();
    setListaModalidades([]);
  }, [obterModalidades, anoLetivo, ueCodigo, ehInfantil]);

  const onChangeSemestre = valor => {
    dispatch(setTurmasAcompanhamentoFechamento());
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
      modalidadeId &&
      anoLetivo &&
      String(modalidadeId) === String(ModalidadeDTO.EJA)
    ) {
      obterSemestres(modalidadeId, anoLetivo);
      return;
    }
    setSemestre();
    setListaSemestres([]);
  }, [obterAnosLetivos, obterSemestres, modalidadeId, anoLetivo]);

  const onChangeTurma = valor => {
    setTurmasId(valor);
    setBimestre(undefined);
  };

  const onchangeMultiSelect = (valores, valorAtual, funSetarNovoValor) => {
    const opcaoTodosJaSelecionado = valorAtual
      ? valorAtual.includes(OPCAO_TODOS)
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
    if (dreCodigo && ueCodigo && modalidadeId) {
      setCarregandoTurmas(true);
      const retorno = await AbrangenciaServico.buscarTurmas(
        ueCodigo,
        modalidadeId,
        '',
        anoLetivo,
        consideraHistorico,
        false,
        []
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoTurmas(false));

      if (retorno?.data?.length) {
        const lista = [];
        if (retorno.data.length > 1) {
          lista.push({ valor: OPCAO_TODOS, nomeFiltro: 'Todas' });
        }
        retorno.data.map(item =>
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
          setTurmasId([String(lista[0].valor)]);
        }
      }
    }
  }, [ueCodigo, dreCodigo, consideraHistorico, anoLetivo, modalidadeId]);

  useEffect(() => {
    if (ueCodigo) {
      obterTurmas();
      return;
    }
    setTurmasId();
    setListaTurmas([]);
  }, [ueCodigo, obterTurmas]);

  const onChangeBimestre = valor => {
    dispatch(setTurmasAcompanhamentoFechamento(undefined));
    setBimestre(valor);
    filtrar(valor);
  };

  const obterBimestres = useCallback(async () => {
    setCarregandoBimestres(true);
    const retorno = await ServicoFiltroRelatorio.obterBimestres({
      modalidadeId,
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
  }, [modalidadeId]);

  useEffect(() => {
    if (modalidadeId) {
      obterBimestres();
      return;
    }
    setListaBimestres([]);
    setBimestre(undefined);
  }, [modalidadeId, obterBimestres]);

  useEffect(() => {
    setDesabilitarCampos(ehInfantil);
    dispatch(setEscolheuModalidadeInfantil(ehInfantil));
  }, [dispatch, ehInfantil]);

  const onChangeSituacaoFechamento = valor => {
    setSituacaoFechamento(valor);
    filtrar(bimestre, valor, situacaoConselhoClasse);
  };

  const onChangeSituacaoConselhoClasse = valor => {
    setSituacaoConselhoClasse(valor);
    filtrar(bimestre, situacaoFechamento, valor);
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
      setListaSituacaoFechamento(lista);
    }
  }, []);

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
      setListaSituacaoConselhoClasse(lista);
    }
  }, []);

  useEffect(() => {
    if (bimestre?.length) {
      Promise.all([obterSituacaoFechamento(), obterSituacaoConselhoClasse()]);
    }
  }, [obterSituacaoFechamento, obterSituacaoConselhoClasse, bimestre]);

  return (
    <>
      <div className="row mb-2">
        <div className="col-12">
          <CheckboxComponent
            label="Exibir histórico?"
            onChangeCheckbox={onChangeConsideraHistorico}
            checked={consideraHistorico}
            disabled={
              desabilitarCampos ||
              (listaAnosLetivo.length === 1 &&
                listaAnosLetivo[0].valor === ANO_INICIO_INFANTIL)
            }
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
              disabled={!consideraHistorico || listaAnosLetivo?.length === 1}
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
              disabled={!anoLetivo || listaDres?.length === 1}
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
                !ueCodigo || listaModalidades?.length === 1 || desabilitarCampos
              }
              onChange={onChangeModalidade}
              valueSelect={modalidadeId}
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
                !modalidadeId ||
                listaSemestres?.length === 1 ||
                String(modalidadeId) !== String(ModalidadeDTO.EJA) ||
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
                !modalidadeId || listaTurmas?.length === 1 || desabilitarCampos
              }
              valueSelect={turmasId}
              onChange={valores => {
                onchangeMultiSelect(valores, turmasId, onChangeTurma);
                dispatch(setTurmasAcompanhamentoFechamento());
              }}
              placeholder="Turma"
              showSearch
            />
          </Loader>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-4 pr-0">
          <Loader loading={carregandoBimestres} ignorarTip>
            <SelectComponent
              lista={listaBimestres}
              valueOption="valor"
              valueText="desc"
              label="Bimestre"
              disabled={
                !turmasId?.length ||
                listaBimestres?.length === 1 ||
                desabilitarCampos
              }
              valueSelect={bimestre}
              onChange={onChangeBimestre}
              placeholder="Selecione o bimestre"
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
              disabled={!turmasId?.length || !bimestre || desabilitarCampos}
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
              disabled={!turmasId?.length || !bimestre || desabilitarCampos}
              valueSelect={situacaoConselhoClasse}
              onChange={onChangeSituacaoConselhoClasse}
              placeholder="Situação do conselho de classe"
            />
          </Loader>
        </div>
      </div>
    </>
  );
};

Filtros.propTypes = {
  onChangeFiltros: PropTypes.func,
  ehInfantil: PropTypes.bool,
};

Filtros.defaultProps = {
  onChangeFiltros: () => null,
  ehInfantil: false,
};

export default Filtros;
