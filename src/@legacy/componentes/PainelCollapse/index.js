import React from 'react';
import {
  CollapseEstilizado,
  PainelEstilizado,
  IconeEstilizado,
  LabelPendente,
} from './styles';

function PainelCollapse({ children, ...props }) {
  const renderizarIcone = painelProps => {
    const direcaoSeta = painelProps.isActive ? 'up' : 'down';
    return (
      <div className="d-flex">
        {painelProps.ehPendente && (
          <>
            <IconeEstilizado
              className="fas fa-exclamation-circle icone-pendente mr-2"
              aria-hidden="true"
              color="#c0630e"
            />
            <LabelPendente>Pendente</LabelPendente>
          </>
        )}
        <IconeEstilizado
          className={`fa fa-chevron-${direcaoSeta}`}
          aria-hidden="true"
          color="#42474a"
        />
      </div>
    );
  };

  return (
    <CollapseEstilizado
      expandIconPosition="right"
      expandIcon={painelProps => renderizarIcone(painelProps)}
      {...props}
    >
      {children}
    </CollapseEstilizado>
  );
}

function Painel({ children, ...props }) {
  return <PainelEstilizado {...props}>{children}</PainelEstilizado>;
}

PainelCollapse.Painel = Painel;

export default PainelCollapse;
