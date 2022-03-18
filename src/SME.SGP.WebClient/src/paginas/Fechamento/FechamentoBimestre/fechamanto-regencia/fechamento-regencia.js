import shortid from 'shortid';
import React from 'react';
import { Tooltip } from 'antd';
import {
  CampoNotaRegencia,
  LinhaNotaRegencia,
  TdRegencia,
  TrRegencia,
} from './fechamento-regencia.css';
import ServicoFechamentoBimestre from '~/servicos/Paginas/Fechamento/ServicoFechamentoBimestre';
import { MarcadorTriangulo } from '~/componentes';

const FechamentoRegencia = props => {
  const { idRegencia, dados, refElement } = props;

  return (
    <TrRegencia  ref={refElement} id={idRegencia} style={{ display: 'none' }}>
      <td colSpan="2" className="destaque-label">
        Conceitos finais regência de classe
      </td>
      <TdRegencia colSpan="4">
        <LinhaNotaRegencia>
          <table>
            <tbody>
              <tr>
                {dados
                  ? dados.map(item => (
                      <CampoNotaRegencia key={shortid.generate()}>
                        <span className="centro disciplina">
                          {item.disciplina}
                        </span>
                        <span className="centro nota">
                          {item.ehConceito
                            ? item.conceitoDescricao
                            : ServicoFechamentoBimestre.formatarNotaConceito(
                                item.notaConceito
                              )}
                        </span>
                        {item?.emAprovacao && (
                          <Tooltip title="Aguardando aprovação">
                            <MarcadorTriangulo />
                          </Tooltip>
                        )}
                      </CampoNotaRegencia>
                    ))
                  : null}
              </tr>
            </tbody>
          </table>
        </LinhaNotaRegencia>
      </TdRegencia>
    </TrRegencia>
  );
};

export default FechamentoRegencia;
