import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CardsDashboard from '~/componentes-sgp/cardsDashboard/cardsDashboard';
import Alert from '../../componentes/alert';
import Card from '../../componentes/card';
import Grid from '../../componentes/grid';
import Row from '../../componentes/row';
import PendenciasGerais from './Pendencias/pendenciasGerais';
import { Container, Label } from './principal.css';

const Principal = () => {
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
    <div>
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
      <CardsDashboard />
      <PendenciasGerais />
    </div>
  );
};

export default Principal;
