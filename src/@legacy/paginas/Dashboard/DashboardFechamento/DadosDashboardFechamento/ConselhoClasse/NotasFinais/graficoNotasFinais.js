import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Loader } from '~/componentes';
import { GraficoBarras } from '~/componentes-sgp';

import { OPCAO_TODOS } from '~/constantes/constantes';
import { erros } from '~/servicos';

import ServicoDashboardFechamento from '~/servicos/Paginas/Dashboard/ServicoDashboardFechamento';

const GraficoNotasFinais = props => {
  const { anoLetivo, dreId, ueId, modalidade, semestre, bimestre } = props;

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoDashboardFechamento.obterNotasFinais(
      anoLetivo,
      dreId === OPCAO_TODOS ? '' : dreId,
      ueId === OPCAO_TODOS ? '' : ueId,
      modalidade,
      semestre,
      bimestre
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    const dados = retorno?.data?.length ? retorno.data : [];
    setDadosGrafico(dados);
  }, [anoLetivo, dreId, ueId, modalidade, semestre, bimestre]);

  useEffect(() => {
    if (modalidade && anoLetivo && dreId && ueId && bimestre) {
      obterDadosGrafico();
      return;
    }
    setDadosGrafico([]);
  }, [modalidade, anoLetivo, dreId, ueId, bimestre, obterDadosGrafico]);

  return (
    <Loader
      loading={exibirLoader}
      className={exibirLoader ? 'text-center' : ''}
    >
      {dadosGrafico?.length ? (
        <GraficoBarras
          data={dadosGrafico}
          xField="grupo"
          xAxisVisible
          isGroup
          colors={['#0288D1', '#F57C00', '#C2185B']}
          showTitle
        />
      ) : (
        !exibirLoader && <div className="text-center">Sem dados</div>
      )}
    </Loader>
  );
};

GraficoNotasFinais.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  semestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  bimestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GraficoNotasFinais.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
  semestre: null,
  bimestre: null,
};

export default GraficoNotasFinais;
