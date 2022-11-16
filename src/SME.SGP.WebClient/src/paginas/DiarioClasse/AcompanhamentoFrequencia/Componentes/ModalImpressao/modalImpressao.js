import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import {
  Button,
  CheckboxComponent,
  Colors,
  DataTable,
  ModalConteudoHtml,
  RadioGroupButton,
} from '~/componentes';

import { setExibirModalImpressao } from '~/redux/modulos/acompanhamentoFrequencia/actions';

import {
  BotaoEstilizado,
  BotoesRodape,
  RadioGroupButtonCustomizado,
} from './modalImpressao.css';
import ServicoAcompanhamentoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoAcompanhamentoFrequencia';
import { erros, sucesso } from '~/servicos';
import { OPCAO_TODOS } from '~/constantes';

const ModalImpressao = ({ dadosAlunos, componenteCurricularId }) => {
  const [incluirAlunosImpressao, setIncluirAlunosImpressao] = useState(
    OPCAO_TODOS
  );
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [imprimirTodosBimestres, setImprimirTodosBimestres] = useState(false);
  const [imprimirFreqDiaria, setImprimirFreqDiaria] = useState(false);
  const [desabilitarBotaoGerar, setDesabilitarBotaoGerar] = useState(false);

  const opcaoExibirPendenciasResolvidas = [
    { value: OPCAO_TODOS, label: 'Todas as crianças/estudantes' },
    { value: '1', label: 'Crianças/estudantes selecionadas' },
  ];

  const opcaoExibirFrequenciaDiaria = [
    { value: true, label: 'Sim' },
    { value: false, label: 'Não' },
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

  const ehAlunosSelecionados = incluirAlunosImpressao === '1';

  const exibirModalImpressao = useSelector(
    store => store.acompanhamentoFrequencia.exibirModalImpressao
  );
  const bimestreSelecionado = useSelector(
    store => store.acompanhamentoFrequencia.bimestreSelecionado
  );
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const dispatch = useDispatch();

  const esconderModal = () => dispatch(setExibirModalImpressao(false));

  const onConfirmarModal = () => {
    esconderModal();
  };

  const fecharModal = async () => {
    esconderModal();
  };

  const onClickGerar = async () => {
    const bimestre = imprimirTodosBimestres ? OPCAO_TODOS : bimestreSelecionado;
    const alunosCodigos = ehAlunosSelecionados
      ? alunosSelecionados
      : [OPCAO_TODOS];

    const retorno = await ServicoAcompanhamentoFrequencia.gerar({
      alunosCodigos,
      componenteCurricularId,
      dreCodigo: turmaSelecionada?.dre,
      ueCodigo: turmaSelecionada?.unidadeEscolar,
      bimestre,
      imprimirFrequenciaDiaria: imprimirFreqDiaria,
      turmaCodigo: turmaSelecionada?.turma,
    }).catch(e => erros(e));
    if (retorno?.status === 200) {
      sucesso(
        'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
      );
    }
    fecharModal();
  };

  useEffect(() => {
    const desabilitar = ehAlunosSelecionados && !alunosSelecionados?.length;
    setDesabilitarBotaoGerar(desabilitar);
  }, [imprimirTodosBimestres, ehAlunosSelecionados, alunosSelecionados]);

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
          onClick={onClickGerar}
          disabled={desabilitarBotaoGerar}
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

      <RadioGroupButton
        label="Imprimir frequência diária"
        opcoes={opcaoExibirFrequenciaDiaria}
        valorInicial
        onChange={e => {
          setImprimirFreqDiaria(e.target.value);
        }}
        value={imprimirFreqDiaria}
      />

      <RadioGroupButtonCustomizado
        label="Quais crianças/estudantes deseja incluir na impressão do relatório?"
        opcoes={opcaoExibirPendenciasResolvidas}
        valorInicial
        onChange={e => {
          setIncluirAlunosImpressao(e.target.value);
        }}
        value={incluirAlunosImpressao}
      />

      {ehAlunosSelecionados && (
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
  componenteCurricularId: PropTypes.string,
};

ModalImpressao.defaultProps = {
  dadosAlunos: [],
  componenteCurricularId: '',
};

export default ModalImpressao;
