import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from 'core/hooks/use-redux';
import { ROUTES } from 'core/enum/routes';
import React from 'react';
import { RouteProps } from '@/routes/config/route-list';

interface AuthProps {
  route?: RouteProps;
}

const Auth: React.FC<AuthProps> = ({ route }) => {
  const location = useLocation();

  const logado = useAppSelector((state) => state.usuario.logado);
  const permissoes: any = useAppSelector((state) => state.usuario.permissoes);
  const primeiroAcesso = useAppSelector((state) => state.usuario.modificarSenha);

  const noPermission = route?.temPermissionamento && !permissoes[route?.chavePermissao];
  const redefinirSenha = logado && noPermission && primeiroAcesso;

  if (!logado) return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  if (noPermission)
    return <Navigate to={ROUTES.SEM_PERMISSAO} state={{ from: location }} replace />;
  if (redefinirSenha)
    return <Navigate to={ROUTES.REDEFINIR_SENHA} state={{ from: location }} replace />;

  return <Outlet />;
};

export default Auth;
