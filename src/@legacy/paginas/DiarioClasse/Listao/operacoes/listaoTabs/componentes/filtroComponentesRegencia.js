import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import styled from 'styled-components';
import { Base, Loader } from '~/componentes';
import { erros, ServicoDisciplina } from '~/servicos';
import ListaoContext from '../../../listaoContext';

export const ContainerBtn = styled.div`
  span {
    height: 38px !important;
    border-radius: 4px;
    border: solid 1px rgba(0, 0, 0, 0.15);
    background-color: ${Base.CinzaBadge};
    font-family: Roboto;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.58;
    letter-spacing: normal;
    color: ${Base.CinzaMako};
    padding: 10px;
    margin: 5px;
    cursor: pointer;

    &.ativo {
      color: #ffffff;
      border: solid 1px ${Base.Roxo};
      background-color: ${Base.Roxo};
    }
  }
`;

const FiltroComponentesRegencia = props => {
  const {
    componentesRegenciaListao,
    setComponentesRegenciaListao,
    componenteCurricular,
  } = useContext(ListaoContext);

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const { ehRegencia, ehSintese } = props;

  const [carregando, setCarregando] = useState(false);

  const exibirFiltro = !ehSintese && ehRegencia;

  const validarsetComponenteAtivo = componente => {
    componentesRegenciaListao.forEach(c => {
      c.ativo =
        c.codigoComponenteCurricular === componente.codigoComponenteCurricular;
    });
    setComponentesRegenciaListao([...componentesRegenciaListao]);
  };

  useEffect(() => {
    if (componenteCurricular?.regencia) {
      const turmaPrograma = !!(turmaSelecionada.ano === '0');
      setCarregando(true);
      ServicoDisciplina.obterDisciplinasPlanejamento(
        componenteCurricular?.codigoComponenteCurricular,
        turmaSelecionada?.turma,
        turmaPrograma,
        componenteCurricular?.regencia
      )
        .then(resposta => {
          if (resposta.data?.length) {
            setComponentesRegenciaListao(resposta.data);
          } else {
            setComponentesRegenciaListao([]);
          }
          setCarregando(false);
        })
        .catch(e => {
          erros(e);
          setComponentesRegenciaListao([]);
          setCarregando(false);
        });
    }

    return () => {
      setComponentesRegenciaListao([]);
    };

  }, [turmaSelecionada, componenteCurricular]);

  return exibirFiltro ? (
    <Loader
      loading={carregando}
      tip="Carregando filtro"
      style={carregando ? { paddingBottom: '27px', paddingTop: '20px' } : {}}
    >
      <>
        {componentesRegenciaListao?.length ? (
          <div>
            <div className="row">
              <div className="col-md-12 d-flex justify-content-end">
                Selecione um componente para consultar as notas ou conceitos dos
                bimestres
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        <ContainerBtn className="row pb-4" style={{ alignItems: 'center' }}>
          <div className="col-md-12 d-flex justify-content-end">
            {!ehSintese && ehRegencia && (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {componentesRegenciaListao.map(componente => (
                    <span
                      key={shortid.generate()}
                      className={componente.ativo ? 'ativo' : ''}
                      onClick={() => {
                        validarsetComponenteAtivo(componente);
                      }}
                    >
                      {componente.nome}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </ContainerBtn>
      </>
    </Loader>
  ) : (
    <></>
  );
};

FiltroComponentesRegencia.propTypes = {
  ehRegencia: PropTypes.bool,
  ehSintese: PropTypes.bool,
};

FiltroComponentesRegencia.defaultProps = {
  ehRegencia: false,
  ehSintese: false,
};

export default FiltroComponentesRegencia;
