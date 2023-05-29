import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import GraficoBarras from '~/componentes-sgp/Graficos/graficoBarras';
import { erros } from '~/servicos';
import ServicoDashboardNAAPA from '~/servicos/Paginas/Dashboard/ServicoDashboardNAAPA';
import NAAPAContext from '../../naapaContext';
import { OPCAO_TODOS } from '@/@legacy/constantes';
import { TagGrafico } from '@/@legacy/componentes-sgp';
import { obterTodosMeses } from '@/@legacy/utils';

const GraficoQtdAtendimentosEncaminhamentosProfissional = () => {
  const { anoLetivo, dre, ue } = useContext(NAAPAContext);

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const [listaMeses, setListaMeses] = useState([]);
  const [meseReferencia, setMeseReferencia] = useState();

  const [dataUltimaConsolidacao, setDataUltimaConsolidacao] = useState();

  const dataUltimaConsolidacaoFormatada = dataUltimaConsolidacao
    ? moment(dataUltimaConsolidacao).format('DD/MM/YYYY HH:mm:ss')
    : '';

  const limparDados = () => {
    setDadosGrafico([]);
    setDataUltimaConsolidacao();
  };

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno =
      await ServicoDashboardNAAPA.obterQuantidadeAtendimentoEncaminhamentosProfissional(
        anoLetivo,
        dre?.id,
        ue?.id,
        meseReferencia
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

    if (retorno?.data?.graficos?.length) {
      setDataUltimaConsolidacao(retorno.data?.dataUltimaConsolidacao);

      const dados = retorno.data?.graficos?.length
        ? retorno.data?.graficos
        : [];
      setDadosGrafico(dados);
    } else {
      limparDados();
    }
  }, [anoLetivo, dre, ue, meseReferencia]);

  useEffect(() => {
    if (anoLetivo && dre && ue && meseReferencia) {
      obterDadosGrafico();
    } else {
      limparDados();
    }
  }, [anoLetivo, dre, ue, meseReferencia, obterDadosGrafico]);

  useEffect(() => {
    const meses = obterTodosMeses();
    meses.unshift({ numeroMes: OPCAO_TODOS, nome: 'Acumulado' });
    setListaMeses(meses);

    setMeseReferencia(OPCAO_TODOS);
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-3 mb-2">
          <SelectComponent
            id="meses"
            lista={listaMeses}
            valueOption="numeroMes"
            valueText="nome"
            label="Mês de referência"
            valueSelect={meseReferencia}
            onChange={mes => {
              setMeseReferencia(mes);
            }}
            placeholder="Mês de referência"
            allowClear={false}
          />
        </div>
        {dataUltimaConsolidacaoFormatada ? (
          <div className="col-sm-12 mb-2">
            <TagGrafico
              valor={`Data da última atualização: ${dataUltimaConsolidacaoFormatada}`}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <Loader
        loading={exibirLoader}
        className={exibirLoader ? 'text-center' : ''}
      >
        {dadosGrafico?.length ? (
          <GraficoBarras data={dadosGrafico} />
        ) : !exibirLoader ? (
          <div className="text-center">Sem dados</div>
        ) : (
          <></>
        )}
      </Loader>
    </>
  );
};

export default GraficoQtdAtendimentosEncaminhamentosProfissional;
