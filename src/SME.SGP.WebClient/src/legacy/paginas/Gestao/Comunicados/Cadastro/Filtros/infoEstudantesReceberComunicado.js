import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { erros, ServicoComunicados } from '~/servicos';

export const Container = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
  color: #c0640e;
  margin-top: 10px;
`;

const InfoEstudantesReceberComunicados = ({ form }) => {
  const {
    anoLetivo,
    codigoDre,
    codigoUe,
    turmas,
    modalidades,
    anosEscolares,
    alunos,
  } = form.values;

  const [infoEstudante, setInfoEstudante] = useState();

  const obterQuantidadeCrianca = useCallback(async () => {
    const resposta = await ServicoComunicados.obterQuantidadeCrianca(
      anoLetivo,
      codigoDre,
      codigoUe,
      turmas,
      modalidades,
      anosEscolares
    ).catch(e => erros(e));

    if (resposta?.data?.mensagemQuantidade) {
      setInfoEstudante(resposta.data.mensagemQuantidade);
    } else {
      setInfoEstudante();
    }
  }, [anoLetivo, codigoDre, codigoUe, turmas, modalidades, anosEscolares]);

  useEffect(() => {
    if (
      anoLetivo &&
      codigoDre &&
      codigoUe &&
      turmas?.length &&
      modalidades?.length &&
      anosEscolares?.length &&
      !alunos?.length
    ) {
      obterQuantidadeCrianca();
    } else if (alunos?.length) {
      setInfoEstudante(
        `Os responsáveis de ${alunos?.length} crianças/estudantes poderão receber este comunicado.`
      );
    } else {
      setInfoEstudante();
    }
  }, [
    anoLetivo,
    codigoDre,
    codigoUe,
    turmas,
    modalidades,
    anosEscolares,
    alunos,
    obterQuantidadeCrianca,
  ]);

  return infoEstudante ? <Container>{infoEstudante}</Container> : '';
};

InfoEstudantesReceberComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
};

InfoEstudantesReceberComunicados.defaultProps = {
  form: null,
};

export default InfoEstudantesReceberComunicados;
