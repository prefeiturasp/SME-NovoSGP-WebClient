import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { Loader, SelectComponent } from '~/componentes';
import GraficoBarras from '~/componentes-sgp/Graficos/graficoBarras';

import { OPCAO_TODOS } from '~/constantes/constantes';
import { erros } from '~/servicos';

import DataUltimaAtualizacao from '~/componentes-sgp/DataUltimaAtualizacao/dataUltimaAtualizacao';
import ServicoDashboardFrequencia from '~/servicos/Paginas/Dashboard/ServicoDashboardFrequencia';

const GraficoTotalEstudantesPresenciasRemotosAusentes = ({
  anoLetivo,
  dreId,
  ueId,
  modalidade,
  semestre,
}) => {
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [anoTurma, setAnoTurma] = useState();

  const dataUltimaConsolidacao = useSelector(
    store =>
      store.dashboardFrequencia?.dadosDashboardFrequencia
        ?.dataUltimaConsolidacao
  );

  const listaAnosEscolares = useSelector(
    store =>
      store.dashboardFrequencia?.dadosDashboardFrequencia?.listaAnosEscolares
  );

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoDashboardFrequencia.obterTotalEstudantesPresenciasRemotosAusentes(
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      anoTurma
      // dataInicio,
      // dataFim,
      // tipoPeriodoDashboard
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    let dadosRetorno = [];
    if (retorno?.data) {
      dadosRetorno = retorno.data;
    }

    setDadosGrafico(dadosRetorno);
  }, [anoLetivo, dreId, ueId, modalidade, anoTurma]);

  useEffect(() => {
    if (anoLetivo && modalidade && anoTurma && modalidade) {
      obterDadosGrafico();
    } else {
      setDadosGrafico([]);
    }
  }, [anoLetivo, modalidade, anoTurma, semestre, obterDadosGrafico]);

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

  const data = [
    {
      descricao: 'Presentes',
      turmaAno: 'EF-1',
      quantidade: 130,
    },
    {
      descricao: 'Remotos',
      turmaAno: 'EF-1',
      quantidade: 800,
    },

    {
      descricao: 'Ausentes',
      turmaAno: 'EF-1',
      quantidade: 546,
    },

    {
      descricao: 'Total de estudantes',
      turmaAno: 'EF-1',
      quantidade: 1234,
    },
    {
      descricao: 'Presentes',
      turmaAno: 'EF-2',
      quantidade: 70,
    },
    {
      descricao: 'Remotos',
      turmaAno: 'EF-2',
      quantidade: 400,
    },

    {
      descricao: 'Ausentes',
      turmaAno: 'EF-2',
      quantidade: 346,
    },

    {
      descricao: 'Total de estudantes',
      turmaAno: 'EF-2',
      quantidade: 234,
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
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
        {dataUltimaConsolidacao && (
          <div className="col-sm-12 col-md-6 col-lg-9 col-xl-9 mb-2">
            <DataUltimaAtualizacao
              dataFormatada={dadosGrafico?.totalFrequenciaFormatado}
            />
          </div>
        )}
      </div>
      <Loader
        loading={exibirLoader}
        className={exibirLoader ? 'text-center' : ''}
      >
        {dadosGrafico?.dadosFrequenciaDashboard ? (
          <GraficoBarras
            // data={dadosGrafico?.dadosFrequenciaDashboard}
            data={data}
            xField="turmaAno"
            xAxisVisible
            isGroup
            colors={['#689F38', '#F57C00', '#D32F2F', '#512DA8']}
          />
        ) : !exibirLoader ? (
          <div className="text-center">Sem dados</div>
        ) : (
          ''
        )}
      </Loader>
    </>
  );
};

GraficoTotalEstudantesPresenciasRemotosAusentes.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  semestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GraficoTotalEstudantesPresenciasRemotosAusentes.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
  semestre: null,
};

export default GraficoTotalEstudantesPresenciasRemotosAusentes;
