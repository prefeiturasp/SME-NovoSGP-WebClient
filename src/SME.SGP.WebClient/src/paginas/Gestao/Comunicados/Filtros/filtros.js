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
import { AbrangenciaServico, erros, ServicoFiltroRelatorio } from '~/servicos';

import FiltrosAvancados from './filtrosAvancados';
import { OPCAO_TODOS } from '~/constantes';
import { onchangeMultiSelect } from '~/utils';

const Filtros = ({ onChangeFiltros }) => {
  const [anoAtual] = useState(window.moment().format('YYYY'));
  const [anoLetivo, setAnoLetivo] = useState();
  const [buscou, setBuscou] = useState(false);
  const [carregandoAnosLetivos, setCarregandoAnosLetivos] = useState(false);
  const [carregandoDres, setCarregandoDres] = useState(false);
  const [carregandoModalidade, setCarregandoModalidade] = useState(false);
  const [carregandoSemestres, setCarregandoSemestres] = useState(false);
  const [carregandoUes, setCarregandoUes] = useState(false);
  const [codigoDre, setCodigoDre] = useState();
  const [codigoUe, setCodigoUe] = useState();
  const [consideraHistorico, setConsideraHistorico] = useState(false);
  const [desabilitarCampos, setDesabilitarCampos] = useState(false);
  const [dreId, setDreId] = useState();
  const [filtrosPrincipais, setFiltrosPrincipais] = useState();
  const [listaAnosLetivo, setListaAnosLetivo] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [modalidadeId, setModalidadeId] = useState();
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);
  const [semestre, setSemestre] = useState();
  const [ueId, setUeId] = useState();

  const limparCampos = () => {
    setListaUes([]);
    setUeId();
    setCodigoUe();

    setListaModalidades([]);
    setModalidadeId();

    setListaSemestres([]);
    setSemestre();
  };

  const onChangeConsideraHistorico = e => {
    setConsideraHistorico(e.target.checked);
    setAnoLetivo(anoAtual);
    setCodigoDre();
    setDreId();
  };

  const onChangeAnoLetivo = ano => {
    setAnoLetivo(ano);
    limparCampos();
  };

  const obterAnosLetivos = useCallback(async () => {
    setCarregandoAnosLetivos(true);
    const [anosLetivoComHistorico, anosLetivoSemHistorico] = await Promise.all([
      FiltroHelper.obterAnosLetivos({
        consideraHistorico: true,
      }),
      FiltroHelper.obterAnosLetivos({
        consideraHistorico: false,
      }),
    ]).finally(() => setCarregandoAnosLetivos(false));

    const valoresAnosAtuais = [
      {
        desc: anoAtual,
        valor: anoAtual,
      },
    ];
    const anosLetivos = valoresAnosAtuais
      .concat(anosLetivoComHistorico, anosLetivoSemHistorico)
      .filter(
        (objetoAno, index, arrayAnos) =>
          arrayAnos.findIndex(
            item => String(item.valor) === String(objetoAno.valor)
          ) === index
      );
    const temAnoAtualNaLista = anosLetivos.find(
      item => String(item.valor) === String(anoAtual)
    );
    const anoSelecionado = temAnoAtualNaLista ? anoAtual : anosLetivos[0].valor;
    setAnoLetivo(anoSelecionado);
    setListaAnosLetivo(anosLetivos);
  }, [anoAtual]);

  useEffect(() => {
    obterAnosLetivos();
  }, [obterAnosLetivos]);

  const onChangeDre = dre => {
    const id = listaDres.find(d => d.valor === dre)?.id;
    setDreId(id);
    setCodigoDre(dre);
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
          setCodigoDre(lista[0].valor);
          setDreId(lista[0].id);
        } else {
          lista.unshift({ codigo: OPCAO_TODOS, nome: 'Todas' });
        }
        setListaDres(lista);
        return;
      }
      setCodigoDre(undefined);
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
    setCodigoUe(ue);
    setListaModalidades([]);
    setModalidadeId();
    setBuscou(false);

    setDesabilitarCampos(ueSelecionada?.ehInfantil);
  };

  const obterUes = useCallback(async () => {
    if (codigoDre) {
      const ueTodos = { nome: 'Todas', codigo: OPCAO_TODOS };
      if (codigoDre === OPCAO_TODOS) {
        setListaUes([ueTodos]);
        setCodigoUe(OPCAO_TODOS);
        return;
      }

      setCarregandoUes(true);
      const resposta = await AbrangenciaServico.buscarUes(
        codigoDre,
        `v1/abrangencias/${consideraHistorico}/dres/${codigoDre}/ues?anoLetivo=${anoLetivo}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoUes(false));

      if (resposta?.data) {
        const lista = resposta.data;
        if (lista?.length === 1) {
          setUeId(lista[0].id);
          setCodigoUe(lista[0].valor);
        } else {
          lista.unshift(ueTodos);
        }

        setListaUes(lista);
        return;
      }
      setListaUes([]);
    }
  }, [anoLetivo, codigoDre, consideraHistorico]);

  useEffect(() => {
    if (codigoDre) {
      obterUes();
      return;
    }
    setUeId();
    setListaUes([]);
  }, [codigoDre, obterUes]);

  const onChangeModalidade = valor => {
    setModalidadeId(valor);
    setBuscou(false);
    setSemestre();
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

        if (lista?.length === 1) {
          setModalidadeId([lista[0].valor]);
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
    if (anoLetivo && codigoUe) {
      obterModalidades(codigoUe);
      return;
    }
    setModalidadeId();
    setListaModalidades([]);
  }, [obterModalidades, anoLetivo, codigoUe]);

  const onChangeSemestre = valor => {
    setBuscou(false);
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
        const lista = retorno.data.map(periodo => ({
          desc: periodo,
          valor: periodo,
        }));

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

  const filtrar = useCallback(() => {
    const params = {
      anoLetivo,
      dreId,
      codigoDre,
      ueId,
      codigoUe,
      modalidadeId,
      semestre: semestre || 0,
    };

    onChangeFiltros(params);
    setBuscou(true);
  }, [
    anoLetivo,
    dreId,
    codigoDre,
    ueId,
    codigoUe,
    modalidadeId,
    semestre,
    onChangeFiltros,
  ]);

  useEffect(() => {
    const temSemestreOuNaoEja =
      String(modalidadeId) !== String(ModalidadeDTO.EJA) || semestre;

    setFiltrosPrincipais({
      anoLetivo,
      codigoDre,
      codigoUe,
      modalidadeId,
      semestre,
    });
    if (
      anoLetivo &&
      codigoDre &&
      codigoUe &&
      modalidadeId?.length &&
      temSemestreOuNaoEja &&
      !buscou
    ) {
      filtrar();
    }
  }, [filtrar, buscou, anoLetivo, codigoDre, codigoUe, modalidadeId, semestre]);

  return (
    <>
      <div className="row mb-2">
        <div className="col-12">
          <CheckboxComponent
            label="Exibir histórico?"
            onChangeCheckbox={onChangeConsideraHistorico}
            checked={consideraHistorico}
            disabled={desabilitarCampos || listaAnosLetivo.length === 1}
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
              valueSelect={codigoDre}
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
              disabled={!codigoDre || listaUes?.length === 1}
              onChange={onChangeUe}
              valueSelect={codigoUe}
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
                !codigoUe || listaModalidades?.length === 1 || desabilitarCampos
              }
              onChange={valores => {
                onchangeMultiSelect(valores, modalidadeId, onChangeModalidade);
              }}
              valueSelect={modalidadeId}
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
        <div className="col-sm-12 col-md-2 mt-4">
          <Button
            id="botao-voltar"
            label="Filtros avançados"
            icon="filter"
            color={Colors.Azul}
            onClick={() => setMostrarFiltrosAvancados(true)}
            border
            className="mr-3"
            width="100%"
          />
        </div>
      </div>

      {mostrarFiltrosAvancados && (
        <FiltrosAvancados
          filtrosPrincipais={filtrosPrincipais}
          onChangeFiltros={onChangeFiltros}
        />
      )}
    </>
  );
};

Filtros.propTypes = {
  onChangeFiltros: PropTypes.func,
};

Filtros.defaultProps = {
  onChangeFiltros: () => {},
};

export default Filtros;
