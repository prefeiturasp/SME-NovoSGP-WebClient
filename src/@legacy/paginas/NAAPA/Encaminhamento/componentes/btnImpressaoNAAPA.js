import React, { useState } from 'react';
import { Button, Colors, Loader } from '~/componentes';
import { erros, sucesso } from '~/servicos';
import ServicoNAAPA from '~/servicos/Paginas/Gestao/NAAPA/ServicoNAAPA';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO } from '~/constantes';
import { SGP_BUTTON_IMPRIMIR } from '~/constantes/ids/button';

const BtnImpressaoEncaminhamentoNAAPA = props => {
  const { idsSelecionados } = props;

  const [exibirLoader, setExibirLoader] = useState(false);

  const onClickImpressao = async () => {
    setExibirLoader(true);

    const resultado = await ServicoNAAPA.imprimir(idsSelecionados)
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
        disabled={idsSelecionados?.length === 0}
      />
    </Loader>
  );
};

export default BtnImpressaoEncaminhamentoNAAPA;
