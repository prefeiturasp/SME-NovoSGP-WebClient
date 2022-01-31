import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import shortid from 'shortid';
import styled from 'styled-components';
import { DataTable } from '~/componentes';
import SinalizacaoAEE from '~/componentes-sgp/SinalizacaoAEE/sinalizacaoAEE';
import { Base } from '~/componentes/colors';
import { BIMESTRE_FINAL } from '~/constantes/constantes';
import notasConceitos from '~/dtos/notasConceitos';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import { MarcadorSituacao } from '../tabFrequencia/lista/listaFrequencia.css';
import ListaoCampoConceito from '../tabListaoAvaliacoes/componentes/listaoCampoConceito';
import ListaoCampoNota from '../tabListaoAvaliacoes/componentes/listaoCampoNota';

export const ContainerTableFechamento = styled.div`
  tr {
    position: relative;
  }
`;

const ListaoListaFechamento = props => {
  const dispatch = useDispatch();

  const {
    componenteCurricular,
    dadosFechamento,
    setDadosFechamento,
    somenteConsultaListao,
    periodoAbertoListao,
    bimestreOperacoes,
  } = useContext(ListaoContext);

  const { ehEJA } = props;

  const desabilitarCampos = somenteConsultaListao || !periodoAbertoListao;

  const montarColunaNumeroEstudante = aluno => {
    return (
      <span className="d-flex justify-content-center">
        <span>{aluno.numeroChamada}</span>

        {aluno?.marcador && (
          <Tooltip title={aluno?.marcador?.descricao} placement="top">
            <MarcadorSituacao
              className="fas fa-circle"
              style={{
                marginRight: '-10px',
                color: Base.Roxo,
              }}
            />
          </Tooltip>
        )}
      </span>
    );
  };

  const montarColunaEstudante = aluno => {
    return (
      <div className="d-flex justify-content-between">
        <div className="d-flex justify-content-start">{aluno.nome}</div>
        <div className=" d-flex justify-content-end">
          <SinalizacaoAEE exibirSinalizacao={aluno.ehAtendidoAEE} />
        </div>
      </div>
    );
  };

  const onChangeNotaConceito = (
    valorNovo,
    codigoAluno,
    podeEditar,
    indexNotaFechamento
  ) => {
    if (!desabilitarCampos && podeEditar && dadosFechamento?.alunos?.length) {
      const alunos = dadosFechamento?.alunos;

      const aluno = alunos.find?.(item => item?.codigoAluno === codigoAluno);
      if (aluno) {
        const indexEstudante = alunos?.indexOf?.(aluno);
        const novosDados = dadosFechamento;
        novosDados.alunos[indexEstudante].notasConceitos[
          indexNotaFechamento
        ].notaConceito = valorNovo;
        novosDados.alunos[indexEstudante].notasConceitos[
          indexNotaFechamento
        ].modoEdicao = true;

        setDadosFechamento(dadosFechamento);
        dispatch(setTelaEmEdicao(true));
      }
    }
  };

  const montarCampoNotaConceito = dadosEstudante => {
    // TODO: Validar quando for regencia
    // Quando não for regencia pegar index 0 pois vai ter somente um campo
    // Quando for regencia vai ter um novo componente no lugar do campo, vai abrir uma nova linha na tabela

    const notaFechamento = dadosEstudante.notasConceitos?.[0];

    const indexNotaFechamento = dadosEstudante.notasConceitos.indexOf(
      notaFechamento
    );

    const desabilitar = desabilitarCampos || !dadosEstudante?.podeEditar;

    switch (Number(dadosFechamento?.notaTipo)) {
      case notasConceitos.Notas:
        return (
          <ListaoCampoNota
            dadosNota={notaFechamento}
            idCampo={shortid.generate()}
            desabilitar={desabilitar}
            podeEditar={dadosEstudante?.podeEditar}
            ehFechamento
            periodoFim={dadosFechamento?.periodoFim}
            mediaAprovacaoBimestre={dadosFechamento?.mediaAprovacaoBimestre}
            onChangeNotaConceito={valorNovo =>
              onChangeNotaConceito(
                valorNovo,
                dadosEstudante?.codigoAluno,
                dadosEstudante?.podeEditar,
                indexNotaFechamento
              )
            }
          />
        );
      case notasConceitos.Conceitos:
        return (
          <ListaoCampoConceito
            dadosConceito={notaFechamento}
            idCampo={shortid.generate()}
            desabilitar={desabilitar}
            listaTiposConceitos={dadosFechamento?.listaTiposConceitos}
            onChangeNotaConceito={valorNovo =>
              onChangeNotaConceito(
                valorNovo,
                dadosEstudante?.codigoAluno,
                dadosEstudante?.podeEditar,
                indexNotaFechamento
              )
            }
          />
        );
      default:
        return '';
    }
  };

  const montarColunaNotaConceitoPorBimestre = () => {
    // TODO - disciplinaId Quando for FINAL e for regente selecionar uma disciplina para filtrar as notas/conceitos do bimestre
    const disciplinaId = 138;

    const bimestres = [1, 2];
    if (!ehEJA) {
      bimestres.push(3);
      bimestres.push(4);
    }

    const mapColunas = bimestres.map(bimestre => {
      return {
        title: `${bimestre}º`,
        align: 'center',
        width: '70px',
        dataIndex: 'notasConceitosBimestre',
        render: notasConceitosBimestre => {
          let notaBimestre = {};
          if (componenteCurricular?.regencia) {
            notaBimestre = notasConceitosBimestre.find(
              item =>
                item?.bimestre === bimestre &&
                item?.disciplinaId === disciplinaId
            );
          } else {
            notaBimestre = notasConceitosBimestre.find(
              item => item?.bimestre === bimestre
            );
          }

          if (notaBimestre && notaBimestre?.notaConceito) {
            return notaBimestre?.notaConceito;
          }

          return '-';
        },
      };
    });

    return mapColunas;
  };

  const colunasEstudantes = [
    {
      title: 'Nº',
      align: 'center',
      width: '60px',
      render: montarColunaNumeroEstudante,
    },
    {
      title: 'Nome do estudante',
      render: montarColunaEstudante,
    },
  ];

  if (bimestreOperacoes === BIMESTRE_FINAL) {
    colunasEstudantes.push({
      title:
        Number(dadosFechamento?.notaTipo) === notasConceitos.Notas
          ? 'Nota bimestre'
          : 'Conceito bimestre',
      align: 'center',
      width: '110px',
      children: montarColunaNotaConceitoPorBimestre(),
    });
  } else {
    colunasEstudantes.push({
      title:
        Number(dadosFechamento?.notaTipo) === notasConceitos.Notas
          ? 'Nota'
          : 'Conceito',
      align: 'center',
      width: '110px',
      render: dadosEstudante => montarCampoNotaConceito(dadosEstudante),
    });
  }

  if (componenteCurricular?.registraFrequencia) {
    colunasEstudantes.push({
      title: 'Frequência',
      align: 'center',
      dataIndex: 'percentualFrequencia',
      width: '110px',
      render: percentualFrequencia =>
        percentualFrequencia ? `${percentualFrequencia}%` : '',
    });
  }

  return (
    <ContainerTableFechamento className="col-md-12 p-0">
      <DataTable
        scroll={{ y: 500 }}
        columns={colunasEstudantes}
        dataSource={dadosFechamento?.alunos}
        pagination={false}
        semHover
        tableResponsive={false}
        idLinha="codigoAluno"
      />
    </ContainerTableFechamento>
  );
};

ListaoListaFechamento.defaultProps = {
  ehEJA: PropTypes.bool,
};

ListaoListaFechamento.propTypes = {
  ehEJA: false,
};

export default ListaoListaFechamento;
