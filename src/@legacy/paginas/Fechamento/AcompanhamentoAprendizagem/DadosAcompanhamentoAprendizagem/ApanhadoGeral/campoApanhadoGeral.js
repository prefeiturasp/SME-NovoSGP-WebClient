import { ROUTES } from '@/core/enum/routes';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { JoditEditor } from '~/componentes';
import { setApanhadoGeralEmEdicao } from '~/redux/modulos/acompanhamentoAprendizagem/actions';
import { verificaSomenteConsulta } from '~/servicos';
import ServicoAcompanhamentoAprendizagem from '~/servicos/Paginas/Relatorios/AcompanhamentoAprendizagem/ServicoAcompanhamentoAprendizagem';

const CampoApanhadoGeral = () => {
  const dispatch = useDispatch();

  const acompanhamentoAprendizagem = useSelector(
    store => store.acompanhamentoAprendizagem
  );

  const dadosApanhadoGeral = acompanhamentoAprendizagem?.dadosApanhadoGeral;

  const qtdMaxImagensCampoPercursoColetivo =
    acompanhamentoAprendizagem?.qtdMaxImagensCampoPercursoColetivo;

  const apanhadoGeralEmEdicao =
    acompanhamentoAprendizagem?.apanhadoGeralEmEdicao;

  const usuario = useSelector(store => store.usuario);

  const permissoesTela = usuario.permissoes[ROUTES.ACOMPANHAMENTO_APRENDIZAGEM];

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
      readonly={desabilitarCampo}
      permiteVideo={false}
      qtdMaxImg={qtdMaxImagensCampoPercursoColetivo}
      imagensCentralizadas
      desabilitar={desabilitarCamposAcompanhamentoAprendizagem}
      mensagemErro="Campo obrigatório"
      temErro={apanhadoGeralEmEdicao && !dadosApanhadoGeral?.apanhadoGeral}
    />
  );
};

export default CampoApanhadoGeral;
