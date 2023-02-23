import React from 'react';
import t from 'prop-types';

// Ant
import { Tooltip } from 'antd';

// Componentes
import { Button, Colors } from '~/componentes';

// Estilos
import { CabecalhoDetalhes } from '../../style';
import {
  SGP_BUTTON_ANTERIOR_TABELA_RETRATIL,
  SGP_BUTTON_EXPANDIR_RETRAIR_TABELA_RETRATIL,
  SGP_BUTTON_PROXIMO_TABELA_RETRATIL,
} from '~/constantes/ids/button';

function Cabecalho({
  titulo,
  retraido,
  desabilitarAnterior,
  desabilitarProximo,
  onClickCollapse,
  onClickAnterior,
  onClickProximo,
}) {
  const clicouEnter = e => e.keyCode === 13;

  return (
    <CabecalhoDetalhes>
      <div className="titulo">
        <Tooltip title={`${retraido ? `Expandir alunos` : `Retrair alunos`}`}>
          <span
            id={SGP_BUTTON_EXPANDIR_RETRAIR_TABELA_RETRATIL}
            className={`botaoCollapse ${retraido && `retraido`}`}
            role="button"
            tabIndex={0}
            onKeyDown={e => (clicouEnter(e) ? onClickCollapse() : '')}
            onClick={() => onClickCollapse()}
          >
            <i className="fas fa-chevron-left" />
          </span>
        </Tooltip>
        <span>{titulo}</span>
      </div>
      <div className="botoes">
        <div>
          <Button
            id={SGP_BUTTON_ANTERIOR_TABELA_RETRATIL}
            label="Anterior"
            color={Colors.Roxo}
            className="ml-auto attached right"
            bold
            onClick={() => onClickAnterior()}
            border
            disabled={desabilitarAnterior}
          />
        </div>
        <div>
          <Button
            id={SGP_BUTTON_PROXIMO_TABELA_RETRATIL}
            label="Próximo"
            color={Colors.Roxo}
            className="ml-auto attached right"
            bold
            onClick={() => onClickProximo()}
            border
            disabled={desabilitarProximo}
          />
        </div>
      </div>
    </CabecalhoDetalhes>
  );
}

Cabecalho.propTypes = {
  titulo: t.string,
  retraido: t.bool,
  desabilitarAnterior: t.bool,
  desabilitarProximo: t.bool,
  onClickCollapse: t.func,
  onClickAnterior: t.func,
  onClickProximo: t.func,
};

Cabecalho.defaultProps = {
  titulo: 'Sem título',
  retraido: false,
  desabilitarAnterior: false,
  desabilitarProximo: false,
  onClickCollapse: () => {},
  onClickAnterior: () => {},
  onClickProximo: () => {},
};

export default Cabecalho;
