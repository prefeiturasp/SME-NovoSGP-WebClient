import { Tooltip } from 'antd';
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shortid from 'shortid';
import styled from 'styled-components';
import { DataTable, LabelSemDados } from '~/componentes';
import Nota from '~/componentes-sgp/inputs/nota';
import { clicarSetas } from '~/componentes-sgp/inputs/nota/funcoes';
import SinalizacaoAEE from '~/componentes-sgp/SinalizacaoAEE/sinalizacaoAEE';
import { Base } from '~/componentes/colors';
import notasConceitos from '~/dtos/notasConceitos';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { setTelaEmEdicao } from '~/redux/modulos/geral/actions';
import { MarcadorSituacao } from '../tabFrequencia/lista/listaFrequencia.css';
import ListaoCampoConceito from './componentes/listaoCampoConceito';
import ListaoAuditoriaAvaliacoes from './listaoAuditoriaAvaliacoes';

export const ContainerTableAvaliacao = styled.div`
  tr {
    position: relative;
  }
`;

const ListaoListaAvaliacoes = () => {
  const dispatch = useDispatch();
  const usuario = useSelector(store => store.usuario);
  const { ehProfessorCj } = usuario;

  const {
    dadosAvaliacao,
    setDadosAvaliacao,
    somenteConsultaListao,
    periodoAbertoListao,
  } = useContext(ListaoContext);

  const desabilitarCampos = somenteConsultaListao || !periodoAbertoListao;

  const montarColunaNumeroAula = aluno => {
    return (
      <span className="d-flex justify-content-center">
        <span>{aluno.numeroChamada}</span>

        {aluno?.marcador ? (
          <Tooltip title={aluno?.marcador?.descricao} placement="top">
            <MarcadorSituacao
              className="fas fa-circle"
              style={{
                marginRight: '-10px',
                color: Base.Roxo,
              }}
            />
          </Tooltip>
        ) : (
          <></>
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
    alunoId,
    podeEditar,
    indexAvaliacao
  ) => {
    if (
      !desabilitarCampos &&
      podeEditar &&
      dadosAvaliacao?.bimestres?.[0]?.alunos?.length
    ) {
      const { alunos } = dadosAvaliacao.bimestres[0];

      const aluno = alunos.find?.(item => item?.id === alunoId);
      if (aluno) {
        const indexEstudante = alunos?.indexOf?.(aluno);
        const novosDados = dadosAvaliacao;
        novosDados.bimestres[0].alunos[indexEstudante].notasAvaliacoes[
          indexAvaliacao
        ].notaConceito = valorNovo;
        novosDados.bimestres[0].alunos[indexEstudante].notasAvaliacoes[
          indexAvaliacao
        ].modoEdicao = true;

        setDadosAvaliacao(dadosAvaliacao);
        dispatch(setTelaEmEdicao(true));
      }
    }
  };

  const montarCampoNotaConceito = (dadosEstudante, avaliacao) => {
    const notaAvaliacao = dadosEstudante.notasAvaliacoes.find(
      item => item.atividadeAvaliativaId === avaliacao.id
    );

    const indexAvaliacao = dadosEstudante.notasAvaliacoes.indexOf(
      notaAvaliacao
    );

    const professorNaoEditaNota = ehProfessorCj
      ? !avaliacao?.ehCJ
      : avaliacao?.ehCJ;

    const desabilitarCampoNota =
      desabilitarCampos || professorNaoEditaNota || !notaAvaliacao.podeEditar;

    switch (Number(dadosAvaliacao?.notaTipo)) {
      case notasConceitos.Notas:
        return (
          <Nota
            onKeyDown={e =>
              clicarSetas(
                e,
                dadosEstudante,
                dadosAvaliacao?.bimestres?.[0]?.alunos,
                3
              )
            }
            dadosNota={notaAvaliacao}
            desabilitar={desabilitarCampoNota}
            idCampo={`aluno${dadosEstudante?.id}`}
            dadosArredondamento={avaliacao?.dadosArredondamento}
            onChangeNotaConceito={valorNovo =>
              onChangeNotaConceito(
                valorNovo,
                dadosEstudante.id,
                notaAvaliacao.podeEditar,
                indexAvaliacao
              )
            }
          />
        );
      case notasConceitos.Conceitos:
        return (
          <>
            <ListaoCampoConceito
              styleContainer={{ paddingRight: 15, paddingLeft: 15 }}
              dadosConceito={notaAvaliacao}
              idCampo={shortid.generate()}
              desabilitar={desabilitarCampos || !notaAvaliacao?.podeEditar}
              listaTiposConceitos={dadosAvaliacao?.listaTiposConceitos}
              onChangeNotaConceito={valorNovo =>
                onChangeNotaConceito(
                  valorNovo,
                  dadosEstudante.id,
                  notaAvaliacao.podeEditar,
                  indexAvaliacao
                )
              }
            />
          </>
        );
      default:
        return '';
    }
  };

  const temMaisDeCincoAvaliacoes =
    dadosAvaliacao?.bimestres?.[0]?.avaliacoes?.length > 5;

  const colunasEstudantes = [
    {
      title: 'Nº',
      align: 'center',
      width: '60px',
      render: montarColunaNumeroAula,
    },

    {
      title: 'Nome do estudante',
      width: temMaisDeCincoAvaliacoes ? '400px' : '',
      render: montarColunaEstudante,
    },
  ];

  const montarDescricaoEllipsis = (descricao, tamanho) => {
    if (descricao?.length >= tamanho)
      return `${descricao.substr(0, tamanho)}...`;
    return descricao;
  };

  if (dadosAvaliacao?.bimestres?.[0]?.avaliacoes?.length) {
    dadosAvaliacao.bimestres[0].avaliacoes.forEach(avaliacao => {
      const descricaoAvaliacao = montarDescricaoEllipsis(avaliacao.nome, 15);
      colunasEstudantes.push({
        title: () => (
          <div>
            <div>
              <Tooltip title={avaliacao.nome}>{descricaoAvaliacao}</Tooltip>
            </div>
            <div>{window.moment(avaliacao.data).format('DD/MM/YYYY')}</div>
            {avaliacao?.disciplinas?.length && (
              <div style={{ display: 'grid' }}>
                {avaliacao.disciplinas.map(disciplina => (
                  <div
                    alt={disciplina}
                    className="badge badge-pill border text-dark bg-white font-weight-light "
                  >
                    <Tooltip title={disciplina}>
                      {montarDescricaoEllipsis(disciplina, 20)}
                    </Tooltip>
                  </div>
                ))}
              </div>
            )}
          </div>
        ),
        align: 'center',
        width: '150px',
        className: 'position-relative',
        render: dadosEstudante =>
          montarCampoNotaConceito(dadosEstudante, avaliacao),
      });
    });
  }

  return dadosAvaliacao?.bimestres?.[0]?.alunos?.length &&
    dadosAvaliacao?.bimestres?.[0]?.avaliacoes?.length ? (
    <>
      <ContainerTableAvaliacao className="col-md-12 p-0">
        <DataTable
          scroll={{ x: 1000, y: 500 }}
          columns={colunasEstudantes}
          dataSource={dadosAvaliacao?.bimestres?.[0]?.alunos}
          pagination={false}
          semHover
          tableResponsive={false}
        />
      </ContainerTableAvaliacao>
      <ListaoAuditoriaAvaliacoes />
    </>
  ) : dadosAvaliacao?.bimestres?.length ? (
    <LabelSemDados
      text="Bimestre selecionado não possui atividade avaliativa cadastrada"
      center
    />
  ) : (
    <></>
  );
};

export default ListaoListaAvaliacoes;
