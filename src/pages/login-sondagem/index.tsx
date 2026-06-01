import { useState, useRef, useEffect, MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { Tooltip } from 'antd';
import { Formik, Form } from 'formik';
import shortid from 'shortid';
import { isBrowser, IOSView } from 'react-device-detect';
import { useNavigate, useParams } from 'react-router-dom';

import LoginHelper from '@/@legacy/paginas/Login/loginHelper';
import Row from '@/@legacy/componentes/row';
import LogoCidadeSP from '@/@legacy/recursos/prefeitura-sp-logo.png';
import FundoLogin from '@/@legacy/recursos/FundoLogin.jpg';
import { Colors } from '@/@legacy/componentes/colors';
import FormGroup from '@/@legacy/componentes/formGroup';
import CampoTextoJs from '@/@legacy/componentes/campoTexto';
import ButtonJs from '@/@legacy/componentes/button';
import { Loader } from '@/@legacy/componentes';
import { URL_RECUPERARSENHA } from '@/@legacy/constantes/url';
import { setExibirMensagemSessaoExpirou } from '@/@legacy/redux/modulos/mensagens/actions';
import { setMenuOculto } from '@/@legacy/redux/modulos/navegacao/actions';
import { useAppSelector } from '@/core/hooks/use-redux';
import { ROUTES } from '@/core/enum/routes';
import {
  Logo,
  Formulario,
  LogoSGP,
  Rotulo,
  Cartao,
  LogoSP,
  CorpoCartao,
  Centralizar,
  LabelLink,
  TextoAjuda,
  ErroGeral,
  MensagemMobile,
  FundoSondagem,
  PainelImagemSondagem,
} from '@/@legacy/paginas/Login/login.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CampoTexto = CampoTextoJs as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Button = ButtonJs as any;

const LoginSondagem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const paramsRoute = useParams();

  const inputUsuarioRf = useRef<HTMLInputElement>(null);
  const btnAcessar = useRef<HTMLButtonElement>(null);

  const [carregando, setCarregando] = useState(false);
  const [erroGeral, setErroGeral] = useState('');
  const [login, setLogin] = useState({ usuario: '', senha: '' });

  const exibirMensagemSessaoExpirou = useAppSelector((store) => store.usuario.sessaoExpirou);
  const { versao } = useAppSelector((store) => store.sistema);

  const redirect = (paramsRoute as any)?.redirect || btoa(ROUTES.SONDAGEM);
  const helper = new LoginHelper(dispatch, redirect);

  const [validacoes] = useState(
    Yup.object({
      usuario: Yup.string()
        .required('Digite seu Usuário')
        .min(5, 'O usuário deve conter no mínimo 5 caracteres.'),
      senha: Yup.string()
        .required('Digite sua Senha')
        .min(4, 'A senha deve conter no mínimo 4 caracteres.'),
    }),
  );

  const realizarLogin = async (dados: { usuario: string; senha: string }) => {
    setCarregando(true);
    setLogin({ usuario: dados.usuario, senha: dados.senha });
    setErroGeral('');
    dispatch(setExibirMensagemSessaoExpirou(false));
    dispatch(setMenuOculto(true));

    const { sucesso, ...retorno } = await helper.acessar({
      login: dados,
      acessoAdmin: false,
      deslogar: false,
      navigate,
    });

    if (!sucesso) {
      setErroGeral((retorno as any).erroGeral);
      setCarregando(false);
      dispatch(setMenuOculto(false));
    }
  };

  const aoPressionarTecla = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      btnAcessar.current?.click();
    }
  };

  const aoClicarBotaoAutenticar = (form: any, e: MouseEvent) => {
    (e as any).persist?.();
    form.validateForm().then(() => form.handleSubmit(e));
  };

  useEffect(() => {
    document.addEventListener('keyup', aoPressionarTecla);
    return () => document.removeEventListener('keyup', aoPressionarTecla);
  }, []);

  useEffect(() => {
    if (exibirMensagemSessaoExpirou) setErroGeral('Sua sessão expirou!');
  }, [exibirMensagemSessaoExpirou]);

  const navegarParaRecuperarSenha = () => {
    const rf = inputUsuarioRf?.current?.value;
    navigate({ pathname: URL_RECUPERARSENHA } as any, { state: { rf } });
  };

  return (
    <FundoSondagem>
      <PainelImagemSondagem>
        <img src={FundoLogin} alt="Login" />
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('sgp-menu-oculto');
            navigate('/login');
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            background: '#ffffff',
            border: '1px solid #5170ff',
            color: '#5170ff',
            borderRadius: '4px',
            padding: '10px 32px',
            fontSize: '15px',
            fontFamily: 'Roboto',
            cursor: 'pointer',
          }}
        >
          Retornar ao SGP
        </button>
      </PainelImagemSondagem>
      <Cartao className="col-xl-6 col-lg-6 col-md-8 pt-1 pb-0 col-sm-8 col-xs-12 overflow-hidden">
        <CorpoCartao className=" overflow-hidden">
          <Centralizar className="row col-md-12 overflow-hidden">
            <Row className="col-md-12 p-0 d-flex justify-content-center align-self-start">
              <LogoSGP className="col-xl-8 col-md-8 col-sm-8 col-xs-12 d-flex justify-content-center">
                <Logo
                  src="/imagens/LogoNovaSondagem.png"
                  alt="Nova Sondagem"
                  width={303}
                  height={102}
                />
              </LogoSGP>
            </Row>
            <Row className="col-md-12 d-flex justify-content-center align-self-start p-0">
              <Formulario id="Formulario" className="col-xl-8 col-md-8 col-sm-8 col-xs-12 p-0">
                {isBrowser || IOSView ? (
                  <Formik
                    enableReinitialize
                    initialValues={{ usuario: login.usuario, senha: login.senha }}
                    onSubmit={(dados) => realizarLogin(dados)}
                    validationSchema={validacoes}
                    validateOnBlur={false}
                    validateOnChange={false}
                  >
                    {(form) => (
                      <Form>
                        <Rotulo className="d-block" htmlFor="usuario">
                          Usuário
                          <Tooltip placement="top" title={TextoAjuda}>
                            <i className="fas fa-question-circle ml-1" />
                          </Tooltip>
                        </Rotulo>
                        <CampoTexto
                          form={form}
                          name="usuario"
                          id="usuario"
                          maxlength={50}
                          classNameCampo="mb-3"
                          placeholder="Informe o RF ou usuário"
                          type="input"
                          ref={inputUsuarioRf}
                          icon
                        />
                        <Rotulo htmlFor="Senha">Senha</Rotulo>
                        <CampoTexto
                          form={form}
                          name="senha"
                          id="senha"
                          maxlength={50}
                          classNameCampo="mb-3"
                          placeholder="Informe sua senha"
                          type="input"
                          maskType="password"
                          icon
                        />
                        <FormGroup>
                          <Loader loading={carregando} tip="">
                            <Button
                              id={shortid.generate()}
                              className="btn-block d-block"
                              label="Acessar"
                              color={Colors.Roxo}
                              ref={btnAcessar}
                              onClick={(e: MouseEvent) => aoClicarBotaoAutenticar(form, e)}
                            />
                          </Loader>
                          <Centralizar className="mt-3">
                            <LabelLink onClick={navegarParaRecuperarSenha}>
                              Esqueci minha senha
                            </LabelLink>
                          </Centralizar>
                        </FormGroup>
                        {form.errors.usuario || form.errors.senha ? (
                          <ErroGeral>
                            Você precisa informar um usuário e senha para acessar o sistema.
                          </ErroGeral>
                        ) : null}
                        {erroGeral && !(form.errors.usuario || form.errors.senha) ? (
                          <ErroGeral>{erroGeral}</ErroGeral>
                        ) : null}
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <MensagemMobile>
                    <span>
                      Para sua melhor experiência recomendamos que o acesso ao sistema seja
                      realizado pelo computador.
                    </span>
                  </MensagemMobile>
                )}
              </Formulario>
            </Row>
            <Row className="col-md-12 d-flex justify-content-center align-self-end mb-3">
              <LogoSP className="col-xl-8 col-md-8 col-sm-8 col-xs-12 d-flex">
                <Logo src={LogoCidadeSP} alt="Cidade de São Paulo - Educação" height={70} />
              </LogoSP>
            </Row>
            <Row>
              {!versao ? '' : <strong>{versao}&nbsp;</strong>} - Sistema homologado para
              navegadores: Google Chrome e Firefox
            </Row>
          </Centralizar>
        </CorpoCartao>
      </Cartao>
    </FundoSondagem>
  );
};

export default LoginSondagem;
