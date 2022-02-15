import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DataTable, Loader } from '~/componentes';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { obterDescricaoConceito } from '~/paginas/DiarioClasse/Listao/listaoFuncoes';
import { erros } from '~/servicos';
import ServicoFechamentoBimestre from '~/servicos/Paginas/Fechamento/ServicoFechamentoBimestre';

const TabelaAvaliacoesFechamento = props => {
  const {
    setAvaliacoesTabelaFechamento,
    avaliacoesTabelaFechamento,
  } = useContext(ListaoContext);

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
          title: titulo,
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
    const resposta = await ServicoFechamentoBimestre.obterAvaliacoesTabelaFechamento(
      turmaSelecionada.id,
      periodoEscolarId
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoDados(false));

    if (resposta?.data?.length) {
      resposta.data = resposta.data.map(aluno => {
        if (aluno?.avaliacoes?.length) {
          aluno.avaliacoes = aluno.avaliacoes.map(avaliacao => {
            return { ...avaliacao, codigoAluno: aluno.codigoAluno };
          });
        }
        return aluno;
      });
      setAvaliacoesTabelaFechamento(resposta.data);
    } else {
      setAvaliacoesTabelaFechamento([]);
      setDadosAlunoSelecionado();
    }
  }, [turmaSelecionada, periodoEscolarId]);

  useEffect(() => {
    montarColunas(dadosAlunoSelecionado);
  }, [dadosAlunoSelecionado, montarColunas]);

  useEffect(() => {
    if (codigoAluno && avaliacoesTabelaFechamento?.length) {
      const dadosAluno = avaliacoesTabelaFechamento.find(
        item => Number(item.codigoAluno) === Number(codigoAluno)
      );
      if (dadosAluno) {
        setDadosAlunoSelecionado(dadosAluno);
      } else {
        setDadosAlunoSelecionado();
      }
    } else {
      obterAvaliacoesTabelaFechamento();
    }
  }, [
    avaliacoesTabelaFechamento,
    codigoAluno,
    obterAvaliacoesTabelaFechamento,
  ]);

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
