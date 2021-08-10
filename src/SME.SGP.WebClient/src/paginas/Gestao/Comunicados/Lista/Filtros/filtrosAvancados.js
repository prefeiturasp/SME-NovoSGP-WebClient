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

const FiltrosAvancados = ({
  atualizaFiltrosAvançados,
  filtrosPrincipais,
  onChangeFiltros,
  setAtualizaFiltrosAvançados,
  temModalidadeEja,
}) => {
  const [anosEscolares, setAnosEscolares] = useState();
  const [buscouFiltrosAvancados, setBuscouFiltrosAvancados] = useState(false);
  const [carregandoAnosEscolares, setCarregandoAnosEscolares] = useState(false);
  const [carregandoTipoEscola, setCarregandoTipoEscola] = useState(false);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [dataEnvioFim, setDataEnvioFim] = useState();
  const [dataExpiracaoFim, setDataExpiracaoFim] = useState();
  const [dataEnvioInicio, setDataEnvioInicio] = useState();
  const [dataExpiracaoInicio, setDataExpiracaoInicio] = useState();
  const [ehDataValida, setEhDataValida] = useState(true);
  const [listaAnosEscolares, setListaAnosEscolares] = useState([]);
  const [listaTipoEscola, setListaTipoEscola] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [tipoEscola, setTipoEscola] = useState();
  const [titulo, setTitulo] = useState();
  const [turmasCodigo, setTurmasCodigo] = useState();

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
          valor: item.codTipoEscola,
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
    setListaTipoEscola(dados);
    if (dados?.length === 1) {
      setTipoEscola([String(dados[0].valor)]);
    }
  }, [filtrosPrincipais]);

  useEffect(() => {
    if (
      filtrosPrincipais?.dreCodigo &&
      filtrosPrincipais?.ueCodigo &&
      filtrosPrincipais?.modalidades?.length
    ) {
      ObterTiposEscola();
    }
  }, [ObterTiposEscola, filtrosPrincipais]);

  const ObterAnosEscolares = useCallback(async () => {
    const todosAnosEscolares = {
      valor: OPCAO_TODOS,
      desc: 'Todos',
    };
    if (ehTodasModalidade) {
      setListaAnosEscolares([todosAnosEscolares]);
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
          desc: item.descricao,
        }))
      : [];

    if (dados?.length === 1) {
      const ehTodosAnos = dados[0].valor === OPCAO_TODOS;

      if (ehTodosAnos) {
        setListaAnosEscolares([todosAnosEscolares]);
        setAnosEscolares([OPCAO_TODOS]);
        return;
      }
      setAnosEscolares([dados[0].valor]);
    }
    if (dados?.length > 1) {
      dados.unshift(todosAnosEscolares);
    }
    setListaAnosEscolares(dados);
  }, [filtrosPrincipais, ehTodasModalidade]);

  useEffect(() => {
    if (filtrosPrincipais?.modalidades?.length && filtrosPrincipais?.ueCodigo) {
      ObterAnosEscolares();
    }
  }, [ObterAnosEscolares, filtrosPrincipais]);

  const onChangeAnosEscolares = valor => {
    setAnosEscolares(valor);
    setTurmasCodigo();
    setListaTurmas([]);
    setBuscouFiltrosAvancados(false);
  };

  useEffect(() => {
    if (ehTodasModalidade && listaAnosEscolares?.length) {
      setAnosEscolares([OPCAO_TODOS]);
    }
  }, [filtrosPrincipais, ehTodasModalidade, listaAnosEscolares]);

  const obterTurmas = useCallback(async () => {
    const todasTurmas = { valor: OPCAO_TODOS, desc: 'Todas' };
    const ehTodasUe = filtrosPrincipais?.ueCodigo === OPCAO_TODOS;

    if (ehTodasModalidade || ehTodasUe) {
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
      anosEscolares,
      filtrosPrincipais?.consideraHistorico
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
          desc: item.descricaoTurma,
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
      anosEscolares?.length
    ) {
      obterTurmas();
    }
  }, [anosEscolares, filtrosPrincipais, obterTurmas]);

  const onChangeIntervaloDatasEnvio = valor => {
    const [dtInicioEnvio, dtFimEnvio] = valor;
    setDataEnvioInicio(dtInicioEnvio);
    setDataEnvioFim(dtFimEnvio);
    setBuscouFiltrosAvancados(false);
  };

  const onChangeIntervaloDatasExpiracao = valor => {
    const [dtInicioExpiracao, dtFimExpiracao] = valor;
    setDataExpiracaoInicio(dtInicioExpiracao);
    setDataExpiracaoFim(dtFimExpiracao);
    setBuscouFiltrosAvancados(false);
  };

  const desabilitarDatas = current => {
    if (current && filtrosPrincipais?.anoLetivo) {
      const ano = moment(`${filtrosPrincipais?.anoLetivo}-01-01`);
      return current < ano.startOf('year') || current > ano.endOf('year');
    }
    return false;
  };

  const verificarData = useCallback(() => {
    if (!dataEnvioInicio || !dataExpiracaoInicio) return true;
    return (
      moment(dataEnvioInicio, 'MM-DD-YYYY') <=
      moment(dataExpiracaoInicio, 'MM-DD-YYYY')
    );
  }, [dataEnvioInicio, dataExpiracaoInicio]);

  useEffect(() => {
    const dataValida = verificarData();
    setEhDataValida(dataValida);
  }, [dataEnvioFim, dataExpiracaoInicio, verificarData]);

  const onChangeTitulo = e => {
    setTitulo(e?.target?.value);
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
    const pesquisarTitulo = !titulo?.length || titulo?.length >= 3;
    const dataValida = verificarData();

    if (!buscouFiltrosAvancados && dataValida && pesquisarTitulo) {
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
      !filtrosPrincipais?.modalidades?.length ||
      (filtrosPrincipais?.modalidades?.length && atualizaFiltrosAvançados)
    ) {
      setAtualizaFiltrosAvançados(false);

      setListaTipoEscola([]);
      setTipoEscola();

      setListaAnosEscolares([]);
      setAnosEscolares();

      setListaTurmas([]);
      setTurmasCodigo();
    }
  }, [
    filtrosPrincipais,
    atualizaFiltrosAvançados,
    setAtualizaFiltrosAvançados,
  ]);

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
              valueOption="valor"
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
                listaAnosEscolares?.length === 1 ||
                ehTodasModalidade ||
                (temModalidadeEja && !filtrosPrincipais?.semestre)
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
                !listaTurmas?.length ||
                !anosEscolares?.length ||
                ehTodasModalidade ||
                (temModalidadeEja && !filtrosPrincipais?.semestre)
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
            desabilitarData={desabilitarDatas}
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
            desabilitarData={desabilitarDatas}
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
  atualizaFiltrosAvançados: PropTypes.bool,
  filtrosPrincipais: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChangeFiltros: PropTypes.func,
  setAtualizaFiltrosAvançados: PropTypes.func,
  temModalidadeEja: PropTypes.bool,
};

FiltrosAvancados.defaultProps = {
  atualizaFiltrosAvançados: false,
  filtrosPrincipais: {},
  onChangeFiltros: () => {},
  setAtualizaFiltrosAvançados: () => {},
  temModalidadeEja: false,
};

export default FiltrosAvancados;
