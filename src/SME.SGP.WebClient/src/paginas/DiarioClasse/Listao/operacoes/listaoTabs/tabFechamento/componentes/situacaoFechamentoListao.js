import React, { useContext } from 'react';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import {
  DataFechamentoProcessado,
  SituacaoProcessadoComPendencias,
} from '~/paginas/Fechamento/FechamentoBimestre/fechamento-bimestre-lista/fechamento-bimestre-lista.css';

const SituacaoFechamentoListao = () => {
  const { dadosFechamento } = useContext(ListaoContext);

  let descDataFechamento = '';

  if (
    dadosFechamento?.situacaoNome &&
    dadosFechamento?.fechamentoId &&
    dadosFechamento?.dataFechamento
  ) {
    const dataMoment = window.moment(dadosFechamento.dataFechamento);
    const data = dataMoment.format('L');
    const hora = dataMoment.format('LT');
    descDataFechamento = `${dadosFechamento.situacaoNome} em ${data} às ${hora}`;
  }

  return dadosFechamento?.situacaoNome ? (
    <div className="row">
      {dadosFechamento?.fechamentoId && dadosFechamento?.dataFechamento ? (
        <div className="col-md-12 d-flex justify-content-end">
          <DataFechamentoProcessado>
            <span>{descDataFechamento}</span>
          </DataFechamentoProcessado>
        </div>
      ) : (
        <></>
      )}
      <div className="col-sm-12 mb-2 d-flex justify-content-end">
        <SituacaoProcessadoComPendencias>
          <span>{dadosFechamento?.situacaoNome}</span>
        </SituacaoProcessadoComPendencias>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default SituacaoFechamentoListao;
