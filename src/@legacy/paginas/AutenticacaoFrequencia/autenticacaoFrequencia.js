import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Colors, Loader } from '@/@legacy/componentes';
import { limparDadosFiltro } from '@/@legacy/redux/modulos/filtro/actions';
import { setExibirMensagemSessaoExpirou } from '@/@legacy/redux/modulos/mensagens/actions';
import { LimparSessao } from '@/@legacy/redux/modulos/sessao/actions';
import {
  Deslogar,
  removerTurma,
} from '@/@legacy/redux/modulos/usuario/actions';
import { ROUTES } from '@/core/enum/routes';
import { store } from '@/core/redux';
import { Col, Result, Row } from 'antd';
import { useDispatch } from 'react-redux';
import LoginHelper from '../Login/loginHelper';

const AutenticacaoFrequencia = () => {
  const paramsRoute = useParams();
  const dispatch = useDispatch();
  const tokenIntegracaoFrequencia = paramsRoute?.tokenIntegracaoFrequencia;
  const navigate = useNavigate();

  const [erroAutenticacao, setErroAutenticacao] = useState(false);

  const redirect = paramsRoute?.redirect || null;
  const loginHelper = new LoginHelper(dispatch, redirect);

  const autenticar = async () => {
    const { sucesso, erroGeral } = await loginHelper.acessar({
      tokenIntegracaoFrequencia,
      navigate,
    });

    if (!sucesso && erroGeral) {
      setErroAutenticacao(true);
      store.dispatch(removerTurma());
      store.dispatch(limparDadosFiltro());
      store.dispatch(Deslogar());
      store.dispatch(LimparSessao());
      store.dispatch(setExibirMensagemSessaoExpirou(false));
    }
  };

  useEffect(() => {
    autenticar();
  }, [tokenIntegracaoFrequencia]);

  if (!erroAutenticacao)
    return (
      <Row justify="center" align="middle" style={{ height: '100vh' }}>
        <Col span={24}>
          <Loader loading tip="Autenticando no SGP..." />
        </Col>
      </Row>
    );

  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Result
        status="error"
        title="Falha ao tentar autenticar"
        subTitle="A página que você tentou acessar não está disponível no momento. Tente novamente mais tarde ou contate o suporte"
        extra={[
          <Row justify="center" key="ROW_VOLTAR">
            <Button
              key="voltar"
              label="Voltar"
              icon="arrow-left"
              color={Colors.Azul}
              border
              className="mr-2"
              onClick={() => navigate(ROUTES.PRINCIPAL)}
            />
          </Row>,
        ]}
      />
    </Row>
  );
};

export default AutenticacaoFrequencia;
