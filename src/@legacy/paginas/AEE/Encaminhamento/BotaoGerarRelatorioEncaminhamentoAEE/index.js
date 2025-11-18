import PropTypes from 'prop-types';
import React, { useState } from 'react';
import BotaoGerarRelatorio from '~/componentes-sgp/BotoesAcaoPadrao/botaoGerarRelatorio';
import { MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO } from '~/constantes';
import { erros, sucesso } from '~/servicos';
import ServicoEncaminhamentoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoEncaminhamentoAEE';

const BotaoGerarRelatorioEncaminhamentoAEE = props => {
  const { ids, disabled } = props;

  const [exibirLoader, setExibirLoader] = useState(false);

  const onClickGerarRelatorio = async () => {
    setExibirLoader(true);

    const resultado = await ServicoEncaminhamentoAEE.gerarRelatorio(ids)
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resultado?.status === 200) {
      sucesso(MENSAGEM_SOLICITACAO_RELATORIO_SUCESSO);
    }
  };

  return (
    <BotaoGerarRelatorio
      onClick={onClickGerarRelatorio}
      loading={exibirLoader}
      disabled={disabled}
      showLoader
    />
  );
};

BotaoGerarRelatorioEncaminhamentoAEE.propTypes = {
  ids: PropTypes.oneOfType([PropTypes.array]),
  disabled: PropTypes.bool,
};

BotaoGerarRelatorioEncaminhamentoAEE.defaultProps = {
  ids: [],
  disabled: false,
};

export default BotaoGerarRelatorioEncaminhamentoAEE;
