import React from 'react';
import PropTypes from 'prop-types';

import { Label } from '~/componentes';

import { statusAcompanhamentoFechamento } from '~/dtos';

import { DetalhesFechamento } from './DetalhesFechamento';
import { CardStatus } from '../CardStatus';

import comDefaultProps from '~/utils/comDefaultProps';
const SecaoFechamento = ({
  dadosTurmas,
  dadosStatusFechamento,
  parametrosFiltro,
}) => {
  return (
    <>
      <Label text="Fechamento" className="mb-2" altura="24" />
      <div className="d-flex">
        {dadosStatusFechamento?.length > 0 ? (
          dadosStatusFechamento?.map(dadosFechamento => (
            <CardStatus
              key={dadosFechamento.descricao}
              dadosStatus={dadosFechamento}
              statusAcompanhamento={statusAcompanhamentoFechamento}
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
        {!!dadosStatusFechamento?.length && (
          <DetalhesFechamento
            turmaId={dadosTurmas?.turmaId}
            parametrosFiltro={parametrosFiltro}
          />
        )}
      </div>
    </>
  );
};

SecaoFechamento.defaultProps = {
  dadosTurmas: {},
  dadosStatusFechamento: {},
  parametrosFiltro: {},
};
SecaoFechamento.propTypes = {
  dadosTurmas: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  dadosStatusFechamento: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  parametrosFiltro: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default comDefaultProps(SecaoFechamento, SecaoFechamento.defaultProps);