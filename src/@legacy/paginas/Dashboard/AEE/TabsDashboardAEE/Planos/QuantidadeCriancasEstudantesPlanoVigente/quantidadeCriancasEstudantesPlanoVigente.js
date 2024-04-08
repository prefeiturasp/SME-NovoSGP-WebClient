import { TagDescricao } from '@/components/sgp/tag-totalizador';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Base } from '~/componentes';
import CardCollapse from '~/componentes/cardCollapse';
import MontarGraficoBarras from '~/paginas/Dashboard/ComponentesDashboard/montarGraficoBarras';
import ServicoDashboardAEE from '~/servicos/Paginas/Dashboard/ServicoDashboardAEE';

const QuantidadeCriancasEstudantesPlanoVigente = props => {
  const { anoLetivo, dreId, ueId } = props;

  const configCabecalho = {
    altura: '44px',
    corBorda: Base.AzulBordaCollapse,
  };

  const [exibir, setExibir] = useState(false);
  const [semDados, setSemDados] = useState(true);
  const [totalPlanosVigentes, setTotalPlanosVigentes] = useState();

  const key = 'quantidade-criancas-estudantes-plano-vigente';

  return (
    <div className="mt-3">
      <CardCollapse
        titulo="Quantidade de crianças/estudantes com plano vigente"
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
          <>
            {!semDados ? (
              <div className="col-md-12">
                <TagDescricao
                  descricao={`Total de planos vigentes: ${totalPlanosVigentes}`}
                />
              </div>
            ) : (
              <></>
            )}
            <div className="col-md-12">
              <MontarGraficoBarras
                anoLetivo={anoLetivo}
                dreId={dreId}
                ueId={ueId}
                nomeIndiceDesc="descricao"
                nomeValor="quantidade"
                ServicoObterValoresGrafico={
                  ServicoDashboardAEE.obterPlanosVigentes
                }
                mapearDados={resposta => {
                  if (resposta?.planosVigentes?.length) {
                    setTotalPlanosVigentes(resposta?.totalPlanosVigentes || 0);
                    setSemDados(false);
                    return resposta.planosVigentes;
                  }
                  setSemDados(true);
                  return [];
                }}
              />
            </div>
          </>
        ) : (
          ''
        )}
      </CardCollapse>
    </div>
  );
};

QuantidadeCriancasEstudantesPlanoVigente.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  dreId: PropTypes.string,
  ueId: PropTypes.string,
};

QuantidadeCriancasEstudantesPlanoVigente.defaultProps = {
  anoLetivo: null,
  dreId: '',
  ueId: '',
};

export default QuantidadeCriancasEstudantesPlanoVigente;
