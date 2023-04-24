import React, { memo } from 'react';
import t from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSomenteConsulta } from '~/redux/modulos/navegacao/actions';
import { Loader } from '~/componentes';
import RotaAutenticadaEstruturadaDefault from './rotaAutenticadaEstruturadaDefault';

const RotaAutenticadaEstruturada = memo(
  ({
    component: Component,
    temPermissionamento,
    chavePermissao,
    ...propriedades
  }) => {
    const dispatch = useDispatch();
    const logado = useSelector(state => state.usuario.logado);
    const permissoes = useSelector(state => state.usuario.permissoes);
    const primeiroAcesso = useSelector(state => state.usuario.modificarSenha);
    const carregandoPerfil = useSelector(state => state.usuario.menu);
    const { loaderGeral } = useSelector(state => state.loader);

    dispatch(setSomenteConsulta(false));

    if (!logado) {
      return <Navigate to="/login" />;
    }

    if (primeiroAcesso) {
      return <Navigate to="/redefinir-senha" />;
    }

    if (temPermissionamento && !permissoes[chavePermissao]) {
      return <Navigate to="/sem-permissao" />;
    }

    return (
      <Loader loading={loaderGeral || !carregandoPerfil}>
        <RotaAutenticadaEstruturadaDefault
          {...propriedades}
          Component={Component}
        />
      </Loader>
    );
  }
);

RotaAutenticadaEstruturada.propTypes = {
  component: t.oneOfType([t.any]),
  temPermissionamento: t.bool,
  chavePermissao: t.string,
};

RotaAutenticadaEstruturada.defaultProps = {
  component: null,
  temPermissionamento: null,
  chavePermissao: null,
};

export default RotaAutenticadaEstruturada;
