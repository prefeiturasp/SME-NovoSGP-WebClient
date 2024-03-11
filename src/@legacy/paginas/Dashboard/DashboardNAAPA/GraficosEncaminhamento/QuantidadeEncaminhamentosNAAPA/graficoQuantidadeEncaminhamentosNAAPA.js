import { TagGrafico } from '@/@legacy/componentes-sgp';
import { TagDescricao } from '@/components/sgp/tag-totalizador';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Loader } from '~/componentes';
import GraficoBarras from '~/componentes-sgp/Graficos/graficoBarras';
import { erros } from '~/servicos';
import ServicoDashboardNAAPA from '~/servicos/Paginas/Dashboard/ServicoDashboardNAAPA';
import NAAPAContext from '../../naapaContext';

const GraficoQuantidadeEncaminhamentosNAAPA = () => {
  const { anoLetivo, dre } = useContext(NAAPAContext);

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const [dataUltimaConsolidacao, setDataUltimaConsolidacao] = useState();
  const [totaEncaminhamento, setTotaEncaminhamento] = useState();

  const dataUltimaConsolidacaoFormatada = dataUltimaConsolidacao
    ? window.moment(dataUltimaConsolidacao).format('DD/MM/YYYY HH:mm:ss')
    : '';

  const limparDados = () => {
    setDadosGrafico([]);
    setDataUltimaConsolidacao();
  };

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno =
      await ServicoDashboardNAAPA.obterQuantidadeEncaminhamentosNAAPA(
        anoLetivo,
        dre?.codigo
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

    if (retorno?.data?.graficos?.length) {
      setDataUltimaConsolidacao(retorno.data?.dataUltimaConsolidacao);
      setTotaEncaminhamento(retorno.data?.totaEncaminhamento || 0);

      const dados = retorno.data?.graficos?.length
        ? retorno.data?.graficos
        : [];
      setDadosGrafico(dados);
    } else {
      limparDados();
    }
  }, [anoLetivo, dre]);

  useEffect(() => {
    if (anoLetivo && dre) {
      obterDadosGrafico();
    } else {
      limparDados();
    }
  }, [anoLetivo, dre, obterDadosGrafico]);

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="d-flex pb-4">
            <div className="col-sm-6">
              {dadosGrafico?.length ? (
                <TagDescricao
                  descricao={`Total de encaminhamentos: ${totaEncaminhamento}`}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="col-sm-6">
              {dataUltimaConsolidacaoFormatada ? (
                <TagGrafico
                  valor={`Data da última atualização: ${dataUltimaConsolidacaoFormatada}`}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
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

export default GraficoQuantidadeEncaminhamentosNAAPA;
