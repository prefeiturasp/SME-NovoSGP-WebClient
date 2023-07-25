import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Loader } from '~/componentes';
import GraficoBarras from '~/componentes-sgp/Graficos/graficoBarras';
import { erros } from '~/servicos';
import ServicoDashboardNAAPA from '~/servicos/Paginas/Dashboard/ServicoDashboardNAAPA';
import NAAPAContext from '../../naapaContext';
import { TagGrafico } from '@/@legacy/componentes-sgp';

const GraficoQuantidadeEncaminhamentosNAAPASituacao = () => {
  const { anoLetivo, dre, ue } = useContext(NAAPAContext);

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

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
      await ServicoDashboardNAAPA.obterQuantidadeEncaminhamentosNAAPASituacao(
        anoLetivo,
        dre?.id,
        ue?.id
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
  }, [anoLetivo, dre, ue]);

  useEffect(() => {
    if (anoLetivo && dre && ue) {
      obterDadosGrafico();
    } else {
      limparDados();
    }
  }, [anoLetivo, dre, ue, obterDadosGrafico]);

  const qtdTotalEncaminamentos = dadosGrafico?.length
    ? dadosGrafico.reduce(
        (accumulator, currentValue) => accumulator + currentValue?.quantidade,
        0
      )
    : 0;

  return (
    <>
      {dadosGrafico?.length ? (
        <div className="row">
          <div className="col-sm-12">
            <TagGrafico
              valor={`Total de encaminhamentos: ${qtdTotalEncaminamentos}`}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
      {dataUltimaConsolidacaoFormatada ? (
        <div className="row">
          <div className="col-sm-12 mb-2">
            <TagGrafico
              valor={`Data da última atualização: ${dataUltimaConsolidacaoFormatada}`}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
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

export default GraficoQuantidadeEncaminhamentosNAAPASituacao;
