import React from 'react';
import PropTypes from 'prop-types';

import { Label } from '~/componentes';
import { CardStatus } from '../CardStatus';
import DetalhesFechamento from './DetalhesFechamento/detalhesFechamento';

const SecaoFechamento = ({ dadosStatusFechamento }) => {
  return (
    <>
      <Label text="Fechamento" className="mb-2" altura="24" />
      <div className="d-flex">
        {dadosStatusFechamento?.length > 0 ? (
          dadosStatusFechamento?.map(dadosFechamento => (
            <CardStatus
              key={dadosFechamento.descricao}
              dadosStatus={dadosFechamento}
            />
          ))
        ) : (
          <Label
            text="Não foram encontrados fechamentos"
            className="mb-2"
            altura="16"
          />
        )}
      </div>
      <div className="row">
        {!!dadosStatusFechamento?.length && <DetalhesFechamento />}
      </div>
    </>
  );
};

SecaoFechamento.defaultProps = {
  dadosStatusFechamento: {},
};
SecaoFechamento.propTypes = {
  dadosStatusFechamento: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default SecaoFechamento;
