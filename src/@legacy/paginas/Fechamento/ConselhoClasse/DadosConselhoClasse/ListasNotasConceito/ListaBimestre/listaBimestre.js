import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip } from 'antd';
import shortid from 'shortid';
import notasConceitos from '~/dtos/notasConceitos';
import CampoConceito from '../CamposNotaConceito/campoConceito';
import CampoNota from '../CamposNotaConceito/campoNota';
import { BarraLateralLista, Lista } from '../listasNotasConceitos.css';
import LinhaJustificativa from '../../Justificativa/LinhaJustificativa/LinhaJustificativa';
import { MarcadorTriangulo } from '~/componentes';
import { moverFocoCampoNotaConselhoClasse } from '~/componentes-sgp/inputs/nota/funcoes';
import {
  formatarFrequencia,
  tratarStringComponenteCurricularNome,
} from '~/utils';

const ListaBimestre = props => {
  const {
    dadosLista,
    tipoNota,
    listaTiposConceitos,
    mediaAprovacao,
    alunoDesabilitado,
    corBarraLateral,
    corRegenciaBarraLateral,
    dadosArredondamento,
    componentesAgrupados,
  } = props;

  const descricaoTipoNota =
    tipoNota === notasConceitos.Notas ? 'Nota' : 'Conceito';

  const descricaoGrupoMatriz =
    dadosLista && dadosLista.grupoMatriz
      ? dadosLista.grupoMatriz
      : 'Componente';

  const alturaLinhaMesclada =
    dadosLista &&
    dadosLista.componenteRegencia &&
    dadosLista.componenteRegencia.componentesCurriculares &&
    dadosLista.componenteRegencia.componentesCurriculares.length
      ? dadosLista.componenteRegencia.componentesCurriculares.length * 2
      : 0;

  const montaCampoPosConselho = (
    notaPosConselho,
    idCampo,
    codigoComponenteCurricular,
    notaFechamento
  ) => {
    const nomeComponenteCurricular = tratarStringComponenteCurricularNome(
      notaFechamento?.nome
    );

    switch (Number(tipoNota)) {
      case Number(notasConceitos.Notas):
        return (
          <CampoNota
            name={nomeComponenteCurricular}
            id={notaPosConselho?.id}
            notaPosConselho={notaPosConselho?.nota}
            idCampo={idCampo}
            codigoComponenteCurricular={String(codigoComponenteCurricular)}
            mediaAprovacao={mediaAprovacao}
            alunoDesabilitado={
              alunoDesabilitado || !notaPosConselho?.podeEditar
            }
            dadosNotaPosConselho={notaPosConselho}
            dadosArredondamento={dadosArredondamento}
            clicarSetas={e =>
              moverFocoCampoNotaConselhoClasse(
                e,
                componentesAgrupados,
                nomeComponenteCurricular
              )
            }
          />
        );
      case Number(notasConceitos.Conceitos):
        return (
          <CampoConceito
            notaPosConselho={notaPosConselho?.nota}
            listaTiposConceitos={listaTiposConceitos}
            id={notaPosConselho?.id}
            idCampo={idCampo}
            codigoComponenteCurricular={codigoComponenteCurricular}
            alunoDesabilitado={
              alunoDesabilitado || !notaPosConselho?.podeEditar
            }
            dadosNotaPosConselho={notaPosConselho}
          />
        );
      default:
        return '';
    }
  };

  const obterValorNotaConceito = valor => {
    const ehNota = Number(notasConceitos.Notas) === tipoNota;
    if (valor && !ehNota && listaTiposConceitos && listaTiposConceitos.length) {
      const conceito = listaTiposConceitos.find(
        item => String(item.id) === String(valor)
      );
      return conceito ? conceito.valor : '';
    }
    return valor;
  };

  const montarValoresNotasConceitos = item => {
    const notaFechamento =
      item && item.notasFechamentos && item.notasFechamentos[0]
        ? item.notasFechamentos[0].notaConceito
        : '';
    return (
      <div
        className="input-notas-conceitos"
        style={{
          display: 'inline-block',
          cursor: 'not-allowed',
        }}
      >
        <span>{obterValorNotaConceito(notaFechamento)}</span>
      </div>
    );
  };

  return (
    <Lista className="pl-2 pr-2">
      <div className="table-responsive pl-2 pr-2">
        <table className="table mt-4">
          <thead className="tabela-conselho-thead">
            <tr>
              <th
                colSpan="2"
                className="coluna-disciplina sombra-direita"
                style={{ width: '250px', paddingLeft: '27px' }}
              >
                {descricaoGrupoMatriz}
              </th>
              <th>{descricaoTipoNota}</th>
              <th>{`${descricaoTipoNota} pós-conselho`}</th>
              <th>Aulas</th>
              <th>Faltas</th>
              <th style={{ width: '100px' }}>Ausências Compensadas</th>
              <th>%Freq.</th>
            </tr>
          </thead>
          <tbody className="tabela-conselho-tbody">
            {dadosLista &&
              dadosLista.componentesCurriculares &&
              dadosLista.componentesCurriculares.map((item, index) => {
                return (
                  <React.Fragment key={shortid.generate()}>
                    <tr>
                      <BarraLateralLista cor={corBarraLateral} />
                      <td
                        className="coluna-disciplina sombra-direita"
                        style={{
                          width: '250px',
                          textAlign: 'left',
                          paddingLeft: '20px',
                        }}
                      >
                        {item.nome}
                      </td>
                      <td className="text-center">
                        {montarValoresNotasConceitos(item)}
                      </td>
                      <td className="position-relative">
                        {montaCampoPosConselho(
                          item.notaPosConselho,
                          `${descricaoGrupoMatriz} ${index} componente`,
                          item.codigoComponenteCurricular,
                          item
                        )}
                        {item.notaPosConselho.emAprovacao && (
                          <Tooltip title="Aguardando aprovação">
                            <MarcadorTriangulo />
                          </Tooltip>
                        )}
                      </td>
                      <td>{item.quantidadeAulas}</td>
                      <td>{item.faltas}</td>
                      <td>{item.ausenciasCompensadas}</td>
                      <td>{formatarFrequencia(item?.frequencia)}</td>
                    </tr>
                    <LinhaJustificativa
                      idCampo={`${descricaoGrupoMatriz} ${index} componente`}
                      ehRegencia={false}
                      alunoDesabilitado={alunoDesabilitado}
                    />
                  </React.Fragment>
                );
              })}
            {dadosLista &&
              dadosLista.componenteRegencia &&
              dadosLista.componenteRegencia.componentesCurriculares &&
              dadosLista.componenteRegencia.componentesCurriculares.map(
                (item, index) => {
                  return (
                    <React.Fragment key={shortid.generate()}>
                      <tr>
                        <BarraLateralLista cor={corRegenciaBarraLateral} />
                        <td
                          className="coluna-disciplina sombra-direita"
                          style={{ textAlign: 'left', paddingLeft: '20px' }}
                        >
                          {item.nome}
                        </td>
                        <td>{montarValoresNotasConceitos(item)}</td>
                        <td className="position-relative">
                          {montaCampoPosConselho(
                            item.notaPosConselho,
                            `${descricaoGrupoMatriz} ${index} regencia`,
                            item.codigoComponenteCurricular
                          )}
                          {item.notaPosConselho.emAprovacao && (
                            <Tooltip title="Aguardando aprovação">
                              <MarcadorTriangulo />
                            </Tooltip>
                          )}
                        </td>
                        {index === 0 ? (
                          <td rowSpan={alturaLinhaMesclada}>
                            {dadosLista.componenteRegencia.quantidadeAulas}
                          </td>
                        ) : null}
                        {index === 0 ? (
                          <td rowSpan={alturaLinhaMesclada}>
                            {dadosLista.componenteRegencia.faltas}
                          </td>
                        ) : null}
                        {index === 0 ? (
                          <td rowSpan={alturaLinhaMesclada}>
                            {dadosLista.componenteRegencia.ausenciasCompensadas}
                          </td>
                        ) : null}
                        {index === 0 ? (
                          <td rowSpan={alturaLinhaMesclada}>
                            {formatarFrequencia(
                              dadosLista?.componenteRegencia?.frequencia
                            )}
                          </td>
                        ) : null}
                      </tr>
                      <LinhaJustificativa
                        idCampo={`${descricaoGrupoMatriz} ${index} regencia`}
                        ehRegencia
                      />
                    </React.Fragment>
                  );
                }
              )}
          </tbody>
        </table>
      </div>
    </Lista>
  );
};

ListaBimestre.propTypes = {
  dadosLista: PropTypes.oneOfType([PropTypes.object]),
  tipoNota: PropTypes.oneOfType([PropTypes.any]),
  listaTiposConceitos: PropTypes.oneOfType([PropTypes.array]),
  mediaAprovacao: PropTypes.number,
  alunoDesabilitado: PropTypes.bool,
  corBarraLateral: PropTypes.string,
  corRegenciaBarraLateral: PropTypes.string,
  dadosArredondamento: PropTypes.oneOfType([PropTypes.any]),
  componentesAgrupados: PropTypes.oneOfType([PropTypes.any]),
};

ListaBimestre.defaultProps = {
  dadosLista: {},
  tipoNota: 0,
  listaTiposConceitos: [],
  mediaAprovacao: 5,
  alunoDesabilitado: false,
  corBarraLateral: '',
  corRegenciaBarraLateral: '',
  dadosArredondamento: null,
  componentesAgrupados: [],
};

export default ListaBimestre;
