import { Routes as BaseRoutes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { createElement, useEffect } from 'react';
import Pagina from '~/componentes-sgp/pagina';
import RecuperarSenha from '~/paginas/RecuperarSenha';
import { useAppSelector } from '@/core/hooks/use-redux';
import Login from '~/paginas/Login';
import { ROUTES } from '@/core/enum/routes';
import RedefinirSenha from '~/paginas/RedefinirSenha';
import { RouteProps, getRoutesArray } from '@/routes/config/route-list';
import { rotaAtiva } from '~/redux/modulos/navegacao/actions';
import { store } from '@/core/redux';
import ReactGA from 'react-ga';

import Auth from '@/routes/config/auth';
import AutenticacaoFrequencia from '@/@legacy/paginas/AutenticacaoFrequencia/autenticacaoFrequencia';

const Routes = () => {
  const location = useLocation();

  const logado = useAppSelector((state) => state.usuario.logado);

  const page = createElement(Pagina);
  const loginPage = createElement(Login);
  const elementRedefinirSenha = createElement(RedefinirSenha);
  const elementRecuperarSenha = createElement(RecuperarSenha);
  const autenticacaoFrequenciaPage = createElement(AutenticacaoFrequencia);

  const routesArray = getRoutesArray();

  useEffect(() => {
    localStorage.setItem('rota-atual', location.pathname);
    store.dispatch(rotaAtiva(location.pathname));
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }, [location]);

  const montarRota = (route: RouteProps) => {
    const element = createElement(route?.component);

    return (
      <Route key={route.path} element={<Auth route={route} />}>
        <Route path={route.path} element={element} />
      </Route>
    );
  };

  return (
    <div style={{ height: logado ? 'auto' : '100%' }}>
      {logado ? (
        <>
          <BaseRoutes>
            <Route path={ROUTES.PRINCIPAL} element={page}>
              {routesArray.map((rota: any) => montarRota(rota))}
            </Route>
            <Route path={ROUTES.REDEFINIR_SENHA} element={elementRedefinirSenha} />
            <Route
              path={ROUTES.AUTENTICACAO_INTEGRACOES_FREQUENCIA}
              element={autenticacaoFrequenciaPage}
            />
          </BaseRoutes>
        </>
      ) : (
        <BaseRoutes>
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} />} />
          <Route path={ROUTES.LOGIN} element={loginPage} />
          <Route path={ROUTES.RECUPERAR_SENHA} element={elementRecuperarSenha} />
          <Route path={ROUTES.REDEFINIR_SENHA_TOKEN} element={elementRedefinirSenha} />
          <Route
            path={ROUTES.AUTENTICACAO_INTEGRACOES_FREQUENCIA}
            element={autenticacaoFrequenciaPage}
          />
        </BaseRoutes>
      )}
    </div>
  );
};

export default Routes;
