import { HttpStatusCode } from '@/core/enum/http-status-code';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { CoresGraficos, Loader } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes/constantes';
import GraficoBarraDashboard from '~/paginas/Dashboard/ComponentesDashboard/graficoBarraDashboard';
import {
  adicionarCoresNosGraficos,
  montarDadosGrafico,
} from '~/paginas/Dashboard/ComponentesDashboard/graficosDashboardUtils';
import { erros } from '~/servicos';

const MontarGraficoBarras = props => {
  const {
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    mesSelecionado,
    rf,
    nomeIndiceDesc,
    nomeValor,
    ServicoObterValoresGrafico,
    chavesGraficoAgrupado,
    ueCodigo,
    dreCodigo,
    exibirLegenda,
    showAxisBottom,
    mapearDados,
  } = props;

  const [chavesGrafico, setChavesGrafico] = useState([]);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [dadosLegendaGrafico, setDadosLegendaGrafico] = useState([]);

  const customPropsColors = item => {
    if (item.id === chavesGraficoAgrupado[0]?.nomeChave) {
      return CoresGraficos[0];
    }
    if (item.id === chavesGraficoAgrupado[1]?.nomeChave) {
      return CoresGraficos[1];
    }
    return CoresGraficos[2];
  };

  const mapearDadosGraficos = useCallback(
    dados => {
      const listaChaves = [];
      const dadosMapeados = [];

      dados.forEach(item => {
        listaChaves.push(item[nomeIndiceDesc]);
        montarDadosGrafico(item, nomeValor, dadosMapeados, nomeIndiceDesc);
      });

      setChavesGrafico(nomeValor ? [nomeValor] : listaChaves);
      const dadosComCores = adicionarCoresNosGraficos(dadosMapeados);

      setDadosGrafico(dadosComCores);

      if (exibirLegenda) {
        const dadosParaMontarLegenda = [];

        listaChaves.forEach((nomeLegenda, index) => {
          const temValor = dadosComCores.find(d => !!d?.[nomeLegenda]);
          if (temValor) {
            dadosParaMontarLegenda.push({
              label: nomeLegenda,
              color: CoresGraficos[index],
            });
          }
        });

        if (dadosParaMontarLegenda?.length) {
          setDadosLegendaGrafico(dadosParaMontarLegenda);
        }
      }
    },
    [nomeIndiceDesc, nomeValor, exibirLegenda]
  );

  const mapearDadosGraficoAgrupado = useCallback(
    dados => {
      const dadosMapeadosComCores = adicionarCoresNosGraficos(
        dados.filter(item => item[nomeIndiceDesc])
      );

      const dadosParaMontarLegenda = [];

      chavesGraficoAgrupado.forEach((item, index) => {
        const temValor = dadosMapeadosComCores.find(d => !!d?.[item.nomeChave]);
        if (temValor) {
          dadosParaMontarLegenda.push({
            label: temValor[item.legenda],
            color: CoresGraficos[index],
          });
        }
      });

      if (dadosParaMontarLegenda?.length) {
        setDadosLegendaGrafico(dadosParaMontarLegenda);
      }
      setDadosGrafico(dadosMapeadosComCores);
    },
    [nomeIndiceDesc, chavesGraficoAgrupado]
  );

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    const retorno = await ServicoObterValoresGrafico(
      anoLetivo,
      dreId === OPCAO_TODOS ? '' : dreId,
      ueId === OPCAO_TODOS ? '' : ueId,
      dreCodigo === OPCAO_TODOS ? '' : dreCodigo,
      ueCodigo === OPCAO_TODOS ? '' : ueCodigo,
      mesSelecionado === OPCAO_TODOS ? '' : mesSelecionado,
      rf === OPCAO_TODOS ? '' : rf,
      modalidade
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.status === HttpStatusCode.Ok) {
      const dados = mapearDados ? mapearDados(retorno.data) : retorno.data;
      if (chavesGraficoAgrupado?.length) {
        mapearDadosGraficoAgrupado(dados);
      } else {
        mapearDadosGraficos(dados);
      }
    } else {
      setDadosGrafico([]);
    }
  }, [
    anoLetivo,
    dreId,
    ueId,
    chavesGraficoAgrupado,
    mapearDadosGraficoAgrupado,
    mapearDadosGraficos,
    dreCodigo,
    ueCodigo,
    mesSelecionado,
    modalidade,
    rf,
  ]);

  useEffect(() => {
    if (
      (anoLetivo && ((dreId && ueId) || (dreCodigo && ueCodigo))) ||
      modalidade
    ) {
      obterDadosGrafico();
    } else {
      setDadosGrafico([]);
    }
  }, [
    anoLetivo,
    dreId,
    ueId,
    dreCodigo,
    ueCodigo,
    modalidade,
    obterDadosGrafico,
  ]);

  const graficoBarras = dados => {
    return (
      <GraficoBarraDashboard
        dadosGrafico={dados}
        chavesGrafico={
          chavesGraficoAgrupado?.length
            ? chavesGraficoAgrupado.map(ch => ch.nomeChave)
            : chavesGrafico
        }
        indice={nomeIndiceDesc}
        groupMode={chavesGraficoAgrupado?.length ? 'grouped' : 'stacked'}
        removeLegends
        margemPersonalizada={{
          top: 50,
          right: 0,
          bottom: 50,
          left: 90,
        }}
        customPropsColors={
          chavesGraficoAgrupado?.length ? customPropsColors : null
        }
        dadosLegendaCustomizada={dadosLegendaGrafico}
        showAxisBottom={showAxisBottom}
      />
    );
  };

  return (
    <Loader loading={exibirLoader} className="col-md-12 text-center">
      {dadosGrafico?.length
        ? graficoBarras(dadosGrafico)
        : !exibirLoader
        ? 'Sem dados'
        : ''}
    </Loader>
  );
};

MontarGraficoBarras.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  mesSelecionado: PropTypes.string,
  rf: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  nomeIndiceDesc: PropTypes.string,
  nomeValor: PropTypes.string,
  ServicoObterValoresGrafico: PropTypes.func,
  chavesGraficoAgrupado: PropTypes.oneOfType([PropTypes.array]),
  dreCodigo: PropTypes.string,
  ueCodigo: PropTypes.string,
  exibirLegenda: PropTypes.bool,
  showAxisBottom: PropTypes.bool,
  mapearDados: PropTypes.oneOfType([PropTypes.any]),
};

MontarGraficoBarras.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
  mesSelecionado: '',
  rf: '',
  nomeIndiceDesc: '',
  nomeValor: '',
  ServicoObterValoresGrafico: () => {},
  chavesGraficoAgrupado: [],
  dreCodigo: '',
  ueCodigo: '',
  exibirLegenda: false,
  showAxisBottom: true,
  mapearDados: null,
};

export default MontarGraficoBarras;
