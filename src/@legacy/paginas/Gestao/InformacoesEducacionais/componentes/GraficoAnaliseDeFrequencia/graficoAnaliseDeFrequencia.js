import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import { Loader } from '~/componentes';
import { erros } from '~/servicos';
import ServicoFrequencia from '~/servicos/InformacoesEducacionais/ServicoFrequencia';
import { OPCAO_TODOS } from '~/constantes/constantes';
import './graficoAnaliseDeFrequencia.css';

const GraficoAnaliseDeFrequencia = ({ dreId, periodicidade }) => {
  const [dados, setDados] = useState({});
  const [carregando, setCarregando] = useState(false);

  const obterDados = useCallback(async () => {
    if (dreId === undefined || dreId === null) {
      setDados({});
      return;
    }
    setCarregando(true);
    try {
      const dreIdFinal = dreId;
      const ehTodas = dreIdFinal === OPCAO_TODOS || dreIdFinal === '-99';
      const resposta = ehTodas
        ? await ServicoFrequencia.obterFrequenciaRanking()
        : await ServicoFrequencia.obterFrequenciaRanking(dreIdFinal);

      if (resposta.status === 200 && resposta.data) {
        const dadosApi = resposta.data;
        setDados({
          escolasEmSituacaoCritica: {
            dados: dadosApi.escolasEmSituacaoCritica || [],
            cor: '#ffebee',
          },
          escolasEmAtencao: {
            dados: dadosApi.escolasEmAtencao || [],
            cor: '#fff8e1',
          },
          escolasRanqueadas: {
            dados: dadosApi.escolasRanqueadas || [],
            cor: '#e8f5e8',
          },
        });
      } else setDados({});
    } catch (error) {
      if (error.response?.data?.mensagens?.length > 0)
        erros(error.response.data.mensagens.join(', '));
      else erros('Erro ao carregar análise de frequência das escolas');
      setDados({});
    } finally {
      setCarregando(false);
    }
  }, [dreId, periodicidade]);

  useEffect(() => {
    obterDados();
  }, [dreId, periodicidade, obterDados]);

  const renderizarGrupoEscolas = (chave, grupo) => {
    if (!grupo || !grupo.dados?.length) return null;

    const titulos = {
      escolasEmSituacaoCritica: 'Escolas em situação crítica',
      escolasEmAtencao: 'Escolas em atenção',
      escolasRanqueadas: 'Melhores frequências',
    };

    const descricoes = {
      escolasEmSituacaoCritica: ` ${grupo.dados.length} escolas com frequência abaixo de 85%`,
      escolasEmAtencao: ` ${grupo.dados.length} escolas com frequência entre 85% e 90%`,
      escolasRanqueadas: ` ${grupo.dados.length} escolas com frequência acima de 90%`,
    };

    const maxAlturaDezLinhas = 240;

    return (
      <Col xs={24} md={8} key={chave}>
        <div
          className="p-3 h-100"
          style={{
            backgroundColor: grupo.cor,
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h5 className="mb-2" style={{ fontWeight: 'bold', color: '#333' }}>
            {titulos[chave]}
          </h5>
          <p className="mb-3 text-muted" style={{ fontSize: '0.9em' }}>
            {descricoes[chave]}
          </p>
          <div
            className="scroll-clean"
            style={{
              overflowY: grupo.dados.length > 10 ? 'auto' : 'visible',
              maxHeight: grupo.dados.length > 10 ? maxAlturaDezLinhas : 'none',
              paddingRight: grupo.dados.length > 10 ? '4px' : 0,
            }}
          >
            {grupo.dados.map((escola, index) => (
              <div key={index} className="mb-2" style={{ lineHeight: '1.2em' }}>
                <span style={{ color: '#555', fontSize: '0.85em' }}>
                  {escola.ue}
                  {dreId === OPCAO_TODOS && escola.dre && ` (${escola.dre})`}
                  {' - '}
                  {escola.percentualFrequencia?.toString()?.replace('.', ',')}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </Col>
    );
  };

  if (carregando) {
    return (
      <div className="mt-4">
        <Loader
          loading
          className="text-center"
          tip="Carregando análise de frequência..."
        />
      </div>
    );
  }

  if (!dreId || !Object.keys(dados).length) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="mb-3">
        <h5 style={{ fontWeight: 'bold', color: '#333', marginTop: '32px' }}>
          Análise de frequência
        </h5>
        <p
          className="text-muted"
          style={{
            fontSize: '14px',
            marginTop: '32px',
            marginBottom: '32px',
            color: '#42474a',
          }}
        >
          Análise dos níveis de frequência das UEs em 2025.
        </p>
      </div>

      <Row gutter={[16, 16]}>
        {renderizarGrupoEscolas(
          'escolasEmSituacaoCritica',
          dados.escolasEmSituacaoCritica
        )}
        {renderizarGrupoEscolas('escolasEmAtencao', dados.escolasEmAtencao)}
        {renderizarGrupoEscolas('escolasRanqueadas', dados.escolasRanqueadas)}
      </Row>
    </div>
  );
};

GraficoAnaliseDeFrequencia.propTypes = {
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  periodicidade: PropTypes.string,
};

GraficoAnaliseDeFrequencia.defaultProps = {
  dreId: null,
  periodicidade: 'mensal',
};

export default GraficoAnaliseDeFrequencia;
