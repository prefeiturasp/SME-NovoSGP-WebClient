import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader } from '~/componentes';
import { GraficoBarras } from '~/componentes-sgp';
import { erros } from '~/servicos';
import ServicoFluenciaLeituraGrafico from '~/servicos/InformacoesEducacionais/ServicoFluenciaLeituraGrafico';
import { SelectComponent } from '~/componentes';

const listaPeriodicidade = [
  { valor: 1, desc: 'Avaliação de entrada (março)' },
  { valor: 2, desc: 'Avaliação de saída (novembro)' },
];

const GraficoFluenciaLeitora = ({ dreId, ueId, anoLetivo }) => {
  const [bimestre, setBimestre] = useState(1);
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [periodicidade, setPeriodicidade] = useState(
    listaPeriodicidade[0].valor
  );
  const [periodicidadeTexto, setPeriodicidadeTexto] = useState(
    listaPeriodicidade[0].desc
  );

  const buscarDados = useCallback(async () => {
    if (dreId === undefined || dreId === null) {
      setDados([]);
      return;
    }
    setLoading(true);
    try {
      const resposta =
        await ServicoFluenciaLeituraGrafico.obterFluenciaLeituraGrafico(
          dreId,
          ueId,
          periodicidade,
          anoLetivo
        );

      if (resposta.status === 200 && Array.isArray(resposta.data)) {
        const dadosFormatados = resposta.data.map(item => ({
          descricao: `${item.nomeFluencia} (${item.descricaoFluencia})`,
          quantidade: item.quantidadeAlunos,
          percentual: item.percentual,
        }));
        setDados(dadosFormatados);
      } else {
        setDados([]);
      }
    } catch (error) {
      const msg =
        error.response?.data?.mensagens?.join(', ') ||
        'Erro ao carregar dados de alfabetização';
      erros(msg);
      setDados([]);
    } finally {
      setLoading(false);
    }
  }, [dreId, periodicidade, ueId, anoLetivo]);

  const handleSelectChange = valor => {
    const selecionado = listaPeriodicidade.find(
      item => item.valor === Number(valor)
    );
    setPeriodicidade(Number(valor));
    setPeriodicidadeTexto(selecionado ? selecionado.desc : '');
  };

  useEffect(() => {
    buscarDados();
  }, [dreId, periodicidade, ueId, anoLetivo, buscarDados]);

  return (
    <div className="mb-3">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '32px',
          marginBottom: '8px',
        }}
      >
        <h5
          className="mb-2"
          style={{ fontWeight: 'bold', color: '#333', margin: 0 }}
        >
          Fluência leitora
        </h5>
        <div style={{ minWidth: 200 }}>
          <SelectComponent
            lista={listaPeriodicidade}
            valueOption="valor"
            valueText="desc"
            onChange={handleSelectChange}
            valueSelect={periodicidadeTexto}
            placeholder="Selecione o bimestre"
          />
        </div>
      </div>
      <p
        style={{
          fontSize: '14px',
          marginBottom: '32px',
          color: '#42474a',
        }}
      >
        É uma avaliação aplicada aos alunos do 2º ano do Ensino Fundamental, com
        o objetivo de medir o nível de leitura e compreensão de textos escritos
        por crianças na faixa etária da alfabetização.
      </p>

      {loading && <Loader />}
      {!loading && dados.length === 0 && (
        <div className="text-center">Sem dados</div>
      )}
      {dados.length > 0 && (
        <GraficoBarras
          data={dados}
          xField="quantidade"
          yField="descricao"
          colors={'#6933FF'}
          xAxisVisible={true}
          legendVisible={false}
          labelVisible={true}
          label={{
            formatter: data => `${data.quantidade} (${data.percentual}%)`,
          }}
          tooltip={{
            customContent: (title, items) => {
              if (!items?.length) return '';
              const item = items[0].data;
              return `
                <div style="max-width:350px; padding: 5px">
                  <div style="font-weight: bold; margin-bottom:4px;">${item.descricao}</div>
                  <div style="font-size:13px;">Quantidade de estudantes: ${item.quantidade} (${item.percentual}%)</div>
                </div>
              `;
            },
          }}
        />
      )}
      <div
        className="text-center"
        style={{ color: '#42474a', fontWeight: 'bold' }}
      >
        Níveis fluência leitora
      </div>
    </div>
  );
};

GraficoFluenciaLeitora.propTypes = {
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GraficoFluenciaLeitora.defaultProps = {
  dreId: null,
  ueId: null,
  anoLetivo: new Date().getFullYear(),
};

export default GraficoFluenciaLeitora;
