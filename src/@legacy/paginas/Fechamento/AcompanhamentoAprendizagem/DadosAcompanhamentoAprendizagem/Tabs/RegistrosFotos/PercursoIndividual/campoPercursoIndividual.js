import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { JoditEditor } from '~/componentes';
import { ROUTES } from '@/core/enum/routes';
import { verificaSomenteConsulta } from '~/servicos';
import { setAcompanhamentoAprendizagemEmEdicao } from '~/redux/modulos/acompanhamentoAprendizagem/actions';
import ServicoAcompanhamentoAprendizagem from '~/servicos/Paginas/Relatorios/AcompanhamentoAprendizagem/ServicoAcompanhamentoAprendizagem';

const CampoPercursoIndividual = () => {
  const dispatch = useDispatch();

  const percursoIndividual = useSelector(
    store =>
      store.acompanhamentoAprendizagem?.dadosAcompanhamentoAprendizagem
        ?.percursoIndividual
  );

  const acompanhamentoAlunoId = useSelector(
    store =>
      store.acompanhamentoAprendizagem?.dadosAcompanhamentoAprendizagem
        ?.acompanhamentoAlunoId
  );

  const desabilitarCamposAcompanhamentoAprendizagem = useSelector(
    store =>
      store.acompanhamentoAprendizagem
        .desabilitarCamposAcompanhamentoAprendizagem
  );

  const qtdMaxImagensCampoPercursoIndividual = useSelector(
    store =>
      store.acompanhamentoAprendizagem?.qtdMaxImagensCampoPercursoIndividual
  );

  const usuario = useSelector(store => store.usuario);

  const permissoesTela = usuario.permissoes[ROUTES.ACOMPANHAMENTO_APRENDIZAGEM];

  const [desabilitarCampo, setDesabilitarCampo] = useState(false);

  const validaPermissoes = useCallback(() => {
    const somenteConsulta = verificaSomenteConsulta(permissoesTela);

    const desabilitar = acompanhamentoAlunoId
      ? somenteConsulta || !permissoesTela.podeIncluir
      : somenteConsulta || !permissoesTela.podeAlterar;

    setDesabilitarCampo(desabilitar);
  }, [acompanhamentoAlunoId, permissoesTela]);

  useEffect(() => {
    validaPermissoes();
  }, [validaPermissoes]);

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
      readonly={desabilitarCampo}
      mensagemErro="Campo obrigatório"
      validarSeTemErro={valorNovo => !valorNovo}
      permiteVideo={false}
      desabilitar={desabilitarCamposAcompanhamentoAprendizagem}
      qtdMaxImg={qtdMaxImagensCampoPercursoIndividual}
    />
  );
};

export default CampoPercursoIndividual;
