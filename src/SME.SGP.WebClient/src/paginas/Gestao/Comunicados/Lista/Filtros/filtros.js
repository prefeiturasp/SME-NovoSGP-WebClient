import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  CheckboxComponent,
  Colors,
  Loader,
  SelectComponent,
} from '~/componentes';
import { FiltroHelper } from '~/componentes-sgp';

import { ModalidadeDTO } from '~/dtos';
import {
  AbrangenciaServico,
  erros,
  ServicoFiltroRelatorio,
  ServicoComunicados,
} from '~/servicos';

import FiltrosAvancados from './filtrosAvancados';
import { OPCAO_TODOS } from '~/constantes';
import { onchangeMultiSelect } from '~/utils';

const Filtros = ({ onChangeFiltros, temModalidadeEja }) => {
  const [anoAtual] = useState(window.moment().format('YYYY'));
  const [anoLetivo, setAnoLetivo] = useState();
  const [atualizaFiltrosAvançados, setAtualizaFiltrosAvançados] = useState(
    false
  );
  const [buscou, setBuscou] = useState(false);
  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoModalidade, setCarregandoModalidade] = useState(false);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [dreCodigo, setDreCodigo] = useState();
  const [dreId, setDreId] = useState();
  const [filtrosPrincipais, setFiltrosPrincipais] = useState();
  const [
    habilitaConsideraHistorico,
    setHabilitaConsideraHistorico,
  ] = useState();
  const [listaAnosLetivo, setListaAnosLetivo] = useState({});
  const [listaDres, setListaDres] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [modalidades, setModalidades] = useState();
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);
  const [semestre, setSemestre] = useState('0');
  const [ueCodigo, setUeCodigo] = useState();
  const [ueId, setUeId] = useState();

  const ANO_MINIMO = '2021';

  const limparCampos = (limpar = false) => {
    setListaUes([]);
    setUeId();
    setUeCodigo();

    setListaModalidades([]);
    setModalidades();

    setListaSemestres([]);
    setSemestre();
    setBuscou(false);
    setAtualizaFiltrosAvançados(true);

    if (limpar) {
      setDreCodigo();
      setDreId();
      setUeId();
      setUeCodigo();
    }
  };

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
    setAnoLetivo(anoAtual);
    limparCampos(true);
  };

  const onChangeAnoLetivo = ano => {
    setAnoLetivo(ano);
    limparCampos();
  };

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);
    const retorno = await ServicoComunicados.obterAnosLetivos(ANO_MINIMO)
      .catch(e => erros(e))
      .finally(() => setCarregandoAnosLetivos(false));

    const anoSelecionado = retorno?.data.anosLetivosHistorico?.length
      ? retorno?.data.anosLetivosHistorico.map(item => ({
          desc: item,
          valor: item,
        }))
      : [];
    setAnoLetivo(retorno?.data?.anoLetivoAtual);
    setHabilitaConsideraHistorico(retorno?.data?.temHistorico);
    setListaAnosLetivo(anoSelecionado);
  }, []);

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
        const lista = resposta.data.sort(FiltroHelper.ordenarLista('nome'));

        if (lista?.length === 1) {
          setDreCodigo(lista[0].codigo);
          setDreId(lista[0].id);
        } else {
          lista.unshift({ codigo: OPCAO_TODOS, nome: 'Todas' });
        }
        setListaDres(lista);
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
    const ueSelecionada = listaUes.find(d => d.valor === ue);
    setUeId(ueSelecionada?.id);
    setUeCodigo(ue);
    setListaModalidades([]);
    setModalidades();
    setBuscou(false);
  };

  const obterUes = useCallback(async () => {
    if (dreCodigo) {
      const ueTodos = { nome: 'Todas', codigo: OPCAO_TODOS };
      if (dreCodigo === OPCAO_TODOS) {
        setListaUes([ueTodos]);
        setUeCodigo(OPCAO_TODOS);
        return;
      }

      setCarregandoUes(true);
      const resposta = await AbrangenciaServico.buscarUes(
        dreCodigo,
        `v1/abrangencias/${consideraHistorico}/dres/${dreCodigo}/ues?anoLetivo=${anoLetivo}&consideraNovasUEs=${true}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoUes(false));

      if (resposta?.data) {
        const lista = resposta.data;
        if (lista?.length === 1) {
          setUeId(lista[0].id);
          setUeCodigo(lista[0].codigo);
        } else {
          lista.unshift(ueTodos);
        }

        setListaUes(lista);
        return;
      }
      setListaUes([]);
    }
  }, [anoLetivo, dreCodigo, consideraHistorico]);

  useEffect(() => {
    if (dreCodigo) {
      obterUes();
      return;
    }
    setUeId();
    setListaUes([]);
  }, [dreCodigo, obterUes]);

  const onChangeModalidade = valor => {
    setModalidades(valor);
    setSemestre();
    setListaSemestres([]);
    setBuscou(false);
    setAtualizaFiltrosAvançados(true);
  };

  const obterModalidades = useCallback(async ue => {
    if (ue) {
      setCarregandoModalidade(true);
      const {
        data,
      } = await ServicoFiltroRelatorio.obterModalidadesPorAbrangencia(
        ue,
        true
      ).finally(() => setCarregandoModalidade(false));

      if (data?.length) {
        const lista = data.map(item => ({
          desc: item.descricao,
          valor: String(item.valor),
        }));

        if (lista?.length === 1) {
          onChangeModalidade([lista[0].valor]);
        } else {
          lista.unshift({
            desc: 'Todas',
            valor: OPCAO_TODOS,
          });
        }
        setListaModalidades(lista);
      }
    }
  }, []);

  useEffect(() => {
    if (anoLetivo && dreCodigo && ueCodigo) {
      obterModalidades(ueCodigo);
      return;
    }
    setModalidades();
    setListaModalidades([]);
  }, [obterModalidades, dreCodigo, anoLetivo, ueCodigo]);

  const onChangeSemestre = valor => {
    setBuscou(false);
    setSemestre(valor);
    setAtualizaFiltrosAvançados(true);
  };

  const obterSemestres = useCallback(
    async (modalidadeSelecionada, anoLetivoSelecionado) => {
      setCarregandoSemestres(true);
      const retorno = await ServicoComunicados.obterSemestres(
        consideraHistorico,
        modalidadeSelecionada,
        anoLetivoSelecionado,
        ueCodigo
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoSemestres(false));

      if (retorno?.data?.length) {
        const lista = retorno.data.map(periodo => ({
          desc: periodo,
          valor: periodo,
        }));
        setListaSemestres(lista);

        if (lista?.length === 1) {
          setSemestre(String(lista[0].valor));
          setBuscou(false);
          setAtualizaFiltrosAvançados(true);
        }
      }
    },
    [consideraHistorico, ueCodigo]
  );

  useEffect(() => {
    const temEja = modalidades?.find(
      item => String(item) === String(ModalidadeDTO.EJA)
    );
    if (modalidades?.length && anoLetivo && temEja) {
      obterSemestres(ModalidadeDTO.EJA, anoLetivo);
      return;
    }
    setSemestre();
    setListaSemestres([]);
  }, [obterSemestres, temModalidadeEja, modalidades, anoLetivo]);

  const filtrar = useCallback(() => {
    const params = {
      anoLetivo,
      dreId,
      dreCodigo,
      ueId,
      ueCodigo,
      modalidades,
      semestre,
    };

    onChangeFiltros(params);
    setBuscou(true);
  }, [
    anoLetivo,
    dreId,
    dreCodigo,
    ueId,
    ueCodigo,
    modalidades,
    semestre,
    onChangeFiltros,
  ]);

  useEffect(() => {
    if (!buscou) {
      setFiltrosPrincipais({
        anoLetivo,
        dreCodigo,
        ueCodigo,
        modalidades,
        semestre,
      });
      filtrar();
    }
  }, [filtrar, buscou, anoLetivo, dreCodigo, ueCodigo, modalidades, semestre]);

  useEffect(() => {
    if (atualizaFiltrosAvançados && !mostrarFiltrosAvancados) {
      const paramsFiltroavancado = {
        tipoEscola: [],
        anosEscolares: [],
        turmasCodigo: [],
        dataEnvioInicio: '',
        dataEnvioFim: '',
        dataExpiracaoInicio: '',
        dataExpiracaoFim: '',
        titulo: '',
      };
      if (!buscou) {
        onChangeFiltros(paramsFiltroavancado);
        setBuscou(true);
      }
    }
  }, [
    onChangeFiltros,
    atualizaFiltrosAvançados,
    mostrarFiltrosAvancados,
    buscou,
  ]);

  return (
    <>
      <div className="row mb-2">
        <div className="col-12">
          <CheckboxComponent
            label="Exibir histórico?"
            onChangeCheckbox={onChangeConsideraHistorico}
            checked={consideraHistorico}
            disabled={!habilitaConsideraHistorico}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-12 col-md-2 pr-0">
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
        <div className="col-sm-12 col-md-5 pr-0">
          <Loader loading={carregandoDres} ignorarTip>
            <SelectComponent
              label="Diretoria Regional de Educação (DRE)"
              lista={listaDres}
              valueOption="codigo"
              valueText="nome"
              disabled={!anoLetivo || listaDres?.length === 1}
              onChange={onChangeDre}
              valueSelect={dreCodigo}
              placeholder="Diretoria Regional De Educação (DRE)"
              showSearch
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-5">
          <Loader loading={carregandoUes} ignorarTip>
            <SelectComponent
              id="ue"
              label="Unidade Escolar (UE)"
              lista={listaUes}
              valueOption="codigo"
              valueText="nome"
              disabled={!dreCodigo || listaUes?.length === 1}
              onChange={onChangeUe}
              valueSelect={ueCodigo}
              placeholder="Unidade Escolar (UE)"
              showSearch
            />
          </Loader>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-5 pr-0">
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
                !listaModalidades?.length
              }
              onChange={valores => {
                onchangeMultiSelect(valores, modalidades, onChangeModalidade);
              }}
              valueSelect={modalidades}
              placeholder="Modalidade"
              multiple
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-5 pr-0">
          <Loader loading={carregandoSemestres} ignorarTip>
            <SelectComponent
              id="drop-semestre"
              lista={listaSemestres}
              valueOption="valor"
              valueText="desc"
              label="Semestre"
              disabled={
                !modalidades ||
                listaSemestres?.length === 1 ||
                !temModalidadeEja
              }
              valueSelect={semestre}
              onChange={onChangeSemestre}
              placeholder="Semestre"
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-2 mt-4">
          <Button
            id="botao-filtros-avancados"
            label="Filtros avançados"
            icon="filter"
            color={Colors.Azul}
            onClick={() => {
              setMostrarFiltrosAvancados(!mostrarFiltrosAvancados);
              setAtualizaFiltrosAvançados(true);
              setBuscou(false);
            }}
            border
            className="mr-3"
            width="100%"
          />
        </div>
      </div>

      {mostrarFiltrosAvancados && (
        <FiltrosAvancados
          atualizaFiltrosAvançados={atualizaFiltrosAvançados}
          filtrosPrincipais={filtrosPrincipais}
          onChangeFiltros={onChangeFiltros}
          setAtualizaFiltrosAvançados={setAtualizaFiltrosAvançados}
          temModalidadeEja={temModalidadeEja}
        />
      )}
    </>
  );
};

Filtros.propTypes = {
  onChangeFiltros: PropTypes.func,
  temModalidadeEja: PropTypes.bool,
};

Filtros.defaultProps = {
  onChangeFiltros: () => {},
  temModalidadeEja: false,
};

export default Filtros;
