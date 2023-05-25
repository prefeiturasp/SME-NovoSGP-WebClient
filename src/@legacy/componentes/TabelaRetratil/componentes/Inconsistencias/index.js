import { Popover } from 'antd';
import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import shortid from 'shortid';
import { SGP_POPOVER_INCONSISTENCIAS_ESTUDANTE } from '@/@legacy/constantes/ids/popover';

export const FiAlert = styled(FiAlertCircle)`
  margin: 0px 2px 2px;
  font-size: 12px;
  color: #b40c02;
`;

const InconsistenciasEstudante = props => {
  const dadosInconsistenciasEstudantes = useSelector(
    store => store.conselhoClasse.dadosInconsistenciasEstudantes
  );

  const codigoAluno = props?.codigoAluno;

  const renderContent = inconsistencias => (
    <div>
      {inconsistencias.map(content => (
        <div key={shortid.generate()}>{content}</div>
      ))}
    </div>
  );

  if (codigoAluno && dadosInconsistenciasEstudantes?.length) {
    const alunoComInconsistencia = dadosInconsistenciasEstudantes?.find(
      e => String(e?.alunoCodigo) === codigoAluno
    );

    return alunoComInconsistencia ? (
      <Popover
        id={SGP_POPOVER_INCONSISTENCIAS_ESTUDANTE}
        mouseEnterDelay={0}
        content={renderContent(alunoComInconsistencia?.inconsistencias)}
      >
        <span>
          <FiAlert className="icone-inconsistencia" />
        </span>
      </Popover>
    ) : (
      <></>
    );
  }

  return <></>;
};

export default InconsistenciasEstudante;
