import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import IndicadorFrequenciaGlobal from './indicadorFrequenciaGlobal';
import IndicadorIdep from './indicadorIdep';
import IndicadorIdeb from './indicadorIdeb';
import ServicoVisaoGeral from '~/servicos/InformacoesEducacionais/ServicoVisaoGeral';
import { erros } from '~/servicos';
import IndicadorTaxaAlfabetizacao from './IndicadorTaxaAlfabetizacao';

import comDefaultProps from '~/utils/comDefaultProps';
const Titulo = styled.h2`
  font-weight: bold;
  color: #333;
  margin-bottom: 0;
  font-size: 20px;
`;

const Descricao = styled.p`
  font-size: 14px;
  color: #42474a;
  margin-bottom: 24px;
`;

const VisaoGeral = ({ anoLetivo, dreCodigo }) => {
  const [dadosCompletos, setDadosCompletos] = useState([]);
  const [dadosTaxaAlfabetizacao, setDadosTaxaAlfabetizacao] = useState([]);
  const [loading, setLoading] = useState(false);
  const ordem = ['Anos iniciais', 'Anos finais'];

  const carregarDados = useCallback(async () => {
    if (anoLetivo && dreCodigo) {
      setLoading(true);
      const resposta = await ServicoVisaoGeral.obterVisaoGeral(
        anoLetivo,
        dreCodigo
      ).catch(e => erros(e));

      if (resposta?.data) {
        setDadosCompletos(resposta.data);
      } else {
        setDadosCompletos([]);
      }
      setLoading(false);
    }
  }, [anoLetivo, dreCodigo]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const carregarDadosTaxaAlfabetizacao = useCallback(async () => {
    if (anoLetivo) {
      setLoading(true);

      let resposta;
      if (dreCodigo !== '-99') {
        resposta = await ServicoVisaoGeral.obterVisaoGeralTaxaAlfabetizacao(
          anoLetivo,
          dreCodigo
        ).catch(e => erros(e));
      } else {
        resposta = await ServicoVisaoGeral.obterVisaoGeralTaxaAlfabetizacao(
          anoLetivo
        ).catch(e => erros(e));
      }

      if (resposta?.data !== undefined && resposta?.data !== null) {
        const valorFormatado = Number(resposta.data).toFixed(2);
        setDadosTaxaAlfabetizacao([{ valor: `${valorFormatado}%`, label: '' }]);
      } else {
        setDadosTaxaAlfabetizacao([]);
      }

      setLoading(false);
    }
  }, [anoLetivo, dreCodigo]);

  useEffect(() => {
    carregarDadosTaxaAlfabetizacao();
  }, [carregarDadosTaxaAlfabetizacao]);

  const dadosFormatados = useMemo(() => {
    const dadosIdep =
      dadosCompletos
        .find(item => item.indicador === 'IDEP')
        ?.series.map(serie => ({
          valor: serie.valor,
          label: serie.serie,
        }))
        .sort((a, b) => ordem.indexOf(a.label) - ordem.indexOf(b.label)) || [];

    const dadosFrequencia =
      dadosCompletos
        .find(item => item.indicador === 'Frequência global')
        ?.series.map(serie => ({
          valor: `${serie.valor}%`,
          label: serie.serie || '',
        })) || [];

    const dadosIdeb =
      dadosCompletos
        .find(item => item.indicador === 'IDEB')
        ?.series.map(serie => ({
          valor: serie.valor,
          label: serie.serie,
        }))
        .sort((a, b) => ordem.indexOf(a.label) - ordem.indexOf(b.label)) || [];

    return { dadosIdep, dadosFrequencia, dadosIdeb };
  }, [dadosCompletos]);

  return (
    <div>
      <Titulo className="mb-2">Visão Geral</Titulo>
      <Descricao>
        Aqui estão as informações resumidas de todas as escolas da rede
        municipal de São Paulo.
      </Descricao>
      <div style={{ marginBottom: '16px' }}>
        <Row gutter={[24]}>
          <Col xs={24} md={12}>
            <IndicadorIdep
              dados={dadosFormatados.dadosIdep}
              loading={loading}
            />
          </Col>

          <Col xs={24} md={12}>
            <IndicadorIdeb
              dados={dadosFormatados.dadosIdeb}
              loading={loading}
            />
          </Col>
        </Row>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <IndicadorFrequenciaGlobal
              dados={dadosFormatados.dadosFrequencia}
              loading={loading}
            />
          </Col>

          <Col xs={24} md={12}>
            <IndicadorTaxaAlfabetizacao
              dados={dadosTaxaAlfabetizacao}
              loading={loading}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

VisaoGeral.propTypes = {
  anoLetivo: PropTypes.string,
  dreCodigo: PropTypes.string,
};

VisaoGeral.defaultProps = {
  anoLetivo: null,
  dreCodigo: null,
};

export default comDefaultProps(VisaoGeral, VisaoGeral.defaultProps);