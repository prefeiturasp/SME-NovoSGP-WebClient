import * as moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Loader } from '~/componentes';
import { GraficoBarras, TagGrafico } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { erros } from '~/servicos';
import ServicoDashboardFechamento from '../../../../../servicos/Paginas/Dashboard/ServicoDashboardFechamento';

const GraficoFechamentoPorEstudantes = props => {
  const { anoLetivo, dreId, ueId, modalidade, semestre, bimestre } = props;

  const dataUltimaConsolidacao = useSelector(
    store =>
      store.dashboardFrequencia?.dadosDashboardFrequencia
        ?.dataUltimaConsolidacao
  );

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoDashboardFechamento.obterFechamentoPorEstudantes(
      anoLetivo,
      dreId === OPCAO_TODOS ? '' : dreId,
      ueId === OPCAO_TODOS ? '' : ueId,
      modalidade,
      semestre,
      bimestre
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      setDadosGrafico(retorno.data);
    } else {
      setDadosGrafico([]);
    }
  }, [anoLetivo, dreId, ueId, modalidade, semestre, bimestre]);

  useEffect(() => {
    if (modalidade && anoLetivo && dreId && ueId) {
      obterDadosGrafico();
    } else {
      setDadosGrafico([]);
    }
  }, [modalidade, anoLetivo, dreId, ueId, bimestre, obterDadosGrafico]);

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
          xField="turma"
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

GraficoFechamentoPorEstudantes.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  semestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bimestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GraficoFechamentoPorEstudantes.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
  semestre: null,
  bimestre: null,
};

export default GraficoFechamentoPorEstudantes;
