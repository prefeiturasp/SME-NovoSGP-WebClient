import * as moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { ROUTES } from '@/core/enum/routes';
import { useNavigate } from 'react-router-dom';
import { Loader } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { RegistroMigrado } from '~/componentes-sgp/registro-migrado';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import {
  SGP_BUTTON_CANCELAR,
  SGP_BUTTON_SALVAR,
} from '~/constantes/ids/button';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import tipoPermissao from '~/dtos/tipoPermissao';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import {
  obterDescricaoNomeMenu,
  verificaSomenteConsulta,
} from '~/servicos/servico-navegacao';
import { removerTagsHtml } from '~/utils';
import Alert from '../../../componentes/alert';
import Button from '../../../componentes/button';
import Card from '../../../componentes/card';
import { Colors } from '../../../componentes/colors';
import SelectComponent from '../../../componentes/select';
import { confirmar, erro, erros, sucesso } from '../../../servicos/alertas';
import api from '../../../servicos/api';
import {
  Badge,
  BtnLink,
  ContainerCampoTipoCiclo,
  IframeStyle,
  InseridoAlterado,
  ListaItens,
} from './planoCiclo.css';

export default function PlanoCiclo() {
  const urlPrefeitura = 'https://curriculo.sme.prefeitura.sp.gov.br';
  const urlMatrizSaberes = `${urlPrefeitura}/matriz-de-saberes`;
  const urlODS = `${urlPrefeitura}/ods`;
  const textEditorRef = useRef(null);
  const navigate = useNavigate();

  const [listaMatriz, setListaMatriz] = useState([]);
  const [listaODS, setListaODS] = useState([]);
  const [carregandoCiclos, setCarregandoCiclos] = useState(true);
  const [listaCiclos, setListaCiclos] = useState([]);
  const [cicloSelecionado, setCicloSelecionado] = useState('');
  const [descricaoCiclo, setDescricaoCiclo] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [pronto, setPronto] = useState(false);
  const [eventoTrocarCiclo, setEventoTrocarCiclo] = useState(false);
  const [registroMigrado, setRegistroMigrado] = useState(false);
  const [cicloParaTrocar, setCicloParaTrocar] = useState('');
  const [inseridoAlterado, setInseridoAlterado] = useState({
    alteradoEm: '',
    alteradoPor: '',
    alteradoRf: '',
    criadoEm: '',
    criadoPor: '',
    criadoRf: '',
  });
  const [listaMatrizSelecionda, setListaMatrizSelecionda] = useState([]);
  const [listaODSSelecionado, setListaODSSelecionado] = useState([]);
  const [planoCiclo, setPlanoCiclo] = useState();
  const [modalidadeEja, setModalidadeEja] = useState(false);
  const [somenteConsulta, setSomenteConsulta] = useState(false);

  const usuario = useSelector(store => store.usuario);
  const turmaSelecionada = useSelector(store => store.usuario.turmaSelecionada);
  const permissoesTela = usuario.permissoes[ROUTES.PLANO_CICLO];

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const ehModalidadeInfantil = ehTurmaInfantil(
    modalidadesFiltroPrincipal,
    turmaSelecionada
  );

  useEffect(() => {
    setSomenteConsulta(
      verificaSomenteConsulta(permissoesTela, ehModalidadeInfantil)
    );
  }, [turmaSelecionada, permissoesTela, ehModalidadeInfantil]);

  useEffect(() => {
    async function carregarListas() {
      const matrizes = await api.get('v1/matrizes-saber');
      setListaMatriz(matrizes.data);

      const ods = await api.get('v1/objetivos-desenvolvimento-sustentavel');
      setListaODS(ods.data);
    }
    carregarListas();
  }, []);

  const [carregando, setCarregando] = useState(false);
  const [carregandoSalvar, setCarregandoSalvar] = useState(false);

  function resetListas() {
    listaMatriz.forEach(item => {
      const target = document.getElementById(`matriz-${item.id}`);
      const estaSelecionado =
        target.getAttribute('opcao-selecionada') === 'true';
      if (estaSelecionado) {
        target.setAttribute('opcao-selecionada', 'false');
      }
    });
    listaODS.forEach(item => {
      const target = document.getElementById(`ods-${item.id}`);
      const estaSelecionado =
        target.getAttribute('opcao-selecionada') === 'true';
      if (estaSelecionado) {
        target.setAttribute('opcao-selecionada', 'false');
      }
    });
    setListaMatrizSelecionda([]);
    setListaODSSelecionado([]);
    setDescricaoCiclo('');
    setPronto(false);
  }

  const carregarIdsSelecionados = useCallback(() => {
    if (planoCiclo?.idsMatrizesSaber?.length) {
      planoCiclo?.idsMatrizesSaber.forEach(id => {
        const matriz = document.querySelector(
          `#matriz-${id}:not([opcao-selecionada='true'])`
        );
        if (matriz) matriz.click();
      });
    }

    if (planoCiclo?.idsObjetivosDesenvolvimentoSustentavel?.length) {
      planoCiclo?.idsObjetivosDesenvolvimentoSustentavel.forEach(id => {
        const objetivo = document.querySelector(
          `#ods-${id}:not([opcao-selecionada='true'])`
        );

        if (objetivo) {
          objetivo.click();
        }
      });
    }
  }, [planoCiclo]);

  useEffect(() => {
    if (pronto) carregarIdsSelecionados();
  }, [carregarIdsSelecionados, planoCiclo, pronto]);

  function configuraValoresPlanoCiclo(ciclo) {
    setDescricaoCiclo(ciclo.data.descricao);
    setCicloSelecionado(String(ciclo.data.cicloId));
    if (ciclo.data.migrado) {
      setRegistroMigrado(ciclo.data.migrado);
    }
  }

  async function obterCicloExistente(ano, escolaId, cicloId) {
    resetListas();
    const ciclo = await api.get(
      `v1/planos/ciclo/${ano}/${cicloId}/${escolaId}`
    );

    setPlanoCiclo(ciclo.data);

    if (ciclo && ciclo.data) {
      const alteradoEm = moment(ciclo.data.alteradoEm).format(
        'DD/MM/YYYY HH:mm:ss'
      );
      const criadoEm = moment(ciclo.data.criadoEm).format(
        'DD/MM/YYYY HH:mm:ss'
      );
      setInseridoAlterado({
        alteradoEm,
        alteradoPor: ciclo.data.alteradoPor,
        alteradoRf: ciclo.data.alteradoRf,
        criadoEm,
        criadoPor: ciclo.data.criadoPor,
        criadoRf: ciclo.data.criadoRf,
      });
      configuraValoresPlanoCiclo(ciclo);
      setPronto(true);
    } else {
      setPronto(true);
      resetListas();
    }
  }

  const turmasUsuario = usuario?.turmasUsuario;

  const carregarCiclos = useCallback(async () => {
    if (usuario && turmaSelecionada.turma) {
      let anoSelecionado = '';
      let codModalidade = null;
      if (turmaSelecionada.turma) {
        anoSelecionado = String(turmaSelecionada.ano);
        codModalidade = turmaSelecionada.modalidade;
      }

      const params = {
        anoSelecionado,
        modalidade: codModalidade,
      };

      let anos = [];
      anos = turmasUsuario?.map?.(item => item?.ano);
      anos = anos?.filter?.(
        (elem, pos) => anos?.indexOf?.(elem) === Number(pos)
      );
      params.anos = anos;

      const ciclos = await api.post('v1/ciclos/filtro', params).catch(err => {
        if (err?.response?.status === 601) erro(err.response.data.mensagens[0]);
        else erro('Ocorreu um erro interno.');
        setSomenteConsulta(true);
        setCarregandoCiclos(false);
      });

      if (ciclos) {
        let sugestaoCiclo = ciclos.data.find(item => item.selecionado);
        if (sugestaoCiclo && sugestaoCiclo.id) {
          sugestaoCiclo = sugestaoCiclo.id;
        }

        setListaCiclos(ciclos.data);

        if (sugestaoCiclo) {
          setCicloSelecionado(String(sugestaoCiclo));
        } else {
          setCicloSelecionado(String(ciclos.data[0].id));
        }

        setCarregandoCiclos(false);

        const anoLetivo = String(turmaSelecionada.anoLetivo);
        const codEscola = String(turmaSelecionada.unidadeEscolar);

        if (Number(turmaSelecionada.modalidade) === ModalidadeEnum.EJA) {
          setModalidadeEja(true);
        } else {
          setModalidadeEja(false);
        }
        obterCicloExistente(
          anoLetivo,
          codEscola,
          String(sugestaoCiclo) || String(ciclos.data[0].id)
        );
      }
    }
    setCarregando(false);
  }, [turmaSelecionada, turmasUsuario]);

  useEffect(() => {
    if (
      turmaSelecionada &&
      !ehModalidadeInfantil &&
      modalidadesFiltroPrincipal.length
    ) {
      setCarregando(true);
      carregarCiclos();
    } else {
      setCarregandoCiclos(false);
      setCicloSelecionado();
      setListaCiclos([]);
    }

    if (!Object.entries(turmaSelecionada).length) setCicloSelecionado();
  }, [turmaSelecionada, ehModalidadeInfantil]);

  function addRemoverMatriz(event, matrizSelecionada) {
    const estaSelecionado =
      event.target.getAttribute('opcao-selecionada') === 'true';
    event.target.setAttribute(
      'opcao-selecionada',
      estaSelecionado ? 'false' : 'true'
    );

    let lista = listaMatrizSelecionda;
    if (estaSelecionado) {
      lista = listaMatrizSelecionda.filter(
        item => item.id !== matrizSelecionada.id
      );
    } else {
      lista.push(matrizSelecionada);
    }
    setListaMatrizSelecionda(lista);
    if (pronto) {
      setModoEdicao(true);
    }
  }

  function addRemoverODS(event, odsSelecionado) {
    const estaSelecionado =
      event.target.getAttribute('opcao-selecionada') === 'true';
    event.target.setAttribute(
      'opcao-selecionada',
      estaSelecionado ? 'false' : 'true'
    );

    let lista = listaODSSelecionado;
    if (estaSelecionado) {
      lista = listaODSSelecionado.filter(item => item.id !== odsSelecionado.id);
    } else {
      lista.push(odsSelecionado);
    }
    setListaODSSelecionado(lista);
    if (pronto) {
      setModoEdicao(true);
    }
  }

  function trocaCiclo(value) {
    const anoLetivo = String(turmaSelecionada.anoLetivo);
    const codEscola = String(turmaSelecionada.unidadeEscolar);
    obterCicloExistente(anoLetivo, codEscola, value);
    setCicloSelecionado(value);
    setModoEdicao(false);
    setInseridoAlterado({});
  }

  const onChangeTextEditor = () => {
    if (!somenteConsulta && !modoEdicao) {
      setModoEdicao(true);
    }
  };

  function irParaLinkExterno(link) {
    window.open(link, '_blank');
  }

  function validaMatrizSelecionada() {
    listaMatriz.forEach(item => {
      const jaSelecionado = listaMatrizSelecionda.find(
        matriz => matriz.id === item.id
      );
      if (jaSelecionado) {
        return true;
      }
      return false;
    });
  }

  function validaODSSelecionado() {
    listaODS.forEach(item => {
      const jaSelecionado = listaODSSelecionado.find(ods => ods.id === item.id);
      if (jaSelecionado) {
        return true;
      }
      return false;
    });
  }

  function confirmarCancelamento() {
    resetListas();
    setModoEdicao(false);
    let ciclo = '';
    if (eventoTrocarCiclo) {
      ciclo = cicloParaTrocar;
      setCicloSelecionado(ciclo);
    }
    const anoLetivo = String(turmaSelecionada.anoLetivo);
    const codEscola = String(turmaSelecionada.unidadeEscolar);
    obterCicloExistente(anoLetivo, codEscola, ciclo || cicloSelecionado);
  }

  function salvarPlanoCiclo(navegarParaPlanejamento) {
    let idsMatrizesSaber = [];
    let idsObjetivosDesenvolvimento = [];

    if (!registroMigrado) {
      if (!listaMatrizSelecionda.length) {
        erro('Selecione uma opção ou mais em Matriz de saberes');
        return;
      }

      if (!listaODSSelecionado.length) {
        erro(
          'Selecione uma opção ou mais em Objetivos de Desenvolvimento Sustentável'
        );
        return;
      }

      idsMatrizesSaber = listaMatrizSelecionda.map(matriz => matriz.id);
      idsObjetivosDesenvolvimento = listaODSSelecionado.map(ods => ods.id);
    }

    const anoLetivo = String(turmaSelecionada.anoLetivo);
    const codEscola = String(turmaSelecionada.unidadeEscolar);

    const textoSemHtml = removerTagsHtml(textEditorRef.current.value);
    if (!textoSemHtml?.trim()) {
      erro('A descrição deve ser informada');
      return;
    }
    const params = {
      ano: anoLetivo,
      cicloId: cicloSelecionado,
      descricao: textEditorRef.current.value,
      escolaId: codEscola,
      id: planoCiclo?.id || 0,
      idsMatrizesSaber,
      idsObjetivosDesenvolvimento,
    };

    setCarregandoSalvar(true);

    api
      .post('v1/planos/ciclo', params)
      .then(() => {
        setCarregandoSalvar(false);
        sucesso('Suas informações foram salvas com sucesso.');
        if (navegarParaPlanejamento) {
          navigate('/');
        } else {
          confirmarCancelamento();
        }
      })
      .catch(e => erros(e))
      .finally(() => setCarregandoSalvar(false));
  }

  const onClickVoltar = async () => {
    if (modoEdicao) {
      const confirmado = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );
      if (confirmado) {
        salvarPlanoCiclo(true);
      } else {
        setModoEdicao(false);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  async function onClickCancelar() {
    const confirmou = await confirmar(
      'Atenção',
      'Você não salvou as informações preenchidas.',
      'Deseja realmente cancelar as alterações?'
    );
    if (confirmou) {
      confirmarCancelamento();
    }
  }

  async function validaTrocaCiclo(value) {
    if (modoEdicao) {
      setCicloParaTrocar(value);
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );
      if (confirmou) {
        salvarPlanoCiclo(false);
      } else {
        trocaCiclo(value);
      }
      setEventoTrocarCiclo(true);
    } else {
      trocaCiclo(value);
    }
  }

  const podeAlterar = permissoesTela[tipoPermissao.podeAlterar];

  const desabilitaCamposEdicao = () => {
    if (podeAlterar) return !modoEdicao;
    return true;
  };

  const desabilitarTipoCiclo =
    somenteConsulta || !podeAlterar ? true : listaCiclos?.length < 2;

  return (
    <>
      {!turmaSelecionada.turma &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'plano-ciclo-selecione-turma',
            mensagem: 'Você precisa escolher uma turma.',
            estiloTitulo: { fontSize: '18px' },
          }}
        />
      ) : (
        <></>
      )}
      <AlertaModalidadeInfantil />
      <Cabecalho
        pagina={obterDescricaoNomeMenu(
          ROUTES.PLANO_CICLO,
          modalidadesFiltroPrincipal,
          turmaSelecionada
        )}
      >
        <>
          <BotaoVoltarPadrao className="mr-2" onClick={() => onClickVoltar()} />
          <Button
            id={SGP_BUTTON_CANCELAR}
            label="Cancelar"
            color={Colors.Roxo}
            border
            bold
            className="mr-2"
            onClick={onClickCancelar}
            disabled={desabilitaCamposEdicao()}
          />
          <Loader loading={carregandoSalvar} tip="">
            <Button
              id={SGP_BUTTON_SALVAR}
              label={inseridoAlterado?.criadoEm ? 'Alterar' : 'Salvar'}
              color={Colors.Roxo}
              border
              bold
              onClick={() => salvarPlanoCiclo(false)}
              disabled={
                ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ||
                !podeAlterar ||
                somenteConsulta ||
                (inseridoAlterado?.criadoEm && !modoEdicao) ||
                !cicloSelecionado
              }
            />
          </Loader>
        </>
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <ContainerCampoTipoCiclo className="row mb-3 align-items-center">
            <div className="col-sm-12 col-md-8">
              <div className="row">
                <div className="col-md-6">
                  <Loader
                    loading={turmaSelecionada.turma && carregandoCiclos}
                    tip=""
                  >
                    <SelectComponent
                      name="tipo-ciclo"
                      id="tipo-ciclo"
                      placeHolder="Selecione um tipo de ciclo"
                      lista={listaCiclos}
                      disabled={desabilitarTipoCiclo}
                      valueOption="id"
                      valueText="descricao"
                      onChange={validaTrocaCiclo}
                      valueSelect={cicloSelecionado}
                    />
                  </Loader>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 pt-2 pb-2 d-flex justify-content-end">
              {registroMigrado ? (
                <RegistroMigrado>Registro Migrado</RegistroMigrado>
              ) : (
                <></>
              )}
            </div>
          </ContainerCampoTipoCiclo>
          {usuario && turmaSelecionada.turma && !ehModalidadeInfantil && (
            <Loader loading={carregando}>
              <div className="row mb-3">
                <div className="col-md-6">
                  Este é um espaço para construção coletiva. Considere os
                  diversos ritmos de aprendizagem para planejar e traçar o
                  percurso de cada
                  {modalidadeEja ? ' etapa' : ' ciclo'}.
                </div>
                <div className="col-md-6">
                  Considerando as especificações de cada
                  {modalidadeEja ? ' etapa ' : ' ciclo '} desta unidade escolar
                  e o currículo da cidade, <b>selecione</b> os itens da matriz
                  do saber e dos objetivos de desenvolvimento e sustentabilidade
                  que contemplam as propostas que planejaram:
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <JoditEditor
                    ref={textEditorRef}
                    iframeStyle={IframeStyle}
                    id="textEditor"
                    height="620px"
                    value={descricaoCiclo}
                    desabilitar={somenteConsulta}
                    onChange={onChangeTextEditor}
                    mensagemErro="Campo obrigatório"
                    validarSeTemErro={valor => !valor}
                  />
                  <InseridoAlterado>
                    {inseridoAlterado.criadoPor && inseridoAlterado.criadoEm ? (
                      <p className="pt-2">
                        INSERIDO por {inseridoAlterado.criadoPor} &#40;
                        {inseridoAlterado.criadoRf}&#41; em
                        {inseridoAlterado.criadoEm}
                      </p>
                    ) : (
                      ''
                    )}

                    {inseridoAlterado.alteradoPor &&
                    inseridoAlterado.alteradoEm ? (
                      <p>
                        ALTERADO por {inseridoAlterado.alteradoPor} &#40;
                        {inseridoAlterado.alteradoRf}&#41; em
                        {inseridoAlterado.alteradoEm}
                      </p>
                    ) : (
                      ''
                    )}
                  </InseridoAlterado>
                </div>
                <div className="col-md-6 btn-link-plano-ciclo">
                  <div className="col-md-12">
                    <div className="row mb-3">
                      <BtnLink
                        onClick={() => irParaLinkExterno(urlMatrizSaberes)}
                      >
                        Matriz de saberes
                        <i className="fas fa-share" />
                      </BtnLink>
                    </div>

                    <div className="row">
                      <ListaItens
                        className={
                          registroMigrado || somenteConsulta
                            ? 'desabilitar-elemento'
                            : ''
                        }
                      >
                        <ul>
                          {listaMatriz.map(item => {
                            return (
                              <li key={item.id} className="row">
                                <div className="col-md-12">
                                  <div className="row aling-center">
                                    <div className="col-md-2">
                                      <Badge
                                        id={`matriz-${item.id}`}
                                        className="btn-li-item btn-li-item-matriz"
                                        opcao-selecionada={
                                          validaMatrizSelecionada
                                        }
                                        onClick={e => addRemoverMatriz(e, item)}
                                      >
                                        {item.id}
                                      </Badge>
                                    </div>

                                    <div className="col-md-10 pl-3">
                                      {item.descricao}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </ListaItens>
                    </div>

                    <hr className="row mb-3 mt-3" />

                    <div className="row mb-3">
                      <BtnLink onClick={() => irParaLinkExterno(urlODS)}>
                        Objetivos de Desenvolvimento Sustentável
                        <i className="fas fa-share" />
                      </BtnLink>
                    </div>
                    <div className="row">
                      <ListaItens
                        className={
                          registroMigrado || somenteConsulta
                            ? 'desabilitar-elemento'
                            : ''
                        }
                      >
                        <ul>
                          {listaODS.map(item => {
                            return (
                              <li key={item.id} className="row">
                                <div className="col-md-12">
                                  <div className="row aling-center">
                                    <div className="col-md-2">
                                      <Badge
                                        id={`ods-${item.id}`}
                                        className="btn-li-item btn-li-item-ods"
                                        opcao-selecionada={validaODSSelecionado}
                                        onClick={e => addRemoverODS(e, item)}
                                      >
                                        {item.id}
                                      </Badge>
                                    </div>

                                    <div className="col-md-10 pl-3">
                                      {item.descricao}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </ListaItens>
                    </div>
                  </div>
                </div>
              </div>
            </Loader>
          )}
        </div>
      </Card>
    </>
  );
}
