import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import DataUltimaAtualizacao from '~/componentes-sgp/DataUltimaAtualizacao/dataUltimaAtualizacao';
import { erros } from '~/servicos';
import ServicoDashboardInformacoesEscolares from '~/servicos/Paginas/Dashboard/ServicoDashboardInformacoesEscolares';

const DataUltimaAtualizacaoDashboardInformacoesEscolares = props => {
  const { anoLetivo } = props;

  const [dataUltimaConsolidacao, setDataUltimaConsolidacao] = useState();

  const obterDataUltimaAtualizacao = useCallback(async () => {
    const retorno = await ServicoDashboardInformacoesEscolares.obterUltimaConsolidacao(
      anoLetivo
    ).catch(e => erros(e));

    if (retorno?.data) {
      setDataUltimaConsolidacao(retorno.data);
    } else {
      setDataUltimaConsolidacao();
    }
  }, [anoLetivo]);

  useEffect(() => {
    if (anoLetivo) {
      obterDataUltimaAtualizacao();
    } else {
      setDataUltimaConsolidacao();
    }
  }, [anoLetivo, obterDataUltimaAtualizacao]);

  return dataUltimaConsolidacao ? (
    <DataUltimaAtualizacao
      dataFormatada={moment(dataUltimaConsolidacao).format(
        'DD/MM/YYYY HH:mm:ss'
      )}
    />
  ) : (
    ''
  );
};

DataUltimaAtualizacaoDashboardInformacoesEscolares.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
};

DataUltimaAtualizacaoDashboardInformacoesEscolares.defaultProps = {
  anoLetivo: '',
};

export default DataUltimaAtualizacaoDashboardInformacoesEscolares;
