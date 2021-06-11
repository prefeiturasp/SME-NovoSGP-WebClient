import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Colors, Loader } from '~/componentes';
import { erros, ServicoAcompanhamentoFechamento } from '~/servicos';
import TabelaAlunosConselho from './tabelaAlunosConselho';

const DetalhesConselhoClasse = props => {
  const { turmaId, bimestre } = props;
  const [exibirDetalhamento, setExibirDetalhamento] = useState(false);
  const [alunosDetalhesConselho, setAlunosDetalhesConselho] = useState([]);

  const [carregandoAlunos, setCarregandoAlunos] = useState(false);

  const onClickExibirDetalhamento = () =>
    setExibirDetalhamento(!exibirDetalhamento);

  const obterListaAlunosPorTurma = useCallback(async () => {
    setCarregandoAlunos(true);

    const resposta = await ServicoAcompanhamentoFechamento.obterListaAlunosPorTurma(
      turmaId,
      bimestre
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoAlunos(false));

    if (resposta?.data?.length) {
      setAlunosDetalhesConselho(resposta.data);
    }
  }, [turmaId, bimestre]);

  useEffect(() => {
    if (exibirDetalhamento) {
      obterListaAlunosPorTurma();
    } else {
      setAlunosDetalhesConselho([]);
    }
  }, [exibirDetalhamento, obterListaAlunosPorTurma]);

  return (
    <>
      <div className="col-md-12 mb-4 mt-3">
        <Loader loading={carregandoAlunos}>
          <Button
            id="botao-detalhamento-conselho"
            label={
              exibirDetalhamento && alunosDetalhesConselho?.length
                ? 'Ocultar detalhamento'
                : 'Exibir detalhamento'
            }
            color={Colors.Azul}
            onClick={onClickExibirDetalhamento}
            border
          />
        </Loader>
      </div>

      {alunosDetalhesConselho?.length ? (
        <div className="col-md-12">
          <TabelaAlunosConselho
            dadosAlunos={alunosDetalhesConselho}
            bimestre={bimestre}
            turmaId={turmaId}
          />
        </div>
      ) : null}
    </>
  );
};

DetalhesConselhoClasse.propTypes = {
  turmaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bimestre: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

DetalhesConselhoClasse.defaultProps = {
  turmaId: null,
  bimestre: null,
};
export default DetalhesConselhoClasse;
