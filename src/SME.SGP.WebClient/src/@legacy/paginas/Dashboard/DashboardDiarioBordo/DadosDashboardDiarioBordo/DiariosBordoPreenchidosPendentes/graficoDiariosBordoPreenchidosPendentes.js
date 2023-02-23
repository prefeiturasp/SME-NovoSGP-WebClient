import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader } from '~/componentes';
import GraficoBarras from '~/componentes-sgp/Graficos/graficoBarras';
import { TagGrafico } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { erros } from '~/servicos';
import ServicoDashboardDiarioBordo from '~/servicos/Paginas/Dashboard/ServicoDashboardDiarioBordo';

const GraficoDiariosBordoPreenchidosPendentes = props => {
  const { anoLetivo, dreId, ueId, modalidade } = props;

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const [dataUltimaConsolidacao, setDataUltimaConsolidacao] = useState();

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoDashboardDiarioBordo.obterDiariosBordoPreenchidosPendentes(
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

  const obterUltimaConsolidacao = useCallback(async () => {
    if (anoLetivo) {
      const resposta = await ServicoDashboardDiarioBordo.obterUltimaConsolidacao(
        anoLetivo
      ).catch(e => erros(e));

      const dados = resposta?.data || [];

      setDataUltimaConsolidacao(dados);
    }
  }, [anoLetivo]);

  useEffect(() => {
    obterUltimaConsolidacao();
  }, [anoLetivo, obterUltimaConsolidacao]);

  return (
    <Loader
      loading={exibirLoader}
      className={exibirLoader ? 'text-center' : ''}
    >
      {dataUltimaConsolidacao ? (
        <TagGrafico
          valor={
            dataUltimaConsolidacao
              ? `Data da última atualização: ${moment(
                  dataUltimaConsolidacao
                ).format('DD/MM/YYYY HH:mm:ss')}`
              : ''
          }
        />
      ) : (
        <></>
      )}
      {dadosGrafico?.length ? (
        <GraficoBarras
          data={dadosGrafico}
          xField="turmaAno"
          xAxisVisible
          isGroup
          colors={['#0288D1', '#F57C00']}
          showScrollbar
        />
      ) : !exibirLoader ? (
        <div className="text-center">Sem dados</div>
      ) : (
        <></>
      )}
    </Loader>
  );
};

GraficoDiariosBordoPreenchidosPendentes.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GraficoDiariosBordoPreenchidosPendentes.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
};

export default GraficoDiariosBordoPreenchidosPendentes;
