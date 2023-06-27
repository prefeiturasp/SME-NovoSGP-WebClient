import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { erro } from '~/servicos/alertas';

import { useDispatch } from 'react-redux';
import LoginHelper from '../Login/loginHelper';

const Autenticacao = () => {
  const paramsRoute = useParams();
  const dispatch = useDispatch();
  const integracaoToken = paramsRoute?.token;
  const navigate = useNavigate();

  const redirect = paramsRoute?.redirect || null;
  const loginHelper = new LoginHelper(dispatch, redirect);

  useEffect(() => {
    const autenticar = async () => {
      const { sucesso, erroGeral } = await loginHelper.acessar({
        integracaoToken,
        navigate,
      });

      if (!sucesso && erroGeral) {
        erro(erroGeral);
      }
    };

    autenticar();
    // eslint-disable-next-line
  }, [integracaoToken]);

  return <></>;
};

export default Autenticacao;
