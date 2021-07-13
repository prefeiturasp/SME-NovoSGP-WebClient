import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { CampoData, Loader, SelectComponent } from '~/componentes';
import { GraficoBarras, TagGrafico } from '~/componentes-sgp';

import { OPCAO_TODOS } from '~/constantes/constantes';
import { erros } from '~/servicos';
import { tipoGraficos } from '~/dtos';
import { obterTodosMeses } from '~/utils';

import ServicoDashboardFrequencia from '~/servicos/Paginas/Dashboard/ServicoDashboardFrequencia';

const GraficoTotalEstudantesPresenciasRemotosAusentesPorDre = ({
  anoLetivo,
  modalidade,
  semestre,
}) => {
  const mesAtual = Number(moment().format('MM'));

  const [anoTurma, setAnoTurma] = useState();
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [dataDiaria, setDataDiaria] = useState(moment());
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaMeses, setListaMeses] = useState([]);
  const [listaTipoGrafico, setListaTipoGrafico] = useState([]);
  const [dataMensal, setDataMensal] = useState(mesAtual.toString());
  const [dataSemanal, setDataSemanal] = useState();
  const [tipoPeriodoDashboard, setTipoPeriodoDashboard] = useState('1');

  const listaAnosEscolares = useSelector(
    store =>
      store.dashboardFrequencia?.dadosDashboardFrequencia?.listaAnosEscolares
  );

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoDashboardFrequencia.obterTotalEstudantesPresenciasRemotosAusentesPorDre(
      anoLetivo,
      modalidade,
      semestre,
      anoTurma,
      null, // dataInicio,
      null, // dataFim
      tipoPeriodoDashboard
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
    // dataInicio,
    // dataFim,
    tipoPeriodoDashboard,
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
    // dataInicio,
    // dataFim,
    tipoPeriodoDashboard,
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

  const obterTipoGraficos = () => {
    const retorno = Object.keys(tipoGraficos).map(item => tipoGraficos[item]);
    setListaTipoGrafico(retorno);
  };

  useEffect(() => {
    if (!listaTipoGrafico?.length) {
      obterTipoGraficos();
    }
  }, [listaTipoGrafico]);

  const onChangeTipoPeriodoDashboard = valor => {
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

  const obterListaMeses = useCallback(() => {
    const retorno = obterTodosMeses();
    setListaMeses(retorno);
  }, []);

  useEffect(() => {
    if (!obterListaMeses?.length) {
      obterListaMeses();
    }
  }, [obterListaMeses]);

  const onChangeDataMensal = mes => {
    setDataMensal(mes);
  };

  const onChangeDataSemanal = semana => {
    setDataSemanal(semana);
  };

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
            lista={[]}
            valueOption="valor"
            valueText="desc"
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
        className={exibirLoader ? 'text-center' : ''}
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
