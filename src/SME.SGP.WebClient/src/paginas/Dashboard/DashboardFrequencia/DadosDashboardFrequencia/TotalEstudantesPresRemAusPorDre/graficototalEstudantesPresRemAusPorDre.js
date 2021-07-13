import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { CampoData, Loader, SelectComponent } from '~/componentes';
import { GraficoBarras, TagGrafico } from '~/componentes-sgp';

import { OPCAO_TODOS } from '~/constantes/constantes';
import { erros, ServicoDashboardFrequencia } from '~/servicos';
import { tipoGraficos } from '~/dtos';
import { obterTodosMeses } from '~/utils';

const GraficoTotalEstudantesPresenciasRemotosAusentesPorDre = ({
  anoLetivo,
  modalidade,
  semestre,
}) => {
  const mesAtual = Number(moment().format('MM'));

  const [anoTurma, setAnoTurma] = useState();
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [dataDiaria, setDataDiaria] = useState(moment());
  const [dataFim, setDataFim] = useState();
  const [dataInicio, setDataInicio] = useState();
  const [dataMensal, setDataMensal] = useState(mesAtual.toString());
  const [dataSemanal, setDataSemanal] = useState();
  const [exibirLoader, setExibirLoader] = useState(false);
  const [tipoPeriodoDashboard, setTipoPeriodoDashboard] = useState('1');

  const listaAnosEscolares = useSelector(
    store =>
      store.dashboardFrequencia?.dadosDashboardFrequencia?.listaAnosEscolares
  );
  const listaTipoGrafico = useSelector(
    store =>
      store.dashboardFrequencia?.dadosDashboardFrequencia?.listaTipoGrafico
  );
  const listaMeses = useSelector(
    store => store.dashboardFrequencia?.dadosDashboardFrequencia?.listaMeses
  );
  const listaSemanas = useSelector(
    store => store.dashboardFrequencia?.dadosDashboardFrequencia?.listaSemanas
  );

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const ehTipoMensal =
      Number(tipoPeriodoDashboard) === tipoGraficos.MENSAL.valor;
    const dataDiariaSelecionada = ehTipoMensal
      ? undefined
      : dataDiaria.format('YYYY-MM-DD');
    const dataSelecionada = dataInicio || dataDiariaSelecionada;
    const retorno = await ServicoDashboardFrequencia.obterTotalEstudantesPresenciasRemotosAusentesPorDre(
      anoLetivo,
      modalidade,
      semestre,
      anoTurma,
      dataSelecionada,
      dataFim,
      tipoPeriodoDashboard,
      dataMensal
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    let dadosRetorno = [];
    if (retorno?.data) {
      dadosRetorno = retorno.data;
    }

    setDadosGrafico(dadosRetorno);
  }, [
    anoLetivo,
    modalidade,
    semestre,
    anoTurma,
    dataDiaria,
    dataInicio,
    dataFim,
    tipoPeriodoDashboard,
    dataMensal,
  ]);

  useEffect(() => {
    if (anoLetivo && modalidade && anoTurma && modalidade) {
      obterDadosGrafico();
      return;
    }
    setDadosGrafico([]);
  }, [
    anoLetivo,
    modalidade,
    semestre,
    anoTurma,
    dataInicio,
    dataDiaria,
    dataFim,
    tipoPeriodoDashboard,
    dataMensal,
    obterDadosGrafico,
  ]);

  useEffect(() => {
    if (listaAnosEscolares?.length === 1) {
      setAnoTurma(listaAnosEscolares[0].ano);
    }
    if (listaAnosEscolares?.length > 1) {
      setAnoTurma(OPCAO_TODOS);
    }
  }, [listaAnosEscolares]);

  const onChangeAnoTurma = valor => {
    setAnoTurma(valor);
  };

  useEffect(() => {
    if (!listaTipoGrafico?.length) {
      ServicoDashboardFrequencia.obterTipoGraficos(tipoGraficos);
    }
  }, [listaTipoGrafico]);

  const limparDatas = () => {
    setDataInicio(undefined);
    setDataFim(undefined);
    setDataDiaria(moment());
    setDataSemanal(undefined);
  };

  const onChangeTipoPeriodoDashboard = valor => {
    limparDatas();
    setTipoPeriodoDashboard(valor);
  };

  const desabilitarData = dataCorrente => {
    return (
      dataCorrente &&
      (dataCorrente > moment() || dataCorrente < moment(`01-01-${anoLetivo}`))
    );
  };

  const onChangeDataDiaria = data => {
    setDataDiaria(data);
  };

  useEffect(() => {
    if (!listaMeses?.length) {
      ServicoDashboardFrequencia.obterListaMeses(obterTodosMeses);
    }
  }, [listaMeses]);

  const onChangeDataMensal = mes => {
    setDataMensal(mes);
  };

  const onChangeDataSemanal = semana => {
    const semanaSelecionada = listaSemanas.find(item => item.valor === semana);
    setDataInicio(semanaSelecionada?.inicio);
    setDataFim(semanaSelecionada?.fim);
    setDataSemanal(semana);
  };

  const obterSemanas = useCallback(async () => {
    const retorno = await ServicoDashboardFrequencia.obterSemanas(
      anoLetivo
    ).catch(e => erros(e));

    if (retorno?.data) {
      ServicoDashboardFrequencia.atualizarFiltros('listaSemanas', retorno.data);
    }
  }, [anoLetivo]);

  useEffect(() => {
    const ehTipoSemanal =
      Number(tipoPeriodoDashboard) === tipoGraficos.SEMANAL.valor;
    if (!listaSemanas?.length && ehTipoSemanal) {
      obterSemanas();
      return;
    }

    if (listaSemanas?.length && ehTipoSemanal) {
      setDataSemanal(listaSemanas[0].valor);
      setDataInicio(listaSemanas[0].inicio);
      setDataFim(listaSemanas[0].fim);
    }
  }, [listaSemanas, tipoPeriodoDashboard, obterSemanas]);

  const montarCampoData = valor => {
    switch (valor) {
      case '1':
        return (
          <CampoData
            name="data"
            placeholder="Selecione"
            valor={dataDiaria}
            formatoData="DD/MM/YYYY"
            onChange={onChangeDataDiaria}
            desabilitarData={desabilitarData}
          />
        );
      case '2':
        return (
          <SelectComponent
            lista={listaSemanas}
            valueOption="valor"
            valueText="descricao"
            valueSelect={dataSemanal}
            onChange={onChangeDataSemanal}
            placeholder="Selecione o tipo"
            allowClear={false}
          />
        );
      case '3':
        return (
          <SelectComponent
            lista={listaMeses}
            valueOption="numeroMes"
            valueText="nome"
            valueSelect={dataMensal}
            onChange={onChangeDataMensal}
            placeholder="Selecione a data"
            allowClear={false}
          />
        );
      default:
        return '';
    }
  };

  return (
    <>
      <div className="col-12 p-0">
        <div className="row">
          <div className="col-sm-12 col-md-4 mb-2 pr-0">
            <SelectComponent
              lista={listaAnosEscolares || []}
              valueOption="ano"
              valueText="modalidadeAno"
              disabled={listaAnosEscolares?.length === 1}
              valueSelect={anoTurma}
              onChange={onChangeAnoTurma}
              placeholder="Selecione o ano"
              allowClear={false}
            />
          </div>
          <div className="col-sm-12 col-md-4 mb-2 pr-0">
            <SelectComponent
              lista={listaTipoGrafico}
              valueOption="valor"
              valueText="desc"
              valueSelect={tipoPeriodoDashboard}
              onChange={onChangeTipoPeriodoDashboard}
              placeholder="Selecione o tipo"
              allowClear={false}
            />
          </div>
          <div className="col-sm-12 col-md-4 mb-2">
            {montarCampoData(tipoPeriodoDashboard)}
          </div>
        </div>
        <div className="row">
          {dadosGrafico?.totalFrequenciaFormatado && (
            <div className="col-sm-12 mb-2">
              <TagGrafico valor={dadosGrafico?.totalFrequenciaFormatado} />
            </div>
          )}
        </div>
      </div>
      <Loader
        loading={exibirLoader}
        className={exibirLoader ? 'text-center my-4' : ''}
      >
        {dadosGrafico?.dadosFrequenciaDashboard && (
          <GraficoBarras
            data={dadosGrafico?.dadosFrequenciaDashboard}
            xField="turmaAno"
            xAxisVisible
            isGroup
            colors={['#689F38', '#F57C00', '#D32F2F', '#512DA8']}
            marginRatio={[0.5]}
            radius={[6, 6, 0, 0]}
            labelVisible={false}
          />
        )}
        {!exibirLoader && !dadosGrafico?.dadosFrequenciaDashboard && (
          <div className="text-center">Sem dados</div>
        )}
      </Loader>
    </>
  );
};

GraficoTotalEstudantesPresenciasRemotosAusentesPorDre.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  semestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GraficoTotalEstudantesPresenciasRemotosAusentesPorDre.defaultProps = {
  anoLetivo: null,
  modalidade: null,
  semestre: null,
};

export default GraficoTotalEstudantesPresenciasRemotosAusentesPorDre;
