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
import ServicoComunicados from '~/servicos/Paginas/AcompanhamentoEscolar/Comunicados/ServicoComunicados';
import { AbrangenciaServico, erros, ServicoFiltroRelatorio } from '~/servicos';
import { onchangeMultiSelect } from '~/utils';
import { OPCAO_TODOS } from '~/constantes/constantesGerais';

const FiltrosAvancados = ({ filtrosPrincipais, onChangeFiltros }) => {
  const [anosEscolares, setAnosEscolares] = useState();
  const [buscouFiltrosAvancados, setBuscouFiltrosAvancados] = useState(false);
  const [carregandoAnosEscolares, setCarregandoAnosEscolares] = useState(false);
  const [carregandoTipoEscola, setCarregandoTipoEscola] = useState(false);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [dataFimEnvio, setDataFimEnvio] = useState();
  const [dataFimExpiracao, setDataFimExpiracao] = useState();
  const [dataInicioEnvio, setDataInicioEnvio] = useState();
  const [dataInicioExpiracao, setDataInicioExpiracao] = useState();
  const [listaAnosEscolares, setListaAnosEscolares] = useState([]);
  const [listaTipoEscola, setListaTipoEscola] = useState([]);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [tipoEscola, setTipoEscola] = useState();
  const [titulo, setTitulo] = useState();
  const [turmasId, setTurmasId] = useState();
  const [validacaoData, setValidacaoData] = useState(false);

  const ehTodasModalidade = filtrosPrincipais?.modalidadeId?.find(
    item => item === OPCAO_TODOS
  );

  const valorPadrao = useMemo(() => {
    const dataParcial = moment().format('MM-DD');
    const dataInteira = moment(
      `${dataParcial}-${filtrosPrincipais?.anoLetivo}`
    );
    return dataInteira;
  }, [filtrosPrincipais]);

  const limparCampos = () => {
    setTipoEscola();
    setAnosEscolares();

    setListaTipoEscola([]);
    setListaAnosEscolares([]);
  };

  const ObterTiposEscola = useCallback(async () => {
    setCarregandoTipoEscola(true);
    const response = await ServicoComunicados.obterTipoEscola()
      .catch(e => erros(e))
      .finally(() => setCarregandoTipoEscola(false));

    const dados = response.data.length ? response.data : [];
    const dadosSelecionados = dados?.length === 1 ? dados[0].valor : dados;
    if (dados?.length > 1) {
      dados.unshift({
        valor: OPCAO_TODOS,
        desc: 'Todos',
      });
    }

    setListaTipoEscola(dadosSelecionados);
  }, []);

  useEffect(() => {
    if (
      filtrosPrincipais?.modalidadeId?.length &&
      filtrosPrincipais?.codigoDre &&
      filtrosPrincipais?.codigoUe &&
      !tipoEscola?.length
    ) {
      ObterTiposEscola();
    }
  }, [ObterTiposEscola, filtrosPrincipais, tipoEscola]);

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
      filtrosPrincipais?.modalidadeId,
      filtrosPrincipais?.codigoUe
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
      filtrosPrincipais?.modalidadeId?.length &&
      filtrosPrincipais?.codigoUe &&
      !listaAnosEscolares.length
    ) {
      ObterAnosEscolares();
    }
  }, [ObterAnosEscolares, filtrosPrincipais, listaAnosEscolares]);

  useEffect(() => {
    if (ehTodasModalidade && listaAnosEscolares.length) {
      setAnosEscolares([OPCAO_TODOS]);
    }
  }, [filtrosPrincipais, ehTodasModalidade, listaAnosEscolares]);

  const obterTurmas = useCallback(async () => {
    if (
      filtrosPrincipais?.codigoDre &&
      filtrosPrincipais?.codigoUe &&
      filtrosPrincipais?.modalidadeId
    ) {
      const todasTurmas = { valor: OPCAO_TODOS, nomeFiltro: 'Todas' };

      if (ehTodasModalidade) {
        setListaTurmas([todasTurmas]);
        setTurmasId([OPCAO_TODOS]);
        return;
      }

      setCarregandoTurmas(true);

      const anosConcatenados =
        anosEscolares?.length && anosEscolares.join().replace(/,/g, '&&anos=');

      const retorno = await AbrangenciaServico.buscarTurmas(
        filtrosPrincipais?.codigoUe,
        filtrosPrincipais?.modalidadeId,
        '',
        filtrosPrincipais?.anoLetivo,
        filtrosPrincipais?.consideraHistorico,
        false,
        [1, 2, 6, 7],
        anosConcatenados
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
  }, [filtrosPrincipais, ehTodasModalidade, anosEscolares]);

  useEffect(() => {
    if (filtrosPrincipais?.codigoUe) {
      obterTurmas();
      return;
    }
    setTurmasId();
    setListaTurmas([]);
  }, [filtrosPrincipais, obterTurmas]);

  const onChangeIntervaloDatasEnvio = valor => {
    const [dtInicioEnvio, dtFimEnvio] = valor;
    setDataInicioEnvio(dtInicioEnvio);
    setDataFimEnvio(dtFimEnvio);
    setBuscouFiltrosAvancados(false);
  };

  const desabilitarDatasEnvio = current => {
    if (current && filtrosPrincipais?.anoLetivo) {
      const ano = moment(`${filtrosPrincipais?.anoLetivo}-01-01`);
      return current < ano.startOf('year') || current > ano.endOf('year');
    }
    return false;
  };

  const onChangeIntervaloDatasExpiracao = valor => {
    const [dtInicioExpiracao, dtFimExpiracao] = valor;
    setDataInicioExpiracao(dtInicioExpiracao);
    setDataFimExpiracao(dtFimExpiracao);
    setBuscouFiltrosAvancados(false);
  };

  const desabilitarDatasExpiracao = current => {
    if (current && filtrosPrincipais?.anoLetivo) {
      const ano = moment(`${filtrosPrincipais?.anoLetivo}-01-01`);
      return current < ano.startOf('year') || current > ano.endOf('year');
    }
    return false;
  };

  useEffect(() => {
    if (dataFimEnvio && dataInicioExpiracao) {
      const ehDataValida = moment(dataFimEnvio) < moment(dataInicioExpiracao);
      setValidacaoData(!ehDataValida);
    }

    if (!dataFimEnvio) {
      setValidacaoData(false);
    }
  }, [dataFimEnvio, dataInicioExpiracao]);

  const onChangeTitulo = e => {
    setTitulo(e.target.value);
    setBuscouFiltrosAvancados(false);
  };

  const filtrarAvancado = useCallback(() => {
    const params = {
      tipoEscola,
      anosEscolares,
      turmasId,
      dataInicioEnvio,
      dataFimEnvio,
      dataInicioExpiracao,
      dataFimExpiracao,
      titulo,
    };
    onChangeFiltros(params);
    setBuscouFiltrosAvancados(true);
  }, [
    onChangeFiltros,
    tipoEscola,
    anosEscolares,
    turmasId,
    dataInicioEnvio,
    dataFimEnvio,
    dataInicioExpiracao,
    dataFimExpiracao,
    titulo,
  ]);

  useEffect(() => {
    const pesquisarTitulo = titulo?.length === 0 || titulo?.length > 3;
    if (
      (tipoEscola?.length ||
        anosEscolares?.length ||
        turmasId?.length ||
        (dataInicioEnvio && dataFimEnvio) ||
        (dataInicioExpiracao && dataFimExpiracao) ||
        pesquisarTitulo) &&
      !buscouFiltrosAvancados
    ) {
      filtrarAvancado();
    }
  }, [
    filtrarAvancado,
    buscouFiltrosAvancados,
    tipoEscola,
    anosEscolares,
    turmasId,
    dataInicioEnvio,
    dataFimEnvio,
    dataInicioExpiracao,
    dataFimExpiracao,
    titulo,
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
                !filtrosPrincipais?.modalidadeId ||
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
                !filtrosPrincipais?.modalidadeId?.length ||
                !listaAnosEscolares.length ||
                listaAnosEscolares?.length === 1
              }
              valueSelect={anosEscolares}
              onChange={valores => {
                onchangeMultiSelect(valores, anosEscolares, setAnosEscolares);
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
              valueText="nomeFiltro"
              label="Turma"
              disabled={
                !filtrosPrincipais?.modalidadeId || listaTurmas?.length === 1
              }
              valueSelect={turmasId}
              onChange={valores => {
                onchangeMultiSelect(valores, turmasId, setTurmasId);
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
            valor={[dataInicioEnvio, dataFimEnvio]}
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
            valor={[dataInicioExpiracao, dataFimExpiracao]}
            valorPadrao={valorPadrao}
            intervaloDatas
            temErro={validacaoData}
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
