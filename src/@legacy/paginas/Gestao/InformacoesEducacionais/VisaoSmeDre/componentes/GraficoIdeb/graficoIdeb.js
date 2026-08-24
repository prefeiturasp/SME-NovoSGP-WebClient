import './graficoIdeb.css';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader } from '~/componentes';
import { erros } from '~/servicos';
import ServicoIdebGrafico from '~/servicos/InformacoesEducacionais/ServicoIdebGrafico';
import { SelectComponent } from '~/componentes';
import { Area } from '@ant-design/plots';
import { Base, Colors } from '~/componentes/colors';
import { InformacaoAnosAnteriores } from '../../../shared/informacaoAnosAnteriores';

import comDefaultProps from '~/utils/comDefaultProps';
const listaSerie = [
  { valor: 1, desc: 'Anos iniciais (1º a 5º anos)' },
  { valor: 2, desc: 'Anos finais (6º a 9º anos)' },
  { valor: 3, desc: 'Ensino médio (1º a 3º séries)' },
];

const GraficoIdeb = ({ anoLetivo, dreId }) => {
  const [dados, setDados] = useState([]);
  const [anoUtilizado, setAnoUtilizado] = useState();
  const [loading, setLoading] = useState(false);
  const [serie, setSerie] = useState(listaSerie[0].valor);
  const [serieTexto, setSerieTexto] = useState(listaSerie[0].desc);

  const buscarDados = useCallback(async () => {
    if (!dreId) {
      setDados([]);
      return;
    }
    setLoading(true);
    try {
      const resposta = await ServicoIdebGrafico.obterIdebGrafico(
        anoLetivo,
        serie,
        dreId
      );
      if (resposta.status === 200 && resposta.data?.distribuicao) {
        const dadosFormatados = resposta.data.distribuicao
          .map(item => ({
            faixa: item.faixa,
            quantidade: item.quantidade,
          }))
          .sort((a, b) => {
            const inicioA = parseInt(a.faixa.split('-')[0], 10);
            const inicioB = parseInt(b.faixa.split('-')[0], 10);
            return inicioA - inicioB;
          });
        if (resposta.data.anoUtilizado) {
          setAnoUtilizado(resposta.data.anoUtilizado);
        }
        setDados(dadosFormatados);
      } else {
        setDados([]);
      }
    } catch (error) {
      const msg =
        error.response?.data?.mensagens?.join(', ') ||
        'Erro ao carregar dados de ideb';
      erros(msg);
      setDados([]);
    } finally {
      setLoading(false);
    }
  }, [dreId, serie]);

  const handleSelectChange = valor => {
    if (valor == null) {
      setSerie(null);
      setSerieTexto(null);
      return;
    }

    const selecionado = listaSerie.find(item => item.valor === Number(valor));
    setSerie(Number(valor));
    setSerieTexto(selecionado ? selecionado.desc : '');
  };

  useEffect(() => {
    buscarDados();
  }, [dreId, serie, buscarDados]);

  const config = {
    data: dados,
    xField: 'faixa',
    yField: 'quantidade',
    smooth: true,
    areaStyle: {
      fill: 'l(90) 0:rgba(255,243,205,1) 0.51:rgba(255,243,205,1) 1:rgba(255,243,205,0)',
    },
    line: { color: '#856404' },
    point: {
      size: 4,
      shape: 'circle',
      style: { fill: Base.Branco, stroke: '#856404', lineWidth: 2 },
    },
    tooltip: {
      showMarkers: true,
      customContent: (title, items) => {
        if (!items || items.length === 0) return '';
        const item = items[0];
        return `<div class="grafico-ideb-tooltip">
          <div style="color: #856404;"><strong>IDEB:</strong> ${item.data.faixa}</div>
          <div style="color: ${Base.CinzaMako};"><strong>Quantidade de UEs:</strong> ${item.data.quantidade}</div>
        </div>`;
      },
    },
    xAxis: {
      title: {
        text: 'Notas',
        style: { fill: Base.CinzaMako, fontSize: 14, fontWeight: 700 },
      },
      label: { style: { fill: Base.CinzaMako, fontSize: 14, fontWeight: 400 } },
    },
    yAxis: {
      title: {
        text: 'Quantidade de escolas',
        style: { fill: Base.CinzaMako, fontSize: 14, fontWeight: 700 },
      },
      label: { style: { fill: Base.CinzaMako, fontSize: 14, fontWeight: 400 } },
    },
  };

  return (
    <div className="grafico-ideb-container">
      <div className="grafico-ideb-header">
        <h5 className="grafico-ideb-titulo" style={{ color: Base.CinzaMako }}>
          IDEB {anoUtilizado && ` (${anoUtilizado})`}
        </h5>
        <div className="grafico-ideb-select">
          <SelectComponent
            id="select-serie"
            lista={listaSerie}
            valueOption="valor"
            valueText="desc"
            onChange={handleSelectChange}
            valueSelect={serieTexto}
            placeholder="Selecione a série"
          />
        </div>
      </div>

      <p className="grafico-ideb-descricao" style={{ color: Base.CinzaMako }}>
        O Índice de Desenvolvimento da Educação Básica é medido a partir das
        médias de desempenho no Sistema de Avaliação da Educação Básica (SAEB).
      </p>

      <InformacaoAnosAnteriores />

      {loading ? (
        <Loader />
      ) : dados.length ? (
        <Area {...config} />
      ) : (
        <div className="text-center">Sem dados</div>
      )}
    </div>
  );
};

GraficoIdeb.propTypes = {
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GraficoIdeb.defaultProps = {
  dreId: null,
};

export default comDefaultProps(GraficoIdeb, GraficoIdeb.defaultProps);