import { ROUTES } from '@/core/enum/routes';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AlertaPermiteSomenteTurmaInfantil from '~/componentes-sgp/AlertaPermiteSomenteTurmaInfantil/alertaPermiteSomenteTurmaInfantil';
import ServicoObservacoesUsuario from '~/componentes-sgp/ObservacoesUsuario/ServicoObservacoesUsuario';
import ObservacoesUsuario from '~/componentes-sgp/ObservacoesUsuario/observacoesUsuario';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Alert from '~/componentes/alert';
import Card from '~/componentes/card';
import Loader from '~/componentes/loader';
import SelectComponent from '~/componentes/select';
import {
  limparDadosCartaIntencoes,
  setCarregandoCartaIntencoes,
  setDadosCartaIntencoes,
} from '~/redux/modulos/cartaIntencoes/actions';
import {
  limparDadosObservacoesUsuario,
  setDadosObservacoesUsuario,
} from '~/redux/modulos/observacoesUsuario/actions';
import ServicoCartaIntencoes from '~/servicos/Paginas/CartaIntencoes/ServicoCartaIntencoes';
import servicoDisciplinas from '~/servicos/Paginas/ServicoDisciplina';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import { confirmar, erros, sucesso } from '~/servicos/alertas';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import BotoesAcoesCartaIntencoes from './DadosCartaIntencoes/BotoesAcoes/botoesAcoesCartaIntencoes';
import ModalErrosCartaIntencoes from './DadosCartaIntencoes/ModalErros/ModalErrosCartaIntencoes';
import DadosCartaIntencoes from './DadosCartaIntencoes/dadosCartaIntencoes';
import LoaderCartaIntencoes from './LoaderCartaIntencoes/laderCartaIntencoes';
import { Container } from './cartaIntencoes.css';
import servicoSalvarCartaIntencoes from './servicoSalvarCartaIntencoes';

const CartaIntencoes = () => {
  const dispatch = useDispatch();

  const [carregandoComponentes, setCarregandoComponentes] = useState(false);
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { turma } = turmaSelecionada;
  const turmaId = turmaSelecionada?.id || 0;
  const permissoesTela = usuario.permissoes[ROUTES.CARTA_INTENCOES];

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const [listaComponenteCurricular, setListaComponenteCurricular] = useState(
    []
  );
  const [componenteCurricular, setComponenteCurricular] = useState(undefined);
  const [somenteConsulta, setSomenteConsulta] = useState(false);
  const [exibirObservacoes, setExibirObservacoes] = useState(false);

  useEffect(() => {
    const naoSetarSomenteConsultaNoStore = !ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );

    const soConsulta = verificaSomenteConsulta(
      permissoesTela,
      naoSetarSomenteConsultaNoStore
    );
    setSomenteConsulta(soConsulta);
  }, [permissoesTela, modalidadesFiltroPrincipal, turmaSelecionada]);

  const resetarInfomacoes = useCallback(() => {
    dispatch(limparDadosCartaIntencoes());
  }, [dispatch]);

  const mostrarLoader = useCallback(
    mostrar => {
      dispatch(setCarregandoCartaIntencoes(mostrar));
    },
    [dispatch]
  );

  const obterUsuariosNotificar = async () => {
    return ServicoCartaIntencoes.obterNotificarUsuarios({
      turmaId,
      componenteCurricular,
    }).catch(e => erros(e));
  };

  const obterDadosObservacoes = useCallback(
    async (turmaCodigo, componenteCurricularId) => {
      dispatch(limparDadosObservacoesUsuario());
      mostrarLoader(true);
      const retorno = await ServicoCartaIntencoes.obterDadosObservacoes(
        turmaCodigo,
        componenteCurricularId
      ).catch(e => {
        erros(e);
        mostrarLoader(false);
      });

      if (retorno && retorno.data) {
        dispatch(setDadosObservacoesUsuario([...retorno.data]));
      } else {
        dispatch(setDadosObservacoesUsuario([]));
      }

      mostrarLoader(false);
    },

    [dispatch]
  );

  const obterListaBimestres = useCallback(async () => {
    if (turma) {
      mostrarLoader(true);
      const retorno = await ServicoCartaIntencoes.obterBimestres(
        turma,
        componenteCurricular
      ).catch(e => erros(e));

      if (retorno && retorno.data && retorno.data.length) {
        const exibir = retorno.data.find(
          item => item.auditoria && item.auditoria.id
        );
        if (exibir) {
          setExibirObservacoes(true);
          obterDadosObservacoes(turma, componenteCurricular);
        }
        dispatch(setDadosCartaIntencoes(retorno.data));
      } else {
        resetarInfomacoes();
        setExibirObservacoes(false);
      }
      mostrarLoader(false);
    }
  }, [
    dispatch,
    turma,
    resetarInfomacoes,
    componenteCurricular,
    mostrarLoader,
    obterDadosObservacoes,
  ]);

  const obterListaComponenteCurricular = useCallback(async () => {
    setCarregandoComponentes(true);
    const resposta = await servicoDisciplinas
      .obterDisciplinasPorTurma(turma)
      .catch(e => erros(e))
      .finally(() => setCarregandoComponentes(false));

    if (resposta && resposta.data) {
      setListaComponenteCurricular(resposta.data);
      if (resposta.data.length === 1) {
        const disciplina = resposta.data[0];
        setComponenteCurricular(String(disciplina.codigoComponenteCurricular));
      }
    } else {
      setListaComponenteCurricular([]);
      setComponenteCurricular(undefined);
    }
  }, [turma]);

  useEffect(() => {
    dispatch(setDadosObservacoesUsuario([]));
    setExibirObservacoes(false);
  }, [turma, dispatch]);

  useEffect(() => {
    resetarInfomacoes();
    if (
      turma &&
      ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada)
    ) {
      obterListaComponenteCurricular();
    } else {
      setComponenteCurricular(undefined);
      setListaComponenteCurricular([]);
    }
  }, [
    turma,
    resetarInfomacoes,
    obterListaComponenteCurricular,
    turmaSelecionada,
    modalidadesFiltroPrincipal,
  ]);

  useEffect(() => {
    if (
      componenteCurricular &&
      ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada)
    ) {
      obterListaBimestres(componenteCurricular);
    } else {
      resetarInfomacoes();
    }
  }, [
    componenteCurricular,
    obterListaBimestres,
    resetarInfomacoes,
    modalidadesFiltroPrincipal,
    turmaSelecionada,
  ]);

  const onChangeSemestreComponenteCurricular = async valor => {
    const continuar =
      await servicoSalvarCartaIntencoes.perguntaDescartarRegistros();

    if (continuar) {
      setComponenteCurricular(valor);
    }
  };

  const recaregarDados = () => {
    obterListaBimestres(componenteCurricular);
  };

  const salvarEditarObservacao = async obs => {
    mostrarLoader(true);
    return ServicoCartaIntencoes.salvarEditarObservacao(
      obs,
      turma,
      componenteCurricular
    )
      .then(resultado => {
        if (resultado && resultado.status === 200) {
          const msg = `Observação ${
            obs.id ? 'alterada' : 'inserida'
          } com sucesso.`;
          sucesso(msg);
        }
        mostrarLoader(false);

        ServicoObservacoesUsuario.atualizarSalvarEditarDadosObservacao(
          obs,
          resultado.data
        );
        return resultado;
      })
      .catch(e => {
        erros(e);
        mostrarLoader(false);
        return e;
      });
  };

  const excluirObservacao = async obs => {
    const confirmado = await confirmar(
      'Excluir',
      '',
      'Você tem certeza que deseja excluir este registro?'
    );

    if (confirmado) {
      mostrarLoader(true);
      const resultado = await ServicoCartaIntencoes.excluirObservacao(
        obs
      ).catch(e => {
        erros(e);
        mostrarLoader(false);
      });
      if (resultado && resultado.status === 200) {
        sucesso('Registro excluído com sucesso');
        ServicoObservacoesUsuario.atualizarExcluirDadosObservacao(
          obs,
          resultado.data
        );
      }
      mostrarLoader(false);
    }
  };

  return (
    <Container>
      {!turmaSelecionada.turma ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'alerta-sem-turma-relatorio-semestral',
            mensagem: 'Você precisa escolher uma turma.',
            estiloTitulo: { fontSize: '18px' },
          }}
        />
      ) : (
        <></>
      )}
      {turmaSelecionada.turma ? <AlertaPermiteSomenteTurmaInfantil /> : ''}
      <ModalErrosCartaIntencoes />
      <LoaderCartaIntencoes>
        <Cabecalho pagina="Carta de Intenções">
          <BotoesAcoesCartaIntencoes
            onClickCancelar={recaregarDados}
            onClickSalvar={recaregarDados}
            componenteCurricularId={componenteCurricular}
            codigoTurma={turma}
            ehTurmaInfantil={ehTurmaInfantil(
              modalidadesFiltroPrincipal,
              turmaSelecionada
            )}
            somenteConsulta={somenteConsulta}
            salvarEditarObservacao={salvarEditarObservacao}
          />
        </Cabecalho>
        <Card>
          <div className="col-md-12">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6 col-xl-4 mb-2">
                <Loader loading={carregandoComponentes} tip="">
                  <SelectComponent
                    id="componente-curricular"
                    lista={listaComponenteCurricular || []}
                    valueOption="codigoComponenteCurricular"
                    valueText="nome"
                    valueSelect={componenteCurricular}
                    onChange={onChangeSemestreComponenteCurricular}
                    placeholder="Selecione um componente curricular"
                    disabled={
                      !ehTurmaInfantil(
                        modalidadesFiltroPrincipal,
                        turmaSelecionada
                      ) ||
                      (listaComponenteCurricular &&
                        listaComponenteCurricular.length === 1)
                    }
                  />
                </Loader>
              </div>
              {componenteCurricular &&
              ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ? (
                <div className="col-md-12">
                  <DadosCartaIntencoes
                    permissoesTela={permissoesTela}
                    somenteConsulta={somenteConsulta}
                  />
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
          {turmaSelecionada.turma &&
          componenteCurricular &&
          exibirObservacoes ? (
            <ObservacoesUsuario
              verificaProprietario
              mostrarListaNotificacao
              dreId={turmaSelecionada.dre}
              carregarListaUsuariosNotificar={true}
              ueId={turmaSelecionada.unidadeEscolar}
              excluirObservacao={obs => excluirObservacao(obs)}
              salvarObservacao={obs => salvarEditarObservacao(obs)}
              editarObservacao={obs => salvarEditarObservacao(obs)}
              obterUsuariosNotificar={() => obterUsuariosNotificar()}
            />
          ) : (
            ''
          )}
        </Card>
      </LoaderCartaIntencoes>
    </Container>
  );
};

export default CartaIntencoes;
