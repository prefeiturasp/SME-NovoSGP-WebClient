import { lazy, useEffect, useMemo, useState } from 'react';

// Redux
import { useSelector } from 'react-redux';

// Ant
import { Tabs } from 'antd';

// Componentes
import { ButtonGroup, Card, LazyLoad, Loader } from '~/componentes';
import Filtro from './componentes/Filtro';

// Componentes SGP
import { Cabecalho } from '~/componentes-sgp';

// Estilos
import { ContainerTabs } from './styles';

// Serviços
import { erro } from '~/servicos/alertas';
import ResumosGraficosPAPServico from '~/servicos/Paginas/Relatorios/PAP/ResumosGraficos';

import { ROUTES } from '@/core/enum/routes';
import { useNavigate } from 'react-router-dom';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';

const ResumosGraficosPAP = () => {
  const navigate = useNavigate();

  const permissoesTela = useSelector(store => store.usuario.permissoes);
  const [somenteConsulta] = useState(false);
  const [tabAtiva, setTabAtiva] = useState('relatorios');
  const [filtro, setFiltro] = useState({});
  const [dados, setDados] = useState({});
  const [carregandoRelatorios, setCarregandoRelatorios] = useState(false);
  const [carregandoGraficos, setCarregandoGraficos] = useState(false);
  const { turmaSelecionada } = useSelector(state => state.usuario);
  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const onClickVoltar = () => {
    navigate('/');
  };

  const Resumos = lazy(() => import('./componentes/Resumos'));
  const TabGraficos = lazy(() => import('./componentes/TabGraficos'));

  const filtroTela = useMemo(() => {
    return {
      DreId: filtro.dreId,
      UeId: filtro.ueId,
      CicloId: filtro.cicloId,
      TurmaId: filtro.turmaId,
      Periodo: filtro.periodo,
      Ano: filtro.ano,
      AnoLetivo: filtro.anoLetivo,
    };
  }, [filtro]);

  useEffect(() => {
    async function buscarDados() {
      try {
        setCarregandoGraficos(true);
        setCarregandoRelatorios(true);
        const requisicoes = await Promise.all([
          ResumosGraficosPAPServico.ListarTotalEstudantes(filtroTela),
          ResumosGraficosPAPServico.ListarFrequencia(filtroTela),
          ResumosGraficosPAPServico.ListarResultados(filtroTela),
          ResumosGraficosPAPServico.ListarInformacoesEscolares(filtroTela),
        ]);

        setDados({
          totalEstudantes: requisicoes[0].data
            ? { ...requisicoes[0].data }
            : [],
          frequencia: requisicoes[1].data
            ? [...requisicoes[1].data.frequencia]
            : [],
          resultados: requisicoes[2].data ? { ...requisicoes[2].data } : [],
          informacoesEscolares: requisicoes[3].data
            ? [...requisicoes[3].data]
            : [],
        });

        setCarregandoGraficos(false);
        setCarregandoRelatorios(false);
      } catch (err) {
        setCarregandoGraficos(false);
        setCarregandoRelatorios(false);
        erro(`Não foi possível completar a requisição! ${err}`);
      }
    }
    if (
      filtroTela.DreId &&
      filtroTela.UeId &&
      filtroTela.CicloId &&
      filtroTela.Periodo
    ) {
      buscarDados();
    }
  }, [filtroTela]);

  const dadosTela = useMemo(() => {
    return dados;
  }, [dados]);

  return (
    <>
      <AlertaModalidadeInfantil />
      <Cabecalho pagina="Resumos e gráficos PAP">
        <ButtonGroup
          somenteConsulta={somenteConsulta}
          permissoesTela={permissoesTela[ROUTES.PAP]}
          onClickVoltar={onClickVoltar}
          desabilitarBotaoPrincipal
        />
      </Cabecalho>
      <Card>
        {!ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ? (
          <div className="col-md-12">
            <Filtro onFiltrar={filtroAtual => setFiltro(filtroAtual)} />
            {filtroTela.DreId &&
            filtroTela.UeId &&
            filtroTela.CicloId &&
            filtroTela.Periodo ? (
              <ContainerTabs
                tabPosition="top"
                type="card"
                tabBarGutter={10}
                onChange={key => setTabAtiva(key)}
                activeKey={tabAtiva}
                defaultActiveKey="relatorios"
              >
                <Tabs.TabPane
                  disabled={carregandoRelatorios}
                  tab="Resumos"
                  key="relatorios"
                >
                  <Loader loading={carregandoRelatorios}>
                    {tabAtiva === 'relatorios' ? (
                      <LazyLoad>
                        <Resumos
                          dados={dadosTela}
                          ciclos={!filtroTela.Ano && !!filtroTela.CicloId}
                          anos={!!filtroTela.Ano}
                          filtroTela={filtroTela}
                          isEncaminhamento={
                            filtroTela &&
                            filtroTela.Periodo &&
                            filtroTela.Periodo.toString() === '1'
                          }
                        />
                      </LazyLoad>
                    ) : (
                      ''
                    )}
                  </Loader>
                </Tabs.TabPane>
                <Tabs.TabPane
                  disabled={carregandoGraficos}
                  tab="Gráficos"
                  key="graficos"
                >
                  <Loader loading={carregandoGraficos}>
                    {tabAtiva === 'graficos' ? (
                      <LazyLoad>
                        <TabGraficos
                          dados={dadosTela}
                          ciclos={!filtroTela.Ano && !!filtroTela.CicloId}
                          anos={!!filtroTela.Ano}
                          periodo={filtroTela.Periodo}
                          filtroTela={filtroTela}
                        />
                      </LazyLoad>
                    ) : (
                      ''
                    )}
                  </Loader>
                </Tabs.TabPane>
              </ContainerTabs>
            ) : null}
          </div>
        ) : (
          ''
        )}
      </Card>
    </>
  );
};

export default ResumosGraficosPAP;
