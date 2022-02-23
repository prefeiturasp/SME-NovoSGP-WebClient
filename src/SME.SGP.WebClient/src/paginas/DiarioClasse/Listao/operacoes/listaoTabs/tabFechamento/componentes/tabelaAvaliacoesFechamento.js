import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DataTable, Loader } from '~/componentes';
import { obterDescricaoConceito } from '~/paginas/DiarioClasse/Listao/listaoFuncoes';
import { erros } from '~/servicos';
import ServicoNotaConceito from '~/servicos/Paginas/DiarioClasse/ServicoNotaConceito';

const TabelaAvaliacoesFechamento = props => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const { codigoAluno, periodoEscolarId, ehNota, listaTiposConceitos } = props;

  const [dadosAlunoSelecionado, setDadosAlunoSelecionado] = useState();
  const [colunas, setColunas] = useState([]);
  const [carregandoDados, setCarregandoDados] = useState(false);

  const montarColunas = useCallback(() => {
    const cols = [];
    if (dadosAlunoSelecionado?.avaliacoes?.length) {
      dadosAlunoSelecionado.avaliacoes.forEach((avaliacao, index) => {
        const titulo = `${avaliacao?.nome} - ${window
          .moment(avaliacao.data)
          .format('DD/MM/YYYY')}`;

        cols.push({
          ellipsis: true,
          title: <Tooltip title={titulo}>{titulo}</Tooltip>,
          align: 'center',
          width: '200px',
          dataIndex: `avaliacoes[${index}]`,
          key: `avaliacoes[${index}]`,
          render: dadosAvaliacao => {
            if (ehNota) return dadosAvaliacao?.notaConceito;

            return obterDescricaoConceito(
              listaTiposConceitos,
              dadosAvaliacao?.notaConceito
            );
          },
        });
      });
    }
    setColunas(cols);
  }, [dadosAlunoSelecionado, ehNota, listaTiposConceitos]);

  const obterAvaliacoesTabelaFechamento = useCallback(async () => {
    setCarregandoDados(true);
    const resposta = await ServicoNotaConceito.obterNotasAvaliacoesPorTurmaBimestreAluno(
      turmaSelecionada.id,
      periodoEscolarId,
      codigoAluno
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoDados(false));

    if (resposta?.data?.length) {
      const avaliacoes = { codigoAluno, avaliacoes: resposta.data };
      setDadosAlunoSelecionado(avaliacoes);
    } else {
      setDadosAlunoSelecionado();
    }
  }, [turmaSelecionada, periodoEscolarId, codigoAluno]);

  useEffect(() => {
    montarColunas(dadosAlunoSelecionado);
  }, [dadosAlunoSelecionado, montarColunas]);

  useEffect(() => {
    if (codigoAluno) {
      obterAvaliacoesTabelaFechamento();
    } else {
      setDadosAlunoSelecionado();
    }
  }, [codigoAluno, obterAvaliacoesTabelaFechamento]);

  return (
    <Loader loading={carregandoDados}>
      <DataTable
        id={`tabela-aluno-${codigoAluno}`}
        idLinha="codigoAluno"
        pagination={false}
        columns={colunas}
        dataSource={dadosAlunoSelecionado ? [dadosAlunoSelecionado] : []}
        semHover
      />
    </Loader>
  );
};

TabelaAvaliacoesFechamento.propTypes = {
  codigoAluno: PropTypes.string,
  periodoEscolarId: PropTypes.number,
  ehNota: PropTypes.bool,
  listaTiposConceitos: PropTypes.oneOfType(PropTypes.array),
};

TabelaAvaliacoesFechamento.defaultProps = {
  codigoAluno: '',
  periodoEscolarId: null,
  ehNota: true,
  listaTiposConceitos: [],
};

export default TabelaAvaliacoesFechamento;
