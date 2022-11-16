import React, { useState } from 'react';
import { Button, Colors, Loader } from '~/componentes';
import { erros, sucesso } from '~/servicos';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO } from '~/constantes';
import { SGP_BUTTON_IMPRIMIR } from '~/componentes-sgp/filtro/idsCampos';

const BtnImpressaoListaPlanoAEE = props => {
  // eslint-disable-next-line react/prop-types
  const { idsPlanosSelecionados } = props;

  const [exibirLoader, setExibirLoader] = useState(false);

  const onClickImpressao = async () => {
    setExibirLoader(true);

    const resultado = await ServicoPlanoAEE.imprimirVersoes(
      idsPlanosSelecionados
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resultado?.status === 200) {
      sucesso(MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO);
    }
  };

  return (
    <Loader loading={exibirLoader} tip="">
      <Button
        icon="print"
        color={Colors.Azul}
        onClick={onClickImpressao}
        border
        semMargemDireita
        id={SGP_BUTTON_IMPRIMIR}
        disabled={idsPlanosSelecionados?.length === 0}
      />
    </Loader>
  );
};

export default BtnImpressaoListaPlanoAEE;
