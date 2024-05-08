import { TurmaSelecionadaDTO } from '@/core/dto/TurmaSelecionadaDto';
import { useAppSelector } from '@/core/hooks/use-redux';
import React from 'react';
import { Alert } from '~/componentes';

export const AlertaSemTurmaSelecionada: React.FC = () => {
  const usuario = useAppSelector((store) => store.usuario);

  const turmaSelecionada = usuario?.turmaSelecionada as TurmaSelecionadaDTO;

  if (turmaSelecionada?.turma) return <></>;

  return (
    <Alert
      alerta={{
        tipo: 'warning',
        mensagem: 'Você precisa escolher uma turma.',
      }}
    />
  );
};
