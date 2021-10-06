import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { GraficoBarras, TagGrafico } from '~/componentes-sgp';
import { erros } from '~/servicos';
import ServicoDashboardRelAcompanhamentoAprendizagem from '~/servicos/Paginas/Dashboard/ServicoDashboardRelAcompanhamentoAprendizagem';

const GraficoTotalCriancasComAcompPorDRE = props => {
  const { anoLetivo, dataUltimaConsolidacao } = props;

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [semestre, setSemestre] = useState();

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoDashboardRelAcompanhamentoAprendizagem.obterTotalCriancasComAcompPorDRE(
      anoLetivo,
      semestre
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      setDadosGrafico(retorno.data);
    } else {
      setDadosGrafico([]);
    }
  }, [anoLetivo, semestre]);

  useEffect(() => {
    if (anoLetivo && semestre) {
      obterDadosGrafico();
    } else {
      setDadosGrafico([]);
    }
  }, [anoLetivo, semestre, obterDadosGrafico]);

  const listaSemestres = [
    { valor: 1, desc: '1° Semestre' },
    { valor: 2, desc: '2° Semestre' },
  ];

  return (
    <>
      <div className="row">
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4 mb-2">
          <SelectComponent
            id="semestre"
            lista={listaSemestres}
            valueOption="valor"
            valueText="desc"
            valueSelect={semestre}
            onChange={valor => {
              setSemestre(valor);
            }}
            placeholder="Selecione o semestre"
            allowClear={false}
          />
        </div>
      </div>
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
            xField="grupo"
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
    </>
  );
};

GraficoTotalCriancasComAcompPorDRE.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dataUltimaConsolidacao: PropTypes.oneOfType(PropTypes.any),
};

GraficoTotalCriancasComAcompPorDRE.defaultProps = {
  anoLetivo: null,
  dataUltimaConsolidacao: null,
};

export default GraficoTotalCriancasComAcompPorDRE;
