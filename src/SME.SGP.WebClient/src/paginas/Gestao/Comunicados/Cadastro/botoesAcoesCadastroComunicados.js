import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Colors } from '~/componentes';
import { RotasDto } from '~/dtos';
import {
  setExibirLoaderGeralComunicados,
  setLimparDadosComunicados,
  setModoEdicaoCadastroComunicados,
} from '~/redux/modulos/comunicados/actions';
import {
  confirmar,
  erros,
  history,
  ServicoComunicados,
  sucesso,
} from '~/servicos';

const BotoesAcoesCadastroComunicados = props => {
  const { comunicadoId, somenteConsulta } = props;

  const usuario = useSelector(store => store.usuario);
  const permissoesTela =
    usuario.permissoes[RotasDto.ACOMPANHAMENTO_COMUNICADOS];

  const dispatch = useDispatch();

  const modoEdicao = useSelector(
    store => store.comunicados?.modoEdicaoCadastroComunicados
  );
  const formComunicados = useSelector(store =>
    store.comunicados?.formComunicados?.()
  );

  useEffect(() => {
    return () => {
      dispatch(setLimparDadosComunicados());
    };
  }, [dispatch]);

  const aoClicarBotaoExcluir = async () => {
    if (!somenteConsulta && comunicadoId && permissoesTela.podeExcluir) {
      const confirmado = await confirmar(
        'Atenção',
        'Você tem certeza que deseja excluir este registro?'
      );
      if (confirmado) {
        dispatch(setExibirLoaderGeralComunicados(true));
        const resposta = await ServicoComunicados.excluir([comunicadoId])
          .catch(e => erros(e))
          .finally(() => dispatch(setExibirLoaderGeralComunicados(false)));

        if (resposta?.status === 200) {
          sucesso('Registro excluído com sucesso');
          history.push(RotasDto.ACOMPANHAMENTO_COMUNICADOS);
        }
      }
    }
  };

  const onClickCadastrar = async () => {
    if (
      !somenteConsulta &&
      (permissoesTela.podeIncluir || permissoesTela.podeAlterar)
    ) {
      const filtros = formComunicados?.state?.values;

      const dadosSalvar = {
        anoLetivo: filtros?.anoLetivo,
        codigoDre: filtros?.codigoDre,
        codigoUe: filtros?.codigoUe,
        modalidades: filtros?.modalidades,
        semestre: filtros?.semestre || 0,
        tipoEscola: filtros?.tipoEscola,
        anosEscolares: filtros?.anosEscolares,
        turmas: filtros?.turmas,
        // alunos: filtros?.alunosSelecionados,
        // alunosEspecificados: filtros?.alunoEspecificado,
        // seriesResumidas: '',
        // tipoCalendarioId: filtros?.tipoCalendarioId,
        // eventoId: filtros?.eventoId,
        // dataEnvio: filtros?.dataEnvio,
        // dataExpiracao: filtros?.dataExpiracao,
        // titulo: filtros?.titulo,
        // descricao: filtros?.descricaoComunicado,
      };

      dispatch(setExibirLoaderGeralComunicados(true));
      const resposta = await ServicoComunicados.salvar(dadosSalvar)
        .catch(e => erros(e))
        .finally(() => dispatch(setExibirLoaderGeralComunicados(false)));

      if (resposta?.status === 200) {
        history.push(RotasDto.ACOMPANHAMENTO_COMUNICADOS);
        sucesso(
          `Comunicado ${comunicadoId ? 'alterado' : 'cadastrado'} com sucesso`
        );
      }
    }
  };

  const resetarTela = () => {
    const initialValues = { ...formComunicados.initialValues };
    formComunicados.resetForm({});
    formComunicados.resetForm(initialValues);
    dispatch(setModoEdicaoCadastroComunicados(false));
  };

  const onClickCancelar = async () => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );
      if (confirmou) resetarTela();
    }
  };

  const validaAntesDoSubmit = () => {
    const initialValues = formComunicados?.initialValues;
    const arrayCampos = Object.keys(initialValues);
    arrayCampos.forEach(campo => {
      formComunicados.setFieldTouched(campo, true, true);
    });
    formComunicados.validateForm().then(() => {
      if (Object.keys(formComunicados.state.errors).length === 0) {
        onClickCadastrar();
      }
    });
  };

  const aoClicarBotaoVoltar = async () => {
    if (
      modoEdicao &&
      !somenteConsulta &&
      (permissoesTela.podeIncluir || permissoesTela.podeAlterar)
    ) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );

      if (confirmou) {
        validaAntesDoSubmit();
      } else {
        history.push(RotasDto.ACOMPANHAMENTO_COMUNICADOS);
      }
    } else {
      history.push(RotasDto.ACOMPANHAMENTO_COMUNICADOS);
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-sm-12 d-flex justify-content-end">
        <Button
          id="botao-voltar"
          label="Voltar"
          icon="arrow-left"
          color={Colors.Azul}
          onClick={aoClicarBotaoVoltar}
          border
          className="mr-3"
        />
        <Button
          id="botao-cancelar"
          label="Cancelar"
          color={Colors.Azul}
          onClick={() => onClickCancelar()}
          border
          className="mr-3"
          disabled={
            somenteConsulta ||
            !modoEdicao ||
            !permissoesTela.podeIncluir ||
            !permissoesTela.podeAlterar
          }
        />
        <Button
          id="botao-excluir"
          label="Excluir"
          color={Colors.Vermelho}
          onClick={aoClicarBotaoExcluir}
          border
          className="mr-3"
          disabled={
            somenteConsulta || !comunicadoId || !permissoesTela.podeExcluir
          }
        />
        {comunicadoId ? (
          <Button
            id="botao-alterar"
            label="Alterar"
            color={Colors.Roxo}
            onClick={() => validaAntesDoSubmit()}
            disabled={
              !modoEdicao || somenteConsulta || !permissoesTela.podeAlterar
            }
          />
        ) : (
          <Button
            id="botao-cadastrar"
            label="Cadastrar"
            color={Colors.Roxo}
            onClick={() => validaAntesDoSubmit()}
            disabled={
              !modoEdicao || somenteConsulta || !permissoesTela.podeIncluir
            }
          />
        )}
      </div>
    </div>
  );
};

BotoesAcoesCadastroComunicados.propTypes = {
  comunicadoId: PropTypes.string,
  somenteConsulta: PropTypes.bool,
};

BotoesAcoesCadastroComunicados.defaultProps = {
  comunicadoId: '',
  somenteConsulta: false,
};

export default BotoesAcoesCadastroComunicados;
