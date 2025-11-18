import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Container } from './cardStatus.css';

const CardStatus = ({ dadosStatus, statusAcompanhamento }) => {
  const [corStatus, setCorStatus] = useState('');

  useEffect(() => {
    const status = Object.keys(statusAcompanhamento).find(
      item => statusAcompanhamento[item].descricao === dadosStatus.descricao
    );

    if (status) {
      setCorStatus(statusAcompanhamento[status].cor);
    }
  }, [dadosStatus, statusAcompanhamento]);

  return (
    <Container corStatus={corStatus}>
      <div className="descricao">{dadosStatus.descricao}</div>
      <div className="quantidade">{dadosStatus.quantidade}</div>
    </Container>
  );
};

CardStatus.propTypes = {
  dadosStatus: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  statusAcompanhamento: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

CardStatus.defaultProps = {
  dadosStatus: [],
  statusAcompanhamento: {},
};
export default CardStatus;
