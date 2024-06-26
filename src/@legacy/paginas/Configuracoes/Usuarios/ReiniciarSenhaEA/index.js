import { validate } from 'gerador-validador-cpf';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Loader } from '~/componentes';
import Button from '~/componentes/button';

import { ROUTES } from '@/core/enum/routes';
import { store } from '@/core/redux';
import FiltroHelper from '~/componentes-sgp/filtro/helper';
import { Colors } from '~/componentes/colors';
import ModalConteudoHtml from '~/componentes/modalConteudoHtml';
import SelectComponent from '~/componentes/select';
import DataTable from '~/componentes/table/dataTable';
import { confirmar, erro, erros } from '~/servicos/alertas';
import api from '~/servicos/api';
import cpfMask from '~/servicos/maskCPF';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';

import { InputBuscaCPF, MensagemInputError } from './style';

export default function ReiniciarSenhaEA() {
  const [usuarioApp, setUsuarioApp] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [dreSelecionada, setDreSelecionada] = useState('');
  const [listaUes, setListaUes] = useState([]);
  const [ueSelecionada, setUeSelecionada] = useState('');
  const [buscaCPF, setBuscaCPF] = useState('');
  const [tituloModal, setTituloModal] = useState('');
  const [
    exibirModalMensagemReiniciarSenha,
    setExibirModalMensagemReiniciarSenha,
  ] = useState(false);
  const [mensagemSenhaAlterada, setMensagemSenhaAlterada] = useState('');
  const [mensagemValidacaoCPF, setMensagemValidacaoCPF] = useState('');

  const [dreDesabilitada, setDreDesabilitada] = useState(false);
  const [ueDesabilitada, setUeDesabilitada] = useState(false);

  const [carregando, setCarregando] = useState(false);

  const { usuario } = store.getState();
  const anoLetivo = useMemo(
    () =>
      (usuario.turmaSelecionada && usuario.turmaSelecionada.anoLetivo) ||
      moment().year(),
    [usuario.turmaSelecionada]
  );

  const permissoesTela = usuario.permissoes[ROUTES.REINICIAR_SENHA];

  const onClickBuscaUsuarioPorCPF = async () => {
    if (!permissoesTela.podeConsultar) return;

    if (validate(buscaCPF)) {
      setCarregando(true);
      const cpfSemMascara = buscaCPF.replace(/[^\d]+/g, '');
      const responseUsuarioApp = await api
        .get(
          `v1/escola-aqui/usuarios/dre/${dreSelecionada}/ue/${ueSelecionada}/cpf/${cpfSemMascara}`
        )
        .catch(e => {
          erros(e);
          setUsuarioApp([]);
        });

      if (responseUsuarioApp && responseUsuarioApp.data) {
        setUsuarioApp([]);
        setUsuarioApp([
          {
            nome: responseUsuarioApp.data.nome,
            cpf: cpfMask(responseUsuarioApp.data.cpf),
          },
        ]);
      } else {
        setUsuarioApp([]);
      }
      setCarregando(false);
    } else {
      erro('Insira um CPF válido');
      setUsuarioApp([]);
    }
  };

  const reiniciarSenha = async linha => {
    const cpfSemMascara = linha.cpf.replace(/[^\d]+/g, '');
    const parametros = {
      cpf: cpfSemMascara,
    };

    setCarregando(true);
    await api
      .put(`v1/escola-aqui/usuarios/reiniciar-senha`, parametros)
      .then(resposta => {
        setTituloModal('');
        setExibirModalMensagemReiniciarSenha(true);
        setMensagemSenhaAlterada(resposta.data.mensagem);
        setTituloModal('Senha reiniciada');
      })
      .catch(e => {
        setTituloModal('');
        setExibirModalMensagemReiniciarSenha(true);
        setMensagemSenhaAlterada(e.response.data.mensagens);
        setTituloModal('Atenção');
      });
    setCarregando(false);
  };

  const onClickReiniciar = async linha => {
    if (!permissoesTela.podeAlterar) return;

    const confirmou = await confirmar(
      'Reiniciar Senha',
      '',
      'Deseja realmente reiniciar essa senha?',
      'Reiniciar',
      'Cancelar'
    );
    if (confirmou) {
      reiniciarSenha(linha);
    }
  };

  const colunas = [
    {
      title: 'Nome do usuário',
      dataIndex: 'nome',
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
    },
    {
      title: 'Ação',
      dataIndex: 'acaoReiniciar',
      render: (_, linha) => {
        return (
          <div className="botao-reiniciar-tabela-acao-escola-aqui">
            <Button
              label="Reiniciar"
              color={Colors.Roxo}
              disabled={!permissoesTela.podeAlterar}
              border
              className="ml-2 text-center"
              onClick={() => onClickReiniciar(linha)}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const carregarDres = async () => {
      const dres = await api.get(
        `v1/abrangencias/false/dres?anoLetivo=${anoLetivo}`
      );
      if (dres.data) {
        setListaDres(dres.data.sort(FiltroHelper.ordenarLista('nome')));
      } else {
        setListaDres([]);
      }
    };

    carregarDres();
    verificaSomenteConsulta(permissoesTela);
  }, [anoLetivo, permissoesTela]);

  useEffect(() => {
    let desabilitada = !listaDres || listaDres.length === 0;

    if (!desabilitada && listaDres.length === 1) {
      setDreSelecionada(String(listaDres[0].codigo));
      desabilitada = true;
    }

    setDreDesabilitada(desabilitada);
  }, [listaDres]);

  useEffect(() => {
    let desabilitada = !listaUes || listaUes.length === 0;

    if (!desabilitada && listaUes.length === 1) {
      setUeSelecionada(String(listaUes[0].codigo));
      desabilitada = true;
    }

    setUeDesabilitada(desabilitada);
  }, [listaUes]);

  const onChangeDre = dre => {
    setDreSelecionada(dre);
    setUeSelecionada();
    setListaUes();
  };

  const onChangeUe = ue => {
    setUeSelecionada(ue);
  };

  const onChangeBuscaCPF = cpfUsuario => {
    if (
      cpfUsuario.target.value.length === 14 &&
      !validate(cpfUsuario.target.value)
    ) {
      setMensagemValidacaoCPF('Este CPF é inválido');
    } else {
      setMensagemValidacaoCPF('');
    }

    setBuscaCPF(cpfUsuario.target.value);
  };

  const carregarUes = useCallback(async dre => {
    const ues = await api.get(
      `/v1/abrangencias/false/dres/${dre}/ues?consideraNovasUEs=${true}`
    );
    if (ues.data) {
      setListaUes(ues.data);
    } else {
      setListaUes([]);
    }
  }, []);

  useEffect(() => {
    if (dreSelecionada) {
      carregarUes(dreSelecionada);
    }
  }, [carregarUes, dreSelecionada]);

  const onCloseModalReiniciarSenha = () => {
    setExibirModalMensagemReiniciarSenha(false);
  };

  return (
    <Loader loading={carregando}>
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 pb-2">
          <SelectComponent
            name="dre-reiniciar-senha"
            id="dre-reiniciar-senha"
            lista={listaDres}
            disabled={!permissoesTela.podeConsultar || dreDesabilitada}
            valueOption="codigo"
            valueText="nome"
            onChange={onChangeDre}
            valueSelect={String(dreSelecionada) || ''}
            label="Diretoria Regional de Educação (DRE)"
            placeholder="Diretoria Regional de Educação (DRE)"
            showSearch
          />
        </div>
        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 pb-2">
          <SelectComponent
            name="ues-list"
            id="ues-list"
            lista={listaUes}
            disabled={!permissoesTela.podeConsultar || ueDesabilitada}
            valueOption="codigo"
            valueText="nome"
            onChange={onChangeUe}
            valueSelect={ueSelecionada || ''}
            label="Unidade Escolar (UE)"
            placeholder="Unidade Escolar (UE)"
            showSearch
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-sm-12 col-md-12 col-lg-10 col-xl-11">
          <InputBuscaCPF
            label="Login"
            placeholder="Digite o CPF"
            onChange={onChangeBuscaCPF}
            desabilitado={!permissoesTela.podeConsultar}
            value={cpfMask(buscaCPF)}
          />
          {mensagemValidacaoCPF !== '' && (
            <MensagemInputError>{mensagemValidacaoCPF}</MensagemInputError>
          )}
        </div>

        <div className="col-sm-12 col-md-12 col-lg-2 col-xl-1">
          <Button
            label="Filtrar"
            color={Colors.Azul}
            disabled={
              !permissoesTela.podeConsultar ||
              !(!!dreSelecionada && !!ueSelecionada)
            }
            border
            className="text-center d-block mt-4 float-right w-100"
            onClick={onClickBuscaUsuarioPorCPF}
          />
        </div>
      </div>

      {usuarioApp.length > 0 && (
        <div className="row">
          <div className="col-md-12 pt-4">
            <DataTable
              rowKey="codigoRf"
              columns={colunas}
              dataSource={usuarioApp}
              cpfRowMask
            />
          </div>
        </div>
      )}

      <ModalConteudoHtml
        key="exibirModalMensagemReiniciarSenha"
        visivel={exibirModalMensagemReiniciarSenha}
        onClose={onCloseModalReiniciarSenha}
        onConfirmacaoPrincipal={onCloseModalReiniciarSenha}
        labelBotaoPrincipal="OK"
        titulo={tituloModal}
        esconderBotaoSecundario
        closable
      >
        <b> {mensagemSenhaAlterada} </b>
      </ModalConteudoHtml>
    </Loader>
  );
}
