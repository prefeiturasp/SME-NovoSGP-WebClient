import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Alert from '../../componentes/alert';

const AlertasFiltroPrincipal = () => {
  const [turmaSelecionada, setTurmaSelecionada] = useState(false);

  const usuario = useSelector(state => state.usuario);
  const perfil = useSelector(state => state.perfil.perfilSelecionado);
  const modalidades = useSelector(state => state.filtro.modalidades);
  const anosLetivo = useSelector(state => state.filtro.anosLetivos);

  const validarFiltro = useCallback(() => {
    if (!usuario.turmaSelecionada) {
      setTurmaSelecionada(false);
      return;
    }

    const temTurma = !!usuario.turmaSelecionada.turma;

    setTurmaSelecionada(temTurma);
  }, [usuario.turmaSelecionada]);

  useEffect(() => {
    validarFiltro();
  }, [usuario, validarFiltro]);

  return (
    <>
      {modalidades &&
      !modalidades.length &&
      anosLetivo.length === 1 &&
      !usuario.ehPerfilProfessor &&
      perfil &&
      perfil.nomePerfil === 'Supervisor' ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'AlertaPrincipal',
            mensagem: `Não foi possível obter as escolas atribuídas ao supervisor ${usuario.rf}`,
          }}
        />
      ) : (
        <></>
      )}
      {!turmaSelecionada ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'AlertaPrincipal',
            mensagem: 'Você precisa escolher uma turma',
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default AlertasFiltroPrincipal;
