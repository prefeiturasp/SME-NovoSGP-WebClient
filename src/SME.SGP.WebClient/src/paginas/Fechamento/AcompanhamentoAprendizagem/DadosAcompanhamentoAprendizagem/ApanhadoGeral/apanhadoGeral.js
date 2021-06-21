import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import CardCollapse from '~/componentes/cardCollapse';
import ServicoAcompanhamentoAprendizagem from '~/servicos/Paginas/Relatorios/AcompanhamentoAprendizagem/ServicoAcompanhamentoAprendizagem';
import AuditoriaApanhadoGeral from './auditoriaApanhadoGeral';
import CampoApanhadoGeral from './campoApanhadoGeral';

const ApanhadoGeral = props => {
  const { semestreSelecionado } = props;

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  useEffect(() => {
    if (semestreSelecionado) {
      ServicoAcompanhamentoAprendizagem.obterDadosApanhadoGeral(
        turmaSelecionada.id,
        semestreSelecionado
      );
    }
  }, [semestreSelecionado, turmaSelecionada]);

  return (
    <CardCollapse
      key="percurso-coletivo-turma-collapse"
      titulo="Percurso Coletivo da Turma"
      indice="percurso-coletivo-turma"
      alt="percurso-coletivo-turma"
      show
    >
      <CampoApanhadoGeral />
      <AuditoriaApanhadoGeral />
    </CardCollapse>
  );
};

ApanhadoGeral.propTypes = {
  semestreSelecionado: PropTypes.string,
};

ApanhadoGeral.defaultProps = {
  semestreSelecionado: '',
};

export default ApanhadoGeral;
