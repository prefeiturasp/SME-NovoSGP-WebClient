import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Colors, Loader, Button, ModalConteudoHtml } from '~/componentes';

import { BotaoEstilizado, TabelaEstilizada } from './listaAlunos.css';

const ModalAlunos = props => {
  const {
    alunosLoader,
    alunosSelecionados,
    dadosAlunos,
    linhasSelecionadas,
    modalAlunosVisivel,
    onConfirm,
    setLinhasSelecionadas,
    setModalAlunosVisivel,
  } = props;

  const [alunos, setAlunos] = useState([]);

  const columns = [
    {
      title: 'Nº',
      dataIndex: 'numeroAlunoChamada',
      width: 50,
    },
    {
      title: 'Criança/estudante',
      dataIndex: 'nomeAluno',
    },
  ];

  const obterAlunos = useCallback(() => {
    const alunosLista = dadosAlunos?.map(aluno => ({
      key: aluno.codigoAluno,
      nomeAluno: aluno.nomeAluno,
      numeroAlunoChamada: aluno.numeroAlunoChamada,
      codigoAluno: aluno.codigoAluno,
      selecionado: !!alunosSelecionados?.find(
        item => item === aluno.codigoAluno
      ),
    }));

    setAlunos(alunosLista.filter(item => !item.selecionado));
  }, [dadosAlunos, alunosSelecionados]);

  useEffect(() => {
    if (dadosAlunos?.length) {
      obterAlunos();
    }
  }, [obterAlunos, dadosAlunos]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setLinhasSelecionadas(selectedRows);
    },
    getCheckboxProps: record => ({
      name: record.name,
    }),
  };

  return (
    <ModalConteudoHtml
      titulo="Selecione a(s) criança(s)/estudante(s)"
      visivel={modalAlunosVisivel}
      onClose={() => {
        setModalAlunosVisivel(false);
      }}
      closable
      loader={alunosLoader}
      width="50%"
      fecharAoClicarFora
      fecharAoClicarEsc
      esconderBotoes
      botoesRodape={
        <>
          <div className="d-flex justify-content-end">
            <BotaoEstilizado
              id="btn-cancelar"
              key="btn-cancelar"
              label="Cancelar"
              color={Colors.CinzaMako}
              bold
              className="mr-2 padding-btn-confirmacao"
              onClick={() => {
                setModalAlunosVisivel(false);
              }}
            />
            <Button
              id="btn-confirmar"
              key="btn-confirmar"
              label="Confirmar"
              color={Colors.Azul}
              bold
              border
              className="padding-btn-confirmacao"
              onClick={() => {
                onConfirm(linhasSelecionadas.map(item => item.codigoAluno));
                setModalAlunosVisivel(false);
              }}
            />
          </div>
        </>
      }
    >
      <Loader loading={alunosLoader}>
        <TabelaEstilizada
          bordered
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          columns={columns}
          dataSource={alunos}
          pagination={false}
          scroll={{ y: 300 }}
        />
      </Loader>
    </ModalConteudoHtml>
  );
};

ModalAlunos.propTypes = {
  dadosAlunos: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
    .isRequired,
  alunosSelecionados: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.array,
  ]).isRequired,
  alunosLoader: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  modalAlunosVisivel: PropTypes.bool.isRequired,
  setModalAlunosVisivel: PropTypes.bool.isRequired,
  linhasSelecionadas: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.array,
  ]).isRequired,
  setLinhasSelecionadas: PropTypes.func.isRequired,
};

export default ModalAlunos;
