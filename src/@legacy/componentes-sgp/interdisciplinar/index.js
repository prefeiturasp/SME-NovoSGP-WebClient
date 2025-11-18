import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Base } from '~/componentes/colors';

const LabelInterdisciplinar = props => {
  const { disciplinas } = props;

  const ContainerInterdisciplinar = styled.span`
    border: 1.6px solid ${Base.Roxo};
    border-radius: 9px;
    padding-left: 6px;
    padding-right: 6px;
    font-weight: bold;
    color: ${Base.Roxo};
  `;

  const montarTooltipDisciplinas = () => (
    <div style={{ display: 'flex', flexFlow: 'column', fontSize: '12px' }}>
      {disciplinas.map(nomeDisciplina => (
        <div key={nomeDisciplina}>{nomeDisciplina}</div>
      ))}
    </div>
  );

  return (
    <Tooltip
      title={disciplinas?.length ? montarTooltipDisciplinas(disciplinas) : ''}
      placement="bottom"
    >
      <ContainerInterdisciplinar>Interdisciplinar</ContainerInterdisciplinar>
    </Tooltip>
  );
};

LabelInterdisciplinar.propTypes = {
  disciplinas: PropTypes.oneOfType([PropTypes.any]),
};

LabelInterdisciplinar.defaultProps = {
  disciplinas: [],
};

export default LabelInterdisciplinar;
