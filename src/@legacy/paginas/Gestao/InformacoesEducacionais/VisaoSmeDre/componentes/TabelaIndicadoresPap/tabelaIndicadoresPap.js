import React, { useEffect, useState } from 'react';
import { Table, Tooltip } from 'antd';
import { Loader } from '~/componentes';
import { erros } from '~/servicos/alertas';
import PropTypes from 'prop-types';
import ServicoPap from '~/servicos/InformacoesEducacionais/ServicoPap';
import TabelaIndicadoresPapDetalhes from './tabelaIndicadoresPapDetalhes';
import Title from 'antd/es/typography/Title';

import comDefaultProps from '~/utils/comDefaultProps';
const TabelaIndicadoresPap = ({ anoLetivo, codigoDre, codigoUe }) => {
  const [dados, setDados] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setExibirLoader(true);
      try {
        const response = await ServicoPap.obterIndicadoresPap(
          anoLetivo,
          codigoDre,
          codigoUe
        );
        setDados(response.data);
      } catch (error) {
        erros(error);
      } finally {
        setExibirLoader(false);
      }
    };

    fetchData();
  }, [anoLetivo, codigoDre, codigoUe]);

  if (exibirLoader) {
    return (
      <div className="mt-4">
        <Loader
          loading={exibirLoader}
          className={exibirLoader ? 'text-center' : ''}
          tip="Carregando indicadores PAP..."
        />
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h5 style={{ fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>
        Projeto de Apoio Pedagógico (PAP)
      </h5>
      <p
        style={{
          fontSize: '14px',
          marginTop: '32px',
          marginBottom: '32px',
          color: '#42474a',
        }}
      >
        O Projeto de Apoio Pedagógico oferece reforço em Português e Matemática
        para alunos com dificuldades, complementando as aulas regulares. A
        tabela abaixo mostra a quantidade de estudantes, classificados por
        frequência e nível de dificuldade das unidades educacionais da cidade de
        São Paulo.
      </p>
      <TabelaIndicadoresPapDetalhes dados={dados} />
    </div>
  );
};

TabelaIndicadoresPap.propTypes = {
  anoLetivo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  codigoDre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  codigoUe: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TabelaIndicadoresPap.defaultProps = {
  codigoDre: null,
  codigoUe: null,
  anoLetivo: new Date().getFullYear(),
};

export default comDefaultProps(TabelaIndicadoresPap, TabelaIndicadoresPap.defaultProps);