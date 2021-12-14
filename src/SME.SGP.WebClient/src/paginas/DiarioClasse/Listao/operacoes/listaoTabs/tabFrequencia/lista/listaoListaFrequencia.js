import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { DataTable, Loader } from '~/componentes';
import { Base } from '~/componentes/colors';
import tipoIndicativoFrequencia from '~/dtos/tipoIndicativoFrequencia';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { erros } from '~/servicos';
import ServicoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoFrequencia';
import CampoTiposFrequencia from './componentes/campoTiposFrequencia';
import {
  IndicativoAlerta,
  IndicativoCritico,
  LinhaTabela,
  TextoEstilizado,
} from './listaFrequencia.css';

const ListaoListaFrequencia = props => {
  const { ehInfantil, dataSource, listaTiposFrequencia, periodo } = props;

  const { componenteCurricular } = useContext(ListaoContext);
  const [carregandoDetalhamento, setCarregandoDetalhamento] = useState(false);
  const [dadosDetalheEstudante, setDadosDetalheEstudante] = useState([]);

  const montarTituloEstudante = () => {
    return (
      <span className="fonte-16">
        Nome {ehInfantil ? 'da criança' : 'do estudante'}
      </span>
    );
  };

  const montarColunaFrequenciaDiaria = (
    dadosDiaAula,
    indexEstudante,
    indexAula
  ) => {
    return (
      <CampoTiposFrequencia
        tipoFrequencia={dadosDiaAula.tipoFrequencia}
        listaTiposFrequencia={listaTiposFrequencia}
        onChange={valorNovo => {
          const regAtual = { ...dadosDiaAula, tipoFrequencia: valorNovo };
          dataSource[indexEstudante].aulas[indexAula] = { ...regAtual };
          // TODO setar modo edição true para a tab de frequencia! Não setar valor assim, trocar para setar no useState e no context!
        }}
      />
    );
  };

  const colunasEstudantes = [
    {
      title: 'Nº',
      dataIndex: 'numeroAlunoChamada',
      align: 'center',
      width: '45px',
    },

    {
      title: montarTituloEstudante,
      dataIndex: 'nomeAluno',
    },
  ];

  if (dataSource[0]?.aulas?.length && componenteCurricular.registraFrequencia) {
    dataSource[0].aulas.forEach((aula, indexAula) => {
      colunasEstudantes.push({
        title: () => (
          <span className="fonte-16">
            {window.moment(aula?.dataAula).format('DD/MM/YYYY')}
          </span>
        ),
        align: 'center',
        dataIndex: `aulas.${indexAula}`,
        width: '150px',
        render: (dadosDiaAula, estudante) => {
          const indexEstudante = dataSource.indexOf(estudante);
          return montarColunaFrequenciaDiaria(
            dadosDiaAula,
            indexEstudante,
            indexAula
          );
        },
      });
    });
  }

  colunasEstudantes.push({
    title: 'Informações adicionais',
    align: 'center',
    width: '130px',
  });

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const obterDetalhamento = async dadosEstudante => {
    setCarregandoDetalhamento(true);
    const resultado = await ServicoFrequencia.obterFrequenciaDetalhadaAluno(
      dadosEstudante.codigoAluno,
      periodo?.dataInicio,
      periodo?.dataFim
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoDetalhamento(false));

    if (resultado?.data?.length) {
      setDadosDetalheEstudante(resultado.data);
    } else {
      setDadosDetalheEstudante([]);
    }
  };

  const onClickExpandir = (expandir, dadosEstudante) => {
    if (expandir) {
      setExpandedRowKeys([dadosEstudante?.codigoAluno]);
      obterDetalhamento(dadosEstudante);
    } else {
      setExpandedRowKeys([]);
    }
  };

  const temLinhaExpandida = dados =>
    expandedRowKeys.filter(item => String(item) === String(dados));

  const expandIcon = (expanded, onExpand, record) => {
    const ehLinhaExpandida = temLinhaExpandida(record.codigoAluno);
    const corTexto = ehLinhaExpandida.length ? Base.Branco : record?.cor;
    return (
      <TextoEstilizado cor={corTexto}>
        Detalhar
        <FontAwesomeIcon
          style={{ fontSize: 24, marginLeft: 5, cursor: 'pointer' }}
          icon={expanded ? faAngleUp : faAngleDown}
          onClick={e => onExpand(record, e)}
        />
      </TextoEstilizado>
    );
  };

  const montarColunaFrequencia = aluno => {
    const percentual = aluno?.indicativoFrequencia?.percentual
      ? `${aluno.indicativoFrequencia.percentual}%`
      : '';

    switch (aluno?.indicativoFrequencia?.tipo) {
      case tipoIndicativoFrequencia.Alerta:
        return <IndicativoAlerta>{percentual}</IndicativoAlerta>;
      case tipoIndicativoFrequencia.Critico:
        return <IndicativoCritico>{percentual}</IndicativoCritico>;
      default:
        return percentual;
    }
  };

  const colunasDetalhamentoEstudante = [
    {
      title: 'Datas',
      dataIndex: 'dataAula',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: dataAula => window.moment(dataAula).format('DD/MM/YYYY'),
    },
    {
      title: 'Aula',
      dataIndex: 'numeroAula',
      align: 'center',
      width: '150px',
    },
    {
      title: '%',
      align: 'center',
      width: '75px',
      render: montarColunaFrequencia,
    },
  ];

  return dataSource?.length ? (
    <LinhaTabela className="col-md-12">
      <DataTable
        idLinha="codigoAluno"
        columns={colunasEstudantes}
        dataSource={dataSource}
        pagination={false}
        semHover
        expandIconColumnIndex={7}
        expandedRowKeys={expandedRowKeys}
        onClickExpandir={onClickExpandir}
        rowClassName={(record, _) => {
          const ehLinhaExpandida = temLinhaExpandida(record?.codigoAluno);
          const nomeClasse = ehLinhaExpandida.length ? 'linha-ativa' : '';
          return nomeClasse;
        }}
        expandedRowRender={estudante => (
          <Loader loading={carregandoDetalhamento}>
            <DataTable
              id={`tabela-aluno-${estudante?.codigoAluno}`}
              idLinha="dataAula"
              pagination={false}
              columns={colunasDetalhamentoEstudante}
              dataSource={dadosDetalheEstudante}
              semHover
              tableLayout="fixed"
            />
          </Loader>
        )}
        expandIcon={({ expanded, onExpand, record }) =>
          expandIcon(expanded, onExpand, record)
        }
      />
    </LinhaTabela>
  ) : (
    <></>
  );
};

ListaoListaFrequencia.propTypes = {
  dataSource: PropTypes.oneOfType([PropTypes.array]),
  ehInfantil: PropTypes.oneOfType([PropTypes.bool]),
  listaTiposFrequencia: PropTypes.oneOfType([PropTypes.array]),
  periodo: PropTypes.oneOfType([PropTypes.any]),
};

ListaoListaFrequencia.defaultProps = {
  dataSource: [],
  ehInfantil: false,
  listaTiposFrequencia: [],
  periodo: null,
};

export default ListaoListaFrequencia;
