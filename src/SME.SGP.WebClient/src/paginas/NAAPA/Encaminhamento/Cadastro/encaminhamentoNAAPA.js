import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Cabecalho } from '~/componentes-sgp';
import LocalizarEstudante from '~/componentes-sgp/LocalizarEstudante';
import { Card } from '~/componentes';
import CadastroEncaminhamentoNAAPABotoesAcao from './cadastroEncaminhamentoNAAPABotoesAcao';
import CadastroEncaminhamentoNAAPA from './cadastroEncaminhamentoNAAPA';
import { store } from '~/redux';
import LoaderEncaminhamentoNAAPA from './componentes/loaderEncaminhamentoNAAPA';
import { limparDadosLocalizarEstudante } from '~/redux/modulos/localizarEstudante/actions';
import { setLimparDadosEncaminhamentoNAAPA } from '~/redux/modulos/encaminhamentoNAAPA/actions';

const EncaminhamentoNAAPA = () => {
  const routeMatch = useRouteMatch();

  const encaminhamentoId = routeMatch.params?.id;

  const [mostrarBusca, setMostrarBusca] = useState(!encaminhamentoId);

  useEffect(() => {
    return () => {
      store.dispatch(limparDadosLocalizarEstudante());
      store.dispatch(setLimparDadosEncaminhamentoNAAPA());
    };
  }, []);

  return (
    <LoaderEncaminhamentoNAAPA>
      <Cabecalho pagina="Encaminhamento">
        <CadastroEncaminhamentoNAAPABotoesAcao
          mostrarBusca={mostrarBusca}
          setMostrarBusca={setMostrarBusca}
        />
      </Cabecalho>

      <Card padding="24px 24px">
        {mostrarBusca ? (
          <LocalizarEstudante />
        ) : (
          <CadastroEncaminhamentoNAAPA />
        )}
      </Card>
    </LoaderEncaminhamentoNAAPA>
  );
};

export default EncaminhamentoNAAPA;
