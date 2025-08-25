import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import { Loader } from '~/componentes';
import { erros } from '~/servicos';

const InformacoesAnaliseDeFrequencia = ({ dreId, periodicidade }) => {
  const [dados, setDados] = useState({});
  const [carregando, setCarregando] = useState(false);

  // Dados mockados baseados no design da imagem
  const dadosMock = {
    escolasSituacaoCritica: {
      titulo: 'Escolas em situação crítica',
      descricao: 'XX escolas com frequência abaixo de 85%',
      escolas: [
        { nome: 'EMEF Jardim São Paulo', percentual: 83 },
        { nome: 'EMEF Itaquera', percentual: 84 },
        { nome: 'EMEF Vila Medeiros', percentual: 84 }
      ],
      cor: '#ffebee' // Rosa claro
    },
    escolasAtencao: {
      titulo: 'Escolas em atenção',
      descricao: 'XX escolas com frequência entre 85% e 90%',
      escolas: [
        { nome: 'EMEF Campo Limpo', percentual: 89 },
        { nome: 'EMEF Tremembé', percentual: 88 },
        { nome: 'EMEF Pêra Marmelo', percentual: 87 },
        { nome: 'EMEF Casa Verde', percentual: 86 },
        { nome: 'EMEF Ermelino Matarazzo', percentual: 86 }
      ],
      cor: '#fff8e1' // Amarelo claro
    },
    melhoresFrequencias: {
      titulo: 'Melhores frequências',
      descricao: 'XX escolas com frequência acima de 94%',
      escolas: [
        { nome: 'EMEF Vila Formosa', percentual: 95 },
        { nome: 'EMEF Vila Rubi', percentual: 95 },
        { nome: 'EMEF Jardim Ângela', percentual: 94 },
        { nome: 'EMEF Alto de Pinheiros', percentual: 94 }
      ],
      cor: '#e8f5e8' // Verde claro
    }
  };

  const obterDados = useCallback(async () => {
    if (!dreId) {
      setDados({});
      return;
    }

    setCarregando(true);
    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // TODO: Substituir dados mock por chamada real à API quando endpoint estiver disponível
      // const response = await ServicoInformacoesEducacionais.obterAnaliseFrequencia({
      //   dreId,
      //   periodicidade,
      //   anoLetivo: new Date().getFullYear()
      // });
      // setDados(response.data);
      
      // Por enquanto, usar dados mockados
      setDados(dadosMock);
    } catch (error) {
      erros(error);
      setDados({});
    } finally {
      setCarregando(false);
    }
  }, [dreId, periodicidade]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  const renderizarGrupoEscolas = (grupo) => {
    if (!grupo || !grupo.escolas?.length) return null;

    return (
      <Col xs={24} md={8} key={grupo.titulo}>
        <div 
          className="p-3 h-100"
          style={{
            backgroundColor: grupo.cor,
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}
        >
          <h5 className="mb-2" style={{ fontWeight: 'bold', color: '#333' }}>
            {grupo.titulo}
          </h5>
          <p className="mb-3 text-muted" style={{ fontSize: '0.9em' }}>
            {grupo.descricao.replace('XX', grupo.escolas.length)}
          </p>
          <div>
            {grupo.escolas.map((escola, index) => (
              <div key={index} className="mb-2">
                <span style={{ color: '#555', fontSize: '0.9em' }}>
                  {escola.nome} <strong>({escola.percentual}%)</strong>
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
        <Loader loading className="text-center" tip="Carregando análise de frequência..." />
      </div>
    );
  }

  if (!dreId || !Object.keys(dados).length) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="mb-3">
        <h5 style={{ fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
          Análise de frequência
        </h5>
        <p className="text-muted" style={{ fontSize: '0.95em', margin: 0 }}>
          Análise dos níveis de frequência das UEs em 2025.
        </p>
      </div>
      
      <Row gutter={[16, 16]}>
        {renderizarGrupoEscolas(dados.escolasSituacaoCritica)}
        {renderizarGrupoEscolas(dados.escolasAtencao)}
        {renderizarGrupoEscolas(dados.melhoresFrequencias)}
      </Row>
    </div>
  );
};

InformacoesAnaliseDeFrequencia.propTypes = {
  dreId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  periodicidade: PropTypes.string,
};

InformacoesAnaliseDeFrequencia.defaultProps = {
  dreId: null,
  periodicidade: 'mensal',
};

export default InformacoesAnaliseDeFrequencia;
