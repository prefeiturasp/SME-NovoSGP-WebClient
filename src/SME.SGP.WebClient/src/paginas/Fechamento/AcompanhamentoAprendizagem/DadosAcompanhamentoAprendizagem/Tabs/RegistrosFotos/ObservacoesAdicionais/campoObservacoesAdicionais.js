import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { JoditEditor } from '~/componentes';
import { setAcompanhamentoAprendizagemEmEdicao } from '~/redux/modulos/acompanhamentoAprendizagem/actions';
import ServicoAcompanhamentoAprendizagem from '~/servicos/Paginas/Relatorios/AcompanhamentoAprendizagem/ServicoAcompanhamentoAprendizagem';

const CampoObservacoesAdicionais = () => {
  const dispatch = useDispatch();

  const dadosAcompanhamentoAprendizagem = useSelector(
    store => store.acompanhamentoAprendizagem.dadosAcompanhamentoAprendizagem
  );

  const desabilitarCamposAcompanhamentoAprendizagem = useSelector(
    store =>
      store.acompanhamentoAprendizagem
        .desabilitarCamposAcompanhamentoAprendizagem
  );

  const [observacao, setObservacao] = useState();

  useEffect(() => {
    setObservacao(dadosAcompanhamentoAprendizagem?.observacoes);
  }, [dadosAcompanhamentoAprendizagem]);

  const onChange = valorNovo => {
    ServicoAcompanhamentoAprendizagem.atualizarDadosPorNomeCampo(
      valorNovo,
      'observacoes'
    );
    dispatch(setAcompanhamentoAprendizagemEmEdicao(true));
  };

  return (
    <JoditEditor
      id="observacoes-adicionais-editor"
      value={observacao}
      onChange={onChange}
      readonly={desabilitarCamposAcompanhamentoAprendizagem}
      permiteVideo={false}
      permiteGif={false}
    />
  );
};

export default CampoObservacoesAdicionais;
