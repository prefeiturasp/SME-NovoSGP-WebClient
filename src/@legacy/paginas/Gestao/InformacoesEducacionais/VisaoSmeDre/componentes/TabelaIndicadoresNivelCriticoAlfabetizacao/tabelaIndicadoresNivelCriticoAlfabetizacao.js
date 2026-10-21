import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Spin } from 'antd';
import { erros } from '~/servicos';
import { Loader } from '~/componentes';
import ServicoNivelAlfabetizacao from '~/servicos/InformacoesEducacionais/ServicoNivelAlfabetizacao';

import comDefaultProps from '~/utils/comDefaultProps';
const TabelaIndicadoresNivelCriticoAlfabetizacao = ({
  codigoDre,
  codigoUe,
  anoLetivo,
}) => {
  const [dados, setDados] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const obterDados = useCallback(async () => {
    setExibirLoader(true);
    try {
      const resposta =
        await ServicoNivelAlfabetizacao.obterIndicadoresAlfabetizacaoCritica(
          codigoDre,
          codigoUe,
          anoLetivo
        );

      if (resposta.status === 200 && resposta.data) {
        const dadosTabela = (resposta.data || []).map((escola, index) => ({
          key: index,
          posicao: escola.posicao,
          ue: escola.ue || 'UE TESTE',
          dre: escola.dre || 'DRE TESTE',
          totalAlunosNaoAlfabetizados: escola.totalAlunosNaoAlfabetizados || 0,
          percentualTotalAlunos: escola.percentualTotalAlunos || 0,
        }));

        setDados(dadosTabela);
      } else {
        setDados([]);
      }
    } catch (error) {
      if (error.response?.data?.mensagens?.length > 0)
        erros(error.response.data.mensagens.join(', '));
      else
        erros('Erro ao carregar indicadores de nível crítico de alfabetização');
      setDados([]);
    } finally {
      setExibirLoader(false);
    }
  }, []);

  useEffect(() => {
    obterDados();
  }, [anoLetivo, codigoDre]);

  const colunas = [
    {
      title: 'Posição',
      dataIndex: 'posicao',
      key: 'posicao',
      width: 80,
      align: 'center',
    },
    {
      title: 'Unidade Educacional',
      dataIndex: 'ue',
      key: 'ue',
    },
    {
      title: 'DRE',
      dataIndex: 'dre',
      key: 'dre',
    },
    {
      title: 'Não alfabetizados',
      dataIndex: 'totalAlunosNaoAlfabetizados',
      key: 'totalAlunosNaoAlfabetizados',
      align: 'center',
    },
    {
      title: '% do total de estudantes',
      dataIndex: 'percentualTotalAlunos',
      key: 'percentualTotalAlunos',
      align: 'center',
      render: valor =>
        `${new Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(valor)}%`,
    },
  ];

  if (exibirLoader) {
    return (
      <Loader
        loading={exibirLoader}
        className={exibirLoader ? 'text-center' : ''}
        tip="Carregando indicadores de alfabetização crítica..."
      />
    );
  }

  return (
    <div className="mt-4">
      <h5 style={{ fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>
        Indicadores de alfabetização crítica
      </h5>
      <p
        style={{
          fontSize: '14px',
          marginTop: '32px',
          marginBottom: '32px',
          color: '#42474a',
        }}
      >
        Essas são as 10 Unidades Educacionais da Rede Municipal de São Paulo que
        apresentam os índices mais críticos de alfabetização
      </p>
      <Table
        dataSource={dados}
        columns={colunas}
        pagination={false}
        bordered
        size="small"
      />
    </div>
  );
};

TabelaIndicadoresNivelCriticoAlfabetizacao.propTypes = {
  codigoDre: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  codigoUe: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

TabelaIndicadoresNivelCriticoAlfabetizacao.defaultProps = {
  codigoDre: null,
  codigoUe: null,
};

export default comDefaultProps(TabelaIndicadoresNivelCriticoAlfabetizacao, TabelaIndicadoresNivelCriticoAlfabetizacao.defaultProps);