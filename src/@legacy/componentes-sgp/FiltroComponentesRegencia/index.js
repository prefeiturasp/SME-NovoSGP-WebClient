import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import styled from 'styled-components';
import { Base, Loader } from '~/componentes';
import { erros, ServicoDisciplina } from '~/servicos';
import { cloneDeep } from 'lodash';

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
    ehRegencia,
    componentesRegencia,
    setComponentesRegencia,
    codigoComponenteCurricular,
  } = props;

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const [carregando, setCarregando] = useState(false);

  const atualizarComponenteAtivo = componente => {
    setComponentesRegencia(prevState => {
      const updatedValues = cloneDeep(prevState);

      updatedValues.forEach(c => {
        if (
          c.codigoComponenteCurricular === componente.codigoComponenteCurricular
        ) {
          c.ativo = !c.ativo;
        }
      });

      return [...updatedValues];
    });
  };

  useEffect(() => {
    if (ehRegencia) {
      const turmaPrograma = !!(turmaSelecionada.ano === '0');
      setCarregando(true);
      ServicoDisciplina.obterDisciplinasPlanejamento(
        codigoComponenteCurricular,
        turmaSelecionada?.turma,
        turmaPrograma,
        ehRegencia
      )
        .then(resposta => {
          if (resposta.data?.length) {
            const lista = resposta.data.map(c => ({ ...c, ativo: true }));
            setComponentesRegencia(lista);
          } else {
            setComponentesRegencia([]);
          }
        })
        .catch(e => erros(e))
        .finally(() => setCarregando(false));
    }

    return () => {
      setComponentesRegencia([]);
    };
  }, [turmaSelecionada, ehRegencia, codigoComponenteCurricular]);

  return ehRegencia ? (
    <Loader
      loading={carregando}
      tip="Carregando filtro"
      style={carregando ? { paddingBottom: '27px', paddingTop: '20px' } : {}}
    >
      <>
        {componentesRegencia?.length ? (
          <div>
            <div className="row">
              <div className="col-md-12 d-flex justify-content-end">
                Selecionar ou deselecionar componente(s) para exibir ou ocultar
                avaliações
              </div>
            </div>
            <ContainerBtn className="row pb-4" style={{ alignItems: 'center' }}>
              <div className="col-md-12 d-flex justify-content-end">
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {componentesRegencia.map(componente => (
                    <span
                      key={shortid.generate()}
                      className={componente?.ativo ? 'ativo' : ''}
                      onClick={() => {
                        atualizarComponenteAtivo(componente);
                      }}
                    >
                      {componente.nome}
                    </span>
                  ))}
                </div>
              </div>
            </ContainerBtn>
          </div>
        ) : (
          <></>
        )}
      </>
    </Loader>
  ) : (
    <></>
  );
};

export default FiltroComponentesRegencia;
