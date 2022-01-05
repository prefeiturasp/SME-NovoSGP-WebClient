import React, { useContext } from 'react';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { ContainerAuditoria } from '~/paginas/DiarioClasse/Notas/notas.css';

const ListaoAuditoriaAvaliacoes = () => {
  const { dadosAvaliacao } = useContext(ListaoContext);

  return dadosAvaliacao?.auditoriaInserido ? (
    <>
      <div className="row mt-2 mb-2 mt-2">
        <div className="col-md-12">
          <ContainerAuditoria style={{ float: 'left' }}>
            <span>
              <p>{dadosAvaliacao?.auditoriaInserido || ''}</p>
              <p>{dadosAvaliacao?.auditoriaAlterado || ''}</p>
            </span>
          </ContainerAuditoria>
        </div>
      </div>
      <div className="row mt-2 mb-2 mt-2">
        <div className="col-md-12">
          <ContainerAuditoria style={{ float: 'left' }}>
            <span>
              <p>{dadosAvaliacao?.auditoriaBimestreInserido || ''}</p>
              <p>{dadosAvaliacao?.auditoriaBimestreAlterado || ''}</p>
            </span>
          </ContainerAuditoria>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default ListaoAuditoriaAvaliacoes;
