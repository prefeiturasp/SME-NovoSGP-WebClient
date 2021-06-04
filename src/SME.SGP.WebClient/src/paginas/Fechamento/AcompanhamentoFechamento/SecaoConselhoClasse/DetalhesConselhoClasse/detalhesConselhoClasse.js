import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Colors, Loader } from '~/componentes';

import { erros, ServicoAcompanhamentoFechamento } from '~/servicos';

import { TabelaAlunosConselho } from '../TabelaAlunosConselho';

const DetalhesConselhoClasse = ({ turmaId, parametrosFiltro }) => {
  const [exibirDetalhamento, setExibirDetalhamento] = useState(false);
  const [alunosDetalhesConselho, setAlunosDetalhesConselho] = useState([]);

  const [carregandoAlunos, setCarregandoAlunos] = useState(false);

  const onClickExibirDetalhamento = () =>
    setExibirDetalhamento(!exibirDetalhamento);

  const obterListaAlunosPorTurma = useCallback(async () => {
    setCarregandoAlunos(true);

    const resposta = await ServicoAcompanhamentoFechamento.obterListaAlunosPorTurma(
      turmaId,
      parametrosFiltro?.bimestre,
      parametrosFiltro?.situacaoConselhoClasse
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoAlunos(false));

    if (resposta?.data?.length) {
      setAlunosDetalhesConselho(resposta.data);
    }
  }, [turmaId, parametrosFiltro]);

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
        <div className="col-md-12 p-0">
          <TabelaAlunosConselho
            dadosAlunos={alunosDetalhesConselho}
            bimestre={parametrosFiltro?.bimestre}
            turmaId={turmaId}
          />
        </div>
      ) : null}
    </>
  );
};

DetalhesConselhoClasse.propTypes = {
  turmaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  parametrosFiltro: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

DetalhesConselhoClasse.defaultProps = {
  turmaId: null,
  parametrosFiltro: {},
};
export default DetalhesConselhoClasse;
