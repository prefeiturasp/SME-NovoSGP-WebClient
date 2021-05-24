import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CheckboxComponent, Loader, SelectComponent } from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';

import { setTurmasAcompanhamentoFechamento } from '~/redux/modulos/acompanhamentoFechamento/actions';

import { ModalidadeDTO } from '~/dtos';
import { AbrangenciaServico, erros, ServicoFiltroRelatorio } from '~/servicos';
import { OPCAO_TODOS, BIMESTRE_FINAL } from '~/constantes/constantes';

const Filtros = ({ onChangeFiltros, ehInfantil }) => {
  const dispatch = useDispatch();
  const [anoAtual] = useState(window.moment().format('YYYY'));
  const [anoLetivo, setAnoLetivo] = useState('');
  const [bimestre, setBimestre] = useState('');
  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoModalidade, setCarregandoModalidade] = useState(false);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [dreCodigo, setDreCodigo] = useState('');
  const [dreId, setDreId] = useState('');
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaBimestres, setListaBimestres] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [modalidadeId, setModalidadeId] = useState('');
  const [semestre, setSemestre] = useState('');
  const [turmasId, setTurmasId] = useState('');
  const [ueId, setUeId] = useState('');
  const [ueCodigo, setUeCodigo] = useState('');

  const ANO_LETIVO_MINIMO = 2021;

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

  const filtrar = valorBimestre => {
    const params = {
      anoLetivo,
      dreId,
      ueId,
      modalidadeId,
      semestre: semestre || 0,
      turmasId,
      bimestre: valorBimestre,
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
    setConsideraHistorico(e.target.checked);
    setAnoLetivo(anoAtual);
  };

  const onChangeAnoLetivo = ano => {
    setAnoLetivo(ano);
    limparCampos();
  };

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);
    let anosLetivos = [];

    const anosLetivoComHistorico = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: true,
      anoMinimo: ANO_LETIVO_MINIMO,
    });
    const anosLetivoSemHistorico = await FiltroHelper.obterAnosLetivos({
      consideraHistorico: false,
      anoMinimo: ANO_LETIVO_MINIMO,
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
    const id = listaUes.find(d => d.valor === ue)?.id;
    setUeId(id);
    setUeCodigo(ue);
    setListaModalidades([]);
    setModalidadeId();
    setListaTurmas([]);
    setTurmasId();
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
        }));

        if (lista?.length === 1) {
          setUeId(lista[0].id);
          setUeCodigo(lista[0].codigo);
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
    if (anoLetivo && ueCodigo) {
      obterModalidades(ueCodigo);
      return;
    }
    setModalidadeId();
    setListaModalidades([]);
  }, [obterModalidades, anoLetivo, ueCodigo]);

  const onChangeSemestre = valor => {
    setSemestre(valor);
  };

  const obterSemestres = async (
    modalidadeSelecionada,
    anoLetivoSelecionado
  ) => {
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
  };

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
  }, [obterAnosLetivos, modalidadeId, anoLetivo]);

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
        consideraHistorico
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoTurmas(false));

      if (retorno?.data?.length) {
        const lista = [];
        if (retorno.data.length > 1) {
          lista.push({ valor: OPCAO_TODOS, desc: 'Todas' });
        }
        retorno.data.map(item =>
          lista.push({
            desc: item.nome,
            valor: item.id,
            id: item.id,
            ano: item.ano,
          })
        );
        setListaTurmas(lista);
        if (lista.length === 1) {
          setTurmasId([String(lista[0].valor)]);
        }
      }
    }
  }, [ueCodigo, dreId, consideraHistorico, anoLetivo, modalidadeId]);

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

  const obterBimestres = useCallback(() => {
    const bi = [];
    bi.push({ desc: '1º', valor: 1 });
    bi.push({ desc: '2º', valor: 2 });

    if (modalidadeId !== ModalidadeDTO.EJA) {
      bi.push({ desc: '3º', valor: 3 });
      bi.push({ desc: '4º', valor: 4 });
    }

    bi.push({ desc: 'Final', valor: BIMESTRE_FINAL });
    bi.push({ desc: 'Todos', valor: OPCAO_TODOS });
    setListaBimestres(bi);
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
  }, [ehInfantil]);

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
                listaAnosLetivo[0].valor === ANO_LETIVO_MINIMO)
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
              valueText="desc"
              label="Turmas"
              disabled={
                !modalidadeId || listaTurmas?.length === 1 || desabilitarCampos
              }
              valueSelect={turmasId}
              onChange={valores => {
                onchangeMultiSelect(valores, turmasId, onChangeTurma);
              }}
              placeholder="Turma"
            />
          </Loader>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-4">
          <SelectComponent
            lista={listaBimestres}
            valueOption="valor"
            valueText="desc"
            label="Bimestre"
            disabled={
              !modalidadeId || listaBimestres?.length === 1 || desabilitarCampos
            }
            valueSelect={bimestre}
            onChange={onChangeBimestre}
            placeholder="Selecione o bimestre"
          />
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
