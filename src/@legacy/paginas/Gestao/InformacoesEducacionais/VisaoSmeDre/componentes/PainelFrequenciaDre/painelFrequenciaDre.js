import React from 'react';
import PropTypes from 'prop-types';
import PainelFrequenciaBase from '~/paginas/Gestao/InformacoesEducacionais/shared/PainelFrequenciaBase/PainelFrequenciaBase';
import comDefaultProps from '~/utils/comDefaultProps';
import '~/paginas/Gestao/InformacoesEducacionais/shared/PainelFrequenciaBase/painelFrequenciaBase.css';

function PainelFrequenciaDre({ dreCodigo, anoLetivo }) {
  return (
    <div className="painel-frequencia painel-frequencia-padding">
      <div className="painel-frequencia-introducao">
        <h2 className="painel-frequencia-titulo">Painel de frequência</h2>
        <p className="painel-frequencia-descricao">
          Aqui, você encontra informações sobre a frequência escolar dos alunos
          matriculados nas Unidades Educacionais (UEs) de São Paulo em{' '}
          {anoLetivo}. Busque uma DRE ou UE específica na barra de pesquisa ou
          consulte os dados na tabela abaixo.
        </p>
      </div>
      <PainelFrequenciaBase
        tipoExtra="dre"
        codigo={dreCodigo}
        anoLetivo={anoLetivo}
      />
    </div>
  );
}

PainelFrequenciaDre.propTypes = {
  dreCodigo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  anoLetivo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

PainelFrequenciaDre.defaultProps = {
  dreCodigo: null,
  anoLetivo: null,
};

export default comDefaultProps(PainelFrequenciaDre, PainelFrequenciaDre.defaultProps);
