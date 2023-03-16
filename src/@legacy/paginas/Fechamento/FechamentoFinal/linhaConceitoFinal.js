import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import { MarcadorTriangulo } from '~/componentes';
import { tratarStringComponenteCurricularNome } from '~/utils';

const LinhaConceitoFinal = props => {
  const expandirLinha = useSelector(
    store => store.notasConceitos.expandirLinha
  );

  const { indexLinha, montarCampoNotaConceitoFinal, aluno } = props;

  return expandirLinha[indexLinha] ? (
    <tr>
      <td colSpan="7" style={{ padding: 0 }}>
        {aluno &&
        aluno.notasConceitoFinal &&
        aluno.notasConceitoFinal.length ? (
          aluno.notasConceitoFinal.map((item, index) => {
            const disciplinaTratada = tratarStringComponenteCurricularNome(
              item.disciplina
            );

            return (
              <td key={shortid.generate()} style={{ position: 'relative' }}>
                <div name={`${disciplinaTratada}${aluno?.codigo}`}>
                  {montarCampoNotaConceitoFinal(item.disciplina, index)}
                </div>
                {item?.emAprovacao && (
                  <Tooltip title="Aguardando aprovação">
                    <MarcadorTriangulo />
                  </Tooltip>
                )}
              </td>
            );
          })
        ) : (
          <></>
        )}
      </td>
    </tr>
  ) : (
    <></>
  );
};

LinhaConceitoFinal.propTypes = {
  indexLinha: PropTypes.number,
};

LinhaConceitoFinal.defaultProps = {
  indexLinha: null,
};

export default LinhaConceitoFinal;
