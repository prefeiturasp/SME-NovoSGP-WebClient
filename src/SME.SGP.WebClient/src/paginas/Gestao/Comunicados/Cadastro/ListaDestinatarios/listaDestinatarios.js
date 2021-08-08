import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { Conteudo, IconeEstilizado } from './listaDestinatarios.css';
import { Label } from '~/componentes';

const ListaDestinatarios = ({
  alunosSelecionados,
  dadosAlunos,
  removerAlunos,
}) => {
  const [alunos, setAlunos] = useState([]);

  const ObterAlunos = useCallback(() => {
    if (dadosAlunos.length === 0) return;

    const alunosLista = dadosAlunos.map(aluno => {
      return {
        key: `alunos${aluno.codigoAluno}selecionados`,
        nomeAluno: aluno.nomeAluno,
        numeroAlunoChamada: aluno.numeroAlunoChamada,
        codigoAluno: aluno.codigoAluno,
        selecionado: !!alunosSelecionados.find(
          item => item === aluno.codigoAluno
        ),
      };
    });

    setAlunos(alunosLista.filter(item => item.selecionado));
  }, [dadosAlunos, alunosSelecionados]);

  useEffect(() => {
    ObterAlunos();
  }, [ObterAlunos, alunosSelecionados, dadosAlunos]);

  return (
    <>
      <Label text="Destinatários" />
      <div className="d-flex flex-wrap">
        {!!alunos.length &&
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
    </>
  );
};

ListaDestinatarios.propTypes = {
  alunosSelecionados: PropTypes.oneOfType([PropTypes.array]).isRequired,
  dadosAlunos: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
    .isRequired,
  removerAlunos: PropTypes.func.isRequired,
};

export default ListaDestinatarios;
