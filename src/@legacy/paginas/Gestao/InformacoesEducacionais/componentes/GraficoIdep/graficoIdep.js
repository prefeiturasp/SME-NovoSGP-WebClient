import './graficoIdep.css';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader } from '~/componentes';
import { erros } from '~/servicos';
import ServicoIdepGrafico from '~/servicos/InformacoesEducacionais/ServicoIdepGrafico';
import { SelectComponent } from '~/componentes';
import { Area } from '@ant-design/plots';
import { Base, Colors } from '~/componentes/colors';

const listaPeriodicidade = [
  { valor: 1, desc: 'Anos iniciais (1º a 5º anos)' },
  { valor: 2, desc: 'Anos finais (6º a 9 º anos)' },
];

const GraficoIdep = ({ anoLetivo, dreId }) => {
  const [dados, setDados] = useState([]);
  const [anoUtilizado, setAnoUtilizado] = useState();
  const [loading, setLoading] = useState(false);
  const [periodicidade, setPeriodicidade] = useState(
    listaPeriodicidade[0].valor
  );
  const [periodicidadeTexto, setPeriodicidadeTexto] = useState(
    listaPeriodicidade[0].desc
  );

  const buscarDados = useCallback(async () => {
    if (!dreId) {
      setDados([]);
      return;
    }
    setLoading(true);
    try {
      const resposta = await ServicoIdepGrafico.obterIdepGrafico(
        anoLetivo,
        periodicidade,
        dreId
      );
      if (resposta.status === 200 && resposta.data?.distribuicao) {
        const dadosFormatados = resposta.data.distribuicao.map(item => ({
          faixa: item.faixa,
          quantidade: item.quantidade,
        }));
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
        'Erro ao carregar dados de IDEP';
      erros(msg);
      setDados([]);
    } finally {
      setLoading(false);
    }
  }, [dreId, periodicidade]);

  const handleSelectChange = valor => {
    if (valor == null) {
      setPeriodicidade(null);
      setPeriodicidadeTexto(null);
      return;
    }

    const selecionado = listaPeriodicidade.find(
      item => item.valor === Number(valor)
    );
    setPeriodicidade(Number(valor));
    setPeriodicidadeTexto(selecionado ? selecionado.desc : '');
  };

  useEffect(() => {
    buscarDados();
  }, [dreId, periodicidade, buscarDados]);

  const config = {
    data: dados,
    xField: 'faixa',
    yField: 'quantidade',
    smooth: true,
    areaStyle: { fill: 'l(270) 0:#e0c3fc 1:#8ec5fc' },
    line: { color: Base.Roxo },
    point: {
      size: 4,
      shape: 'circle',
      style: { fill: Base.Branco, stroke: Base.Roxo, lineWidth: 2 },
    },
    tooltip: {
      showMarkers: true,
      customContent: (title, items) => {
        if (!items || items.length === 0) return '';
        const item = items[0];
        return `<div class="grafico-idep-tooltip">
          <div style="color: ${Base.Roxo};"><strong>IDEP:</strong> ${item.data.faixa}</div>
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
    <div className="grafico-idep-container">
      <div className="grafico-idep-header">
        <h5 className="grafico-idep-titulo" style={{ color: Base.CinzaMako }}>
          IDEP {anoUtilizado && ` (${anoUtilizado})`}
        </h5>
        <div className="grafico-idep-select">
          <SelectComponent
            lista={listaPeriodicidade}
            valueOption="valor"
            valueText="desc"
            onChange={handleSelectChange}
            valueSelect={periodicidadeTexto}
            placeholder="Selecione o período"
          />
        </div>
      </div>

      <p className="grafico-idep-descricao" style={{ color: Base.CinzaMako }}>
        O Índice de Desenvolvimento da Educação Paulistana é medido a partir dos
        resultados das avaliações da Prova São Paulo e dos resultados das taxas
        de aprovação.
      </p>

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

GraficoIdep.propTypes = {
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GraficoIdep.defaultProps = {
  dreId: null,
};

export default GraficoIdep;
