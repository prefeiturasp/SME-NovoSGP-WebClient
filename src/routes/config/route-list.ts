import { setRotas } from '~/redux/modulos/navegacao/actions';
import Principal from '~/paginas/Principal/principal';
import PlanoCiclo from '~/paginas/Planejamento/PlanoCiclo/planoCiclo';
import PlanoAnual from '~/paginas/Planejamento/Anual/planoAnual';
import AtribuicaoSupervisorLista from '~/paginas/Gestao/AtribuicaoSupervisor/atribuicaoSupervisorLista';
import AtribuicaoResponsaveisCadastro from '~/paginas/Gestao/AtribuicaoSupervisor/atribuicaoResponsaveisCadastro';
import AtribuicaoEsporadicaLista from '~/paginas/Gestao/AtribuicaoEsporadica/Lista';
import AtribuicaoEsporadicaForm from '~/paginas/Gestao/AtribuicaoEsporadica/Form';
import AtribuicaoCJLista from '~/paginas/Gestao/AtribuicaoCJ/Lista';
import AtribuicaoCJForm from '~/paginas/Gestao/AtribuicaoCJ/Form';
import DetalheNotificacao from '~/paginas/Notificacoes/Detalhes/detalheNotificacao';
import NotificacoesLista from '~/paginas/Notificacoes/Lista/listaNotificacoes';
import RotasTipo from '~/constantes/rotasTipo';
import MeusDados from '~/paginas/Perfil/meusDados';
import PeriodosEscolares from '~/paginas/CalendarioEscolar/PeriodosEscolares/PeriodosEscolares';
import TabsReiniciarSenha from '~/paginas/Configuracoes/Usuarios/TabsReiniciarSenha';
import TipoCalendarioEscolarLista from '~/paginas/CalendarioEscolar/TipoCalendarioEscolar/tipoCalendarioEscolarLista';
import TipoCalendarioEscolarForm from '~/paginas/CalendarioEscolar/TipoCalendarioEscolar/tipoCalendarioEscolarForm';
import TipoFeriadoLista from '~/paginas/CalendarioEscolar/TipoFeriado/tipoFeriadoLista';
import TipoFeriadoForm from '~/paginas/CalendarioEscolar/TipoFeriado/tipoFeriadoForm';
import CalendarioEscolar from '~/paginas/CalendarioEscolar/Calendario';
import TipoEventosLista from '~/paginas/CalendarioEscolar/TipoEventos/tipoEventosLista';
import TipoEventosForm from '~/paginas/CalendarioEscolar/TipoEventos/tipoEventosForm';
import SemPermissao from '~/paginas/SemPermissao/sem-permissao';
import CadastroAula from '~/paginas/CalendarioProfessor/CadastroAula/cadastroAula';
import FrequenciaPlanoAula from '~/paginas/DiarioClasse/FrequenciaPlanoAula/frequenciaPlanoAula';
import AvaliacaoForm from '~/paginas/CalendarioEscolar/Avaliacao/avaliacaoForm';
import Notas from '~/paginas/DiarioClasse/Notas/notas';
import TipoAvaliacaoLista from '~/paginas/Configuracoes/TipoAvaliacao/tipoAvaliacaoLista';
import TipoAvaliacaoForm from '~/paginas/Configuracoes/TipoAvaliacao/tipoAvaliacaoForm';
import AulaDadaAulaPrevista from '~/paginas/DiarioClasse/AulaDadaAulaPrevista/aulaDadaAulaPrevista';
import RegistroPOALista from '~/paginas/DiarioClasse/RegistroPOA/Lista';
import RegistroPOAForm from '~/paginas/DiarioClasse/RegistroPOA/Form';
import CompensacaoAusenciaLista from '~/paginas/DiarioClasse/CompensacaoAusencia/compensacaoAusenciaLista';
import CompensacaoAusenciaForm from '~/paginas/DiarioClasse/CompensacaoAusencia/compensacaoAusenciaForm';
import FechamentoBismestre from '~/paginas/Fechamento/FechamentoBimestre/fechamento-bimestre';
import PeriodoFechamentoAbertura from '~/paginas/CalendarioEscolar/PeriodoFechamentoAbertura/periodo-fechamento-abertura';
import ResumosGraficosPAP from '~/paginas/Relatorios/PAP/ResumosGraficos';
import PaginaComErro from '~/paginas/Erro/pagina-com-erro';
import FechaReabLista from '~/paginas/CalendarioEscolar/PeriodoFechamentoReabertura/lista/fechaReabLista';
import FechaReabCadastro from '~/paginas/CalendarioEscolar/PeriodoFechamentoReabertura/cadastro/fechaReabCadastro';
import RelatorioPAPAcompanhamento from '~/paginas/Relatorios/PAP/Acompanhamento';
import PendenciasFechamentoLista from '~/paginas/Fechamento/PendenciasFechamento/pendenciasFechamentoLista';
import PendenciasFechamentoForm from '~/paginas/Fechamento/PendenciasFechamento/pendenciasFechamentoForm';
import ComunicadosCadastro from '~/paginas/Gestao/Comunicados/Cadastro/cadastroComunicados';
import ComunicadosLista from '~/paginas/Gestao/Comunicados/Lista/listaComunicados';
import ConselhoClasse from '~/paginas/Fechamento/ConselhoClasse/conselhoClasse';
import RelatorioSemestral from '~/paginas/Relatorios/PAP/RelatorioSemestral/relatorioSemestral';
import CalendarioProfessor from '~/paginas/CalendarioEscolar/CalendarioProfessor';
import TerritorioSaber from '~/paginas/Planejamento/TerritorioSaber';
import HistoricoEscolar from '~/paginas/Relatorios/HistoricoEscolar/historicoEscolar';
import AtaFinalResultados from '~/paginas/Relatorios/Atas/AtaFinalResultados/ataFinalResultados';
import BoletimSimples from '~/paginas/Relatorios/DiarioClasse/BoletimSimples';
import RelatorioFrequencia from '~/paginas/Relatorios/Frequencia/relatorioFrequencia';
import ListaDiarioBordo from '~/paginas/DiarioClasse/DiarioBordo/listaDiarioBordo';
import DiarioBordo from '~/paginas/DiarioClasse/DiarioBordo/diarioBordo';
import RelatorioPendencias from '~/paginas/Relatorios/Pendencias/relatorioPendencias';
import CartaIntencoes from '~/paginas/Planejamento/CartaIntencoes/cartaIntencoes';
import RelatorioParecerConclusivo from '~/paginas/Relatorios/ParecerConclusivo/relatorioParecerConclusivo';
import DevolutivasLista from '~/paginas/DiarioClasse/Devolutivas/devolutivasLista';
import RegistroIndividual from '~/paginas/DiarioClasse/RegistroIndividual/registroIndividual';
import DevolutivasForm from '~/paginas/DiarioClasse/Devolutivas/devolutivasForm';
import RelatorioNotasConceitosFinais from '~/paginas/Relatorios/NotasConceitosFinais/relatorioNotasConceitosFinais';
import RelatorioCompensacaoAusencia from '~/paginas/Relatorios/CompensacaoAusencia/relatorioCompensacaoAusencia';
import DashboardEscolaAqui from '~/paginas/Dashboard/DashboardEscolaAqui/dashboardEscolaAqui';
import ControleGrade from '~/paginas/Relatorios/DiarioClasse/ControleGrade/controleGrade';
import Sondagem from '~/paginas/Sondagem/sondagem';
import HistoricoNotificacoes from '~/paginas/Relatorios/Notificacoes/HistoricoNotificacoes/historicoNotificacoes';
import RelatorioUsuarios from '~/paginas/Relatorios/Gestao/Usuarios/relatorioUsuarios';
import AtribuicaoCJ from '~/paginas/Relatorios/Gestao/AtribuicaoCJ/atribuicaoCJ';
import RelatorioHistoricoAlteracoesNotas from '~/paginas/Relatorios/Fechamento/HistoricoAlteracoesNotas/relatorioHistoricoAlteracoesNotas';
import relatorioEscolaAquiAdesao from '~/paginas/Relatorios/EscolaAqui/Adesao/relatorioEscolaAquiAdesao';
import RelatorioLeitura from '~/paginas/Relatorios/EscolaAqui/Leitura/relatorioLeitura';
import ListaOcorrencias from '~/paginas/Gestao/Ocorrencia/lista/listaOcorrencias';
import CadastroOcorrencias from '~/paginas/Gestao/Ocorrencia/CadastroOcorrencias';
import RelatorioPlanejamentoDiario from '~/paginas/Relatorios/DiarioClasse/PlanejamentoDiario/relatorioPlanejamentoDiario';
import EncaminhamentoAEELista from '~/paginas/AEE/Encaminhamento/Lista/encaminhamentoAEELista';
import EncaminhamentoAEECadastro from '~/paginas/AEE/Encaminhamento/Cadastro/encaminhamentoAEECadastro';
import RegistroItineranciaAEECadastro from '~/paginas/AEE/RegistroItinerancia/Cadastro/registroItineranciaAEECadastro';
import AcompanhamentoFrequencia from '~/paginas/DiarioClasse/AcompanhamentoFrequencia/acompanhamentoFrequencia';
import PlanoAEELista from '~/paginas/AEE/Plano/Lista/planoAEELista';
import PlanoAEECadastro from '~/paginas/AEE/Plano/Cadastro/planoAEECadastro';
import RegistroItineranciaAEELista from '~/paginas/AEE/RegistroItinerancia/Lista/registroItineranciaAEELista';
import AcompanhamentoAprendizagem from '~/paginas/Fechamento/AcompanhamentoAprendizagem/acompanhamentoAprendizagem';
import RelatorioDevolutivas from '~/paginas/Relatorios/Planejamento/Devolutivas/relatorioDevolutivas';
import DashboardAEE from '~/paginas/Dashboard/AEE/dashboardAEE';
import DashboardRegistroItinerancia from '~/paginas/Dashboard/DashboardRegistroItinerancia/dashboardRegistroItinerancia';
import AcompanhamentoFechamento from '~/paginas/Fechamento/AcompanhamentoFechamento/acompanhamentoFechamento';
import DashboardFrequencia from '~/paginas/Dashboard/DashboardFrequencia/dashboardFrequencia';
import DashboardDevolutivas from '~/paginas/Dashboard/DashboardDevolutivas/dashboardDevolutivas';
import DashboardInformacoesEscolares from '~/paginas/Dashboard/DashboardInformacoesEscolares/dashboardInformacoesEscolares';
import DashboardRegistroIndividual from '~/paginas/Dashboard/DashboardRegistroIndividual/dashboardRegistroIndividual';
import DashboardDiarioBordo from '~/paginas/Dashboard/DashboardDiarioBordo/dashboardDiarioBordo';
import RelatorioAcompanhamentoFechamento from '~/paginas/Relatorios/Fechamento/AcompanhamentoFechamento/relatorioAcompanhamentoFechamento';
import DashboardRelAcompanhamentoAprendizagem from '~/paginas/Dashboard/DashboardRelAcompAprend/dashboardRelAcompAprend';
import DashboardFechamento from '~/paginas/Dashboard/DashboardFechamento/dashboardFechamento';
import RelatorioAtaBimestral from '~/paginas/Relatorios/Atas/AtaBimestral/relatorioAtaBimestral';
import EventosLista from '~/paginas/CalendarioEscolar/Eventos/lista/eventosLista';
import EventosCadastro from '~/paginas/CalendarioEscolar/Eventos/cadastro/eventosCadastro';
import RelatorioAcompanhamentoRegistros from '~/paginas/Relatorios/Gestao/AcompanhamentoRegistros/acompanhamentoRegistros';
import RelatorioFrequenciaMensal from '~/paginas/Relatorios/Frequencia/relatorioFrequenciaMensal';
import DashboardNAAPA from '~/paginas/Dashboard/DashboardNAAPA/dashboardNAAPA';
import Suporte from '~/paginas/Configuracoes/Usuarios/Suporte/suporte';
import ListaEncaminhamentoNAAPA from '~/paginas/NAAPA/Encaminhamento/Lista/listaEncaminhamentoNAAPA';
import CadastroEncaminhamentoNAAPA from '~/paginas/NAAPA/Encaminhamento/Cadastro/encaminhamentoNAAPA';
import RelatorioPlanoAEE from '~/paginas/Relatorios/AEE/plano/relatorioPlanoAEE';
import DocPlanosTrabalhoLista from '~/paginas/Gestao/DocumentosPlanosTrabalho/lista/docPlanosTrabalhoLista';
import DocPlanosTrabalhoCadastro from '~/paginas/Gestao/DocumentosPlanosTrabalho/cadastro/docPlanosTrabalhoCadastro';
import RelatorioEncaminhamentoAEE from '~/paginas/Relatorios/AEE/encaminhamento/relatorioEncaminhamentoAEE';
import { store } from 'core/redux';
import { ROUTES } from 'core/enum/routes';
import Login from '~/paginas/Login';
import ListaoPrincipal from '~/paginas/DiarioClasse/Listao';
import RelatorioEncaminhamentonNAAPA from '~/paginas/Relatorios/NAAPA/encaminhamento/relatorioEncaminhamentoNAAPA';
import RelatorioSondagemAnalitico from '~/paginas/Relatorios/Sondagem/relatorioSondagem';
import RelatorioRegistroItinerancia from '~/paginas/Relatorios/AEE/registroItinerancia/relatorioRegistroItinerancia';
import RelatorioControleFrequenciaMensal from '~/paginas/Relatorios/Frequencia/RelatorioControleFrequenciaMensal/relatorioControleFrequenciaMensal';
import RelatorioPAP from '@/@legacy/paginas/Relatorios/PAP/RelatorioPAP/relatorioPAP';

export interface RouteProps {
  path: string;
  breadcrumbName: string[];
  menu: string[];
  parent: string;
  component: () => JSX.Element;
  exact: boolean;
  tipo: number;
  temPermissionamento: boolean;
  chavePermissao: string;
}

const route = new Map();
const routesArray: RouteProps[] = [];

route.set(ROUTES.LOGIN, {
  breadcrumbName: [],
  menu: [],
  parent: '',
  component: Login,
  temPermissionamento: false,
  chavePermissao: '',
});

route.set(ROUTES.RELATORIO_BOLETIM_SIMPLES, {
  breadcrumbName: ['Boletim'],
  menu: ['Fechamento'],
  parent: '/',
  component: BoletimSimples,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_BOLETIM_SIMPLES,
});

route.set(ROUTES.ACOMPANHAMENTO_COMUNICADOS, {
  breadcrumbName: 'Comunicados',
  menu: ['Gestão'],
  parent: '/',
  component: ComunicadosLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ACOMPANHAMENTO_COMUNICADOS,
});

route.set(`${ROUTES.ACOMPANHAMENTO_COMUNICADOS}/novo`, {
  menu: ['Gestão'],
  parent: ROUTES.ACOMPANHAMENTO_COMUNICADOS,
  component: ComunicadosCadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ACOMPANHAMENTO_COMUNICADOS,
});

route.set(`${ROUTES.ACOMPANHAMENTO_COMUNICADOS}/editar/:id`, {
  breadcrumbName: 'Cadastro de comunicados',
  menu: ['Gestão'],
  parent: ROUTES.ACOMPANHAMENTO_COMUNICADOS,
  component: ComunicadosCadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ACOMPANHAMENTO_COMUNICADOS,
});

route.set(`${ROUTES.PAP}`, {
  breadcrumbName: 'Resumos e Gráficos PAP',
  menu: ['Relatórios', 'PAP'],
  parent: '/',
  component: ResumosGraficosPAP,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.PAP,
});

route.set(ROUTES.CALENDARIO_ESCOLAR, {
  breadcrumbName: 'Calendário Escolar',
  parent: '/',
  component: CalendarioEscolar,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
});

route.set(ROUTES.TIPO_EVENTOS, {
  breadcrumbName: 'Tipo de Eventos',
  menu: ['Calendário Escolar'],
  parent: '/',
  component: TipoEventosLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.TIPO_EVENTOS,
});

route.set('/calendario-escolar/tipo-eventos/novo', {
  breadcrumbName: 'Cadastro de Tipo de Eventos',
  parent: '/calendario-escolar/tipo-eventos',
  component: TipoEventosForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.TIPO_EVENTOS,
});

route.set('/calendario-escolar/tipo-eventos/editar/:id', {
  breadcrumbName: 'Cadastro de Tipo de Eventos',
  parent: '/calendario-escolar/tipo-eventos',
  component: TipoEventosForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.TIPO_EVENTOS,
});

route.set(ROUTES.PLANO_CICLO, {
  breadcrumbName: 'Plano de Ciclo',
  menu: ['Planejamento'],
  parent: '/',
  component: PlanoCiclo,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.PLANO_CICLO,
});

route.set(ROUTES.PLANO_ANUAL, {
  breadcrumbName: 'Plano Anual',
  menu: ['Planejamento'],
  parent: '/',
  component: PlanoAnual,
  exact: false,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.PLANO_ANUAL,
});

route.set(ROUTES.TERRITORIO_SABER, {
  breadcrumbName: 'Territórios do Saber',
  menu: ['Planejamento'],
  parent: '/',
  component: TerritorioSaber,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.TERRITORIO_SABER,
});

route.set(ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA, {
  breadcrumbName: 'Atribuição de responsáveis',
  menu: ['Gestão'],
  parent: '/',
  component: AtribuicaoSupervisorLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA,
});

route.set(ROUTES.ATRIBUICAO_RESPONSAVEIS, {
  breadcrumbName: 'Nova Atribuição',
  parent: ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA,
  component: AtribuicaoResponsaveisCadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA,
});

route.set(`${ROUTES.ATRIBUICAO_RESPONSAVEIS}/:dreId/`, {
  breadcrumbName: 'Atribuição de responsáveis',
  parent: ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA,
  component: AtribuicaoResponsaveisCadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA,
});

route.set(`${ROUTES.ATRIBUICAO_RESPONSAVEIS}/:dreId/:supervisorId/:tipoResponsavel`, {
  breadcrumbName: 'Atribuição de responsáveis',
  parent: ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA,
  component: AtribuicaoResponsaveisCadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA,
});

route.set(`${ROUTES.ATRIBUICAO_RESPONSAVEIS}/:dreId/:supervisorId/:tipoResponsavel/:codigoUe`, {
  breadcrumbName: 'Atribuição de responsáveis',
  parent: ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA,
  component: AtribuicaoResponsaveisCadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA,
});

route.set(`${ROUTES.ATRIBUICAO_RESPONSAVEIS}/:dreId/:tipoResponsavel`, {
  breadcrumbName: 'Atribuição de responsáveis',
  parent: ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA,
  component: AtribuicaoResponsaveisCadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ATRIBUICAO_RESPONSAVEIS_LISTA,
});

route.set(`${ROUTES.ATRIBUICAO_ESPORADICA_LISTA}`, {
  breadcrumbName: 'Atribuição Esporádica',
  menu: ['Gestão'],
  parent: '/',
  component: AtribuicaoEsporadicaLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ATRIBUICAO_ESPORADICA_LISTA,
});

route.set(`${ROUTES.ATRIBUICAO_ESPORADICA_NOVO}`, {
  breadcrumbName: 'Atribuição',
  parent: '/gestao/atribuicao-esporadica',
  component: AtribuicaoEsporadicaForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ATRIBUICAO_ESPORADICA_LISTA,
});

route.set('/gestao/atribuicao-esporadica/editar/:id', {
  breadcrumbName: 'Atribuição',
  parent: '/gestao/atribuicao-esporadica',
  component: AtribuicaoEsporadicaForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ATRIBUICAO_ESPORADICA_LISTA,
});

route.set('/gestao/atribuicao-cjs', {
  breadcrumbName: 'Atribuição de CJ',
  menu: ['Gestão'],
  parent: '/',
  component: AtribuicaoCJLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ATRIBUICAO_CJ_LISTA,
});

route.set('/gestao/atribuicao-cjs/novo', {
  breadcrumbName: 'Atribuição',
  parent: '/gestao/atribuicao-cjs',
  component: AtribuicaoCJForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ATRIBUICAO_CJ_LISTA,
});

route.set('/gestao/atribuicao-cjs/editar', {
  breadcrumbName: 'Atribuição',
  parent: '/gestao/atribuicao-cjs',
  component: AtribuicaoCJForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ATRIBUICAO_CJ_LISTA,
});

route.set('/notificacoes/:id', {
  breadcrumbName: ['Notificações'],
  parent: '/',
  component: DetalheNotificacao,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.NOTIFICACOES,
});

route.set(ROUTES.NOTIFICACOES, {
  breadcrumbName: ['Notificações'],
  parent: '/',
  component: NotificacoesLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.NOTIFICACOES,
});

route.set(ROUTES.MEUS_DADOS, {
  breadcrumbName: 'Perfil',
  parent: '/',
  component: MeusDados,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.MEUS_DADOS,
});

route.set(ROUTES.PERIODOS_ESCOLARES, {
  breadcrumbName: 'Períodos Escolares',
  menu: ['Calendário Escolar'],
  parent: '/',
  component: PeriodosEscolares,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.PERIODOS_ESCOLARES,
});

route.set(ROUTES.REINICIAR_SENHA, {
  breadcrumbName: 'Reiniciar Senha',
  menu: ['Configurações', 'Usuários'],
  parent: '/',
  component: TabsReiniciarSenha,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.REINICIAR_SENHA,
});

route.set(ROUTES.SUPORTE, {
  breadcrumbName: 'Suporte',
  menu: ['Configurações', 'Usuários'],
  parent: '/',
  component: Suporte,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.SUPORTE,
});

route.set(ROUTES.TIPO_CALENDARIO_ESCOLAR, {
  breadcrumbName: 'Tipo de Calendário Escolar',
  menu: ['Calendário Escolar'],
  parent: '/',
  component: TipoCalendarioEscolarLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.TIPO_CALENDARIO_ESCOLAR,
});

route.set('/calendario-escolar/tipo-calendario-escolar/novo', {
  breadcrumbName: 'Cadastro do Tipo de Calendário Escolar',
  parent: '/calendario-escolar/tipo-calendario-escolar',
  component: TipoCalendarioEscolarForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.TIPO_CALENDARIO_ESCOLAR,
});

route.set('/calendario-escolar/tipo-calendario-escolar/editar/:id', {
  breadcrumbName: 'Cadastro do Tipo de Calendário Escolar',
  parent: '/calendario-escolar/tipo-calendario-escolar',
  component: TipoCalendarioEscolarForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.TIPO_CALENDARIO_ESCOLAR,
});

route.set(ROUTES.PRINCIPAL, {
  icone: 'fas fa-home',
  parent: null,
  component: Principal,
  exact: true,
  limpaSelecaoMenu: true,
  paginaInicial: true,
  dicaIcone: 'Página Inicial',
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
  breadcrumbName: 'Início',
});

route.set(ROUTES.TIPO_FERIADO, {
  breadcrumbName: 'Lista de Tipo de Feriado',
  menu: ['Tipo Feriado'],
  parent: '/',
  component: TipoFeriadoLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.TIPO_FERIADO,
});

route.set('/calendario-escolar/tipo-feriado/novo', {
  breadcrumbName: 'Cadastro de Tipo de Feriado',
  parent: '/calendario-escolar/tipo-feriado',
  component: TipoFeriadoForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.TIPO_FERIADO,
});

route.set('/calendario-escolar/tipo-feriado/editar/:id', {
  breadcrumbName: 'Alterar Tipo de Feriado',
  parent: '/calendario-escolar/tipo-feriado',
  component: TipoFeriadoForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.TIPO_FERIADO,
});

route.set(ROUTES.SEM_PERMISSAO, {
  breadcrumbName: 'Sem permissão',
  parent: '/',
  component: SemPermissao,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
});

route.set(ROUTES.EVENTOS, {
  breadcrumbName: 'Eventos do calendário escolar',
  menu: ['Calendário escolar'],
  parent: '/',
  component: EventosLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.EVENTOS,
});

route.set(`${ROUTES.EVENTOS}/:tipoCalendarioId`, {
  breadcrumbName: 'Eventos do calendário escolar',
  menu: ['Calendário escolar'],
  parent: '/',
  component: EventosLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.EVENTOS,
});

route.set('/calendario-escolar/eventos/novo/:tipoCalendarioId', {
  breadcrumbName: 'Cadastro de eventos do calendário escolar',
  parent: '/calendario-escolar/eventos',
  component: EventosCadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.EVENTOS,
});

route.set('/calendario-escolar/eventos/editar/:id', {
  breadcrumbName: 'Cadastro de eventos do calendário escolar',
  parent: '/calendario-escolar/eventos',
  component: EventosCadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.EVENTOS,
});

route.set('/calendario-escolar/eventos/editar/:id/:tipoCalendarioId', {
  breadcrumbName: 'Cadastro de Eventos do Calendário Escolar',
  parent: '/calendario-escolar/eventos',
  component: EventosCadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.EVENTOS,
});

route.set(ROUTES.CALENDARIO_PROFESSOR, {
  breadcrumbName: 'Calendário do Professor',
  menu: ['Calendário Escolar'],
  parent: '/',
  component: CalendarioProfessor,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.CALENDARIO_PROFESSOR,
});

route.set(ROUTES.CADASTRO_DE_AULA, {
  breadcrumbName: 'Cadastro de Aula',
  parent: '/calendario-escolar/calendario-professor',
  component: CadastroAula,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.CALENDARIO_PROFESSOR,
});

route.set(`${ROUTES.CADASTRO_DE_AULA}/novo/:tipoCalendarioId/:somenteReposicao`, {
  breadcrumbName: 'Cadastro de Aula',
  parent: ROUTES.CADASTRO_DE_AULA,
  component: CadastroAula,
  exact: false,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.CALENDARIO_PROFESSOR,
});

route.set(`${ROUTES.CADASTRO_DE_AULA}/editar/:id/:somenteReposicao`, {
  breadcrumbName: 'Cadastro de Aula',
  parent: ROUTES.CADASTRO_DE_AULA,
  component: CadastroAula,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.CALENDARIO_PROFESSOR,
});

route.set(`${ROUTES.CADASTRO_DE_AVALIACAO}/novo`, {
  breadcrumbName: 'Cadastro de Avaliação',
  parent: ROUTES.CALENDARIO_PROFESSOR,
  component: AvaliacaoForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.CALENDARIO_PROFESSOR,
});

route.set(`${ROUTES.CADASTRO_DE_AVALIACAO}/editar/:id`, {
  breadcrumbName: 'Cadastro de Avaliação',
  parent: ROUTES.CALENDARIO_PROFESSOR,
  component: AvaliacaoForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.CALENDARIO_PROFESSOR,
});

route.set(`${ROUTES.FREQUENCIA_PLANO_AULA}`, {
  breadcrumbName: 'Frequência/Plano de aula',
  menu: ['Diário de Classe'],
  parent: '/',
  component: FrequenciaPlanoAula,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.FREQUENCIA_PLANO_AULA,
});

route.set(`${ROUTES.ACOMPANHAMENTO_FREQUENCIA}`, {
  breadcrumbName: 'Acompanhamento de Frequência',
  menu: ['Diário de Classe'],
  parent: '/',
  component: AcompanhamentoFrequencia,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ACOMPANHAMENTO_FREQUENCIA,
});

route.set(`${ROUTES.NOTAS}/:disciplinaId/:bimestre`, {
  breadcrumbName: 'Notas',
  menu: ['Diário de Classe'],
  parent: '/',
  component: Notas,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.NOTAS,
});

route.set(`${ROUTES.NOTAS}`, {
  breadcrumbName: 'Notas',
  menu: ['Diário de Classe'],
  parent: '/',
  component: Notas,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.NOTAS,
});

route.set(`${ROUTES.TIPO_AVALIACAO}`, {
  breadcrumbName: 'Configurações/Tipo Avalição',
  menu: ['Configurações', 'Tipo Avaliação'],
  parent: '/',
  component: TipoAvaliacaoLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
});
route.set(`${ROUTES.TIPO_AVALIACAO}/novo`, {
  breadcrumbName: 'Configurações/Tipo Avalição Novo',
  menu: ['Configurações', 'Tipo Avaliação'],
  parent: '/',
  component: TipoAvaliacaoForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
});
route.set(`${ROUTES.TIPO_AVALIACAO}/editar/:id`, {
  breadcrumbName: 'Configurações/Tipo Avalição Novo',
  menu: ['Configurações', 'Tipo Avaliação'],
  parent: '/',
  component: TipoAvaliacaoForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
});

route.set(`${ROUTES.AULA_DADA_AULA_PREVISTA}`, {
  breadcrumbName: 'Aula prevista X Aula dada',
  menu: ['Diário de Classe'],
  parent: '/',
  component: AulaDadaAulaPrevista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
});

route.set(`${ROUTES.REGISTRO_POA}`, {
  breadcrumbName: 'Registro POA',
  menu: ['Planejamento'],
  parent: '/',
  component: RegistroPOALista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
});

route.set(`${ROUTES.REGISTRO_POA}/novo`, {
  breadcrumbName: 'Registro',
  parent: ROUTES.REGISTRO_POA,
  component: RegistroPOAForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.REGISTRO_POA,
});

route.set(`${ROUTES.REGISTRO_POA}/editar/:id`, {
  breadcrumbName: 'Registro',
  parent: ROUTES.REGISTRO_POA,
  component: RegistroPOAForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.REGISTRO_POA,
});

route.set(`${ROUTES.COMPENSACAO_AUSENCIA}`, {
  breadcrumbName: 'Compensação de Ausência',
  menu: ['Diário de Classe'],
  parent: '/',
  component: CompensacaoAusenciaLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.COMPENSACAO_AUSENCIA,
});

route.set(`${ROUTES.COMPENSACAO_AUSENCIA}/novo`, {
  breadcrumbName: 'Cadastrar Compensação de Ausência',
  parent: ROUTES.COMPENSACAO_AUSENCIA,
  component: CompensacaoAusenciaForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.COMPENSACAO_AUSENCIA,
});

route.set(`${ROUTES.COMPENSACAO_AUSENCIA}/editar/:id`, {
  breadcrumbName: 'Editar Compensação de Ausência',
  parent: ROUTES.COMPENSACAO_AUSENCIA,
  component: CompensacaoAusenciaForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.COMPENSACAO_AUSENCIA,
});

route.set(`${ROUTES.FECHAMENTO_BIMESTRE}`, {
  breadcrumbName: 'Fechamento de Bimestre',
  menu: ['Fechamento'],
  parent: '/',
  component: FechamentoBismestre,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
  chavePermissao: ROUTES.FECHAMENTO_BIMESTRE,
});

route.set(`${ROUTES.PERIODO_FECHAMENTO_ABERTURA}`, {
  breadcrumbName: 'Abertura',
  menu: ['Calendário Escolar', 'Período de Fechamento'],
  parent: '/',
  component: PeriodoFechamentoAbertura,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.PERIODO_FECHAMENTO_ABERTURA,
});

route.set(`${ROUTES.PERIODO_FECHAMENTO_REABERTURA}`, {
  breadcrumbName: 'Reabertura',
  menu: ['Calendário Escolar', 'Período de Fechamento'],
  parent: '/',
  component: FechaReabLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.PERIODO_FECHAMENTO_REABERTURA,
});

route.set(`${ROUTES.PERIODO_FECHAMENTO_REABERTURA}/novo/`, {
  breadcrumbName: 'Períodos',
  parent: ROUTES.PERIODO_FECHAMENTO_REABERTURA,
  component: FechaReabCadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.PERIODO_FECHAMENTO_REABERTURA,
});

route.set(`${ROUTES.PERIODO_FECHAMENTO_REABERTURA}/novo/:tipoCalendarioId`, {
  breadcrumbName: 'Períodos',
  parent: ROUTES.PERIODO_FECHAMENTO_REABERTURA,
  component: FechaReabCadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.PERIODO_FECHAMENTO_REABERTURA,
});

route.set(`${ROUTES.PERIODO_FECHAMENTO_REABERTURA}/editar/:id`, {
  breadcrumbName: 'Períodos',
  parent: ROUTES.PERIODO_FECHAMENTO_REABERTURA,
  component: FechaReabCadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.PERIODO_FECHAMENTO_REABERTURA,
});

route.set(`${ROUTES.PENDENCIAS_FECHAMENTO}`, {
  breadcrumbName: 'Pendências do Fechamento',
  menu: ['Fechamento'],
  parent: '/',
  component: PendenciasFechamentoLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.PENDENCIAS_FECHAMENTO,
});
route.set(`${ROUTES.PENDENCIAS_FECHAMENTO}/:bimestre/:codigoComponenteCurricular`, {
  breadcrumbName: 'Pendências do Fechamento',
  menu: ['Fechamento'],
  parent: '/',
  component: PendenciasFechamentoLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.PENDENCIAS_FECHAMENTO,
});

route.set(`${ROUTES.PENDENCIAS_FECHAMENTO}/:id`, {
  breadcrumbName: 'Pendências do Fechamento',
  menu: ['Fechamento'],
  parent: ROUTES.PENDENCIAS_FECHAMENTO,
  component: PendenciasFechamentoForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.PENDENCIAS_FECHAMENTO,
});

route.set('/erro', {
  breadcrumbName: 'Erro',
  parent: '/',
  component: PaginaComErro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
});

route.set(ROUTES.RELATORIO_PAP_ACOMPANHAMENTO, {
  breadcrumbName: 'Acompanhamento',
  menu: ['Relatórios', 'PAP'],
  parent: '/',
  component: RelatorioPAPAcompanhamento,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_PAP_ACOMPANHAMENTO,
});

route.set(ROUTES.CONSELHO_CLASSE, {
  breadcrumbName: 'Conselho de Classe',
  menu: ['Fechamento'],
  parent: '/',
  component: ConselhoClasse,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.CONSELHO_CLASSE,
});

route.set(ROUTES.RELATORIO_SEMESTRAL, {
  breadcrumbName: 'Relatório Semestral',
  menu: ['Relatórios', 'PAP'],
  parent: '/',
  component: RelatorioSemestral,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_SEMESTRAL,
});
route.set(ROUTES.ATA_FINAL_RESULTADOS, {
  breadcrumbName: 'Ata final de resultados',
  menu: ['Relatórios', 'Atas'],
  parent: '/',
  component: AtaFinalResultados,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ATA_FINAL_RESULTADOS,
});

route.set(ROUTES.HISTORICO_ESCOLAR, {
  breadcrumbName: 'Histórico Escolar',
  menu: ['Relatórios'],
  parent: '/',
  component: HistoricoEscolar,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  // temPermissionamento: true,
  // chavePermissao: ROUTES.HISTORICO_ESCOLAR,
});

route.set(ROUTES.RELATORIO_FREQUENCIA, {
  breadcrumbName: 'Frequência',
  menu: ['Relatórios', 'Frequência'],
  parent: '/',
  component: RelatorioFrequencia,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_FREQUENCIA,
});

route.set(ROUTES.DIARIO_BORDO, {
  breadcrumbName: 'Diário de Bordo (Intencionalidade docente)',
  menu: ['Diário de Classe'],
  parent: '/',
  component: ListaDiarioBordo,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DIARIO_BORDO,
});

route.set(`${ROUTES.DIARIO_BORDO}/novo`, {
  breadcrumbName: 'Cadastrar',
  menu: [],
  parent: ROUTES.DIARIO_BORDO,
  component: DiarioBordo,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DIARIO_BORDO,
});

route.set(`${ROUTES.DIARIO_BORDO}/detalhes/:aulaId/:diarioBordoId/:componenteCurricularId`, {
  breadcrumbName: 'Diário de Bordo (Intencionalidade docente)',
  menu: ['Diário de Classe'],
  parent: '/',
  component: DiarioBordo,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DIARIO_BORDO,
});

route.set(ROUTES.RELATORIO_PENDENCIAS, {
  breadcrumbName: 'Pendências',
  menu: ['Relatórios', 'Gestão'],
  parent: '/',
  component: RelatorioPendencias,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_PENDENCIAS,
});

route.set(ROUTES.RELATORIO_PARECER_CONCLUSIVO, {
  breadcrumbName: 'Parecer conclusivo',
  menu: ['Relatórios', 'Fechamento'],
  parent: '/',
  component: RelatorioParecerConclusivo,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_PARECER_CONCLUSIVO,
});

route.set(ROUTES.RELATORIO_NOTAS_CONCEITOS_FINAIS, {
  breadcrumbName: 'Notas e conceitos finais',
  menu: ['Relatórios', 'Fechamento'],
  parent: '/',
  component: RelatorioNotasConceitosFinais,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_NOTAS_CONCEITOS_FINAIS,
});

route.set(ROUTES.CARTA_INTENCOES, {
  breadcrumbName: 'Carta de intenções',
  menu: ['Planejamento '],
  parent: '/',
  component: CartaIntencoes,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.CARTA_INTENCOES,
});

route.set(ROUTES.DEVOLUTIVAS, {
  breadcrumbName: 'Devolutivas',
  menu: ['Diário de Classe '],
  parent: '/',
  component: DevolutivasLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DEVOLUTIVAS,
});

route.set(`${ROUTES.DEVOLUTIVAS}/novo`, {
  breadcrumbName: 'Cadastrar Devolutiva',
  parent: ROUTES.DEVOLUTIVAS,
  component: DevolutivasForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DEVOLUTIVAS,
});

route.set(`${ROUTES.DEVOLUTIVAS}/editar/:id`, {
  breadcrumbName: 'Alterar Devolutiva',
  parent: ROUTES.DEVOLUTIVAS,
  component: DevolutivasForm,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DEVOLUTIVAS,
});

route.set(ROUTES.REGISTRO_INDIVIDUAL, {
  breadcrumbName: 'Registro individual',
  menu: ['Diário de Classe '],
  parent: '/',
  component: RegistroIndividual,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.REGISTRO_INDIVIDUAL,
});

route.set(ROUTES.RELATORIO_COMPENSACAO_AUSENCIA, {
  breadcrumbName: 'Compensação de ausência',
  menu: ['Relatórios', 'Frequência'],
  parent: '/',
  component: RelatorioCompensacaoAusencia,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
  chavePermissao: ROUTES.RELATORIO_COMPENSACAO_AUSENCIA,
});

route.set(ROUTES.DASHBOARD_ESCOLA_AQUI, {
  breadcrumbName: 'Escola aqui',
  menu: ['Dashboard'],
  parent: '/',
  component: DashboardEscolaAqui,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
  chavePermissao: ROUTES.DASHBOARD_ESCOLA_AQUI,
});

route.set(ROUTES.CONTROLE_GRADE, {
  breadcrumbName: 'Controle de grade',
  menu: ['Relatórios', 'Diário de classe'],
  parent: '/',
  component: ControleGrade,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
  chavePermissao: ROUTES.CONTROLE_GRADE,
});

route.set(ROUTES.RELATORIO_PLANEJAMENTO_DIARIO, {
  breadcrumbName: 'Controle de planejamento diário',
  menu: ['Relatórios', 'Diário de classe'],
  parent: '/',
  component: RelatorioPlanejamentoDiario,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_PLANEJAMENTO_DIARIO,
});

route.set(ROUTES.SONDAGEM, {
  breadcrumbName: 'Sistema Sondagem',
  parent: '/',
  component: Sondagem,
  exact: false,
  tipo: RotasTipo.EstruturadaAutenticada,
});

route.set(ROUTES.HISTORICO_NOTIFICACOES, {
  breadcrumbName: 'Histórico de notificações',
  menu: ['Relatórios', 'Notificações'],
  parent: '/',
  component: HistoricoNotificacoes,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.HISTORICO_NOTIFICACOES,
});

route.set(ROUTES.DOCUMENTOS_PLANOS_TRABALHO, {
  breadcrumbName: 'Documentos e planos de trabalho',
  menu: ['Gestão'],
  parent: '/',
  component: DocPlanosTrabalhoLista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DOCUMENTOS_PLANOS_TRABALHO,
});

route.set(`${ROUTES.DOCUMENTOS_PLANOS_TRABALHO}/novo`, {
  breadcrumbName: 'Upload do arquivo',
  parent: ROUTES.DOCUMENTOS_PLANOS_TRABALHO,
  component: DocPlanosTrabalhoCadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DOCUMENTOS_PLANOS_TRABALHO,
});

route.set(`${ROUTES.DOCUMENTOS_PLANOS_TRABALHO}/editar/:id`, {
  breadcrumbName: 'Upload do arquivo',
  parent: ROUTES.DOCUMENTOS_PLANOS_TRABALHO,
  component: DocPlanosTrabalhoCadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DOCUMENTOS_PLANOS_TRABALHO,
});

route.set(ROUTES.RELATORIO_USUARIOS, {
  breadcrumbName: 'Usuários',
  menu: ['Relatórios', 'Gestão'],
  parent: '/',
  component: RelatorioUsuarios,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_USUARIOS,
});

route.set(ROUTES.RELATORIO_ATRIBUICAO_CJ, {
  breadcrumbName: 'Atribuições',
  menu: ['Relatórios', 'Gestão'],
  parent: '/',
  component: AtribuicaoCJ,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
  chavePermissao: ROUTES.RELATORIO_ATRIBUICAO_CJ,
});

route.set(ROUTES.RELATORIO_ALTERACAO_NOTAS, {
  breadcrumbName: 'Histórico de alterações de notas',
  menu: ['Relatórios', 'Fechamento'],
  parent: '/',
  component: RelatorioHistoricoAlteracoesNotas,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
  chavePermissao: ROUTES.RELATORIO_ALTERACAO_NOTAS,
});

route.set(ROUTES.RELATORIO_DEVOLUTIVAS, {
  breadcrumbName: 'Devolutivas',
  menu: ['Relatórios', 'Diário de Classe'],
  parent: '/',
  component: RelatorioDevolutivas,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
  chavePermissao: ROUTES.RELATORIO_DEVOLUTIVAS,
});

route.set(ROUTES.RELATORIO_LEITURA, {
  breadcrumbName: 'Leitura',
  menu: ['Relatórios', 'Escola aqui'],
  parent: '/',
  component: RelatorioLeitura,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_LEITURA,
});

route.set(ROUTES.RELATORIO_ESCOLA_AQUI_ADESAO, {
  breadcrumbName: 'Adesão',
  menu: ['Relatórios', 'Escola aqui'],
  parent: '/',
  component: relatorioEscolaAquiAdesao,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
  chavePermissao: ROUTES.RELATORIO_ESCOLA_AQUI_ADESAO,
});

route.set(ROUTES.RELATORIO_AEE_ENCAMINHAMENTO, {
  breadcrumbName: 'Encaminhamento',
  menu: ['AEE'],
  parent: '/',
  component: EncaminhamentoAEELista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_AEE_ENCAMINHAMENTO,
});

route.set(`${ROUTES.RELATORIO_AEE_ENCAMINHAMENTO}/novo`, {
  breadcrumbName: 'Cadastrar',
  parent: `${ROUTES.RELATORIO_AEE_ENCAMINHAMENTO}`,
  component: EncaminhamentoAEECadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_AEE_ENCAMINHAMENTO,
});

route.set(`${ROUTES.RELATORIO_AEE_ENCAMINHAMENTO}/editar/:id`, {
  breadcrumbName: 'Editar',
  parent: `${ROUTES.RELATORIO_AEE_ENCAMINHAMENTO}`,
  component: EncaminhamentoAEECadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_AEE_ENCAMINHAMENTO,
});

route.set(`${ROUTES.RELATORIO_AEE_REGISTRO_ITINERANCIA}`, {
  breadcrumbName: 'Registro de itinerância',
  menu: ['AEE'],
  parent: '/',
  component: RegistroItineranciaAEELista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_AEE_REGISTRO_ITINERANCIA,
});

route.set(`${ROUTES.RELATORIO_AEE_REGISTRO_ITINERANCIA}/novo`, {
  breadcrumbName: 'Cadastro',
  parent: ROUTES.RELATORIO_AEE_REGISTRO_ITINERANCIA,
  component: RegistroItineranciaAEECadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_AEE_REGISTRO_ITINERANCIA,
});

route.set(`${ROUTES.RELATORIO_AEE_REGISTRO_ITINERANCIA}/editar/:id`, {
  breadcrumbName: 'Registro de itinerância',
  menu: ['AEE'],
  parent: '/',
  component: RegistroItineranciaAEECadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
  chavePermissao: ROUTES.RELATORIO_AEE_REGISTRO_ITINERANCIA,
});

route.set(ROUTES.RELATORIO_AEE_PLANO, {
  breadcrumbName: 'Plano',
  menu: ['AEE'],
  parent: '/',
  component: PlanoAEELista,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_AEE_PLANO,
});

route.set(`${ROUTES.RELATORIO_AEE_PLANO}/novo`, {
  breadcrumbName: 'Cadastro',
  parent: ROUTES.RELATORIO_AEE_PLANO,
  component: PlanoAEECadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_AEE_PLANO,
});

route.set(`${ROUTES.RELATORIO_AEE_PLANO}/editar/:id`, {
  breadcrumbName: 'Editar',
  parent: `${ROUTES.RELATORIO_AEE_PLANO}`,
  component: PlanoAEECadastro,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_AEE_PLANO,
});

route.set(ROUTES.OCORRENCIAS, {
  breadcrumbName: 'Ocorrências',
  menu: ['Gestão'],
  parent: '/',
  component: ListaOcorrencias,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
  chavePermissao: ROUTES.OCORRENCIAS,
});

route.set(`${ROUTES.OCORRENCIAS}/novo`, {
  breadcrumbName: 'Cadastro',
  parent: ROUTES.OCORRENCIAS,
  component: CadastroOcorrencias,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
  chavePermissao: ROUTES.OCORRENCIAS,
});

route.set(`${ROUTES.OCORRENCIAS}/editar/:id`, {
  breadcrumbName: 'Cadastro',
  parent: ROUTES.OCORRENCIAS,
  component: CadastroOcorrencias,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
  chavePermissao: ROUTES.OCORRENCIAS,
});

route.set(ROUTES.ACOMPANHAMENTO_APRENDIZAGEM, {
  breadcrumbName: 'Relatório do Acompanhamento da Aprendizagem',
  menu: ['Fechamento'],
  parent: '/',
  component: AcompanhamentoAprendizagem,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ACOMPANHAMENTO_APRENDIZAGEM,
});

route.set(ROUTES.DASHBOARD_AEE, {
  breadcrumbName: 'AEE',
  menu: ['Dashboard'],
  parent: '/',
  component: DashboardAEE,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DASHBOARD_AEE,
});

route.set(ROUTES.DASHBOARD_REGISTRO_ITINERANCIA, {
  breadcrumbName: 'Registro de Itinerância',
  menu: ['Dashboard'],
  parent: '/',
  component: DashboardRegistroItinerancia,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DASHBOARD_REGISTRO_ITINERANCIA,
});

route.set(ROUTES.ACOMPANHAMENTO_FECHAMENTO, {
  breadcrumbName: 'Acompanhamento do Fechamento',
  menu: ['Fechamento'],
  parent: '/',
  component: AcompanhamentoFechamento,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
  chavePermissao: ROUTES.ACOMPANHAMENTO_FECHAMENTO,
});

route.set(ROUTES.DASHBOARD_FREQUENCIA, {
  breadcrumbName: 'Frequência',
  menu: ['Dashboard'],
  parent: '/',
  component: DashboardFrequencia,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DASHBOARD_FREQUENCIA,
});

route.set(ROUTES.DASHBOARD_DEVOLUTIVAS, {
  breadcrumbName: 'Devolutivas',
  menu: ['Dashboard'],
  parent: '/',
  component: DashboardDevolutivas,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DASHBOARD_DEVOLUTIVAS,
});

route.set(ROUTES.DASHBOARD_INFORMACOES_ESCOLARES, {
  breadcrumbName: 'Informações escolares',
  menu: ['Dashboard'],
  parent: '/',
  component: DashboardInformacoesEscolares,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DASHBOARD_INFORMACOES_ESCOLARES,
});

route.set(ROUTES.DASHBOARD_REGISTRO_INDIVIDUAL, {
  breadcrumbName: 'Registro individual',
  menu: ['Dashboard'],
  parent: '/',
  component: DashboardRegistroIndividual,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DASHBOARD_REGISTRO_INDIVIDUAL,
});

route.set(ROUTES.DASHBOARD_DIARIO_BORDO, {
  breadcrumbName: 'Diário de bordo',
  menu: ['Dashboard'],
  parent: '/',
  component: DashboardDiarioBordo,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DASHBOARD_DIARIO_BORDO,
});

route.set(ROUTES.RELATORIO_ACOMPANHAMENTO_FECHAMENTO, {
  breadcrumbName: 'Relatório de Acompanhamento do Fechamento',
  menu: ['Relatórios', 'Fechamento'],
  parent: '/',
  component: RelatorioAcompanhamentoFechamento,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_ACOMPANHAMENTO_FECHAMENTO,
});

route.set(ROUTES.DASHBOARD_RELATORIO_ACOMPANHAMENTO_APRENDIZAGEM, {
  breadcrumbName: 'Relatório do Acompanhamento da Aprendizagem',
  menu: ['Dashboard'],
  parent: '/',
  component: DashboardRelAcompanhamentoAprendizagem,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DASHBOARD_RELATORIO_ACOMPANHAMENTO_APRENDIZAGEM,
});

route.set(ROUTES.DASHBOARD_FECHAMENTO, {
  breadcrumbName: 'Fechamento',
  menu: ['Dashboard'],
  parent: '/',
  component: DashboardFechamento,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
  chavePermissao: ROUTES.DASHBOARD_FECHAMENTO,
});

route.set(ROUTES.ATA_BIMESTRAL, {
  breadcrumbName: 'Ata bimestral',
  menu: ['Relatórios', 'Atas'],
  parent: '/',
  component: RelatorioAtaBimestral,
  exact: true,
  // tipo: RotasTipo.EstruturadaAutenticada,
  // temPermissionamento: true,
  chavePermissao: ROUTES.ATA_BIMESTRAL,
});

route.set(ROUTES.RELATORIO_ACOMPANHAMENTO_REGISTROS, {
  breadcrumbName: 'Acompanhamento dos registros',
  menu: ['Relatórios', 'Gestão'],
  parent: '/',
  component: RelatorioAcompanhamentoRegistros,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_ACOMPANHAMENTO_REGISTROS,
});

route.set(`${ROUTES.LISTAO}`, {
  breadcrumbName: 'Listão',
  menu: ['Diário de Classe'],
  parent: '/',
  component: ListaoPrincipal,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.LISTAO,
});

route.set(`${ROUTES.LISTAO_OPERACOES}`, {
  breadcrumbName: 'Operações',
  parent: ROUTES.LISTAO,
  component: ListaoPrincipal,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: false,
  chavePermissao: ROUTES.LISTAO,
});

route.set(ROUTES.RELATORIO_FREQUENCIA_MENSAL, {
  breadcrumbName: 'Frequência mensal',
  menu: ['Relatórios', 'Frequência'],
  parent: '/',
  component: RelatorioFrequenciaMensal,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_FREQUENCIA_MENSAL,
});

route.set(ROUTES.DASHBOARD_NAAPA, {
  breadcrumbName: 'NAAPA',
  menu: ['Dashboard'],
  parent: '/',
  component: DashboardNAAPA,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.DASHBOARD_NAAPA,
});

route.set(ROUTES.ENCAMINHAMENTO_NAAPA, {
  breadcrumbName: 'Encaminhamento NAAPA',
  menu: ['Gestão'],
  parent: '/',
  component: ListaEncaminhamentoNAAPA,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ENCAMINHAMENTO_NAAPA,
});

route.set(`${ROUTES.ENCAMINHAMENTO_NAAPA}/novo`, {
  breadcrumbName: 'Encaminhamento',
  parent: ROUTES.ENCAMINHAMENTO_NAAPA,
  component: CadastroEncaminhamentoNAAPA,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ENCAMINHAMENTO_NAAPA,
});

route.set(`${ROUTES.ENCAMINHAMENTO_NAAPA}/:id`, {
  breadcrumbName: 'Encaminhamento',
  parent: ROUTES.ENCAMINHAMENTO_NAAPA,
  component: CadastroEncaminhamentoNAAPA,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.ENCAMINHAMENTO_NAAPA,
});

route.set(ROUTES.RELATORIO_AEE_PLANO_IMPRESSAO, {
  breadcrumbName: 'Plano',
  menu: ['Relatórios', 'AEE'],
  parent: '/',
  component: RelatorioPlanoAEE,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_AEE_PLANO_IMPRESSAO,
});

route.set(ROUTES.RELATORIO_AEE_ENCAMINHAMENTO_IMPRESSAO, {
  breadcrumbName: 'Encaminhamento',
  menu: ['Relatórios', 'AEE'],
  parent: '/',
  component: RelatorioEncaminhamentoAEE,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_AEE_ENCAMINHAMENTO_IMPRESSAO,
});

route.set(ROUTES.RELATORIO_ENCAMINHAMENTO_NAAPA, {
  breadcrumbName: 'Encaminhamento',
  menu: ['Relatórios', 'NAAPA'],
  parent: '/',
  component: RelatorioEncaminhamentonNAAPA,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_ENCAMINHAMENTO_NAAPA,
});

route.set(ROUTES.RELATORIO_SONDAGEM_ANALITICO, {
  breadcrumbName: 'Relatório analítico',
  menu: ['Relatórios', 'Sondagem'],
  parent: '/',
  component: RelatorioSondagemAnalitico,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_SONDAGEM_ANALITICO,
});

route.set(ROUTES.RELATORIO_AEE_REGISTRO_ITINERANCIA_IMPRESSAO, {
  breadcrumbName: 'Registro de itinerância',
  menu: ['Relatórios', 'AEE'],
  parent: '/',
  component: RelatorioRegistroItinerancia,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_AEE_REGISTRO_ITINERANCIA_IMPRESSAO,
});

route.set(ROUTES.RELATORIO_CONTROLE_FREQUENCIA_MENSAL, {
  breadcrumbName: 'Controle de frequência mensal',
  menu: ['Relatórios', 'Frequência'],
  parent: '/',
  component: RelatorioControleFrequenciaMensal,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_CONTROLE_FREQUENCIA_MENSAL,
});

route.set(ROUTES.RELATORIO_PAP, {
  breadcrumbName: 'Relatório de PAP',
  menu: ['Relatórios', 'PAP'],
  parent: '/',
  component: RelatorioPAP,
  exact: true,
  tipo: RotasTipo.EstruturadaAutenticada,
  // TODO
  // temPermissionamento: true,
  chavePermissao: ROUTES.RELATORIO_PAP,
});

const getRoutesArray = () => {
  for (const [key, value] of route) {
    const rota = value;
    rota.path = key;
    routesArray.push(rota);

    const rotaRedux = {
      path: value.paginaInicial ? '/' : key,
      icone: value.icone,
      dicaIcone: value.dicaIcone,
      breadcrumbName: value.breadcrumbName,
      menu: value.menu,
      parent: value.parent,
      limpaSelecaoMenu: value.limpaSelecaoMenu,
    };

    store.dispatch(setRotas(rotaRedux));
  }
  return routesArray;
};

export { getRoutesArray };
