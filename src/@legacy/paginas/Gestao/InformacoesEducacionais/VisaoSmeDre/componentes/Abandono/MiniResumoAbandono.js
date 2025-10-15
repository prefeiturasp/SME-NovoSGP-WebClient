import React from 'react';
import PropTypes from 'prop-types';
import './tabelaAbandonoSmeDre.css';

function MiniResumoAbandono({ ano, quantidadeDesistentes }) {
  return (
    <div className="mini-resumo-abandono">
      <div>
        <strong>Ano:</strong> {ano}
      </div>
      <div>
        <strong>Qtde de desistências:</strong> {quantidadeDesistentes}
      </div>
    </div>
  );
}

MiniResumoAbandono.propTypes = {
  modalidade: PropTypes.string.isRequired,
  ano: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  quantidadeDesistentes: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default MiniResumoAbandono;
