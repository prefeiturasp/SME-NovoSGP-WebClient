import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '~/componentes';
import { GraficoBarras, TagGrafico } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes';
import { erros } from '~/servicos';
import ServicoDashboardDevolutivas from '~/servicos/Paginas/Dashboard/ServicoDashboardDevolutivas';

const GraficoQtdDevolutivasRegistradasEstimada = props => {
  const { anoLetivo, dreId, ueId, modalidade } = props;

  const dataUltimaConsolidacao = useSelector(
    store =>
      store.dashboardDevolutivas?.dadosDashboardDevolutivas
        ?.dataUltimaConsolidacao
  );

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno =
      await ServicoDashboardDevolutivas.obterQtdDevolutivasRegistradasEstimada(
        anoLetivo,
        dreId === OPCAO_TODOS ? '' : dreId,
        ueId === OPCAO_TODOS ? '' : ueId,
        modalidade
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      setDadosGrafico(retorno.data);
    } else {
      setDadosGrafico([]);
    }
  }, [anoLetivo, dreId, ueId, modalidade]);

  useEffect(() => {
    if (modalidade && anoLetivo && dreId && ueId) {
      obterDadosGrafico();
    } else {
      setDadosGrafico([]);
    }
  }, [modalidade, anoLetivo, dreId, ueId, obterDadosGrafico]);

  return (
    <Loader
      loading={exibirLoader}
      className={exibirLoader ? 'text-center' : ''}
    >
      {dataUltimaConsolidacao && (
        <TagGrafico
          valor={
            dataUltimaConsolidacao
              ? `Data da última atualização: ${moment(
                  dataUltimaConsolidacao
                ).format('DD/MM/YYYY HH:mm:ss')}`
              : ''
          }
        />
      )}
      {dadosGrafico?.length ? (
        <GraficoBarras
          data={dadosGrafico}
          xField="turmaAno"
          xAxisVisible
          isGroup
          colors={['#0288D1', '#F57C00']}
        />
      ) : !exibirLoader ? (
        <div className="text-center">Sem dados</div>
      ) : (
        ''
      )}
    </Loader>
  );
};

GraficoQtdDevolutivasRegistradasEstimada.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GraficoQtdDevolutivasRegistradasEstimada.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
};

export default GraficoQtdDevolutivasRegistradasEstimada;
