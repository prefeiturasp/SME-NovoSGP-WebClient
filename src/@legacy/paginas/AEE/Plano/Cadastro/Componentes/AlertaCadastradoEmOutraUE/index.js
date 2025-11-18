import { Alert } from '@/@legacy/componentes';
import { SGP_ALERT_ENCAMINHAMENTO_AEE_EM_OUTRA_UE } from '@/@legacy/constantes/ids/alert';
import { useSelector } from 'react-redux';

const AlertaCadastradoEmOutraUE = () => {
  const registroCadastradoEmOutraUE = useSelector(
    store => store?.planoAEE?.planoAEEDados?.registroCadastradoEmOutraUE
  );

  return registroCadastradoEmOutraUE ? (
    <div className="row">
      <div className="col-md-12">
        <Alert
          alerta={{
            tipo: 'warning',
            id: SGP_ALERT_ENCAMINHAMENTO_AEE_EM_OUTRA_UE,
            mensagem:
              'Você tem apenas permissão de consulta nesta tela. Este encaminhamento está cadastrado em outra UE.',
          }}
          className="mb-2"
        />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default AlertaCadastradoEmOutraUE;
