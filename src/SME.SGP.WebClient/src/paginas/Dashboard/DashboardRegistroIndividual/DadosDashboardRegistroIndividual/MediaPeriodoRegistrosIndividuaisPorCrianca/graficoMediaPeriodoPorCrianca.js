import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '~/componentes';
import { GraficoBarras, TagGrafico } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { erros } from '~/servicos';
import ServicoDashboardRegistroIndividual from '~/servicos/Paginas/Dashboard/ServicoDashboardRegistroIndividual';

const GraficoMediaPeriodoPorCrianca = props => {
  const { anoLetivo, dreId, ueId, modalidade } = props;

  const dataUltimaConsolidacao = useSelector(
    store =>
      store.dashboardRegistroIndividual?.dadosDashboardRegistroIndividual
        ?.dataUltimaConsolidacao
  );

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoDashboardRegistroIndividual.obterMediaPeriodoRegistrosIndividuaisPorCrianca(
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
    if (anoLetivo && dreId && ueId && modalidade) {
      obterDadosGrafico();
    } else {
      setDadosGrafico([]);
    }
  }, [anoLetivo, dreId, ueId, modalidade, obterDadosGrafico]);

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
        <GraficoBarras data={dadosGrafico} xAxisVisible legendVisible={false} />
      ) : !exibirLoader ? (
        <div className="text-center">Sem dados</div>
      ) : (
        ''
      )}
    </Loader>
  );
};

GraficoMediaPeriodoPorCrianca.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GraficoMediaPeriodoPorCrianca.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
};

export default GraficoMediaPeriodoPorCrianca;
