import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Colors, DataTable, ModalConteudoHtml } from '~/componentes';

import { confirmar, erro } from '~/servicos';
import { setExibirModalImpressao } from '~/redux/modulos/acompanhamentoFrequencia/actions';

import {
  BotaoEstilizado,
  BotoesRodape,
  RadioGroupButtonCustomizado,
} from './modalImpressao.css';

const ModalImpressao = ({ dadosAlunos }) => {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [incluirCriancaImpressao, setIncluirCriancaImpressao] = useState(1);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);

  const opcaoExibirPendenciasResolvidas = [
    { value: 1, label: 'Todas as crianças' },
    { value: 2, label: 'Crianças selecionadas' },
  ];

  const columns = [
    {
      title: 'Nº',
      dataIndex: 'numeroChamada',
      width: 50,
    },
    {
      title: 'Criança/estudante',
      dataIndex: 'nome',
      render: (nome, aluno) => `${nome} (${aluno.alunoRf})`,
    },
  ];

  console.log('dados', dadosAlunos);

  const exibirModalImpressao = useSelector(
    store => store.acompanhamentoFrequencia.exibirModalImpressao
  );
  const dispatch = useDispatch();

  const esconderModal = () => dispatch(setExibirModalImpressao(false));

  const perguntarSalvarListaUsuario = async () => {
    const resposta = await confirmar(
      'Atenção',
      'Suas alterações não foram salvas, deseja salvar agora?'
    );
    return resposta;
  };

  const onConfirmarModal = () => {
    esconderModal();
  };

  const fecharModal = async () => {
    esconderModal();
    if (modoEdicao) {
      const ehPraSalvar = await perguntarSalvarListaUsuario();
      if (ehPraSalvar) {
        onConfirmarModal();
      }
    }
  };

  const botoesRodape = () => (
    <>
      <BotoesRodape>
        <BotaoEstilizado
          id="btn-cancelar"
          key="btn-cancelar"
          label="Cancelar"
          color={Colors.CinzaMako}
          bold
          className="mr-2 padding-btn-confirmacao"
          onClick={() => {
            dispatch(setExibirModalImpressao(false));
          }}
        />
        <Button
          id="btn-confirmar"
          key="btn-confirmar"
          label="Gerar relatório"
          color={Colors.Azul}
          bold
          border
          className="padding-btn-confirmacao"
          onClick={() => {}}
        />
      </BotoesRodape>
    </>
  );

  return (
    <ModalConteudoHtml
      titulo="Impressão do relatório de frequência com justificativa"
      visivel={exibirModalImpressao}
      onClose={fecharModal}
      onConfirmacaoPrincipal={onConfirmarModal}
      closable
      width="50%"
      fecharAoClicarFora
      fecharAoClicarEsc
      esconderBotoes
      botoesRodape={botoesRodape()}
      fontSizeTitulo="18"
      tipoFonte="bold"
    >
      <RadioGroupButtonCustomizado
        label="Quais crianças deseja incluir na impressão do relatório?"
        opcoes={opcaoExibirPendenciasResolvidas}
        valorInicial
        onChange={e => {
          setIncluirCriancaImpressao(e.target.value);
        }}
        value={incluirCriancaImpressao}
      />

      {incluirCriancaImpressao === 2 && (
        <div className="pt-3">
          <DataTable
            idLinha="alunoRf"
            id="lista-alunos"
            selectedRowKeys={alunosSelecionados}
            onSelectRow={ids => setAlunosSelecionados(ids)}
            columns={columns}
            dataSource={dadosAlunos}
            selectMultipleRows
            scroll={{ y: 250 }}
            pagination={false}
          />
        </div>
      )}
    </ModalConteudoHtml>
  );
};

export default ModalImpressao;
