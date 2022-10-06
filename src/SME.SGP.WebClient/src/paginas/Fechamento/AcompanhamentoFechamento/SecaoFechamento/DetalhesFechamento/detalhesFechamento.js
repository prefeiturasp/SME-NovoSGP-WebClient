import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Colors, Loader } from '~/componentes';
import { erros, ServicoAcompanhamentoFechamento } from '~/servicos';

import { TabelaComponentesCurriculares } from '../TabelaComponentesCurriculares';

const DetalhesFechamento = ({ turmaId, parametrosFiltro }) => {
  const [exibirDetalhamento, setExibirDetalhamento] = useState(false);
  const [
    carregandoComponetesCurriculares,
    setCarregandoComponetesCurriculares,
  ] = useState(false);
  const [componentesCurriculares, setComponentesCurriculares] = useState([]);

  const onClickExibirDetalhamento = () =>
    setExibirDetalhamento(!exibirDetalhamento);

  const obterComponentesCurricularesFechamento = useCallback(async () => {
    setCarregandoComponetesCurriculares(true);

    const resposta = await ServicoAcompanhamentoFechamento.obterComponentesCurricularesFechamento(
      turmaId,
      parametrosFiltro?.bimestre,
      parametrosFiltro?.situacaoFechamento
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoComponetesCurriculares(false));

    if (resposta?.data?.length) {
      setComponentesCurriculares(resposta.data);
    }
  }, [turmaId, parametrosFiltro]);

  useEffect(() => {
    if (exibirDetalhamento) {
      obterComponentesCurricularesFechamento();
      return;
    }
    setComponentesCurriculares([]);
  }, [exibirDetalhamento, obterComponentesCurricularesFechamento]);

  return (
    <>
      <div className="col-md-12 mt-3">
        <Loader loading={carregandoComponetesCurriculares}>
          <Button
            id="botao-detalhamento-conselho"
            label={
              exibirDetalhamento
                ? 'Ocultar detalhamento'
                : 'Exibir detalhamento'
            }
            color={Colors.Azul}
            onClick={onClickExibirDetalhamento}
            border
          />
        </Loader>
      </div>

      {!!componentesCurriculares?.length && (
        <div className="col-md-12 p-0 pt-4">
          <TabelaComponentesCurriculares
            dadosComponentesCurriculares={componentesCurriculares}
            turmaId={turmaId}
            bimestre={parametrosFiltro?.bimestre}
          />
        </div>
      )}
    </>
  );
};

DetalhesFechamento.defaultProps = {
  turmaId: 0,
  parametrosFiltro: {},
};

DetalhesFechamento.propTypes = {
  turmaId: PropTypes.number,
  parametrosFiltro: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default DetalhesFechamento;
