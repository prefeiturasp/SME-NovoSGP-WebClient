import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Base } from '~/componentes';
import notasConceitos from '~/dtos/notasConceitos';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';

export const ContainerDescConceito = styled.div`
  padding: 7px 7px 7px 7px;
  border-radius: 3px;
  border: solid 1px #ced4da;
  background-color: ${Base.CinzaFundo};
  argin-left: 5px;
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

  const obterDescricaoConceito = useCallback(
    valor => {
      if (listaTiposConceitos?.length) {
        const conceito = listaTiposConceitos.find(
          item => item.id === String(valor)
        );
        return conceito?.valor || '';
      }
      return '';
    },
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
      setValorExibir(obterDescricaoConceito(notaBimestre?.notaConceito));
    } else {
      setValorExibir(notaBimestre?.notaConceito);
    }
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
  bimestre: PropTypes.string,
  notasConceitoBimestre: [],
  listaTiposConceitos: [],
};

export default ColunaNotaConceitoPorBimestre;