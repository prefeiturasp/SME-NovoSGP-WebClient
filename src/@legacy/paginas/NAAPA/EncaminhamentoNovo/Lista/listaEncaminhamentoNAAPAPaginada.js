import { NomeEstudanteLista } from '@/@legacy/componentes-sgp';
import { ROUTES } from '@/core/enum/routes';
import { store } from '@/core/redux';
import { Checkbox } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListaPaginada } from '~/componentes';
import { OPCAO_TODOS } from '~/constantes';
import { SGP_TABLE_ENCAMINHAMENTO_NAAPA } from '~/constantes/ids/table';
import { setTabAtivaEncaminhamentoNAAPA } from '~/redux/modulos/encaminhamentoNAAPA/actions';
import { verificarDataFimMaiorInicio } from '~/utils';

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
    ordenacoesSelecionadas,
  } = props;

  const navigate = useNavigate();

  const [filtros, setFiltros] = useState();

  const filtroEhValido = !!(anoLetivo && dre?.id && ue?.id);

  const colunas = [
    {
      title: 'Tipo',
      dataIndex: 'tipoQuestionario',
    },
    {
      title: 'Criança/Estudante',
      dataIndex: 'nomeAluno',
    },
    {
      title: 'Turma',
      dataIndex: 'turmaNome',
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
      title: 'Situação',
      dataIndex: 'situacao',
    },
    {
      title: 'Suspeita de violência',
      dataIndex: 'suspeitaViolencia',
      render: valor => {
        return <Checkbox checked={Boolean(valor)} disabled />;
      },
    },
  ];

  if (ue?.codigo === OPCAO_TODOS) {
    colunas.splice(1, 0, {
      title: 'Unidade Educacional',
      dataIndex: 'ueNome',
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
    <ListaPaginada
      url="v1/novo-encaminhamento-naapa/obterEncaminhamentoPorTipo"
      id={SGP_TABLE_ENCAMINHAMENTO_NAAPA}
      colunas={colunas}
      filtro={filtros}
      onClick={linha => {
        store.dispatch(setTabAtivaEncaminhamentoNAAPA(0));

        const dadosSalvarState = obterDadosFiltros();

        if (linha?.tipoQuestionario === 'Institucional') {
          navigate(`${ROUTES.ENCAMINHAMENTO_NAAPA_INSTITUCIONAL}/${linha.id}`, {
            state: dadosSalvarState,
          });
        } else if (linha?.tipoQuestionario === 'Individual') {
          navigate(`${ROUTES.ENCAMINHAMENTO_NAAPA}/${linha.id}`, {
            state: dadosSalvarState,
          });
        } else {
        }
      }}
      filtroEhValido={filtroEhValido}
      multiSelecao
      selecionarItems={valores => onSelecionarItems(valores)}
    />
  ) : (
    <></>
  );
};

export default ListaEncaminhamentoNAAPAPaginada;
