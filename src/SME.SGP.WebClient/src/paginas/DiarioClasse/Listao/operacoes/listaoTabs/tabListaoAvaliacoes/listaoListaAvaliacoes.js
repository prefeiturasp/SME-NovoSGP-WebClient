import { Tooltip } from 'antd';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { DataTable } from '~/componentes';
import SinalizacaoAEE from '~/componentes-sgp/SinalizacaoAEE/sinalizacaoAEE';
import { Base } from '~/componentes/colors';
import notasConceitos from '~/dtos/notasConceitos';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { MarcadorSituacao } from '../tabFrequencia/lista/listaFrequencia.css';
import LabelAusenteCellTable from './componentes/labelAusenteCellTable';
import ListaoCampoConceito from './componentes/listaoCampoConceito';
import ListaoCampoNota from './componentes/listaoCampoNota';
import ListaoAuditoriaAvaliacoes from './listaoAuditoriaAvaliacoes';

const ListaoListaAvaliacoes = () => {
  const usuario = useSelector(store => store.usuario);
  const { ehProfessorCj } = usuario;

  const { dadosAvaliacao } = useContext(ListaoContext);

  // TODO
  const desabilitarCampos = false;

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

  const montarCampoNotaConceito = (dadosEstudante, avaliacao) => {
    const notaAvaliacao = dadosEstudante.notasAvaliacoes.find(
      item => item.atividadeAvaliativaId === avaliacao.id
    );

    const desabilitarNota = ehProfessorCj ? !avaliacao?.ehCJ : avaliacao?.ehCJ;

    console.log(notaAvaliacao);

    switch (Number(dadosAvaliacao?.notaTipo)) {
      case Number(notasConceitos.Notas):
        return (
          <>
            {notaAvaliacao?.ausente ? <LabelAusenteCellTable /> : <></>}
            <ListaoCampoNota
              name={`aluno${dadosEstudante.id}`}
              nota={notaAvaliacao}
              onChangeNotaConceito={valorNovo =>
                console.log(`VALOR NOVO: ${valorNovo}`)
              }
              desabilitarCampo={
                desabilitarCampos ||
                desabilitarNota ||
                !notaAvaliacao.podeEditar
              }
            />
          </>
        );
      case Number(notasConceitos.Conceitos):
        return (
          <>
            {notaAvaliacao?.ausente ? <LabelAusenteCellTable /> : <></>}
            <ListaoCampoConceito
              nota={notaAvaliacao}
              onChangeNotaConceito={valorNovo =>
                console.log(`VALOR NOVO: ${valorNovo}`)
              }
              desabilitarCampo={desabilitarCampos || !notaAvaliacao?.podeEditar}
              listaTiposConceitos={dadosAvaliacao?.listaTiposConceitos}
            />
          </>
        );
      default:
        return '';
    }
  };

  const colunasEstudantes = [
    {
      title: 'Nº',
      align: 'center',
      width: '60px',
      render: montarColunaNumeroAula,
    },

    {
      title: 'Nome do estudante',
      width: '350px',
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
        render: dadosEstudamte =>
          montarCampoNotaConceito(dadosEstudamte, avaliacao),
      });
    });
  }

  return dadosAvaliacao?.bimestres?.[0]?.alunos ? (
    <>
      <div className="col-md-12 p-0">
        <DataTable
          scroll={{ x: 1000, y: 500 }}
          columns={colunasEstudantes}
          dataSource={dadosAvaliacao?.bimestres?.[0]?.alunos}
          pagination={false}
          semHover
          tableResponsive={false}
        />
      </div>
      <ListaoAuditoriaAvaliacoes />
    </>
  ) : (
    <></>
  );
};

export default ListaoListaAvaliacoes;
