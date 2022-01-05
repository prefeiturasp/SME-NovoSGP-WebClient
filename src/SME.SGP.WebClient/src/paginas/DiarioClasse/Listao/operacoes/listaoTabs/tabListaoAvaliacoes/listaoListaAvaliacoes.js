import { Tooltip } from 'antd';
import React, { useContext } from 'react';
import { DataTable } from '~/componentes';
import SinalizacaoAEE from '~/componentes-sgp/SinalizacaoAEE/sinalizacaoAEE';
import { Base } from '~/componentes/colors';
import ListaoContext from '~/paginas/DiarioClasse/Listao/listaoContext';
import { MarcadorSituacao } from '../tabFrequencia/lista/listaFrequencia.css';
import ListaoAuditoriaAvaliacoes from './listaoAuditoriaAvaliacoes';

const ListaoListaAvaliacoes = () => {
  const { dadosAvaliacao } = useContext(ListaoContext);

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
    console.log(notaAvaliacao);
  };

  const colunasEstudantes = [
    {
      title: 'Nº',
      align: 'center',
      width: '60px',
      fixed: 'left',
      render: montarColunaNumeroAula,
    },

    {
      title: 'Nome do estudante',
      width: '350px',
      fixed: 'left',
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
