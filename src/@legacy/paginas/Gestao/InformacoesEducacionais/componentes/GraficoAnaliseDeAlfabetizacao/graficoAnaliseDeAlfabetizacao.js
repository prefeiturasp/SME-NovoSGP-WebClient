import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader } from '~/componentes';
import { GraficoBarrasHorizontal } from '~/componentes-sgp';
import { erros } from '~/servicos';
import ServicoAlfabetizacaoGrafico from '~/servicos/InformacoesEducacionais/ServicoAlfabetizacaoGrafico';
import { SelectComponent } from '~/componentes';

const listaPeriodicidade = [
  { valor: 1, desc: '1º bimestre' },
  { valor: 2, desc: '2º bimestre' },
  { valor: 3, desc: '3º bimestre' },
  { valor: 4, desc: '4º bimestre' },
];
const GraficoAlfabetizacao = ({ dreId }) => {
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
        await ServicoAlfabetizacaoGrafico.obterAlfabetizacaoGrafico(
          dreId,
          null,
          periodicidade
        );
      if (resposta.status === 200 && Array.isArray(resposta.data)) {
        const dadosFormatados = resposta.data.map(item => ({
          descricao: item.nivelAlfabetizacaoDescricao,
          quantidade: item.totalAlunos,
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
  }, [dreId, periodicidade]);

  const handleSelectChange = valor => {
    const selecionado = listaPeriodicidade.find(
      item => item.valor === Number(valor)
    );
    setPeriodicidade(Number(valor));
    setPeriodicidadeTexto(selecionado ? selecionado.desc : '');
  };

  useEffect(() => {
    buscarDados();
  }, [dreId, periodicidade, buscarDados]);

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
          Alfabetização
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
        className="text-muted"
        style={{
          fontSize: '14px',
          marginBottom: '32px',
          color: '#42474a',
        }}
      >
        Distribuição por níveis de alfabetização dos estudantes nas Unidades
        Educacionais da Rede Municipal de São Paulo.
      </p>

      {dados.length ? (
        <GraficoBarrasHorizontal
          data={dados}
          xField="quantidade"
          yField="descricao"
          colors={'#6933FF'}
          xAxisVisible
          legendVisible={false}
          labelVisible={false}
          tooltip={{
            formatter: datum => ({
              name: datum.descricao,
              value: `${datum.quantidade} alunos`,
            }),
          }}
        />
      ) : !loading ? (
        <div className="text-center">Sem dados</div>
      ) : null}
    </div>
  );
};

GraficoAlfabetizacao.propTypes = {
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GraficoAlfabetizacao.defaultProps = {
  dreId: null,
};

export default GraficoAlfabetizacao;
