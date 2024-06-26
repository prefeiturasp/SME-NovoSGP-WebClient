import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Colors, Loader, SelectComponent } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import {
  setAlunosComunicados,
  setExibirModalAlunos,
} from '~/redux/modulos/comunicados/actions';
import { erros, ServicoComunicados } from '~/servicos';
import ModalAlunos from '../../ListaAlunos/listaAlunos';

const CriancasEstudantesComunicados = ({
  form,
  onChangeCampos,
  desabilitar,
  comunicadoId,
}) => {
  const dispatch = useDispatch();

  const opcoesAlunos = [
    { id: OPCAO_TODOS, nome: 'Todos' },
    { id: '1', nome: 'Crianças/Estudantes Selecionados' },
  ];

  const { anoLetivo, turmas, alunoEspecifico, alunos } = form.values;

  const nomeCampo = 'alunoEspecifico';

  const [alunosLoader, setAlunosLoader] = useState(false);

  const ehTodasTurma = () => turmas?.find(item => item === OPCAO_TODOS);

  const selecionaAlunosEspecificos = useCallback(() => {
    const validacaoTurma = ehTodasTurma() || turmas?.length > 1;
    const valorAlunoEspecifico = validacaoTurma ? OPCAO_TODOS : undefined;

    form.setFieldValue(nomeCampo, valorAlunoEspecifico);
  }, [turmas]);

  useEffect(() => {
    if (!comunicadoId) {
      selecionaAlunosEspecificos(turmas);
    }
  }, [selecionaAlunosEspecificos, turmas, comunicadoId]);

  const obterAlunos = useCallback(async () => {
    if (!desabilitar) {
      setAlunosLoader(true);
      const retorno = await ServicoComunicados.obterAlunos(turmas, anoLetivo)
        .catch(e => erros(e))
        .finally(() => setAlunosLoader(false));

      if (retorno?.data?.length) {
        dispatch(setAlunosComunicados(retorno.data));
      } else {
        dispatch(setAlunosComunicados([]));
      }
      dispatch(setExibirModalAlunos(true));
    }
  }, [turmas, anoLetivo, dispatch]);

  useEffect(() => {
    if (!turmas?.length) {
      dispatch(setAlunosComunicados([]));
    }
  }, [turmas, dispatch]);

  return (
    <>
      <div className="col-sm-12 col-md-8 col-lg-8 col-xl-4 mb-2">
        <Loader loading={alunosLoader}>
          <SelectComponent
            label="Crianças/Estudantes"
            placeholder="Selec. a(s) criança(s)/estudante(s)"
            lista={opcoesAlunos}
            valueOption="id"
            valueText="nome"
            disabled={
              desabilitar ||
              !turmas?.length ||
              !!ehTodasTurma() ||
              turmas?.length > 1
            }
            allowClear={false}
            name={nomeCampo}
            form={form}
            onChange={() => {
              onChangeCampos();
              form.setFieldValue('alunos', []);
              dispatch(setAlunosComunicados([]));
            }}
            labelRequired={alunoEspecifico && alunoEspecifico !== OPCAO_TODOS}
          />
        </Loader>
      </div>
      <div className="col-sm-12 col-md-4 col-lg-4 col-xl-3 mb-2 mt-4">
        <Loader loading={alunosLoader}>
          <Button
            id="botao-criancas-estudantes"
            label="Crianças/estudantes"
            color={Colors.Azul}
            onClick={() => obterAlunos()}
            border
            className="mr-3"
            width="100%"
            disabled={
              desabilitar ||
              !alunoEspecifico ||
              alunoEspecifico === OPCAO_TODOS ||
              !turmas?.length
            }
          />
        </Loader>
      </div>
      <ModalAlunos
        alunosSelecionados={alunos}
        onCloseModal={alunosSelecionados => {
          form.setFieldValue('alunos', [...alunosSelecionados]);
        }}
      />
    </>
  );
};

CriancasEstudantesComunicados.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
  comunicadoId: PropTypes.string,
};

CriancasEstudantesComunicados.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
  comunicadoId: '',
};

export default CriancasEstudantesComunicados;
