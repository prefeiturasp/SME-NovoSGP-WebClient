import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import {
  Button,
  CheckboxComponent,
  Colors,
  DataTable,
  ModalConteudoHtml,
} from '~/componentes';

import { setExibirModalImpressao } from '~/redux/modulos/acompanhamentoFrequencia/actions';

import {
  BotaoEstilizado,
  BotoesRodape,
  RadioGroupButtonCustomizado,
} from './modalImpressao.css';

const ModalImpressao = ({ dadosAlunos }) => {
  const [incluirCriancaImpressao, setIncluirCriancaImpressao] = useState(1);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [imprimirTodosBimestres, setImprimirTodosBimestres] = useState(false);

  const opcaoExibirPendenciasResolvidas = [
    { value: 1, label: 'Todas as crianças/estudantes' },
    { value: 2, label: 'Crianças/estudantes selecionadas' },
  ];

  const columns = [
    {
      title: 'Nº',
      dataIndex: 'numeroChamada',
      width: 50,
    },
    {
      title: 'Crianças/estudantes',
      dataIndex: 'nome',
      render: (nome, aluno) => `${nome} (${aluno.alunoRf})`,
    },
  ];

  const exibirModalImpressao = useSelector(
    store => store.acompanhamentoFrequencia.exibirModalImpressao
  );
  const bimestreSelecionado = useSelector(
    store => store.acompanhamentoFrequencia.bimestreSelecionado
  );

  const dispatch = useDispatch();

  const esconderModal = () => dispatch(setExibirModalImpressao(false));

  const onConfirmarModal = () => {
    esconderModal();
  };

  const fecharModal = async () => {
    esconderModal();
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
          id="btn-gerar"
          key="btn-gerar"
          label="Gerar"
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
      titulo={`Impressão do relatório de frequência - ${bimestreSelecionado}º Bimestre`}
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
      <CheckboxComponent
        id="imprimir-bimestres"
        label="Imprimir todos os bimestres"
        className="pb-3"
        onChangeCheckbox={e => setImprimirTodosBimestres(e.target.checked)}
        checked={imprimirTodosBimestres}
      />

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
            scroll={{ y: 225 }}
            pagination={false}
          />
        </div>
      )}
    </ModalConteudoHtml>
  );
};

ModalImpressao.propTypes = {
  dadosAlunos: PropTypes.oneOfType([PropTypes.array]),
};

ModalImpressao.defaultProps = {
  dadosAlunos: [],
};

export default ModalImpressao;
