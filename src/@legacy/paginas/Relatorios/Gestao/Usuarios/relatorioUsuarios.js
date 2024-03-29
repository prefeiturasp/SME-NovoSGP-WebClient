import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader,
  Localizador,
  RadioGroupButton,
  SelectComponent,
} from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import BotoesAcaoRelatorio from '~/componentes-sgp/botoesAcaoRelatorio';
import CampoNumero from '~/componentes/campoNumero';
import Card from '~/componentes/card';
import { OPCAO_TODOS } from '~/constantes/constantes';
import { URL_HOME } from '~/constantes/url';
import { erros, sucesso } from '~/servicos/alertas';
import ServicoFiltroRelatorio from '~/servicos/Paginas/FiltroRelatorio/ServicoFiltroRelatorio';
import ServicoRelatorioUsuarios from '~/servicos/Paginas/Relatorios/Usuarios/ServicoRelatorioUsuarios';
import {
  obterListaSituacoes,
  obterTodosPerfis,
} from '~/servicos/Paginas/ServicoUsuario';

const RelatorioUsuarios = () => {
  const navigate = useNavigate();

  const [listaDres, setListaDres] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [listaPerfis, setListaPerfis] = useState([]);
  const [listaSituacao, setListaSituacao] = useState([]);

  const opcoesExibirHistorico = [
    { label: 'Não exibir', value: false },
    { label: 'Exibir', value: true },
  ];

  const [codigoDre, setCodigoDre] = useState(undefined);
  const [codigoUe, setCodigoUe] = useState(undefined);
  const [usuarioRf, setUsuarioRf] = useState(undefined);
  const [perfisSelecionados, setPerfisSelecionados] = useState([]);
  const [situacoesSelecionadas, setSituacoesSelecionadas] = useState([]);
  const [diasSemAcesso, setDiasSemAcesso] = useState();
  const [exibirHistorico, setExibirHistorico] = useState(false);

  const [carregandoGeral, setCarregandoGeral] = useState(false);
  const [desabilitarBtnGerar, setDesabilitarBtnGerar] = useState(true);

  const [anoAtual] = useState(window.moment().format('YYYY'));

  const [modoEdicao, setModoEdicao] = useState(false);

  const obterUes = useCallback(
    async dre => {
      if (dre) {
        setCarregandoGeral(true);
        const retorno = await ServicoFiltroRelatorio.obterUes(
          dre,
          false,
          anoAtual
        ).catch(e => {
          erros(e);
          setCarregandoGeral(false);
        });

        if (retorno && retorno.data && retorno.data.length) {
          setListaUes(retorno.data);

          if (retorno && retorno.data.length && retorno.data.length === 1) {
            setCodigoUe(retorno.data[0].codigo);
          }
        } else {
          setListaUes([]);
        }

        setCarregandoGeral(false);
      }
    },
    [anoAtual]
  );

  const onChangeDre = dre => {
    setCodigoDre(dre);

    setListaUes([]);
    setCodigoUe(undefined);
    setModoEdicao(true);
  };

  const obterDres = async () => {
    setCarregandoGeral(true);
    const retorno = await ServicoFiltroRelatorio.obterDres().catch(e => {
      erros(e);
      setCarregandoGeral(false);
    });
    if (retorno && retorno.data && retorno.data.length) {
      setListaDres(retorno.data);

      if (retorno && retorno.data.length && retorno.data.length === 1) {
        setCodigoDre(retorno.data[0].codigo);
      }
    } else {
      setListaDres([]);
    }
    setCarregandoGeral(false);
  };

  useEffect(() => {
    if (codigoDre) {
      obterUes(codigoDre);
    } else {
      setCodigoUe(undefined);
      setListaUes([]);
    }
  }, [codigoDre, obterUes]);

  useEffect(() => {
    const desabilitar = !codigoDre || !codigoUe || !perfisSelecionados?.length;

    setDesabilitarBtnGerar(desabilitar);
  }, [
    codigoDre,
    codigoUe,
    usuarioRf,
    perfisSelecionados,
    situacoesSelecionadas,
    diasSemAcesso,
    exibirHistorico,
  ]);

  const montarListaPerfis = async () => {
    const resposta = await obterTodosPerfis().catch(e => erros(e));
    if (resposta?.data?.length) {
      const lista = resposta.data;
      setListaPerfis(lista);

      if (lista.length > 1) {
        lista.unshift({ key: OPCAO_TODOS, value: 'Todos' });
        setPerfisSelecionados([OPCAO_TODOS]);
      }
      if (lista?.length === 1) {
        setPerfisSelecionados([lista[0].key]);
      }
    } else {
      setListaPerfis([]);
    }
  };

  const montarListaSituacoes = async () => {
    const resposta = await obterListaSituacoes().catch(e => erros(e));
    if (resposta?.data?.length) {
      const lista = resposta.data;
      setListaSituacao(lista);

      if (lista.length > 1) {
        lista.unshift({ key: OPCAO_TODOS, value: 'Todas' });
      }
    } else {
      setListaSituacao([]);
    }
  };

  useEffect(() => {
    obterDres();
    montarListaPerfis();
    montarListaSituacoes();
  }, []);

  const onClickVoltar = () => {
    navigate(URL_HOME);
  };

  const onClickCancelar = () => {
    setCodigoDre();
    setCodigoUe();
    setUsuarioRf();
    setPerfisSelecionados([]);
    setSituacoesSelecionadas([]);
    setDiasSemAcesso();
    setExibirHistorico(false);

    setListaDres([]);
    setListaUes([]);

    obterDres();

    setModoEdicao(false);
  };

  const onClickGerar = async () => {
    let keysPerfis = perfisSelecionados;
    if (perfisSelecionados[0] === OPCAO_TODOS) {
      keysPerfis = listaPerfis
        .filter(a => a.key !== OPCAO_TODOS)
        .map(a => a.key);
    }

    let keysSituacoes = situacoesSelecionadas;
    if (
      situacoesSelecionadas?.length === 1 &&
      situacoesSelecionadas[0] === OPCAO_TODOS
    ) {
      keysSituacoes = [];
    }

    const params = {
      codigoDre,
      codigoUe,
      usuarioRf: usuarioRf || '',
      perfis: keysPerfis,
      situacoes: keysSituacoes,
      diasSemAcesso: diasSemAcesso || 0,
      exibirHistorico,
    };

    setCarregandoGeral(true);

    const retorno = await ServicoRelatorioUsuarios.gerar(params)
      .catch(e => erros(e))
      .finally(() => setCarregandoGeral(false));

    if (retorno && retorno.status === 200) {
      sucesso(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
      );
      setDesabilitarBtnGerar(true);
    }
  };

  const onChangeUe = ue => {
    setCodigoUe(ue);
    setModoEdicao(true);
  };

  return (
    <>
      <Loader loading={carregandoGeral}>
        <Cabecalho pagina="Relatório de usuários">
          <BotoesAcaoRelatorio
            onClickVoltar={onClickVoltar}
            onClickCancelar={onClickCancelar}
            onClickGerar={onClickGerar}
            desabilitarBtnGerar={desabilitarBtnGerar}
            modoEdicao={modoEdicao}
          />
        </Cabecalho>
        <Card>
          <div className="col-md-12">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
                <SelectComponent
                  label="DRE"
                  lista={listaDres}
                  valueOption="codigo"
                  valueText="nome"
                  disabled={listaDres && listaDres.length === 1}
                  onChange={onChangeDre}
                  valueSelect={codigoDre}
                  placeholder="Diretoria Regional de Educação (DRE)"
                  showSearch
                />
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
                <SelectComponent
                  label="Unidade Escolar (UE)"
                  lista={listaUes}
                  valueOption="codigo"
                  valueText="nome"
                  disabled={listaUes && listaUes.length === 1}
                  onChange={onChangeUe}
                  valueSelect={codigoUe}
                  placeholder="Unidade Escolar (UE)"
                  showSearch
                />
              </div>
              <div className="col-md-12 mb-2">
                <div className="row pr-3">
                  <Localizador
                    rfEdicao={usuarioRf}
                    buscandoDados={setCarregandoGeral}
                    dreId={codigoDre}
                    ueId={codigoUe}
                    anoLetivo={anoAtual}
                    showLabel
                    onChange={valores => {
                      if (valores && valores.professorRf) {
                        setUsuarioRf(valores.professorRf);
                        setModoEdicao(true);
                      }
                    }}
                    buscarOutrosCargos
                  />
                </div>
              </div>
              <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 mb-2">
                <SelectComponent
                  id="select-perfis"
                  lista={listaPerfis}
                  valueOption="key"
                  valueText="value"
                  label="Perfil"
                  valueSelect={perfisSelecionados}
                  multiple
                  onChange={valores => {
                    const opcaoTodosJaSelecionado = perfisSelecionados
                      ? perfisSelecionados.includes(OPCAO_TODOS)
                      : false;
                    if (opcaoTodosJaSelecionado) {
                      const listaSemOpcaoTodos = valores.filter(
                        v => v !== OPCAO_TODOS
                      );
                      setPerfisSelecionados(listaSemOpcaoTodos);
                    } else if (valores.includes(OPCAO_TODOS)) {
                      setPerfisSelecionados([OPCAO_TODOS]);
                    } else {
                      setPerfisSelecionados(valores);
                    }
                    setModoEdicao(true);
                  }}
                  placeholder="Perfil"
                  disabled={listaPerfis?.length === 1}
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-2">
                <SelectComponent
                  label="Situação"
                  lista={listaSituacao}
                  valueOption="key"
                  valueText="value"
                  disabled={listaSituacao && listaSituacao.length === 1}
                  valueSelect={situacoesSelecionadas}
                  multiple
                  onChange={valores => {
                    const opcaoTodosJaSelecionado = situacoesSelecionadas
                      ? situacoesSelecionadas.includes(OPCAO_TODOS)
                      : false;
                    if (opcaoTodosJaSelecionado) {
                      const listaSemOpcaoTodos = valores.filter(
                        v => v !== OPCAO_TODOS
                      );
                      setSituacoesSelecionadas(listaSemOpcaoTodos);
                    } else if (valores.includes(OPCAO_TODOS)) {
                      setSituacoesSelecionadas([OPCAO_TODOS]);
                    } else {
                      setSituacoesSelecionadas(valores);
                    }
                    setModoEdicao(true);
                  }}
                  placeholder="Situação"
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xl-3 mb-2">
                <CampoNumero
                  onChange={v => {
                    setDiasSemAcesso(v);
                    setModoEdicao(true);
                  }}
                  value={diasSemAcesso}
                  min={0}
                  label="Não acessa a mais de (dias)"
                  className="w-100"
                  ehDecimal={false}
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
                <RadioGroupButton
                  label="Histórico de reinício de senha"
                  opcoes={opcoesExibirHistorico}
                  valorInicial
                  onChange={e => {
                    setExibirHistorico(e.target.value);
                    setModoEdicao(true);
                  }}
                  value={exibirHistorico}
                />
              </div>
            </div>
          </div>
        </Card>
      </Loader>
    </>
  );
};

export default RelatorioUsuarios;
