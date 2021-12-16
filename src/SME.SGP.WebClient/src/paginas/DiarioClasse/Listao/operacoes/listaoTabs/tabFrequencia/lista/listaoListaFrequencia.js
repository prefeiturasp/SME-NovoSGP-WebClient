import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataTable } from '~/componentes';
import { Base } from '~/componentes/colors';
import tipoIndicativoFrequencia from '~/dtos/tipoIndicativoFrequencia';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import CampoTiposFrequencia from './componentes/campoTiposFrequencia';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import {
  IndicativoAlerta,
  IndicativoCritico,
  LinhaTabela,
  TextoEstilizado,
} from './listaFrequencia.css';

const ListaoListaFrequencia = () => {
  const {
    componenteCurricular,
    dadosFrequencia,
    setDadosFrequencia,
    listaoEhInfantil,
  } = useContext(ListaoContext);

  const dispatch = useDispatch();

  const [dadosDetalheEstudante, setDadosDetalheEstudante] = useState([]);

  const montarTituloEstudante = () => {
    return (
      <span className="fonte-16">
        Nome {listaoEhInfantil ? 'da criança' : 'do estudante'}
      </span>
    );
  };

  const montarColunaFrequenciaDiaria = (
    indexEstudante,
    indexAula,
    dataAula,
    dadosDiaAula
  ) => {
    return (
      <CampoTiposFrequencia
        tipoFrequencia={dadosDiaAula.tipoFrequencia}
        listaTiposFrequencia={dadosFrequencia?.listaTiposFrequencia}
        onChange={valorNovo => {
          const dados = dadosFrequencia;
          dados.listaFrequencia[indexEstudante].aulas[
            indexAula
          ].tipoFrequencia = valorNovo;

          if (dados.listaFrequencia[indexEstudante]?.detalhesAulas?.length) {
            const dataParaSetarFreq = dados.listaFrequencia[
              indexEstudante
            ].detalhesAulas.find(d => d.dataAula === dataAula);

            if (dataParaSetarFreq) {
              const indexData = dados.listaFrequencia[
                indexEstudante
              ].detalhesAulas.indexOf(dataParaSetarFreq);

              const { aulas } = dados.listaFrequencia[
                indexEstudante
              ].detalhesAulas[indexData];

              aulas.forEach(aula => {
                aula.tipoFrequencia = valorNovo;
              });
            }
          }
          dispatch(setTelaEmEdicao(true));
          setDadosFrequencia({ ...dados });
        }}
      />
    );
  };

  const montarColunaFrequenciaAula = dadosAula => {
    return (
      <CampoTiposFrequencia
        tipoFrequencia={dadosAula.tipoFrequencia}
        listaTiposFrequencia={dadosFrequencia?.listaTiposFrequencia}
        onChange={valorNovo => {
          dadosAula.tipoFrequencia = valorNovo;
          dispatch(setTelaEmEdicao(true));
          setDadosFrequencia({ ...dadosFrequencia });
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
      width: '350px',
    },
  ];

  if (
    dadosFrequencia?.listaFrequencia?.[0]?.aulas?.length &&
    componenteCurricular.registraFrequencia
  ) {
    dadosFrequencia.listaFrequencia[0].aulas.forEach((aula, indexAula) => {
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
          const indexEstudante = dadosFrequencia.listaFrequencia.indexOf(
            estudante
          );
          return montarColunaFrequenciaDiaria(
            indexEstudante,
            indexAula,
            aula.dataAula,
            dadosDiaAula
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

  const onClickExpandir = (expandir, dadosEstudante) => {
    if (expandir) {
      setExpandedRowKeys([dadosEstudante?.codigoAluno]);
      setDadosDetalheEstudante(dadosEstudante.detalhesAulas);
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
      render: dataAula => window.moment(dataAula).format('DD/MM/YYYY'),
    },
  ];

  if (dadosDetalheEstudante?.[0]?.aulas?.length) {
    let indexDiaMaiorQtdAulas = 0;
    let totalAulas = 0;
    dadosDetalheEstudante.forEach((item, i) => {
      if (item.aulas.length > totalAulas) {
        totalAulas = item.aulas.length;
        indexDiaMaiorQtdAulas = i;
      }
    });

    dadosDetalheEstudante[indexDiaMaiorQtdAulas].aulas.forEach(
      (aula, indexAula) => {
        colunasDetalhamentoEstudante.push({
          title: `Aula ${aula.numeroAula}`,
          align: 'center',
          dataIndex: `aulas.${indexAula}`,
          width: '150px',
          render: dadosAula => {
            if (dadosAula?.numeroAula) {
              return montarColunaFrequenciaAula(dadosAula);
            }

            return '-';
          },
        });
      }
    );
  }

  colunasDetalhamentoEstudante.push({
    title: '%',
    align: 'center',
    width: '70px',
    render: montarColunaFrequencia,
  });

  return dadosFrequencia?.listaFrequencia?.length ? (
    <LinhaTabela className="col-md-12 p-0">
      <DataTable
        idLinha="codigoAluno"
        columns={colunasEstudantes}
        dataSource={dadosFrequencia.listaFrequencia}
        pagination={false}
        semHover
        expandIconColumnIndex={
          dadosFrequencia?.listaFrequencia?.[0]?.aulas?.length + 3 || null
        }
        expandedRowKeys={expandedRowKeys}
        onClickExpandir={onClickExpandir}
        rowClassName={(record, _) => {
          const ehLinhaExpandida = temLinhaExpandida(record?.codigoAluno);
          const nomeClasse = ehLinhaExpandida.length ? 'linha-ativa' : '';
          return nomeClasse;
        }}
        expandedRowRender={estudante => (
          <DataTable
            id={`tabela-aluno-${estudante?.codigoAluno}`}
            idLinha="dataAula"
            pagination={false}
            columns={colunasDetalhamentoEstudante}
            dataSource={dadosDetalheEstudante}
            semHover
            tableLayout="fixed"
          />
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

export default ListaoListaFrequencia;
