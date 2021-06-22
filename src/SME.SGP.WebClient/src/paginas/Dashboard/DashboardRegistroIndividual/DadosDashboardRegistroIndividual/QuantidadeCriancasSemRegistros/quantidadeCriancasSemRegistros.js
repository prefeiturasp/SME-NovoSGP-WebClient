import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import GraficoQuantidadeCriancasSemRegistros from './graficoQuantidadeCriancasSemRegistros';

const QuantidadeCriancasSemRegistros = props => {
  const { anoLetivo, dreId, ueId, modalidade } = props;

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);

  const diasSemRegistro = useSelector(
    store =>
      store.dashboardRegistroIndividual?.dadosDashboardRegistroIndividual
        ?.diasSemRegistro
  );

  const key = `quantidade-criancas-estao-sem-registros-mais-${diasSemRegistro ||
    0}-dias`;

  return (
    <div className="mt-3">
      <CardCollapse
        titulo={`Quantidade de crianças que estão sem registros a mais de ${diasSemRegistro ||
          0} dias`}
        key={`${key}-collapse-key`}
        indice={`${key}-collapse-indice`}
        alt={`${key}-alt`}
        configCabecalho={configCabecalho}
        show={exibir}
        onClick={() => {
          setExibir(!exibir);
        }}
      >
        {exibir ? (
          <GraficoQuantidadeCriancasSemRegistros
            anoLetivo={anoLetivo}
            dreId={dreId}
            ueId={ueId}
            modalidade={modalidade}
          />
        ) : (
          ''
        )}
      </CardCollapse>
    </div>
  );
};

QuantidadeCriancasSemRegistros.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

QuantidadeCriancasSemRegistros.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
};

export default QuantidadeCriancasSemRegistros;
