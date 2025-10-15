import React from 'react';
import PropTypes from 'prop-types';
import './tabelaAbandonoSmeDre.css';

function MiniResumoAbandono({ ano, quantidadeDesistentes }) {
  return (
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: 4,
        padding: 12,
        background: '#fafaff',
        fontSize: 14,
        marginBottom: 8,
        display: 'inline-block',
        minWidth: 180,
      }}
    >
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
