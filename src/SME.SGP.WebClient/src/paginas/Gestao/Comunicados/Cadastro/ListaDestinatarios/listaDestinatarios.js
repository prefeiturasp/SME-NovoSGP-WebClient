import { faTimes } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { Label } from '~/componentes';
import { Conteudo, IconeEstilizado } from './listaDestinatarios.css';

const ListaDestinatarios = ({ form, onChangeCampos, desabilitar }) => {
  const { alunos } = form.values;

  const removerAluno = alunoCodigo => {
    const novaListaAlunos = alunos.filter(
      aluno => aluno?.alunoCodigo !== alunoCodigo
    );
    form.setFieldValue('alunos', [...novaListaAlunos]);
    onChangeCampos();
  };

  return alunos?.length ? (
    <>
      <Label text="Destinatários" />
      <div className="d-flex flex-wrap">
        {alunos.map(aluno => (
          <Conteudo>
            {`${aluno?.alunoNome} (${aluno?.alunoCodigo})`}
            <IconeEstilizado
              icon={faTimes}
              onClick={() => {
                if (!desabilitar) {
                  removerAluno(aluno?.alunoCodigo);
                }
              }}
            />
          </Conteudo>
        ))}
      </div>
    </>
  ) : (
    ''
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
