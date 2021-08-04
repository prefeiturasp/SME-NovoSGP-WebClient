import React from 'react';
import PropTypes from 'prop-types';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { Conteudo, IconeEstilizado } from './listaDestinatarios.css';

const ListaDestinatarios = ({ alunos, removerAlunos }) => {
  return (
    <div className="d-flex flex-wrap">
      {alunos &&
        alunos.map(item => (
          <Conteudo>
            {item.nomeAluno}
            <IconeEstilizado
              icon={faTimes}
              onClick={() => removerAlunos(item.codigoAluno)}
            />
          </Conteudo>
        ))}
    </div>
  );
};

ListaDestinatarios.propTypes = {
  alunos: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  removerAlunos: PropTypes.func.isRequired,
};

export default ListaDestinatarios;
