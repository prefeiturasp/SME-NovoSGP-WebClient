import PropTypes from 'prop-types';
import React from 'react';
import shortid from 'shortid';
import { formatarFrequencia } from '~/utils';
import AusenciasEstudante from './ausenciasEstudante';
import BtnExpandirAusenciaEstudante from './btnExpandirAusenciaEstudante';
import { TabelaColunasFixas } from './listaFrequenciaPorBimestre.css';
import ModalAnotacoes from './modalAnotacoes';

const ListaFrequenciaPorBimestre = props => {
  const {
    dados,
    turmaId,
    codigoAluno,
    componenteCurricularId,
    esconderBimestre,
  } = props;

  return (
    <>
      <ModalAnotacoes />
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-12">
            <TabelaColunasFixas>
              <div className="wrapper">
                <div className="header-fixo">
                  <table className="table">
                    <thead className="tabela-um-thead">
                      <tr>
                        {!esconderBimestre && (
                          <th className="col-linha-dois">Bimestre</th>
                        )}
                        <th className="col-linha-dois">Quantidade de aulas</th>
                        <th className="col-linha-dois">
                          Quantidade de ausências
                        </th>
                        <th className="col-linha-dois">Frequência</th>
                      </tr>
                    </thead>
                    <tbody className="tabela-um-tbody">
                      {dados?.length ? (
                        dados?.map((data, index) => {
                          return (
                            <>
                              <tr key={shortid.generate()}>
                                {!esconderBimestre && (
                                  <td className="col-valor-linha-dois">
                                    {data.bimestre}°
                                  </td>
                                )}
                                <td className="col-valor-linha-dois">
                                  {data.aulasRealizadas}
                                </td>
                                <td className="col-valor-linha-dois">
                                  {data.ausencias}
                                </td>
                                <td className="col-valor-linha-dois">
                                  {data.frequenciaFormatado ? (
                                    <>
                                      {formatarFrequencia(
                                        data.frequenciaFormatado
                                      )}
                                      <BtnExpandirAusenciaEstudante
                                        indexLinha={index}
                                      />
                                    </>
                                  ) : (
                                    ''
                                  )}
                                </td>
                              </tr>
                              <AusenciasEstudante
                                indexLinha={index}
                                bimestre={data?.bimestre}
                                semestre={data?.semestre}
                                turmaId={turmaId}
                                codigoAluno={codigoAluno}
                                componenteCurricularId={componenteCurricularId}
                              />
                            </>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="4">Sem dados</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabelaColunasFixas>
          </div>
        </div>
      </div>
    </>
  );
};

ListaFrequenciaPorBimestre.propTypes = {
  dados: PropTypes.oneOfType([PropTypes.array]),
  turmaId: PropTypes.oneOfType([PropTypes.any]),
  codigoAluno: PropTypes.oneOfType([PropTypes.any]),
  componenteCurricularId: PropTypes.oneOfType([PropTypes.any]),
  esconderBimestre: PropTypes.bool,
};

ListaFrequenciaPorBimestre.defaultProps = {
  dados: [],
  turmaId: '',
  codigoAluno: '',
  componenteCurricularId: 0,
  esconderBimestre: false,
};

export default ListaFrequenciaPorBimestre;
