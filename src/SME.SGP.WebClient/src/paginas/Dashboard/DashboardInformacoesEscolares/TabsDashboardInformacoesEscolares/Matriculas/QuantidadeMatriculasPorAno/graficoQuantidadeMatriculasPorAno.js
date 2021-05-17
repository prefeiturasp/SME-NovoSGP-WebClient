import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import DataUltimaAtualizacao from '~/componentes-sgp/DataUltimaAtualizacao/dataUltimaAtualizacao';
import GraficoBarras from '~/componentes-sgp/Graficos/graficoBarras';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { erros } from '~/servicos';
import ServicoDashboardInformacoesEscolares from '~/servicos/Paginas/Dashboard/ServicoDashboardInformacoesEscolares';

const GraficoQuantidadeMatriculasPorAno = props => {
  const { anoLetivo, dreId, ueId, modalidade, listaAnosEscolares } = props;

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [anoEscolar, setAnoEscolar] = useState();

  // TODO MOCK!
  const dataUltimaConsolidacao = moment();

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoDashboardInformacoesEscolares.obterQuantidadeMatriculasPorAno(
      anoLetivo,
      dreId === OPCAO_TODOS ? '' : dreId,
      ueId === OPCAO_TODOS ? '' : ueId,
      modalidade,
      anoEscolar === OPCAO_TODOS ? '' : anoEscolar
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      setDadosGrafico(retorno.data);
    } else {
      setDadosGrafico([]);
    }
  }, [anoLetivo, dreId, ueId, modalidade, anoEscolar]);

  useEffect(() => {
    if (anoLetivo && dreId && ueId && modalidade) {
      obterDadosGrafico();
    } else {
      setDadosGrafico([]);
    }
  }, [anoLetivo, dreId, ueId, modalidade, anoEscolar, obterDadosGrafico]);

  useEffect(() => {
    if (dreId === OPCAO_TODOS && ueId === OPCAO_TODOS) {
      if (listaAnosEscolares?.length === 1) {
        setAnoEscolar(String(listaAnosEscolares[0].ano));
      }
      if (listaAnosEscolares?.length > 1) {
        setAnoEscolar(OPCAO_TODOS);
      }
    }
  }, [listaAnosEscolares, dreId, ueId]);

  const onChangeAnoEscolar = valor => setAnoEscolar(valor);

  return (
    <>
      <div className="row">
        {dreId === OPCAO_TODOS && ueId === OPCAO_TODOS && (
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
        )}
        {dataUltimaConsolidacao && (
          <div className="col-sm-12 col-md-6 col-lg-9 col-xl-9 mb-2">
            <DataUltimaAtualizacao
              dataFormatada={
                dataUltimaConsolidacao
                  ? moment(dataUltimaConsolidacao).format('DD/MM/YYYY HH:mm:ss')
                  : ''
              }
            />
          </div>
        )}
      </div>
      <Loader
        loading={exibirLoader}
        className={exibirLoader ? 'text-center' : ''}
      >
        {dadosGrafico?.length ? (
          <GraficoBarras
            data={dadosGrafico}
            xAxisVisible
            legendVisible={false}
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

GraficoQuantidadeMatriculasPorAno.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.string,
  listaAnosEscolares: PropTypes.oneOfType(PropTypes.array),
};

GraficoQuantidadeMatriculasPorAno.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: '',
  listaAnosEscolares: [],
};

export default GraficoQuantidadeMatriculasPorAno;
