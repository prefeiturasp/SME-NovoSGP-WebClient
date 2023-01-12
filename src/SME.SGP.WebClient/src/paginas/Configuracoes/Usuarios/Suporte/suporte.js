import { Col, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  CampoTexto,
  Card,
  Colors,
  DataTable,
  Loader,
  SelectComponent,
} from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import {
  SGP_SELECT_DRE,
  SGP_SELECT_UE,
} from '~/componentes-sgp/filtro/idsCampos';
import { OPCAO_TODOS, URL_HOME } from '~/constantes';
import RotasDto from '~/dtos/rotasDto';
import LoginHelper from '~/paginas/Login/loginHelper';
import { store } from '~/redux';
import {
  AbrangenciaServico,
  api,
  erro,
  erros,
  history,
  verificaSomenteConsulta,
} from '~/servicos';

const Suporte = ({ match }) => {
  const { usuario } = store.getState();
  const permissoesTela = usuario.permissoes[RotasDto.SUPORTE];

  const [carregandoDres, setCarregandoDres] = useState(false);
  const [listaDres, setListaDres] = useState([]);
  const [dreId, setDreId] = useState();

  const [carregandoUes, setCarregandoUes] = useState(false);
  const [listaUes, setListaUes] = useState([]);
  const [ueId, setUeId] = useState();

  const [nomeUsuarioSelecionado, setNomeUsuarioSelecionado] = useState('');
  const [rfSelecionado, setRfSelecionado] = useState('');

  const [carregando, setCarregando] = useState(false);

  const [listaUsuario, setListaUsuario] = useState([]);

  const dispatch = useDispatch();

  const redirect = match?.params?.redirect ? match.params.redirect : null;

  const helper = new LoginHelper(dispatch, redirect);

  useEffect(() => {
    verificaSomenteConsulta(permissoesTela);
  }, [permissoesTela]);

  const onClickVoltar = () => history.push(URL_HOME);

  const onChangeDre = valor => {
    setUeId();
    setDreId(valor);
  };

  const obterDres = useCallback(async () => {
    setCarregandoDres(true);
    const retorno = await AbrangenciaServico.buscarDres()
      .catch(e => erros(e))
      .finally(() => setCarregandoDres(false));

    if (retorno?.data?.length) {
      if (retorno.data.length === 1) {
        setDreId(retorno.data[0].codigo);
      } else {
        retorno.data.unshift({
          nome: 'Todas',
          codigo: OPCAO_TODOS,
        });
      }

      setListaDres(retorno.data);
    } else {
      setListaDres([]);
      setDreId();
    }
  }, []);

  useEffect(() => {
    obterDres();
  }, [obterDres]);

  const onChangeUe = valor => {
    setUeId(valor);
  };

  const obterUes = useCallback(async () => {
    if (dreId) {
      if (dreId === OPCAO_TODOS) {
        const objUe = { codigo: OPCAO_TODOS, nome: 'Todas' };
        setListaUes([objUe]);
        setUeId(objUe?.codigo);
        return;
      }

      setCarregandoUes(true);
      const resposta = await AbrangenciaServico.buscarUes(
        dreId,
        `/v1/abrangencias/false/dres/${dreId}/ues?consideraNovasUEs=${true}`,
        true
      )
        .catch(e => erros(e))
        .finally(() => setCarregandoUes(false));
      if (resposta?.data?.length) {
        const lista = resposta.data;

        if (lista.length === 1) {
          setUeId(lista[0].codigo);
        } else {
          lista.unshift({
            nome: 'Todas',
            codigo: OPCAO_TODOS,
          });
        }

        setListaUes(lista);
        return;
      }
      setListaUes([]);
    }
  }, [dreId]);

  useEffect(() => {
    setUeId();
    setListaUes([]);
    if (dreId) {
      obterUes();
    }
  }, [dreId, obterUes]);

  const onChangeNomeUsuario = nomeUsuario =>
    setNomeUsuarioSelecionado(nomeUsuario.target.value);

  const onChangeRf = rf => setRfSelecionado(rf.target.value);

  const acessar = async linha => {
    setCarregando(true);

    const resposta = await helper.acessar({ usuario: linha.codigoRf }, true);

    if (resposta?.sucesso) {
      history.push(URL_HOME);
    } else if (resposta.erro) {
      erros(resposta.erro);
    }
    setCarregando(false);
  };

  const onClickFiltrar = async () => {
    const todosDreOuUe = dreId === OPCAO_TODOS || ueId === OPCAO_TODOS;
    if (!rfSelecionado && todosDreOuUe) {
      erro('Campo login obrigatório');
      return;
    }
    if (dreId) {
      setCarregando(true);
      const parametrosPost = {
        codigoDre: dreId === OPCAO_TODOS ? '' : dreId,
        codigoUe: ueId === OPCAO_TODOS ? '' : ueId,
        nomeServidor: nomeUsuarioSelecionado,
        codigoRf: rfSelecionado,
      };

      setListaUsuario([]);
      const lista = await api
        .post(`v1/unidades-escolares/usuarios`, parametrosPost)
        .catch(e => erros(e))
        .finally(() => setCarregando(false));

      if (lista?.data?.length) {
        setListaUsuario(lista.data);
      } else {
        setListaUsuario([]);
      }
    } else {
      setListaUsuario([]);
    }
  };

  const colunas = [
    {
      title: 'Nome',
      dataIndex: 'nomeServidor',
    },
    {
      title: 'Login',
      dataIndex: 'codigoRf',
      width: '25%',
    },
    {
      title: 'Ação',
      width: '15%',
      render: (_, linha) => {
        return (
          <div className="d-flex justify-content-center">
            <Button
              label="Acessar"
              color={Colors.Roxo}
              border
              onClick={() => acessar(linha)}
              disabled={!linha.codigoRf}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Cabecalho pagina="Suporte">
        <BotaoVoltarPadrao onClick={() => onClickVoltar()} />
      </Cabecalho>
      <Card padding="24px 24px">
        <Col span={24}>
          <Loader loading={carregando}>
            <Row gutter={[16, 16]}>
              <Col sm={24} md={12}>
                <Loader loading={carregandoDres} ignorarTip>
                  <SelectComponent
                    id={SGP_SELECT_DRE}
                    label="Diretoria Regional de Educação (DRE)"
                    lista={listaDres}
                    valueOption="codigo"
                    valueText="nome"
                    disabled={listaDres?.length === 1}
                    onChange={valor => onChangeDre(valor)}
                    valueSelect={dreId}
                    placeholder="Diretoria Regional De Educação (DRE)"
                    showSearch
                  />
                </Loader>
              </Col>
              <Col sm={24} md={12}>
                <Loader loading={carregandoUes} ignorarTip>
                  <SelectComponent
                    id={SGP_SELECT_UE}
                    label="Unidade Escolar (UE)"
                    lista={listaUes}
                    valueOption="codigo"
                    valueText="nome"
                    disabled={!dreId || listaUes?.length === 1}
                    onChange={valor => onChangeUe(valor)}
                    valueSelect={ueId}
                    placeholder="Unidade Escolar (UE)"
                    showSearch
                  />
                </Loader>
              </Col>
              <Col sm={24} md={12}>
                <CampoTexto
                  id="SGP_INPUT_TEXT_USUARIO"
                  label="Nome do usuário"
                  placeholder="Nome do usuário"
                  onChange={e => onChangeNomeUsuario(e)}
                  value={nomeUsuarioSelecionado}
                />
              </Col>
              <Col sm={24} md={12} lg={8}>
                <CampoTexto
                  id="SGP_INPUT_TEXT_LOGIN"
                  label="Login"
                  placeholder="Login"
                  onChange={e => onChangeRf(e)}
                  value={rfSelecionado}
                />
              </Col>
              <Col sm={24} md={12} lg={4}>
                <Button
                  id="SGP_BUTTON_FILTRAR"
                  label="Filtrar"
                  color={Colors.Azul}
                  disabled={!dreId || !ueId}
                  border
                  className="text-center d-block mt-4 float-right w-100"
                  onClick={() => onClickFiltrar()}
                />
              </Col>
              <Col sm={24}>
                {listaUsuario.length > 0 ? (
                  <DataTable
                    idLinha="codigoRf"
                    columns={colunas}
                    dataSource={listaUsuario}
                    semHover
                  />
                ) : (
                  <></>
                )}
              </Col>
            </Row>
          </Loader>
        </Col>
      </Card>
    </>
  );
};

export default Suporte;
