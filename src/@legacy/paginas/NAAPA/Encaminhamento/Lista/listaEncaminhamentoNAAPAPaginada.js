import { NomeEstudanteLista } from '@/@legacy/componentes-sgp';
import { OrdenacaoListEncaminhamentoNAAPAEnum } from '@/core/enum/ordenacao-list-encaminhamento-naapa-enum';
import { ROUTES } from '@/core/enum/routes';
import { store } from '@/core/redux';
import { Col, Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListaPaginada } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_TABLE_ENCAMINHAMENTO_NAAPA } from '~/constantes/ids/table';
import { setTabAtivaEncaminhamentoNAAPA } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { verificarDataFimMaiorInicio } from '~/utils';
import { BotaoOrdenacaoListaEncaminhamentoNAAPA } from './components/ordenacao';

const ListaEncaminhamentoNAAPAPaginada = props => {
  const {
    ue,
    dre,
    turmaId,
    situacao,
    anoLetivo,
    codigoNomeAluno,
    prioridade,
    consideraHistorico,
    dataAberturaQueixaFim,
    dataAberturaQueixaInicio,
    onSelecionarItems,
    exibirEncaminhamentosEncerrados,
    obterDadosFiltros,
  } = props;

  const navigate = useNavigate();

  const [filtros, setFiltros] = useState();
  const [ordenacoesSelecionadas, setOrdenacoesSelecionadas] = useState([
    OrdenacaoListEncaminhamentoNAAPAEnum.DataEntradaQueixaDesc,
  ]);

  const filtroEhValido = !!(anoLetivo && dre?.id && ue?.id);

  const colunas = [
    {
      title: 'Criança/Estudante',
      dataIndex: 'nomeAluno ',
      render: (_, linha) => (
        <NomeEstudanteLista
          nome={`${linha?.nomeAluno} (${linha?.codigoAluno})`}
          ehMatriculadoTurmaPAP={linha?.ehMatriculadoTurmaPAP}
        />
      ),
    },
    {
      title: 'Turma',
      dataIndex: 'turma',
    },
    {
      title: 'Data de entrada da queixa',
      dataIndex: 'dataAberturaQueixaInicio',
      render: dataInicio =>
        dataInicio ? window.moment(dataInicio).format('DD/MM/YYYY') : '',
    },
    {
      title: 'Data do último atendimento',
      dataIndex: 'dataUltimoAtendimento',
      render: ultimoAtendimento =>
        ultimoAtendimento
          ? window.moment(ultimoAtendimento).format('DD/MM/YYYY')
          : '',
    },
    {
      title: 'Prioridade',
      dataIndex: 'prioridade',
    },
    {
      title: 'Situação',
      dataIndex: 'situacao',
    },
  ];

  if (ue?.codigo === OPCAO_TODOS) {
    colunas.unshift({
      title: 'Unidade Escolar (UE)',
      dataIndex: 'ue',
    });
  }

  const filtrar = useCallback(() => {
    const params = {
      exibirHistorico: consideraHistorico,
      anoLetivo,
      dreId: dre?.id,
      codigoUe: ue?.codigo,
      turmaId: turmaId === OPCAO_TODOS ? '' : turmaId,
      codigoNomeAluno,
      dataAberturaQueixaInicio: dataAberturaQueixaInicio
        ? dataAberturaQueixaInicio.format('YYYY-MM-DD')
        : '',
      dataAberturaQueixaFim: dataAberturaQueixaFim
        ? dataAberturaQueixaFim.format('YYYY-MM-DD')
        : '',
      situacao,
      prioridade,
      exibirEncerrados: exibirEncaminhamentosEncerrados,
    };

    if (ordenacoesSelecionadas?.length) {
      params.ordenacao = ordenacoesSelecionadas.map(item => item?.value);
    }

    const dataFimMaiorInicio = verificarDataFimMaiorInicio(
      dataAberturaQueixaInicio,
      dataAberturaQueixaFim
    );

    if (dataFimMaiorInicio) {
      setFiltros({ ...params });
    }
  }, [
    consideraHistorico,
    anoLetivo,
    dre,
    ue,
    turmaId,
    codigoNomeAluno,
    dataAberturaQueixaInicio,
    dataAberturaQueixaFim,
    situacao,
    prioridade,
    exibirEncaminhamentosEncerrados,
    ordenacoesSelecionadas,
  ]);

  useEffect(() => {
    filtrar();
  }, [filtrar]);

  const exibirTabela =
    filtros?.anoLetivo && filtros?.dreId && filtros?.codigoUe;

  return exibirTabela ? (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <BotaoOrdenacaoListaEncaminhamentoNAAPA
            setOrdenacoesSelecionadas={setOrdenacoesSelecionadas}
            ordenacoesSelecionadas={ordenacoesSelecionadas}
            opcoesParaRemover={
              ue?.codigo !== OPCAO_TODOS
                ? [OrdenacaoListEncaminhamentoNAAPAEnum.UE]
                : []
            }
          />
        </Col>
        <Col xs={24}>
          <ListaPaginada
            url="v1/encaminhamento-naapa"
            id={SGP_TABLE_ENCAMINHAMENTO_NAAPA}
            colunas={colunas}
            filtro={filtros}
            onClick={linha => {
              store.dispatch(setTabAtivaEncaminhamentoNAAPA(0));
              const dadosSalvarState = obterDadosFiltros();
              navigate(`${ROUTES.ENCAMINHAMENTO_NAAPA}/${linha?.id}`, {
                state: dadosSalvarState,
              });
            }}
            filtroEhValido={filtroEhValido}
            multiSelecao
            selecionarItems={valores => onSelecionarItems(valores)}
          />
        </Col>
      </Row>
    </>
  ) : (
    <></>
  );
};

export default ListaEncaminhamentoNAAPAPaginada;
