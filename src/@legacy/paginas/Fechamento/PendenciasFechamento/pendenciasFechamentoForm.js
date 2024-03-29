import { URL_PENDENCIAFECHAMENTO } from '@/@legacy/constantes';
import { ROUTES } from '@/core/enum/routes';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Loader } from '~/componentes';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Alert from '~/componentes/alert';
import Auditoria from '~/componentes/auditoria';
import Button from '~/componentes/button';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import JoditEditor from '~/componentes/jodit-editor/joditEditor';
import Label from '~/componentes/label';
import SelectComponent from '~/componentes/select';
import { SGP_BUTTON_APROVAR } from '~/constantes/ids/button';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import situacaoPendenciaDto from '~/dtos/situacaoPendenciaDto';
import { ServicoPeriodoFechamento } from '~/servicos';
import ServicoPendenciasFechamento from '~/servicos/Paginas/Fechamento/ServicoPendenciasFechamento';
import ServicoDisciplina from '~/servicos/Paginas/ServicoDisciplina';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import { erro, erros, sucesso } from '~/servicos/alertas';
import { setBreadcrumbManual } from '~/servicos/breadcrumb-services';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import { IframeStyle } from './pendenciasFechamentoLista.css';
import {
  AprovadoForm,
  Campo,
  CampoDescricao,
  PendenteForm,
  ResolvidoForm,
} from './situacaoFechamento.css';

const PendenciasFechamentoForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paramsRoute = useParams();

  const idPendenciaFechamento = paramsRoute?.id || 0;

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const permissoesTela = usuario.permissoes[ROUTES.PENDENCIAS_FECHAMENTO];
  const [somenteConsulta, setSomenteConsulta] = useState(false);

  const [carregandoDisciplinas, setCarregandoDisciplinas] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(false);
  const [listaDisciplinas, setListaDisciplinas] = useState([]);
  const [listaBimestres, setListaBimestres] = useState([]);
  const [auditoria, setAuditoria] = useState([]);
  const [exibirAuditoria, setExibirAuditoria] = useState(false);

  const [codigoComponenteCurricular, setCodigoComponenteCurricular] =
    useState(undefined);
  const [bimestre, setBimestre] = useState('');
  const [situacaoId, setSituacaoId] = useState('');
  const [situacaoNome, setSituacaoNome] = useState('');
  const [descricao, setdescricao] = useState('');
  const [detalhamento, setDetalhamento] = useState('');
  const [periodoAberto, setPeriodoAberto] = useState([]);

  const resetarTela = () => {
    setSituacaoId('');
    setSituacaoNome('');
    setCodigoComponenteCurricular('');
    setBimestre('');
    setdescricao('');
    setDetalhamento('');
    setAuditoria({});
    setExibirAuditoria(false);
  };

  useEffect(() => {
    const naoSetarSomenteConsultaNoStore = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    setSomenteConsulta(
      verificaSomenteConsulta(permissoesTela, naoSetarSomenteConsultaNoStore)
    );
  }, [turmaSelecionada, permissoesTela, modalidadesFiltroPrincipal]);

  useEffect(() => {
    const montaBimestre = () => {
      let listaBi = [];
      if (
        Number(turmaSelecionada.modalidade) === ModalidadeEnum.EJA ||
        Number(turmaSelecionada.modalidade) === ModalidadeEnum.CELP
      ) {
        listaBi = [
          { valor: 1, descricao: 'Primeiro bimestre' },
          { valor: 2, descricao: 'Segundo bimestre' },
        ];
      } else {
        listaBi = [
          { valor: 1, descricao: 'Primeiro bimestre' },
          { valor: 2, descricao: 'Segundo bimestre' },
          { valor: 3, descricao: 'Terceiro bimestre' },
          { valor: 4, descricao: 'Quarto bimestre' },
        ];
      }
      setListaBimestres(listaBi);
    };

    const obterDisciplinas = async () => {
      setCarregandoDisciplinas(true);
      const disciplinas = await ServicoDisciplina.obterDisciplinasPorTurma(
        turmaSelecionada.turma
      ).catch(e => erros(e));

      if (disciplinas && disciplinas.data && disciplinas.data.length) {
        setListaDisciplinas(disciplinas.data);
      } else {
        setListaDisciplinas([]);
      }
      setCarregandoDisciplinas(false);
    };

    if (
      turmaSelecionada.turma &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada)
    ) {
      montaBimestre();
      obterDisciplinas();
    } else {
      resetarTela();
    }
  }, [turmaSelecionada, modalidadesFiltroPrincipal]);

  const obterPeriodoAberto = useCallback(async () => {
    const retorno =
      await ServicoPeriodoFechamento.verificarSePodeAlterarNoPeriodo(
        turmaSelecionada.turma,
        bimestre
      ).catch(e => erros(e));

    setPeriodoAberto(!!retorno.data);
  }, [turmaSelecionada, bimestre]);

  useEffect(() => {
    if (bimestre && turmaSelecionada?.turma) {
      obterPeriodoAberto();
    }
  }, [bimestre, turmaSelecionada, obterPeriodoAberto]);

  useEffect(() => {
    const consultaPorId = async () => {
      if (idPendenciaFechamento) {
        setBreadcrumbManual(
          location.pathname,
          'Análise de pendências',
          ROUTES.PENDENCIAS_FECHAMENTO
        );
        setCarregandoDados(true);
        const retorno = await ServicoPendenciasFechamento.obterPorId(
          idPendenciaFechamento
        ).catch(e => erros(e));

        if (retorno && retorno.data) {
          const {
            situacao,
            situacaoNome,
            componenteCurricular,
            bimestre,
            descricao,
            detalhamentoFormatado,
          } = retorno.data;
          setSituacaoId(situacao);
          setSituacaoNome(situacaoNome);
          setCodigoComponenteCurricular(String(componenteCurricular));
          setBimestre(String(bimestre));
          setdescricao(descricao);
          setDetalhamento(detalhamentoFormatado);

          const {
            criadoPor,
            criadoRF,
            criadoEm,
            alteradoPor,
            alteradoRF,
            alteradoEm,
          } = retorno.data;
          setAuditoria({
            criadoPor,
            criadoRf: criadoRF,
            criadoEm,
            alteradoPor,
            alteradoRf: alteradoRF,
            alteradoEm,
          });
          setExibirAuditoria(true);
        } else {
          resetarTela();
        }
        setCarregandoDados(false);
      }
    };

    if (!ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada)) {
      consultaPorId();
    }
  }, [modalidadesFiltroPrincipal, turmaSelecionada, idPendenciaFechamento]);

  const onClickVoltar = () => navigate(URL_PENDENCIAFECHAMENTO);

  const onClickAprovar = async () => {
    const retorno = await ServicoPendenciasFechamento.aprovar([
      idPendenciaFechamento,
    ]).catch(e => erros(e));
    if (retorno && retorno.data) {
      const comErros = retorno.data.filter(item => !item.sucesso);
      if (comErros && comErros.length) {
        const mensagensErros = comErros.map(e => e.mensagemConsistencia);
        mensagensErros.forEach(msg => {
          erro(msg);
        });
      } else {
        sucesso(`Pendência aprovada com sucesso`);
        onClickVoltar();
      }
    }
  };

  const montarLabelSituacaoPendencia = () => {
    switch (situacaoId) {
      case situacaoPendenciaDto.Pendente:
        return (
          <PendenteForm>
            <span>{situacaoNome}</span>
          </PendenteForm>
        );
      case situacaoPendenciaDto.Resolvida:
        return (
          <ResolvidoForm>
            <span>{situacaoNome}</span>
          </ResolvidoForm>
        );
      case situacaoPendenciaDto.Aprovada:
        return (
          <AprovadoForm>
            <span>{situacaoNome}</span>
          </AprovadoForm>
        );
      default:
        return '';
    }
  };

  return (
    <Loader loading={carregandoDados} tip="">
      {!turmaSelecionada.turma &&
      !ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ? (
        <Alert
          alerta={{
            tipo: 'warning',
            id: 'pendencias-selecione-turma',
            mensagem: 'Você precisa escolher uma turma.',
          }}
        />
      ) : (
        <></>
      )}
      {bimestre && !periodoAberto ? (
        <Alert
          alerta={{
            tipo: 'warning',
            mensagem:
              'Apenas é possível consultar este registro pois o período não está em aberto.',
          }}
        />
      ) : (
        <></>
      )}
      <AlertaModalidadeInfantil />
      <Cabecalho pagina="Análise de Pendências">
        <>
          <BotaoVoltarPadrao className="mr-2" onClick={() => onClickVoltar()} />
          <Button
            id={SGP_BUTTON_APROVAR}
            label="Aprovar"
            color={Colors.Roxo}
            border
            bold
            onClick={onClickAprovar}
            disabled={
              !periodoAberto ||
              ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ||
              somenteConsulta ||
              !permissoesTela.podeAlterar ||
              !situacaoId ||
              Number(situacaoId) === situacaoPendenciaDto.Aprovada
            }
          />
        </>
      </Cabecalho>
      <Card>
        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
              <SelectComponent
                label="Bimestre"
                id="bimestre"
                valueOption="valor"
                valueText="descricao"
                lista={listaBimestres}
                valueSelect={bimestre}
                disabled
              />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
              <Loader loading={carregandoDisciplinas} tip="">
                <SelectComponent
                  label="Componente curricular"
                  id="disciplina"
                  lista={listaDisciplinas}
                  valueOption="codigoComponenteCurricular"
                  valueText="nome"
                  valueSelect={codigoComponenteCurricular}
                  disabled
                />
              </Loader>
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
              {montarLabelSituacaoPendencia()}
            </div>
            <Campo className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-2">
              <Label text="Descrição" />
              <CampoDescricao
                id="descricao"
                autoSize={{ minRows: 2, maxRows: 2 }}
                value={descricao}
                readOnly
              />
            </Campo>
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-2">
              <JoditEditor
                label="Detalhamento"
                value={detalhamento}
                removerToolbar
                desabilitar
                iframeStyle={IframeStyle}
                disablePlugins="resize-cells"
              />
            </div>
          </div>
        </div>
        {exibirAuditoria ? (
          <Auditoria
            criadoEm={auditoria.criadoEm}
            criadoPor={auditoria.criadoPor}
            criadoRf={auditoria.criadoRf}
            alteradoPor={auditoria.alteradoPor}
            alteradoEm={auditoria.alteradoEm}
            alteradoRf={auditoria.alteradoRf}
          />
        ) : (
          ''
        )}
      </Card>
    </Loader>
  );
};

export default PendenciasFechamentoForm;
