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

  const {
    codigoAluno,
    periodoEscolarId,
    ehNota,
    listaTiposConceitos,
    componenteCurricular,
  } = props;

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
            let notaConceito = dadosAvaliacao?.notaConceito;

            if (ehNota) {
              notaConceito = notaConceito
                ? notaConceito.toString().replace('.', ',')
                : '-';
              return notaConceito;
            }

            return obterDescricaoConceito(listaTiposConceitos, notaConceito);
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
      codigoAluno,
      componenteCurricular?.codigoComponenteCurricular
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoDados(false));

    if (resposta?.data?.length) {
      const avaliacoes = { codigoAluno, avaliacoes: resposta.data };
      setDadosAlunoSelecionado(avaliacoes);
    } else {
      setDadosAlunoSelecionado();
    }
  }, [turmaSelecionada, periodoEscolarId, codigoAluno, componenteCurricular]);

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
      {dadosAlunoSelecionado ? (
        <DataTable
          id={`tabela-aluno-${codigoAluno}`}
          idLinha="codigoAluno"
          pagination={false}
          columns={colunas}
          dataSource={dadosAlunoSelecionado ? [dadosAlunoSelecionado] : []}
          semHover
        />
      ) : !carregandoDados ? (
        <div className="text-center">Sem dados</div>
      ) : (
        <></>
      )}
    </Loader>
  );
};

TabelaAvaliacoesFechamento.propTypes = {
  codigoAluno: PropTypes.string,
  periodoEscolarId: PropTypes.number,
  ehNota: PropTypes.bool,
  listaTiposConceitos: PropTypes.oneOfType(PropTypes.array),
  componenteCurricular: PropTypes.oneOfType(PropTypes.any),
};

TabelaAvaliacoesFechamento.defaultProps = {
  codigoAluno: '',
  periodoEscolarId: null,
  ehNota: true,
  listaTiposConceitos: [],
  componenteCurricular: null,
};

export default TabelaAvaliacoesFechamento;
