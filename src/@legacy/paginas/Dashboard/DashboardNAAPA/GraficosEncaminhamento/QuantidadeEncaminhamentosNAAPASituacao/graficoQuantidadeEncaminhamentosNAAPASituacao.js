import { TagGrafico } from '@/@legacy/componentes-sgp';
import { TagDescricao } from '@/components/sgp/tag-totalizador';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Loader } from '~/componentes';
import GraficoBarras from '~/componentes-sgp/Graficos/graficoBarras';
import { erros } from '~/servicos';
import ServicoDashboardNAAPA from '~/servicos/Paginas/Dashboard/ServicoDashboardNAAPA';
import NAAPAContext from '../../naapaContext';

const GraficoQuantidadeEncaminhamentosNAAPASituacao = () => {
  const { anoLetivo, dre, ue, modalidade } = useContext(NAAPAContext);

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const [dataUltimaConsolidacao, setDataUltimaConsolidacao] = useState();

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
      await ServicoDashboardNAAPA.obterQuantidadeEncaminhamentosNAAPASituacao(
        anoLetivo,
        dre?.id,
        ue?.id,
        modalidade
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
  }, [anoLetivo, dre, ue, modalidade]);

  useEffect(() => {
    if (anoLetivo && dre && ue && modalidade) {
      obterDadosGrafico();
    } else {
      limparDados();
    }
  }, [anoLetivo, dre, ue, modalidade, obterDadosGrafico]);

  const qtdTotalEncaminamentos = dadosGrafico?.length
    ? dadosGrafico.reduce(
        (accumulator, currentValue) => accumulator + currentValue?.quantidade,
        0
      )
    : 0;

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="d-flex pb-4">
            <div className="col-sm-6">
              {dadosGrafico?.length ? (
                <TagDescricao
                  descricao={`Total de encaminhamentos: ${qtdTotalEncaminamentos}`}
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

export default GraficoQuantidadeEncaminhamentosNAAPASituacao;
