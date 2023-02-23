import { Col, Row } from 'antd';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Colors } from '~/componentes';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_BUTTON_ALTERAR,
  SGP_BUTTON_CADASTRAR,
  SGP_BUTTON_CANCELAR,
} from '~/constantes/ids/button';
import { OPCAO_TODOS } from '~/constantes';
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

  const converterData = valor =>
    valor ? moment(valor).format('MM-DD-YYYY') : '';

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
        tiposEscolas: filtros?.tipoEscola,
        anosEscolares: filtros?.anosEscolares,
        turmas: filtros?.turmas,
        alunoEspecificado: false,
        alunos: filtros?.alunos,
        tipoCalendarioId: filtros?.tipoCalendarioId,
        eventoId: filtros?.eventoId,
        titulo: filtros?.titulo,
        descricao: filtros?.descricao,
        id: comunicadoId || 0,
      };

      if (filtros?.alunoEspecifico) {
        const todosAluno = filtros.alunoEspecifico === OPCAO_TODOS;
        if (todosAluno) {
          dadosSalvar.alunoEspecificado = false;
        } else {
          dadosSalvar.alunoEspecificado = true;
        }
      }
      if (filtros?.alunos?.length) {
        dadosSalvar.alunos = filtros.alunos.map(aluno => aluno.alunoCodigo);
      }
      if (filtros?.dataEnvio) {
        dadosSalvar.dataEnvio = converterData(filtros?.dataEnvio);
      }
      if (filtros?.dataExpiracao) {
        dadosSalvar.dataExpiracao = converterData(filtros?.dataExpiracao);
      }

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
    <Row gutter={[8, 8]} type="flex">
      <Col>
        <BotaoVoltarPadrao onClick={() => aoClicarBotaoVoltar()} />
      </Col>
      <Col>
        <Button
          id={SGP_BUTTON_CANCELAR}
          label="Cancelar"
          color={Colors.Azul}
          onClick={() => onClickCancelar()}
          border
          disabled={
            somenteConsulta ||
            !modoEdicao ||
            !permissoesTela.podeIncluir ||
            !permissoesTela.podeAlterar
          }
        />
      </Col>
      <Col>
        <BotaoExcluirPadrao
          onClick={aoClicarBotaoExcluir}
          disabled={
            somenteConsulta || !comunicadoId || !permissoesTela.podeExcluir
          }
        />
      </Col>
      <Col>
        {comunicadoId ? (
          <Button
            id={SGP_BUTTON_ALTERAR}
            label="Alterar"
            color={Colors.Roxo}
            onClick={() => validaAntesDoSubmit()}
            disabled={
              somenteConsulta ||
              !permissoesTela.podeAlterar ||
              (comunicadoId && !modoEdicao)
            }
          />
        ) : (
          <Button
            id={SGP_BUTTON_CADASTRAR}
            label="Cadastrar"
            color={Colors.Roxo}
            onClick={() => validaAntesDoSubmit()}
            disabled={
              somenteConsulta ||
              !permissoesTela.podeIncluir ||
              (comunicadoId && !modoEdicao)
            }
          />
        )}
      </Col>
    </Row>
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
