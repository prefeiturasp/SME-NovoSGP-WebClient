import { useSelector } from 'react-redux';
import { Button, Colors } from '~/componentes';
import { SGP_BUTTON_COPIAR_PAP } from '~/constantes/ids/button';
import { DrawerCopiarPAP } from './drawer';
import { useState } from 'react';

export const BotaoCopiarPAP = ({ disabled = true }) => {
  const estudanteSelecionadoRelatorioPAP = useSelector(
    store => store.relatorioPAP?.estudanteSelecionadoRelatorioPAP
  );

  const [mostrarDrawer, setMostrarDrawer] = useState(false);

  const desabilitar =
    disabled ||
    !estudanteSelecionadoRelatorioPAP ||
    // estudanteSelecionadoRelatorioPAP?.desabilitado ||
    !estudanteSelecionadoRelatorioPAP?.processoConcluido;

  const onClickCopiar = () => {
    setMostrarDrawer(true);
  };

  const onCloseDrawer = () => setMostrarDrawer(false);

  return (
    <>
      <Button
        id={SGP_BUTTON_COPIAR_PAP}
        label="Copiar"
        color={Colors.Roxo}
        border
        onClick={() => onClickCopiar()}
        disabled={desabilitar}
      />
      {mostrarDrawer && <DrawerCopiarPAP onCloseDrawer={onCloseDrawer} />}
    </>
  );
};
