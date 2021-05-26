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
  const { anoLetivo, dreId, ueId, modalidade } = props;

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [anosEscolares, setAnosEscolares] = useState([]);

  const [listaAnosEscolares, setListaAnosEscolares] = useState([]);

  const exibirAnosEscolares =
    anoLetivo &&
    modalidade &&
    ((dreId === OPCAO_TODOS && ueId === OPCAO_TODOS) ||
      (dreId !== OPCAO_TODOS && ueId !== OPCAO_TODOS));

  const obterDadosGrafico = async (
    ano,
    dre,
    ue,
    mod,
    anosEscolaresConsulta
  ) => {
    setExibirLoader(true);
    const retorno = await ServicoDashboardInformacoesEscolares.obterQuantidadeMatriculasPorAno(
      ano,
      dre === OPCAO_TODOS ? '' : dre,
      ue === OPCAO_TODOS ? '' : ue,
      mod,
      anosEscolaresConsulta?.length === 1 &&
        anosEscolaresConsulta[0] === OPCAO_TODOS
        ? ''
        : anosEscolaresConsulta
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      setDadosGrafico(retorno.data);
    } else {
      setDadosGrafico([]);
    }
  };

  useEffect(() => {
    if (anoLetivo && dreId && ueId && modalidade && !exibirAnosEscolares) {
      obterDadosGrafico(anoLetivo, dreId, ueId, modalidade);
    } else {
      setDadosGrafico([]);
    }
  }, [anoLetivo, dreId, ueId, modalidade, exibirAnosEscolares]);

  const onChangeAnoEscolar = (novosValores, valoresAtuais) => {
    let novaListaAnos = [];

    const opcaoTodosJaSelecionado = valoresAtuais
      ? valoresAtuais?.includes(OPCAO_TODOS)
      : false;
    if (opcaoTodosJaSelecionado) {
      const listaSemOpcaoTodos = novosValores?.filter(
        ano => ano !== OPCAO_TODOS
      );
      novaListaAnos = listaSemOpcaoTodos;
    } else if (novosValores?.includes(OPCAO_TODOS)) {
      novaListaAnos = [OPCAO_TODOS];
    } else {
      novaListaAnos = novosValores;
    }

    setAnosEscolares(novaListaAnos);
    if (novaListaAnos?.length) {
      obterDadosGrafico(anoLetivo, dreId, ueId, modalidade, novaListaAnos);
    } else {
      setDadosGrafico([]);
    }
  };

  const obterAnosEscolares = useCallback(async () => {
    setExibirLoader(true);
    const respota = await ServicoDashboardInformacoesEscolares.obterAnosEscolaresPorModalidade(
      anoLetivo,
      dreId === OPCAO_TODOS ? '' : dreId,
      ueId === OPCAO_TODOS ? '' : ueId,
      modalidade
    ).catch(e => erros(e));

    if (respota?.data?.length) {
      if (respota.data.length > 1) {
        respota.data.unshift({
          ano: OPCAO_TODOS,
          modalidadeAno: 'Todos os anos',
        });
      }

      setListaAnosEscolares(respota.data);

      let valorInicialAnoEscolar = [];

      if (respota.data.length === 1) {
        valorInicialAnoEscolar = [String(respota.data[0].ano)];
      } else if (respota.data?.length > 1) {
        valorInicialAnoEscolar = [OPCAO_TODOS];
      }

      setAnosEscolares(valorInicialAnoEscolar);
      obterDadosGrafico(
        anoLetivo,
        dreId,
        ueId,
        modalidade,
        valorInicialAnoEscolar
      );
    } else {
      setExibirLoader(false);
      setListaAnosEscolares([]);
      setAnosEscolares([]);
      setDadosGrafico([]);
    }
  }, [anoLetivo, dreId, ueId, modalidade]);

  useEffect(() => {
    if (anoLetivo && dreId && ueId && modalidade && exibirAnosEscolares) {
      obterAnosEscolares();
    } else {
      setListaAnosEscolares([]);
      setAnosEscolares([]);
    }
  }, [
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    exibirAnosEscolares,
    obterAnosEscolares,
  ]);

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
};

GraficoQuantidadeMatriculasPorAno.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: '',
};

export default GraficoQuantidadeMatriculasPorAno;
