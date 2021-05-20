import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import GraficoBarras from '~/componentes-sgp/Graficos/graficoBarras';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { erros } from '~/servicos';
import ServicoDashboardInformacoesEscolares from '~/servicos/Paginas/Dashboard/ServicoDashboardInformacoesEscolares';
import DataUltimaAtualizacaoDashboardInformacoesEscolares from '../../../dataUltimaAtualizacaoDashboardInformacoesEscolares';
import LabelTotalMatriculas from '../../../labelTotalMatriculas';

const GraficoQuantidadeMatriculasPorAno = props => {
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
  const [anosEscolares, setAnosEscolares] = useState([]);

  const dataUltimaConsolidacao = moment();

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoDashboardInformacoesEscolares.obterQuantidadeMatriculasPorAno(
      anoLetivo,
      dreId === OPCAO_TODOS ? '' : dreId,
      ueId === OPCAO_TODOS ? '' : ueId,
      modalidade,
      anosEscolares?.length === 1 && anosEscolares[0] === OPCAO_TODOS
        ? ''
        : anosEscolares
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      setDadosGrafico(retorno.data);
    } else {
      setDadosGrafico([]);
    }
  }, [anoLetivo, dreId, ueId, modalidade, anosEscolares]);

  useEffect(() => {
    if (
      anoLetivo &&
      dreId &&
      ueId &&
      modalidade &&
      (exibirAnosEscolares ? anosEscolares?.length : true)
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
    anosEscolares,
    exibirAnosEscolares,
    obterDadosGrafico,
  ]);

  useEffect(() => {
    if (exibirAnosEscolares) {
      if (listaAnosEscolares?.length === 1) {
        setAnosEscolares([String(listaAnosEscolares[0].ano)]);
      }
      if (listaAnosEscolares?.length > 1) {
        setAnosEscolares([OPCAO_TODOS]);
      }
    }
  }, [listaAnosEscolares, exibirAnosEscolares]);

  const onChangeAnoEscolar = (novosValores, valoresAtuais) => {
    const opcaoTodosJaSelecionado = valoresAtuais
      ? valoresAtuais?.includes(OPCAO_TODOS)
      : false;
    if (opcaoTodosJaSelecionado) {
      const listaSemOpcaoTodos = novosValores?.filter(
        ano => ano !== OPCAO_TODOS
      );
      setAnosEscolares(listaSemOpcaoTodos);
    } else if (novosValores?.includes(OPCAO_TODOS)) {
      setAnosEscolares([OPCAO_TODOS]);
    } else {
      setAnosEscolares(novosValores);
    }
  };

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
              valueSelect={anosEscolares}
              onChange={valores => {
                onChangeAnoEscolar(valores, anosEscolares);
              }}
              placeholder="Selecione o ano"
              multiple
            />
          </div>
        )}
        {dataUltimaConsolidacao && (
          <div
            className={
              exibirAnosEscolares
                ? 'col-sm-12 col-md-6 col-lg-9 col-xl-9 mb-2'
                : 'col-md-12 mb-2'
            }
          >
            <DataUltimaAtualizacaoDashboardInformacoesEscolares
              anoLetivo={anoLetivo}
            />
          </div>
        )}
        {dadosGrafico?.length && (
          <div className="col-md-12 mb-2">
            <LabelTotalMatriculas
              total={dadosGrafico
                ?.map(item => item?.quantidade)
                .reduce((total, valorAtual) => total + valorAtual)}
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
  exibirAnosEscolares: PropTypes.bool,
};

GraficoQuantidadeMatriculasPorAno.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: '',
  listaAnosEscolares: [],
  exibirAnosEscolares: false,
};

export default GraficoQuantidadeMatriculasPorAno;
