import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Loader, SelectComponent } from '~/componentes';
import { GraficoBarras, TagGrafico } from '~/componentes-sgp';

import {
  erros,
  ServicoDashboardFrequencia,
  ServicoFiltroRelatorio,
} from '~/servicos';
import { OPCAO_TODOS } from '~/constantes/constantes';

const GraficoTotalAtividadeCompensacao = ({
  anoLetivo,
  dreId,
  ueId,
  modalidade,
  semestre,
}) => {
  const [bimestre, setBimestre] = useState();
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaBimestres, setListaBimestres] = useState([]);

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoDashboardFrequencia.obterTotalAtividadeCompensacao(
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      semestre,
      bimestre
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    let dadosRetorno = [];
    if (retorno?.data) {
      dadosRetorno = retorno.data;
    }

    setDadosGrafico(dadosRetorno);
  }, [anoLetivo, dreId, ueId, modalidade, semestre, bimestre]);

  useEffect(() => {
    if (anoLetivo && modalidade && bimestre && modalidade) {
      obterDadosGrafico();
      return;
    }
    setDadosGrafico([]);
  }, [
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    semestre,
    bimestre,
    obterDadosGrafico,
  ]);

  const concatenarBimestre = valor => {
    if (valor === Number(OPCAO_TODOS)) {
      return '';
    }
    return 'Bimestre';
  };

  const obterBimestres = useCallback(async () => {
    const retorno = await ServicoFiltroRelatorio.obterBimestres({
      modalidadeId: modalidade,
      opcaoTodos: true,
    }).catch(e => erros(e));

    if (retorno?.data) {
      const lista = retorno.data.map(item => ({
        desc: `${item.descricao} ${concatenarBimestre(item.valor)}`,
        valor: item.valor,
      }));
      setListaBimestres(lista);
      setBimestre(OPCAO_TODOS);
    }
  }, [modalidade]);

  useEffect(() => {
    if (modalidade) {
      obterBimestres();
      return;
    }
    setListaBimestres([]);
    setBimestre(undefined);
  }, [modalidade, obterBimestres]);

  const onChangeBimestre = valor => {
    setBimestre(valor);
  };

  return (
    <>
      <div className="col-12 p-0">
        <div className="row">
          <div className="col-3 mb-2 ">
            <SelectComponent
              lista={listaBimestres}
              valueOption="valor"
              valueText="desc"
              valueSelect={bimestre}
              onChange={onChangeBimestre}
              placeholder="Selecione o bimestre"
              allowClear={false}
            />
          </div>
          {dadosGrafico?.totalAusenciasFormatado && (
            <div className="col-9 mb-2">
              <TagGrafico valor={dadosGrafico?.totalAusenciasFormatado} />
            </div>
          )}
        </div>
      </div>
      <Loader
        loading={exibirLoader}
        className={exibirLoader ? 'text-center' : ''}
      >
        {dadosGrafico?.dadosCompensacaoAusenciaDashboard && (
          <GraficoBarras
            data={dadosGrafico?.dadosCompensacaoAusenciaDashboard}
            xAxisVisible
            radius={[6, 6, 0, 0]}
            labelVisible={false}
            legendVisible={false}
          />
        )}
        {!exibirLoader && !dadosGrafico?.dadosCompensacaoAusenciaDashboard && (
          <div className="text-center">Sem dados</div>
        )}
      </Loader>
    </>
  );
};

GraficoTotalAtividadeCompensacao.propTypes = {
  anoLetivo: PropTypes.oneOfType(PropTypes.any),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  semestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GraficoTotalAtividadeCompensacao.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
  semestre: null,
};

export default GraficoTotalAtividadeCompensacao;
