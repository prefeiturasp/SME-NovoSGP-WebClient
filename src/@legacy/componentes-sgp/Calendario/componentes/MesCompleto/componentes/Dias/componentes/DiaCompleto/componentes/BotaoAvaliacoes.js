import React, { useCallback } from 'react';
import styled from 'styled-components';
import shortid from 'shortid';
import t from 'prop-types';

// Ant
import { Tooltip } from 'antd';

// Componentes
import { SelectComponent, Base, Colors } from '~/componentes';

// Estilos
import { Botao } from '../styles';

// DTOs
import RotasDTO from '~/dtos/rotasDto';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  padding-right: 0 !important;
  display: flex !important;
  align-items: center !important;
  z-index: 99999 !important;
`;

function BotaoAvaliacoes({ atividadesAvaliativas, permissaoTela }) {
  const navigate = useNavigate();

  const onClickAvaliacaoHandler = useCallback(
    avaliacao => {
      if (permissaoTela?.podeConsultar && avaliacao) {
        navigate(`${RotasDTO.CADASTRO_DE_AVALIACAO}/editar/${avaliacao}`);
      }
    },
    [permissaoTela]
  );

  const montarDados = () => {
    if (atividadesAvaliativas?.length > 1) {
      return (
        <SelectComponent
          lista={atividadesAvaliativas}
          classNameContainer="w-100"
          className="fonte-14"
          onChange={avaliacaoAtual => onClickAvaliacaoHandler(avaliacaoAtual)}
          valueSelect="Avaliação"
          valueOption="id"
          valueText="descricao"
          placeholder="Avaliação"
          allowClear={false}
          size="small"
          border={Base.Roxo}
          color={Base.Roxo}
        />
      );
    }

    if (atividadesAvaliativas?.length === 1) {
      return (
        <Tooltip className="zIndex" title={atividadesAvaliativas[0].descricao}>
          <span>
            <Botao
              id={shortid.generate()}
              label="Avaliação"
              color={Colors.Roxo}
              className="w-100 position-relative btn-sm zIndex"
              onClick={() =>
                onClickAvaliacaoHandler(atividadesAvaliativas[0].id)
              }
              height="24px"
              padding="0 1rem"
              border
            />
          </span>
        </Tooltip>
      );
    }
  };

  return (
    <Wrapper key={shortid.generate()} className="px-2 p-x-md-3">
      {montarDados()}
    </Wrapper>
  );
}

BotaoAvaliacoes.propTypes = {
  atividadesAvaliativas: t.oneOfType([t.any]),
  permissaoTela: t.oneOfType([t.any]),
};

BotaoAvaliacoes.defaultProps = {
  atividadesAvaliativas: [],
  permissaoTela: {},
};

export default BotaoAvaliacoes;
