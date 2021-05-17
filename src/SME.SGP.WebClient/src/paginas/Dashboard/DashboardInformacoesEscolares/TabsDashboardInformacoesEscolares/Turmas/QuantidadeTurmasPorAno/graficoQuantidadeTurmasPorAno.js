import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import GraficoBarras from '~/componentes-sgp/Graficos/graficoBarras';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { erros } from '~/servicos';
import ServicoDashboardInformacoesEscolares from '~/servicos/Paginas/Dashboard/ServicoDashboardInformacoesEscolares';

const GraficoQuantidadeTurmasPorAno = props => {
  const {
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    listaAnosEscolares,
    exibirAnosEscolares,
  } = props;

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [anoEscolar, setAnoEscolar] = useState();

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoDashboardInformacoesEscolares.obterQuantidadeTurmasPorAno(
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
    if (
      anoLetivo &&
      dreId &&
      ueId &&
      modalidade &&
      (exibirAnosEscolares ? !!anoEscolar : true)
    ) {
      obterDadosGrafico();
    } else {
      setDadosGrafico([]);
    }
  }, [
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    anoEscolar,
    exibirAnosEscolares,
    obterDadosGrafico,
  ]);

  useEffect(() => {
    if (exibirAnosEscolares) {
      if (listaAnosEscolares?.length === 1) {
        setAnoEscolar(String(listaAnosEscolares[0].ano));
      }
      if (listaAnosEscolares?.length > 1) {
        setAnoEscolar(OPCAO_TODOS);
      }
    }
  }, [listaAnosEscolares, exibirAnosEscolares]);

  const onChangeAnoEscolar = valor => setAnoEscolar(valor);

  return (
    <>
      <div className="row">
        {exibirAnosEscolares && (
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

GraficoQuantidadeTurmasPorAno.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.string,
  listaAnosEscolares: PropTypes.oneOfType(PropTypes.array),
  exibirAnosEscolares: PropTypes.bool,
};

GraficoQuantidadeTurmasPorAno.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: '',
  listaAnosEscolares: [],
  exibirAnosEscolares: false,
};

export default GraficoQuantidadeTurmasPorAno;
