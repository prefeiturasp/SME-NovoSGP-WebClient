import { faTimes } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Label } from '~/componentes';
import { Conteudo, IconeEstilizado } from './listaDestinatarios.css';

const ListaDestinatarios = ({ form, onChangeCampos, desabilitar }) => {
  const alunosComunicados = useSelector(
    store => store.comunicados?.alunosComunicados
  );

  const { alunos } = form.values;

  const [dadosAlunosSelecionados, setDadosAlunosSelecionados] = useState([]);

  const obterAlunos = useCallback(() => {
    const listaAlunos = alunosComunicados?.filter(aluno =>
      alunos.find(a => a?.codigoAluno === aluno?.codigoAluno)
    );
    if (listaAlunos?.length) {
      setDadosAlunosSelecionados(listaAlunos);
    } else {
      setDadosAlunosSelecionados([]);
    }
  }, [alunosComunicados, alunos]);

  useEffect(() => {
    if (alunosComunicados?.length && alunos?.length) {
      obterAlunos();
    }
  }, [obterAlunos, alunosComunicados, alunos]);

  const removerAluno = codigoAluno => {
    const novaListaAlunos = alunos.filter(
      aluno => aluno?.codigoAluno !== codigoAluno
    );
    form.setFieldValue('alunos', [...novaListaAlunos]);
    onChangeCampos();
  };

  return (
    <>
      <Label text="Destinatários" />
      <div className="d-flex flex-wrap">
        {dadosAlunosSelecionados?.length
          ? dadosAlunosSelecionados.map(aluno => (
              <Conteudo>
                {aluno?.nomeAluno}
                <IconeEstilizado
                  icon={faTimes}
                  onClick={() => {
                    if (!desabilitar) {
                      removerAluno(aluno?.codigoAluno);
                    }
                  }}
                />
              </Conteudo>
            ))
          : ''}
      </div>
    </>
  );
};

ListaDestinatarios.propTypes = {
  form: PropTypes.oneOfType([PropTypes.object]),
  onChangeCampos: PropTypes.func,
  desabilitar: PropTypes.bool,
};

ListaDestinatarios.defaultProps = {
  form: null,
  onChangeCampos: () => null,
  desabilitar: false,
};

export default ListaDestinatarios;
