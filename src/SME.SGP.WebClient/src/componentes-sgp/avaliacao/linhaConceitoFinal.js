/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import { MarcadorTriangulo } from '~/componentes';
import { tratarString } from '~/utils';

const LinhaConceitoFinal = props => {
  const expandirLinha = useSelector(
    store => store.notasConceitos.expandirLinha
  );

  const { indexLinha, dados, montarCampoNotaConceitoFinal, aluno } = props;

  const quantidadeAvaliacoes =
    dados && dados.avaliacoes && dados.avaliacoes.length
      ? dados.avaliacoes.length
      : 0;

  return (
    <>
      {expandirLinha[indexLinha] ? (
        <>
          <tr>
            <td
              colSpan={4 + quantidadeAvaliacoes}
              className="linha-conceito-final"
            >
              <div className="desc-linha-conceito-final">
                <table>
                  <tbody>
                    <tr>
                      {aluno &&
                      aluno.notasBimestre &&
                      aluno.notasBimestre.length ? (
                        aluno.notasBimestre.map((item, index) => {
                          const disciplinaTratada = tratarString(
                            item.disciplina
                          );
                          return (
                            <td
                              style={{
                                paddingRight: '16px',
                                position: 'relative',
                              }}
                              key={shortid.generate()}
                              name={`${disciplinaTratada}${aluno?.id}`}
                            >
                              {montarCampoNotaConceitoFinal(
                                item.disciplina,
                                index
                              )}
                              {aluno?.notasBimestre?.emAprovacao && (
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
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

LinhaConceitoFinal.propTypes = {
  indexLinha: PropTypes.oneOfType([PropTypes.any]),
  dados: PropTypes.oneOfType([PropTypes.any]),
};

LinhaConceitoFinal.defaultProps = {
  indexLinha: null,
  dados: [],
};

export default LinhaConceitoFinal;
