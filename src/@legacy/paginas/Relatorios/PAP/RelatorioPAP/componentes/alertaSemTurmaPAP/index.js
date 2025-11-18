import { ehTurmaInfantil } from '@/@legacy/servicos';
import { useSelector } from 'react-redux';
import { Alert } from '~/componentes';

const AlertaSemTurmaPAP = () => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const listaPeriodosPAP = useSelector(
    store => store.relatorioPAP.listaPeriodosPAP
  );

  const turmaSelecionadaEhInfantil = ehTurmaInfantil(
    modalidadesFiltroPrincipal,
    turmaSelecionada
  );

  if (!listaPeriodosPAP?.length && !turmaSelecionadaEhInfantil) {
    return (
      <Alert
        alerta={{
          tipo: 'warning',
          mensagem:
            'Somente é possivel realizar o preenchimento do PAP para turmas PAP',
        }}
      />
    );
  }

  return <></>;
};

export default AlertaSemTurmaPAP;
