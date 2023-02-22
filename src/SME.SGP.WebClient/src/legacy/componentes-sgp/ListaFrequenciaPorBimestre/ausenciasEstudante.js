import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shortid from 'shortid';
import Loader from '~/componentes/loader';
import {
  setDadosModalAnotacao,
  setExibirModalAnotacao,
  setExpandirLinhaAusenciaEstudante,
} from '~/redux/modulos/listaFrequenciaPorBimestre/actions';
import { erros } from '~/servicos';
import ServicoAcompanhamentoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoAcompanhamentoFrequencia';
import Paginacao from '../Paginacao/paginacao';
import {
  BtnVisualizarAnotacao,
  TabelaColunasFixas,
} from './listaFrequenciaPorBimestre.css';

const AusenciasEstudante = props => {
  const {
    indexLinha,
    bimestre,
    semestre,
    turmaId,
    codigoAluno,
    componenteCurricularId,
  } = props;

  const dispatch = useDispatch();

  const expandirLinhaAusenciaEstudante = useSelector(
    store => store.listaFrequenciaPorBimestre.expandirLinhaAusenciaEstudante
  );

  const [exibirLoader, setExibirLoader] = useState(false);
  const [ausencias, setAusencias] = useState([]);

  const REGISTROS_POR_PAGINA = 10;

  useEffect(() => {
    return () => {
      dispatch(setExpandirLinhaAusenciaEstudante([]));
    };
  }, [dispatch]);

  const obterAusenciaMotivoPorAlunoTurmaBimestreAno = useCallback(
    async numeroPagina => {
      setExibirLoader(true);
      const retorno = await ServicoAcompanhamentoFrequencia.obterFrequenciaDiariaAluno(
        turmaId,
        componenteCurricularId,
        codigoAluno,
        bimestre,
        semestre,
        numeroPagina || 1,
        REGISTROS_POR_PAGINA
      )
        .catch(e => erros(e))
        .finally(() => setExibirLoader(false));

      if (retorno?.data) {
        setAusencias(retorno.data);
      } else {
        setAusencias([]);
      }
    },

    [bimestre, semestre, turmaId, componenteCurricularId, codigoAluno]
  );

  useEffect(() => {
    if (expandirLinhaAusenciaEstudante[indexLinha]) {
      obterAusenciaMotivoPorAlunoTurmaBimestreAno();
    } else {
      setAusencias([]);
    }
  }, [
    indexLinha,
    expandirLinhaAusenciaEstudante,
    obterAusenciaMotivoPorAlunoTurmaBimestreAno,
  ]);

  const onClickAnotacao = item => {
    dispatch(setDadosModalAnotacao(item));
    dispatch(setExibirModalAnotacao(true));
  };

  const visualizarAnotacao = item => {
    return (
      <div
        className="d-flex"
        style={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div style={{ padding: '9px' }}>
          {item?.motivo?.substr(0, 100)}
          {item?.motivo?.length > 100 ? '...' : ''}
        </div>

        <BtnVisualizarAnotacao
          className={item.id > 0 ? 'btn-com-anotacao' : ''}
          onClick={() => {
            if (item?.motivo.length > 0) {
              onClickAnotacao(item);
            }
          }}
        >
          <i className="fas fa-eye" style={{ marginTop: '9px' }} />
        </BtnVisualizarAnotacao>
      </div>
    );
  };

  return (
    <>
      {expandirLinhaAusenciaEstudante[indexLinha] ? (
        <tr>
          <td colSpan="6">
            <Loader loading={exibirLoader}>
              <TabelaColunasFixas
                style={{ display: 'inline-grid', width: '100%' }}
              >
                <div className="wrapper">
                  <div className="header-fixo">
                    <table className="table">
                      <thead className="tabela-dois-thead">
                        <tr>
                          <th className="col-linha-dados">Data da Aula</th>
                          <th className="col-linha-dados">Aulas Dadas</th>
                          <th className="col-linha-dados">Presenças</th>
                          <th className="col-linha-dados">Remoto</th>
                          <th className="col-linha-dados">Ausências</th>
                          <th className="campo-justificativa">Justificativa</th>
                        </tr>
                      </thead>
                      <tbody className="tabela-dois-tbody">
                        {ausencias?.items?.length ? (
                          ausencias?.items?.map(item => {
                            return (
                              <tr key={shortid.generate()}>
                                <td>
                                  {moment(item.dataAula).format('DD/MM/YYYY')}
                                </td>
                                <td className="col-linha-dados">
                                  {item.quantidadeAulas}
                                </td>
                                <td className="col-linha-dados">
                                  {item.quantidadePresenca}
                                </td>
                                <td className="col-linha-dados">
                                  {item.quantidadeRemoto}
                                </td>
                                <td className="col-linha-dados">
                                  {item.quantidadeAusencia}
                                </td>
                                <td className="campo-justificativa">
                                  {visualizarAnotacao(item)}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr className="text-center">
                            <td colSpan="6">Sem dados</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabelaColunasFixas>
            </Loader>
            {ausencias?.items?.length && ausencias?.totalRegistros ? (
              <div className="col-md-12">
                <Paginacao
                  pageSize={REGISTROS_POR_PAGINA}
                  numeroRegistros={ausencias?.totalRegistros}
                  onChangePaginacao={
                    obterAusenciaMotivoPorAlunoTurmaBimestreAno
                  }
                />
              </div>
            ) : (
              ''
            )}
          </td>
        </tr>
      ) : (
        ''
      )}
    </>
  );
};

AusenciasEstudante.propTypes = {
  indexLinha: PropTypes.oneOfType([PropTypes.any]),
  bimestre: PropTypes.oneOfType([PropTypes.any]),
  semestre: PropTypes.oneOfType([PropTypes.any]),
  turmaId: PropTypes.oneOfType([PropTypes.any]),
  codigoAluno: PropTypes.oneOfType([PropTypes.any]),
  componenteCurricularId: PropTypes.oneOfType([PropTypes.any]),
};

AusenciasEstudante.defaultProps = {
  indexLinha: null,
  bimestre: '',
  semestre: '',
  turmaId: '',
  codigoAluno: '',
  componenteCurricularId: 0,
};

export default AusenciasEstudante;
