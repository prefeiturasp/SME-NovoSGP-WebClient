import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { TagGrafico } from '~/componentes-sgp';
import GraficoBarras from '~/componentes-sgp/Graficos/graficoBarras';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { erros, ServicoDashboardFrequencia } from '~/servicos';
import ServicoDashboardDiarioBordo from '~/servicos/Paginas/Dashboard/ServicoDashboardDiarioBordo';

const GraficoTotalDiariosBordoPorDRE = props => {
  const { anoLetivo, dreId, ueId, modalidade } = props;

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const [listaAnosEscolares, setListaAnosEscolares] = useState([]);
  const [anoEscolar, setAnoEscolar] = useState();

  const [dataUltimaConsolidacao, setDataUltimaConsolidacao] = useState();

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoDashboardDiarioBordo.obterTotalDiariosBordoPorDRE(
      anoLetivo,
      anoEscolar === OPCAO_TODOS ? '' : anoEscolar
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      setDadosGrafico(retorno.data);
    } else {
      setDadosGrafico([]);
    }
  }, [anoLetivo, anoEscolar]);

  useEffect(() => {
    if (anoLetivo && anoEscolar) {
      obterDadosGrafico();
    } else {
      setDadosGrafico([]);
    }
  }, [anoLetivo, anoEscolar, obterDadosGrafico]);

  const obterAnosEscolares = useCallback(async () => {
    const respota = await ServicoDashboardFrequencia.obterAnosEscolaresPorModalidade(
      anoLetivo,
      dreId === OPCAO_TODOS ? '' : dreId,
      ueId === OPCAO_TODOS ? '' : ueId,
      modalidade
    ).catch(e => erros(e));

    if (respota?.data?.length) {
      if (respota.data.length === 1) {
        setAnoEscolar(respota.data[0].ano);
      } else if (respota.data.length > 1) {
        respota.data.unshift({ ano: OPCAO_TODOS, modalidadeAno: 'Todos' });
        setAnoEscolar(OPCAO_TODOS);
      }
      setListaAnosEscolares(respota.data);
    } else {
      setListaAnosEscolares([]);
    }
  }, [anoLetivo, dreId, ueId, modalidade]);

  useEffect(() => {
    if (anoLetivo && dreId && ueId && modalidade) {
      obterAnosEscolares();
    } else {
      setListaAnosEscolares([]);
    }
  }, [anoLetivo, dreId, ueId, modalidade, obterAnosEscolares]);

  const onChangeAnoEscolar = valor => {
    setAnoEscolar(valor);
  };

  const obterUltimaConsolidacao = useCallback(async () => {
    if (anoLetivo) {
      const resposta = await ServicoDashboardDiarioBordo.obterUltimaConsolidacao(
        anoLetivo
      ).catch(e => erros(e));

      if (resposta?.data) {
        setDataUltimaConsolidacao(resposta.data);
      } else {
        setDataUltimaConsolidacao();
      }
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
      <div className="row">
        <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
          <SelectComponent
            lista={listaAnosEscolares || []}
            valueOption="ano"
            valueText="modalidadeAno"
            disabled={listaAnosEscolares?.length === 1}
            valueSelect={anoEscolar}
            onChange={onChangeAnoEscolar}
            placeholder="Selecione o ano"
            allowClear={false}
          />
        </div>
      </div>

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
          xField="dre"
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

GraficoTotalDiariosBordoPorDRE.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GraficoTotalDiariosBordoPorDRE.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
};

export default GraficoTotalDiariosBordoPorDRE;
