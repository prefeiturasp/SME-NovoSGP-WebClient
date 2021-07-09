import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { JoditEditor } from '~/componentes';
import { setAcompanhamentoAprendizagemEmEdicao } from '~/redux/modulos/acompanhamentoAprendizagem/actions';
import ServicoAcompanhamentoAprendizagem from '~/servicos/Paginas/Relatorios/AcompanhamentoAprendizagem/ServicoAcompanhamentoAprendizagem';

const CampoPercursoIndividual = () => {
  const dispatch = useDispatch();

  const dadosAcompanhamentoAprendizagem = useSelector(
    store => store.acompanhamentoAprendizagem.dadosAcompanhamentoAprendizagem
  );

  const desabilitarCamposAcompanhamentoAprendizagem = useSelector(
    store =>
      store.acompanhamentoAprendizagem
        .desabilitarCamposAcompanhamentoAprendizagem
  );

  const [percursoIndividual, setPercursoIndividual] = useState();

  useEffect(() => {
    setPercursoIndividual(dadosAcompanhamentoAprendizagem?.percursoIndividual);
  }, [dadosAcompanhamentoAprendizagem]);

  const onChange = valorNovo => {
    ServicoAcompanhamentoAprendizagem.atualizarDadosPorNomeCampo(
      valorNovo,
      'percursoIndividual'
    );
    dispatch(setAcompanhamentoAprendizagemEmEdicao(true));
  };

  return (
    <JoditEditor
      id="percurso-individual-editor"
      value={percursoIndividual}
      onChange={onChange}
      readonly={desabilitarCamposAcompanhamentoAprendizagem}
      mensagemErro="Campo obrigat�rio"
      validarSeTemErro={valorNovo => !valorNovo}
    />
  );
};

export default CampoPercursoIndividual;
