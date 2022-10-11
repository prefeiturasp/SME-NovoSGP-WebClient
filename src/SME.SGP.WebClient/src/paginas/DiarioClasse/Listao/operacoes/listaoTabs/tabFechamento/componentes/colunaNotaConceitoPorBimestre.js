import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Base } from '~/componentes';
import notasConceitos from '~/dtos/notasConceitos';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { obterDescricaoConceito } from '~/paginas/DiarioClasse/Listao/listaoFuncoes';

export const ContainerDescConceito = styled.div`
  padding: 7px 7px 7px 7px;
  border-radius: 3px;
  border: solid 1px #ced4da;
  background-color: ${Base.CinzaFundo};
  color: #a4a4a4;
  width: 53px;
  height: 37px;
`;

const ColunaNotaConceitoPorBimestre = props => {
  const { componentesRegenciaListao } = useContext(ListaoContext);

  const {
    ehRegencia,
    notaTipo,
    bimestre,
    notasConceitoBimestre,
    listaTiposConceitos,
  } = props;

  const [valorExibir, setValorExibir] = useState('');

  const obterDescricao = useCallback(
    valor => obterDescricaoConceito(listaTiposConceitos, valor),
    [listaTiposConceitos]
  );

  useEffect(() => {
    let notaBimestre = {};
    if (ehRegencia) {
      const componenteAtivo = componentesRegenciaListao?.find(c => c?.ativo);
      notaBimestre = notasConceitoBimestre.find(
        item =>
          item?.bimestre === bimestre &&
          item?.disciplinaCodigo === componenteAtivo?.codigoComponenteCurricular
      );
    } else {
      notaBimestre = notasConceitoBimestre.find(
        item => item?.bimestre === bimestre
      );
    }

    if (Number(notaTipo) === notasConceitos.Conceitos) {
      setValorExibir(obterDescricao(notaBimestre?.notaConceito));
    } else {
      setValorExibir(notaBimestre?.notaConceito);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    notaTipo,
    bimestre,
    ehRegencia,
    notasConceitoBimestre,
    componentesRegenciaListao,
    obterDescricaoConceito,
  ]);

  return <ContainerDescConceito>{valorExibir}</ContainerDescConceito>;
};

ColunaNotaConceitoPorBimestre.propTypes = {
  ehRegencia: PropTypes.bool,
  notaTipo: PropTypes.number,
  bimestre: PropTypes.string,
  notasConceitoBimestre: PropTypes.oneOfType([PropTypes.array]),
  listaTiposConceitos: PropTypes.oneOfType([PropTypes.array]),
};

ColunaNotaConceitoPorBimestre.defaultProps = {
  ehRegencia: '',
  notaTipo: null,
  bimestre: '',
  notasConceitoBimestre: [],
  listaTiposConceitos: [],
};

export default ColunaNotaConceitoPorBimestre;
