import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Colors, DataTable, ModalConteudoHtml } from '~/componentes';
import { setExibirModalAlunos } from '~/redux/modulos/comunicados/actions';
import { BotaoEstilizado } from './listaAlunos.css';

const ModalAlunos = props => {
  const { alunosSelecionados, onCloseModal } = props;

  const dispatch = useDispatch();

  const alunosComunicados = useSelector(
    store => store.comunicados?.alunosComunicados
  );

  const exibirModalAlunos = useSelector(
    store => store.comunicados?.exibirModalAlunos
  );

  const [idsAlunosSelecionados, setIdsAlunosSelecionados] = useState([]);

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
    if (alunosSelecionados?.length) {
      setIdsAlunosSelecionados(
        alunosSelecionados.map(aluno => aluno.alunoCodigo)
      );
    } else {
      setIdsAlunosSelecionados([]);
    }
  }, [alunosSelecionados]);

  useEffect(() => {
    if (alunosComunicados?.length) {
      obterAlunos();
    }
  }, [obterAlunos, alunosComunicados]);

  return exibirModalAlunos ? (
    <ModalConteudoHtml
      titulo="Selecione a(s) criança(s)/estudante(s)"
      visivel={exibirModalAlunos}
      onClose={() => {
        dispatch(setExibirModalAlunos(false));
      }}
      closable
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
                dispatch(setExibirModalAlunos(false));
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
                const novaListaAlunos = idsAlunosSelecionados.map(codigo => {
                  const dadosAluno = alunosComunicados.find(
                    aluno => aluno.codigoAluno === codigo
                  );
                  return {
                    alunoCodigo: codigo,
                    alunoNome: dadosAluno.nomeAluno,
                  };
                });
                onCloseModal(novaListaAlunos);
                dispatch(setExibirModalAlunos(false));
              }}
            />
          </div>
        </>
      }
    >
      <DataTable
        idLinha="codigoAluno"
        id="lista-alunos"
        selectedRowKeys={idsAlunosSelecionados}
        onSelectRow={ids => setIdsAlunosSelecionados(ids)}
        columns={columns}
        dataSource={alunosComunicados}
        selectMultipleRows
        scroll={{ y: 300 }}
        pagination={false}
      />
    </ModalConteudoHtml>
  ) : (
    ''
  );
};

ModalAlunos.propTypes = {
  alunosSelecionados: PropTypes.oneOfType([PropTypes.array]),
  onCloseModal: PropTypes.func,
};

ModalAlunos.defaultProps = {
  alunosSelecionados: [],
  onCloseModal: () => null,
};

export default ModalAlunos;
