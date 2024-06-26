import React, { useState, useEffect, useCallback } from 'react';

import { Card, Loader, SelectComponent, RadioGroupButton } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';

import {
  erros,
  sucesso,
  ServicoFiltroRelatorio,
  ServicoAdesaoEscolaAqui,
} from '~/servicos';

import { URL_HOME } from '~/constantes';
import { OPCAO_TODOS } from '~/constantes/constantes';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import { useNavigate } from 'react-router-dom';

const RelatorioEscolaAquiAdesao = () => {
  const navigate = useNavigate();

  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);

  const [dreCodigo, setDreCodigo] = useState(undefined);
  const [ueCodigo, setUeCodigo] = useState(undefined);
  const [opcaoListaUsuarios, setOpcaoListaUsuarios] = useState(1);

  const [desabilitarBtnGerar, setDesabilitarBtnGerar] = useState(true);
  const [desabilitarRadioListarUsuario, setDesabilitarRadioListarUsuario] =
    useState(true);
  const [clicouBotaoGerar, setClicouBotaoGerar] = useState(false);

  const [modoEdicao, setModoEdicao] = useState(false);

  const opcoesListarUsuarios = [
    { label: 'Não', value: 1 },
    { label: 'Válidos', value: 2 },
    { label: 'CPF irregular no EOL', value: 3 },
    { label: 'Todos', value: 4 },
  ];

  const voltar = () => {
    navigate(URL_HOME);
  };

  const cancelar = () => {
    setDreCodigo();
    setUeCodigo();
    setOpcaoListaUsuarios(1);
    setModoEdicao(false);
  };

  const gerar = async () => {
    setExibirLoader(true);
    setClicouBotaoGerar(true);

    const retorno = await ServicoAdesaoEscolaAqui.gerar({
      dreCodigo,
      ueCodigo,
      opcaoListaUsuarios,
    })
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno && retorno.status === 200) {
      sucesso(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
      );
    }
  };

  const onChangeDre = valor => {
    setDreCodigo(valor);
    setUeCodigo(undefined);
    setOpcaoListaUsuarios(1);
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const onChangeUe = valor => {
    setUeCodigo(valor);
    if (valor === OPCAO_TODOS || !valor) {
      setOpcaoListaUsuarios(1);
    }
    setClicouBotaoGerar(false);
    setModoEdicao(true);
  };

  const obterDres = async () => {
    setExibirLoader(true);
    const retorno = await ServicoFiltroRelatorio.obterDres().catch(e => {
      erros(e);
      setExibirLoader(false);
    });
    if (retorno && retorno.data && retorno.data.length) {
      setListaDres(retorno.data);

      if (retorno && retorno.data.length && retorno.data.length === 1) {
        setDreCodigo(retorno.data[0].codigo);
      }
    } else {
      setListaDres([]);
    }
    setExibirLoader(false);
  };

  useEffect(() => {
    if (!dreCodigo) {
      obterDres();
    }
  }, [dreCodigo]);

  const obterUes = useCallback(async dre => {
    if (dre) {
      setExibirLoader(true);
      const retorno = await ServicoFiltroRelatorio.obterUes(dre, false).catch(
        e => {
          erros(e);
          setExibirLoader(false);
        }
      );

      if (retorno && retorno.data && retorno.data.length) {
        setListaUes(retorno.data);

        if (retorno && retorno.data.length && retorno.data.length === 1) {
          setUeCodigo(retorno.data[0].codigo);
        }
      } else {
        setListaUes([]);
      }

      setExibirLoader(false);
    }
  }, []);

  useEffect(() => {
    if (dreCodigo) {
      obterUes(dreCodigo);
      return;
    }
    setUeCodigo(undefined);
    setOpcaoListaUsuarios(1);
    setListaUes([]);
  }, [dreCodigo, obterUes]);

  useEffect(() => {
    const desabilitar = !dreCodigo || !ueCodigo || clicouBotaoGerar;
    setDesabilitarBtnGerar(desabilitar);
  }, [dreCodigo, ueCodigo, clicouBotaoGerar]);

  useEffect(() => {
    const desabilitaDre = dreCodigo === OPCAO_TODOS ? true : !dreCodigo;
    const desabilitaUe = ueCodigo === OPCAO_TODOS ? true : !ueCodigo;
    const desabilitar = desabilitaDre || desabilitaUe;
    setDesabilitarRadioListarUsuario(desabilitar);
  }, [dreCodigo, ueCodigo]);

  return (
    <Loader loading={exibirLoader}>
      <Cabecalho pagina="Relatório de adesão">
        <BotoesAcaoRelatorio
          onClickVoltar={voltar}
          onClickCancelar={cancelar}
          onClickGerar={gerar}
          desabilitarBtnGerar={desabilitarBtnGerar}
          modoEdicao={modoEdicao}
        />
      </Cabecalho>

      <Card>
        <div className="col-md-12 pr-0">
          <div className="row pb-3">
            <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
              <SelectComponent
                label="DRE"
                lista={listaDres}
                valueOption="codigo"
                valueText="nome"
                disabled={listaDres?.length === 1}
                onChange={onChangeDre}
                valueSelect={dreCodigo}
                placeholder="Diretoria Regional de Educação (DRE)"
                showSearch
              />
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
              <SelectComponent
                id="drop-ue"
                label="Unidade Escolar (UE)"
                lista={listaUes}
                valueOption="codigo"
                valueText="nome"
                disabled={!dreCodigo || listaUes?.length === 1}
                onChange={onChangeUe}
                valueSelect={ueCodigo}
                placeholder="Unidade Escolar (UE)"
                showSearch
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-2">
              <RadioGroupButton
                label="Listar usuários"
                opcoes={opcoesListarUsuarios}
                valorInicial
                onChange={e => {
                  setOpcaoListaUsuarios(e.target.value);
                  setClicouBotaoGerar(false);
                  setModoEdicao(true);
                }}
                value={opcaoListaUsuarios}
                desabilitado={desabilitarRadioListarUsuario}
              />
            </div>
          </div>
        </div>
      </Card>
    </Loader>
  );
};

export default RelatorioEscolaAquiAdesao;
