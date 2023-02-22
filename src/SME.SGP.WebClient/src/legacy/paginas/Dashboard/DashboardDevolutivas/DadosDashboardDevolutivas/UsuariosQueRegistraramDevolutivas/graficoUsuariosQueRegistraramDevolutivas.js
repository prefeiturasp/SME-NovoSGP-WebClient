import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import GraficoBarras from '~/componentes-sgp/Graficos/graficoBarras';
import { OPCAO_TODOS } from '~/constantes';
import { erros } from '~/servicos';
import ServicoDashboardDevolutivas from '~/servicos/Paginas/Dashboard/ServicoDashboardDevolutivas';
import { obterTodosMeses } from '~/utils';

const GraficoUsuariosQueRegistraramDevolutivas = props => {
  const { anoLetivo, dreId, ueId, modalidade } = props;

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const [listaMeses, setListaMeses] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState();

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoDashboardDevolutivas.obterUsuariosQueRegistraramDevolutivas(
      anoLetivo,
      dreId === OPCAO_TODOS ? '' : dreId,
      mesSelecionado
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      setDadosGrafico(retorno.data);
    } else {
      setDadosGrafico([]);
    }
  }, [anoLetivo, dreId, mesSelecionado]);

  useEffect(() => {
    if (modalidade && anoLetivo && dreId && ueId && mesSelecionado) {
      obterDadosGrafico();
    } else {
      setDadosGrafico([]);
    }
  }, [modalidade, anoLetivo, dreId, ueId, mesSelecionado, obterDadosGrafico]);

  const montarMeses = useCallback(() => {
    if (modalidade) {
      const meses = obterTodosMeses();
      delete meses[0];
      meses.unshift({ numeroMes: OPCAO_TODOS, nome: 'Todos' });
      setListaMeses(meses);
      setMesSelecionado(OPCAO_TODOS);
    } else {
      setListaMeses([]);
      setMesSelecionado();
    }
  }, [modalidade]);

  useEffect(() => {
    montarMeses();
  }, [montarMeses]);

  const onChangeMes = valor => setMesSelecionado(valor);

  return (
    <Loader
      loading={exibirLoader}
      className={exibirLoader ? 'text-center' : ''}
    >
      <div className="row">
        <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
          <SelectComponent
            lista={listaMeses || []}
            valueOption="numeroMes"
            valueText="nome"
            disabled={listaMeses?.length === 1}
            valueSelect={mesSelecionado}
            onChange={onChangeMes}
            placeholder="Selecione o mês"
            allowClear={false}
          />
        </div>
      </div>
      {dadosGrafico?.length ? (
        <GraficoBarras
          data={dadosGrafico}
          xAxisVisible
          legendVisible={false}
          xField="ano"
        />
      ) : !exibirLoader ? (
        <div className="text-center">Sem dados</div>
      ) : (
        <></>
      )}
    </Loader>
  );
};

GraficoUsuariosQueRegistraramDevolutivas.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GraficoUsuariosQueRegistraramDevolutivas.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
};

export default GraficoUsuariosQueRegistraramDevolutivas;
