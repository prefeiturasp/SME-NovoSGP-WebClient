import React from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import { Divider } from 'antd';

import { Label } from '~/componentes';

const CampoMensagemInfantil = ({ mural, atividades }) => {
  const montarMural = () => {
    if (!mural?.length) {
      return 'Sem dados';
    }
    return mural.map(item => (
      <div className="mb-3">
        <div>
          {`${item.email} - ${
            item?.dataPublicacao
              ? moment(item.dataPublicacao).format('DD/MM/YYYY')
              : ''
          }`}
        </div>
        <div>{item.mensagem}</div>
      </div>
    ));
  };

  const montarAtividade = () => {
    if (!atividades?.length) {
      return 'Sem dados';
    }
    return atividades.map(item => (
      <div className="mb-3">
        <div>
          {`${item.email} - ${
            item?.dataPublicacao
              ? moment(item.dataPublicacao).format('DD/MM/YYYY')
              : ''
          }`}
        </div>
        <div>{item.titulo}</div>
        <div>{item.mensagem}</div>
      </div>
    ));
  };

  return (
    <div className="row">
      <div className="col-md-12 mb-2">
        <Label text="Mural" />
        {montarMural()}

        <Divider />

        <Label text="Atividade" />
        {montarAtividade()}
      </div>
    </div>
  );
};

CampoMensagemInfantil.propTypes = {
  mural: PropTypes.oneOfType(PropTypes.array),
  atividades: PropTypes.oneOfType(PropTypes.array),
};

CampoMensagemInfantil.defaultProps = {
  mural: [],
  atividades: [],
};

export default CampoMensagemInfantil;
