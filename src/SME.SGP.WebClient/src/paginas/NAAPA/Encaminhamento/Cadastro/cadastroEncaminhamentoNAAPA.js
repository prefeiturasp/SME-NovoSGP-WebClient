import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const CadastroEncaminhamentoNAAPA = () => {
  const dre = useSelector(state => state.localizarEstudante.dre);
  const ue = useSelector(state => state.localizarEstudante.ue);
  const turma = useSelector(state => state.localizarEstudante.turma);
  const aluno = useSelector(state => state.localizarEstudante.codigoAluno);

  useEffect(() => {
    console.log(dre);
    console.log(ue);
    console.log(turma);
    console.log(aluno);
  }, []);

  return <div>Cadastro</div>;
};

export default CadastroEncaminhamentoNAAPA;
