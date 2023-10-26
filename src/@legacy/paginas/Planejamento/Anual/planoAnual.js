import { ROUTES } from '@/core/enum/routes';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '~/componentes';
import AlertaNaoPermiteTurmaInfantil from '~/componentes-sgp/AlertaNaoPermiteTurmaInfantil/alertaNaoPermiteTurmaInfantil';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Alert from '~/componentes/alert';
import {
  limparDadosPlanoAnual,
  setComponenteCurricularPlanoAnual,
  setPlanoAnualSomenteConsulta,
} from '~/redux/modulos/anual/actions';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import {
  obterDescricaoNomeMenu,
  verificaSomenteConsulta,
} from '~/servicos/servico-navegacao';
import BotoesAcoesPlanoAnual from './DadosPlanoAnual/BotoesAcoes/botoesAcoesPlanoAnual';
import ComponenteCurricularPlanoAnual from './DadosPlanoAnual/ComponenteCurricular/componenteCurricularPlanoAnual';
import LoaderPlanoAnual from './DadosPlanoAnual/LoaderPlanoAnual/loaderPlanoAnual';
import MarcadorMigrado from './DadosPlanoAnual/MarcadorMigrado/MarcadorMigrado';
import ModalCopiarConteudoPlanoAnual from './DadosPlanoAnual/ModalCopiarConteudoPlanoAnual/modalCopiarConteudoPlanoAnual';
import ModalErrosPlanoAnual from './DadosPlanoAnual/ModalErros/ModalErrosPlanoAnual';
import DadosPlanoAnual from './DadosPlanoAnual/dadosPlanoAnual';
import { ContainerColumnReverse, ContainerPlanoAnual } from './planoAnual.css';

const PlanoAnual = () => {
  const dispatch = useDispatch();

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const permissoesTela = usuario.permissoes[ROUTES.PLANO_ANUAL];

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const [turmaInfantil, setTurmaInfantil] = useState(false);

  useEffect(() => {
    const naoSetarSomenteConsultaNoStore = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );

    const soConsulta = verificaSomenteConsulta(
      permissoesTela,
      naoSetarSomenteConsultaNoStore
    );
    dispatch(setPlanoAnualSomenteConsulta(soConsulta));
  }, [permissoesTela, modalidadesFiltroPrincipal, turmaSelecionada, dispatch]);

  const resetarInfomacoes = useCallback(() => {
    dispatch(limparDadosPlanoAnual());
  }, [dispatch]);

  const resetarComponenteCurricular = useCallback(() => {
    dispatch(setComponenteCurricularPlanoAnual(undefined));
  }, [dispatch]);

  useEffect(() => {
    resetarInfomacoes();
    return () => {
      // Quando sair da tela vai executar para limpar os dados no redux!
      resetarInfomacoes();
      resetarComponenteCurricular();
    };
  }, [turmaSelecionada, resetarInfomacoes, resetarComponenteCurricular]);

  useEffect(() => {
    const infantil = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    setTurmaInfantil(infantil);
  }, [modalidadesFiltroPrincipal, turmaSelecionada]);

  useEffect(() => {
    if (turmaInfantil) {
      resetarInfomacoes();
    }
  }, [turmaInfantil, resetarInfomacoes]);

  return (
    <LoaderPlanoAnual>
      {!turmaSelecionada.turma && !turmaInfantil ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'plano-anual-selecione-turma',
            mensagem: 'Você precisa escolher uma turma.',
            estiloTitulo: { fontSize: '18px' },
          }}
        />
      ) : null}
      <AlertaNaoPermiteTurmaInfantil />
      <ModalErrosPlanoAnual />
      <ModalCopiarConteudoPlanoAnual />
      <ContainerPlanoAnual>
        <Cabecalho
          pagina={obterDescricaoNomeMenu(
            ROUTES.PLANO_ANUAL,
            modalidadesFiltroPrincipal,
            turmaSelecionada
          )}
        >
          <BotoesAcoesPlanoAnual />
        </Cabecalho>
        <Card>
          <div className="col-md-12">
            <ContainerColumnReverse className="row">
              <div className="col-sm-12 col-md-8 col-lg-6 col-xl-4 mb-2">
                <ComponenteCurricularPlanoAnual />
              </div>
              <div className="col-sm-12 col-md-4 col-lg-6 col-xl-8 pt-2 pb-2 d-flex justify-content-end">
                <MarcadorMigrado />
              </div>
            </ContainerColumnReverse>
          </div>
          <div className="col-md-12">
            {!turmaInfantil && turmaSelecionada && turmaSelecionada.turma ? (
              <DadosPlanoAnual />
            ) : (
              ''
            )}
          </div>
        </Card>
      </ContainerPlanoAnual>
    </LoaderPlanoAnual>
  );
};

export default PlanoAnual;
