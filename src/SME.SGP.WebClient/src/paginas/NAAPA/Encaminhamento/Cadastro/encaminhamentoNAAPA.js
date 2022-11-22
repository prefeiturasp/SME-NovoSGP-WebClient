import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RotasDto } from '~/dtos';
import { Cabecalho } from '~/componentes-sgp';
import LocalizarEstudante from '~/componentes-sgp/LocalizarEstudante';
import { Card } from '~/componentes';
import { verificaSomenteConsulta } from '~/servicos';
import CadastroEncaminhamentoNAAPABotoesAcao from './cadastroEncaminhamentoNAAPABotoesAcao';
import CadastroEncaminhamentoNAAPA from './cadastroEncaminhamentoNAAPA';
import { store } from '~/redux';
import { limparDados } from '~/redux/modulos/localizarEstudante/actions';

const EncaminhamentoNAAPA = () => {
  const usuario = useSelector(state => state.usuario);

  const { permissoes } = usuario;
  const { podeIncluir } = permissoes?.[RotasDto.ENCAMINHAMENTO_NAAPA];

  const routeMatch = useRouteMatch();

  const encaminhamentoId = routeMatch.params?.id;

  const [somenteConsulta, setSomenteConsulta] = useState(false);
  //const [mostrarBusca, setMostrarBusca] = useState(!encaminhamentoId);
  const [mostrarBusca, setMostrarBusca] = useState(false);

  useEffect(() => {
    const soConsulta = verificaSomenteConsulta(
      permissoes?.[RotasDto.ENCAMINHAMENTO_NAAPA]
    );

    setSomenteConsulta(soConsulta);
  }, [permissoes]);

  useEffect(() => {
    return () => {
      store.dispatch(limparDados());
    };
  }, []);

  return (
    <>
      <Cabecalho pagina="Novo encaminhamento">
        <CadastroEncaminhamentoNAAPABotoesAcao
          podeIncluir={podeIncluir}
          mostrarBusca={mostrarBusca}
          somenteConsulta={somenteConsulta}
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
    </>
  );
};

export default EncaminhamentoNAAPA;
