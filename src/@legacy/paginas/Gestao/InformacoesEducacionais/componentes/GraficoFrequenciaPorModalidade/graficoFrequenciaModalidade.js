import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader } from '~/componentes';
import { GraficoBarras, TagGrafico } from '~/componentes-sgp';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { erros } from '~/servicos';

const GraficoFrequenciaModalidade = props => {
  const { anoLetivo, dreId, ueId, modalidade, semestre, tipoVisualizacao } = props;

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [dataAtual] = useState(moment().format('DD/MM/YYYY'));

  // Dados mockados para demonstração
  const dadosMock = {
    data_atual: "2025-08-19",
    frequencia_global: [
      { modalidade: "Fundamental", media: 92.5 },
      { modalidade: "Médio", media: 89.3 },
      { modalidade: "CIEJA", media: 85.1 },
      { modalidade: "Infantil - Creche", media: 90.2 },
      { modalidade: "Infantil - Pré-escola", media: 87.9 }
    ]
  };

  const obterDadosGrafico = useCallback(async () => {
    setExibirLoader(true);
    try {
      // Aqui você chamaria uma API real em produção
      // Simulando uma chamada de API com timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Neste exemplo, usamos dados mockados
      // A estrutura de dados real deve ser adaptada conforme necessário
      const dadosFormatados = dadosMock.frequencia_global.map(item => ({
        modalidade: item.modalidade,
        media: item.media
      }));
      
      setDadosGrafico(dadosFormatados);
    } catch (e) {
      erros(e);
    } finally {
      setExibirLoader(false);
    }
  }, [anoLetivo, dreId, ueId, modalidade, semestre, tipoVisualizacao]);

  useEffect(() => {
    if (dreId === OPCAO_TODOS) {
      obterDadosGrafico();
    } else {
      setDadosGrafico([]);
    }
  }, [dreId, obterDadosGrafico]);

  return (
    <Loader
      loading={exibirLoader}
      className={exibirLoader ? 'text-center' : ''}
    >
      <TagGrafico
        valor={`Dados atualizados até: ${dataAtual}`}
      />
      {dadosGrafico?.length ? (
        <GraficoBarras
          data={dadosGrafico}
          xField="modalidade"
          yField="media"
          xAxisVisible
          isGroup={false}
          colors={['#0288D1']}
          tooltipRender={item => {
            return {
              name: item.modalidade,
              value: `${item.media.toFixed(1)}%`
            };
          }}
          legendPosition="bottom"
        />
      ) : !exibirLoader ? (
        <div className="text-center">Sem dados</div>
      ) : (
        ''
      )}
    </Loader>
  );
};

GraficoFrequenciaModalidade.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.any]),
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  modalidade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  semestre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tipoVisualizacao: PropTypes.oneOfType([PropTypes.string]),
};

GraficoFrequenciaModalidade.defaultProps = {
  anoLetivo: null,
  dreId: null,
  ueId: null,
  modalidade: null,
  semestre: null,
  tipoVisualizacao: 'global',
};

export default GraficoFrequenciaModalidade;
