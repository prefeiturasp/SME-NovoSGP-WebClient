import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { TagGrafico } from '~/componentes-sgp';
import GraficoBarras from '~/componentes-sgp/Graficos/graficoBarras';
import { OPCAO_TODOS } from '~/constantes';
import { ModalidadeDTO } from '~/dtos';
import { erros } from '~/servicos';
import ServicoDashboardNAAPA from '~/servicos/Paginas/Dashboard/ServicoDashboardNAAPA';
import NAAPAContext from '../../naapaContext';

const GraficoQuantidadeFrequenciaInferior = () => {
  const {
    consideraHistorico,
    anoLetivo,
    dre,
    ue,
    modalidade,
    semestre,
    listaMesesReferencias,
  } = useContext(NAAPAContext);

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const [mesesReferencias, setMesesReferencias] = useState(OPCAO_TODOS);

  const ehModalidadeEJA = Number(modalidade) === ModalidadeDTO.EJA;

  // TODO
  const dataUltimaConsolidacao = window.moment();

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoDashboardNAAPA.obterFrequenciaTurmaEvasaoAbaixo50Porcento(
      consideraHistorico,
      anoLetivo,
      dre?.codigo,
      ue?.codigo,
      modalidade,
      semestre
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      setDadosGrafico(retorno.data);
    } else {
      setDadosGrafico([]);
    }
  }, [consideraHistorico, anoLetivo, dre, ue, modalidade, semestre]);

  useEffect(() => {
    const validouEJA = ehModalidadeEJA ? !!semestre : true;
    if (anoLetivo && dre && ue && modalidade && validouEJA) {
      obterDadosGrafico();
    } else {
      setDadosGrafico([]);
    }
  }, [
    consideraHistorico,
    anoLetivo,
    dre,
    ue,
    modalidade,
    semestre,
    ehModalidadeEJA,
    obterDadosGrafico,
  ]);

  const onChangeMes = valor => setMesesReferencias(valor);

  return (
    <>
      <div className="row align-items-end">
        <div className="col-sm-12 col-md-12 col-lg-3 col-xl-3 mb-2">
          <SelectComponent
            id="meses"
            lista={listaMesesReferencias}
            valueOption="numeroMes"
            valueText="nome"
            label="Mês de referência"
            disabled={listaMesesReferencias?.length === 1}
            valueSelect={mesesReferencias}
            onChange={mes => {
              onChangeMes(mes);
            }}
            placeholder="Mês de referência"
            allowClear={false}
          />
        </div>

        {dataUltimaConsolidacao && (
          <div className="col-sm-12 col-md-12 col-lg-9 col-xl-9 mb-2">
            <TagGrafico
              valor={
                dataUltimaConsolidacao
                  ? `Data da última atualização: ${window
                      .moment(dataUltimaConsolidacao)
                      .format('DD/MM/YYYY HH:mm:ss')}`
                  : ''
              }
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
          <></>
        )}
      </Loader>
    </>
  );
};

export default GraficoQuantidadeFrequenciaInferior;
