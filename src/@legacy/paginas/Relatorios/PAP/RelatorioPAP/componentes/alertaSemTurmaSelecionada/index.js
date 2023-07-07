import { ehTurmaInfantil } from '@/@legacy/servicos';
import { useSelector } from 'react-redux';
import { Alert } from '~/componentes';

const AlertaSemTurmaSelecionada = () => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const turmaSelecionadaEhInfantil = ehTurmaInfantil(
    modalidadesFiltroPrincipal,
    turmaSelecionada
  );

  if (!turmaSelecionada?.turma && !turmaSelecionadaEhInfantil) {
    return (
      <Alert
        alerta={{
          tipo: 'warning',
          mensagem: 'Você precisa escolher uma turma.',
        }}
      />
    );
  }

  return <></>;
};

export default AlertaSemTurmaSelecionada;
