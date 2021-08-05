import React, { useState, useEffect, useCallback, useMemo } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
  CampoData,
  CampoTexto,
  Label,
  Loader,
  SelectComponent,
} from '~/componentes';

import { erros, ServicoComunicados } from '~/servicos';
import { onchangeMultiSelect } from '~/utils';
import { OPCAO_TODOS } from '~/constantes/constantesGerais';

const FiltrosAvancados = ({ filtrosPrincipais, onChangeFiltros }) => {
  const [anosEscolares, setAnosEscolares] = useState();
  const [buscouFiltrosAvancados, setBuscouFiltrosAvancados] = useState(false);
  const [carregandoAnosEscolares, setCarregandoAnosEscolares] = useState(false);
  const [carregandoTipoEscola, setCarregandoTipoEscola] = useState(false);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [dataEnvioFim, setDataEnvioFim] = useState();
  const [dataExpiracaoFim, setDataExpiracaoFim] = useState();
  const [dataEnvioInicio, setDataEnvioInicio] = useState();
  const [dataExpiracaoInicio, setDataExpiracaoInicio] = useState();
  const [listaAnosEscolares, setListaAnosEscolares] = useState([]);
  const [listaTipoEscola, setListaTipoEscola] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [tipoEscola, setTipoEscola] = useState();
  const [titulo, setTitulo] = useState();
  const [turmasCodigo, setTurmasCodigo] = useState();
  const [ehDataValida, setEhDataValida] = useState(true);

  const ehTodasModalidade = filtrosPrincipais?.modalidades?.find(
    item => item === OPCAO_TODOS
  );

  const valorPadrao = useMemo(() => {
    const dataParcial = moment().format('MM-DD');
    const dataInteira = moment(
      `${dataParcial}-${filtrosPrincipais?.anoLetivo}`,
      'MM-DD-YYYY'
    );
    return dataInteira;
  }, [filtrosPrincipais]);

  const ObterTiposEscola = useCallback(async () => {
    setCarregandoTipoEscola(true);
    const response = await ServicoComunicados.obterTipoEscola(
      filtrosPrincipais?.dreCodigo,
      filtrosPrincipais?.ueCodigo
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoTipoEscola(false));

    const dados = response.data.length
      ? response.data.map(item => ({
          codigo: item.codTipoEscola,
          desc: item.descricao,
          id: item.id,
        }))
      : [];

    if (dados?.length > 1) {
      dados.unshift({
        valor: OPCAO_TODOS,
        desc: 'Todos',
      });
    }
    if (dados?.length === 1) {
      setTipoEscola(dados[0].codigo.toString());
    }

    setListaTipoEscola(dados);
  }, [filtrosPrincipais]);

  useEffect(() => {
    if (
      filtrosPrincipais?.dreCodigo &&
      filtrosPrincipais?.ueCodigo &&
      filtrosPrincipais?.modalidades?.length &&
      !listaTipoEscola?.length &&
      !carregandoTipoEscola
    ) {
      ObterTiposEscola();
    }
  }, [
    ObterTiposEscola,
    filtrosPrincipais,
    listaTipoEscola,
    carregandoTipoEscola,
  ]);

  const ObterAnosEscolares = useCallback(async () => {
    const todosAnosEscolares = [
      {
        valor: OPCAO_TODOS,
        desc: 'Todos',
      },
    ];

    if (ehTodasModalidade) {
      setListaAnosEscolares(todosAnosEscolares);
      setAnosEscolares([OPCAO_TODOS]);
      return;
    }

    setCarregandoAnosEscolares(true);
    const response = await ServicoComunicados.buscarAnosPorModalidade(
      filtrosPrincipais?.modalidades,
      filtrosPrincipais?.ueCodigo
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoAnosEscolares(false));

    const dados = response?.data?.length
      ? response.data.map(item => ({
          valor: item.ano,
          desc: item.ano,
        }))
      : [];
    const dadosSelecionados = dados?.length === 1 ? dados[0].valor : dados;
    if (dados?.length > 1) {
      dados.unshift({
        valor: OPCAO_TODOS,
        desc: 'Todos',
      });
    }
    setListaAnosEscolares(dadosSelecionados);
  }, [filtrosPrincipais, ehTodasModalidade]);

  useEffect(() => {
    if (
      filtrosPrincipais?.modalidades?.length &&
      filtrosPrincipais?.ueCodigo &&
      !listaAnosEscolares.length &&
      !carregandoAnosEscolares
    ) {
      ObterAnosEscolares();
    }
  }, [
    ObterAnosEscolares,
    filtrosPrincipais,
    listaAnosEscolares,
    carregandoAnosEscolares,
  ]);

  const onChangeAnosEscolares = valor => {
    setAnosEscolares(valor);
    setTurmasCodigo();
    setListaTurmas([]);
    setBuscouFiltrosAvancados(false);
  };

  useEffect(() => {
    if (ehTodasModalidade && listaAnosEscolares.length) {
      setAnosEscolares([OPCAO_TODOS]);
    }
  }, [filtrosPrincipais, ehTodasModalidade, listaAnosEscolares]);

  const obterTurmas = useCallback(async () => {
    const todasTurmas = { valor: OPCAO_TODOS, desc: 'Todas' };

    if (ehTodasModalidade) {
      setListaTurmas([todasTurmas]);
      setTurmasCodigo([OPCAO_TODOS]);
      return;
    }

    setCarregandoTurmas(true);

    const retorno = await ServicoComunicados.obterTurmas(
      filtrosPrincipais?.anoLetivo,
      filtrosPrincipais?.ueCodigo,
      filtrosPrincipais?.semestre,
      filtrosPrincipais?.modalidades,
      anosEscolares
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoTurmas(false));

    if (retorno?.data?.length) {
      const lista = [];
      if (retorno.data.length > 1) {
        lista.push(todasTurmas);
      }
      retorno.data.map(item =>
        lista.push({
          desc: item.descricao,
          valor: item.valor,
        })
      );
      setListaTurmas(lista);
      if (lista.length === 1) {
        setTurmasCodigo([String(lista[0].valor)]);
      }
    }
  }, [filtrosPrincipais, ehTodasModalidade, anosEscolares]);

  useEffect(() => {
    if (
      filtrosPrincipais?.ueCodigo &&
      filtrosPrincipais?.modalidades?.length &&
      anosEscolares?.length &&
      !listaTurmas?.length &&
      !carregandoTurmas
    ) {
      obterTurmas();
    }
  }, [
    anosEscolares,
    filtrosPrincipais,
    listaTurmas,
    carregandoTurmas,
    obterTurmas,
  ]);

  const onChangeIntervaloDatasEnvio = valor => {
    const [dtInicioEnvio, dtFimEnvio] = valor;
    setDataEnvioInicio(dtInicioEnvio);
    setDataEnvioFim(dtFimEnvio);
    setBuscouFiltrosAvancados(false);
  };

  const desabilitarDatasEnvio = current => {
    if (current && filtrosPrincipais?.anoLetivo) {
      const ano = moment(`${filtrosPrincipais?.anoLetivo}-01-01`, 'MM-DD-YYYY');
      return current < ano.startOf('year') || current > ano.endOf('year');
    }
    return false;
  };

  const onChangeIntervaloDatasExpiracao = valor => {
    const [dtInicioExpiracao, dtFimExpiracao] = valor;
    setDataExpiracaoInicio(dtInicioExpiracao);
    setDataExpiracaoFim(dtFimExpiracao);
    setBuscouFiltrosAvancados(false);
  };

  const desabilitarDatasExpiracao = current => {
    if (current && filtrosPrincipais?.anoLetivo) {
      const ano = moment(`${filtrosPrincipais?.anoLetivo}-01-01`);
      return current < ano.startOf('year') || current > ano.endOf('year');
    }
    return false;
  };

  const verificarData = useCallback(() => {
    if (!dataEnvioFim || !dataExpiracaoInicio) return true;
    return (
      moment(dataEnvioFim, 'MM-DD-YYYY') <
      moment(dataExpiracaoInicio, 'MM-DD-YYYY')
    );
  }, [dataEnvioFim, dataExpiracaoInicio]);

  useEffect(() => {
    if (dataEnvioFim && dataExpiracaoInicio) {
      const dataValida = verificarData();
      setEhDataValida(dataValida);
    }

    if (!dataEnvioFim) {
      setEhDataValida(true);
    }
  }, [dataEnvioFim, dataExpiracaoInicio, verificarData]);

  const onChangeTitulo = e => {
    setTitulo(e.target.value);
    setBuscouFiltrosAvancados(false);
  };

  const filtrarAvancado = useCallback(() => {
    const params = {
      tipoEscola,
      anosEscolares,
      turmasCodigo,
      dataEnvioInicio,
      dataEnvioFim,
      dataExpiracaoInicio,
      dataExpiracaoFim,
      titulo,
    };
    onChangeFiltros(params);
    setBuscouFiltrosAvancados(true);
  }, [
    onChangeFiltros,
    tipoEscola,
    anosEscolares,
    turmasCodigo,
    dataEnvioInicio,
    dataEnvioFim,
    dataExpiracaoInicio,
    dataExpiracaoFim,
    titulo,
  ]);

  useEffect(() => {
    const pesquisarTitulo = !titulo?.length || titulo?.length > 3;
    const dataValida = verificarData();

    if (
      (tipoEscola?.length ||
        anosEscolares?.length ||
        turmasCodigo?.length ||
        (dataEnvioInicio && dataEnvioFim) ||
        (dataExpiracaoInicio && dataExpiracaoFim)) &&
      !buscouFiltrosAvancados &&
      dataValida &&
      pesquisarTitulo
    ) {
      filtrarAvancado();
    }
  }, [
    filtrarAvancado,
    buscouFiltrosAvancados,
    tipoEscola,
    anosEscolares,
    turmasCodigo,
    dataEnvioInicio,
    dataEnvioFim,
    dataExpiracaoInicio,
    dataExpiracaoFim,
    titulo,
    verificarData,
  ]);

  useEffect(() => {
    if (
      !filtrosPrincipais?.dreCodigo ||
      !filtrosPrincipais?.ueCodigo ||
      !filtrosPrincipais?.modalidades?.length
    ) {
      setListaTipoEscola([]);
      setTipoEscola();

      setListaAnosEscolares([]);
      setAnosEscolares();

      setListaTurmas([]);
      setTurmasCodigo();
    }
  }, [filtrosPrincipais]);

  return (
    <div className="mt-4">
      <Label
        text="Filtros avançados"
        className="mb-3"
        altura="24"
        tamanhoFonte="18"
      />

      <div className="row p-0 mb-3">
        <div className="col-sm-12 col-md-4 pr-0">
          <Loader loading={carregandoTipoEscola} ignorarTip>
            <SelectComponent
              id="tipo-escola"
              lista={listaTipoEscola}
              valueOption="codigo"
              valueText="desc"
              label="Tipo de escola"
              disabled={
                !filtrosPrincipais?.modalidades ||
                !listaTipoEscola?.length ||
                listaTipoEscola?.length === 1
              }
              valueSelect={tipoEscola}
              onChange={valores => {
                onchangeMultiSelect(valores, tipoEscola, setTipoEscola);
                setBuscouFiltrosAvancados(false);
              }}
              placeholder="Selecione o tipo de escola"
              showSearch
              multiple
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-4 pr-0">
          <Loader loading={carregandoAnosEscolares} ignorarTip>
            <SelectComponent
              id="select-ano-escolar"
              lista={listaAnosEscolares}
              valueOption="valor"
              valueText="desc"
              label="Ano"
              disabled={
                !filtrosPrincipais?.modalidades?.length ||
                !listaAnosEscolares.length ||
                listaAnosEscolares?.length === 1
              }
              valueSelect={anosEscolares}
              onChange={valores => {
                onchangeMultiSelect(
                  valores,
                  anosEscolares,
                  onChangeAnosEscolares
                );
                setBuscouFiltrosAvancados(false);
              }}
              placeholder="Selecione o ano"
              multiple
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
              label="Turma"
              disabled={
                !filtrosPrincipais?.modalidades ||
                listaTurmas?.length === 1 ||
                !anosEscolares?.length
              }
              valueSelect={turmasCodigo}
              onChange={valores => {
                onchangeMultiSelect(valores, turmasCodigo, setTurmasCodigo);
                setBuscouFiltrosAvancados(false);
              }}
              placeholder="Turma"
              showSearch
            />
          </Loader>
        </div>
      </div>
      <div className="row p-0">
        <div className="col-sm-12 col-md-4 pr-0">
          <CampoData
            className="intervalo-datas"
            label="Data de envio"
            formatoData="DD/MM/YYYY"
            onChange={onChangeIntervaloDatasEnvio}
            desabilitarData={desabilitarDatasEnvio}
            valor={[dataEnvioInicio, dataEnvioFim]}
            valorPadrao={valorPadrao}
            intervaloDatas
          />
        </div>
        <div className="col-sm-12 col-md-4 pr-0">
          <CampoData
            className="intervalo-datas"
            label="Data de expiração"
            formatoData="DD/MM/YYYY"
            onChange={onChangeIntervaloDatasExpiracao}
            desabilitarData={desabilitarDatasExpiracao}
            valor={[dataExpiracaoInicio, dataExpiracaoFim]}
            valorPadrao={valorPadrao}
            intervaloDatas
            temErro={!ehDataValida}
            mensagemErro="Data de expiração deve ser maior que a data de envio"
          />
        </div>
        <div className="col-sm-12 col-md-4">
          <CampoTexto
            label="Título"
            name="titulo"
            placeholder="Pesquise pelo título do comunicado"
            value={titulo}
            onChange={onChangeTitulo}
          />
        </div>
      </div>
    </div>
  );
};

FiltrosAvancados.propTypes = {
  filtrosPrincipais: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChangeFiltros: PropTypes.func,
};

FiltrosAvancados.defaultProps = {
  filtrosPrincipais: {},
  onChangeFiltros: () => {},
};

export default FiltrosAvancados;
