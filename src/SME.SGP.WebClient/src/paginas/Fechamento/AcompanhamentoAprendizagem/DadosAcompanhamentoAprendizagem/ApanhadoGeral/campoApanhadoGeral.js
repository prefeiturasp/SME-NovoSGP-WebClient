import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { JoditEditor } from '~/componentes';
import { RotasDto } from '~/dtos';
import { setApanhadoGeralEmEdicao } from '~/redux/modulos/acompanhamentoAprendizagem/actions';
import { verificaSomenteConsulta } from '~/servicos';
import ServicoAcompanhamentoAprendizagem from '~/servicos/Paginas/Relatorios/AcompanhamentoAprendizagem/ServicoAcompanhamentoAprendizagem';

const CampoApanhadoGeral = () => {
  const dispatch = useDispatch();

  const dadosApanhadoGeral = useSelector(
    store => store.acompanhamentoAprendizagem.dadosApanhadoGeral
  );

  const qtdMaxImagensCampoPercursoColetivo = useSelector(
    store =>
      store.acompanhamentoAprendizagem?.qtdMaxImagensCampoPercursoColetivo
  );

  const usuario = useSelector(store => store.usuario);

  const permissoesTela =
    usuario.permissoes[RotasDto.ACOMPANHAMENTO_APRENDIZAGEM];

  const [desabilitarCampo, setDesabilitarCampo] = useState(false);

  const validaPermissoes = useCallback(() => {
    const somenteConsulta = verificaSomenteConsulta(permissoesTela);

    const desabilitar = dadosApanhadoGeral?.acompanhamentoTurmaId
      ? somenteConsulta || !permissoesTela.podeIncluir
      : somenteConsulta || !permissoesTela.podeAlterar;

    setDesabilitarCampo(desabilitar);
  }, [dadosApanhadoGeral, permissoesTela]);

  useEffect(() => {
    validaPermissoes();
  }, [validaPermissoes]);

  const onChange = valorNovo => {
    ServicoAcompanhamentoAprendizagem.atualizarApanhadoGeral(valorNovo);
    dispatch(setApanhadoGeralEmEdicao(true));
  };

  const desabilitarCamposAcompanhamentoAprendizagem = useSelector(
    store =>
      store.acompanhamentoAprendizagem
        .desabilitarCamposAcompanhamentoAprendizagem
  );

  return (
    <JoditEditor
      id="percurso-coletivo-turma-editor"
      value={dadosApanhadoGeral?.apanhadoGeral}
      onChange={onChange}
      readonly={desabilitarCamposAcompanhamentoAprendizagem || desabilitarCampo}
      permiteVideo={false}
      qtdMaxImg={qtdMaxImagensCampoPercursoColetivo}
      imagensCentralizadas
      permiteGif={false}
    />
  );
};

export default CampoApanhadoGeral;
