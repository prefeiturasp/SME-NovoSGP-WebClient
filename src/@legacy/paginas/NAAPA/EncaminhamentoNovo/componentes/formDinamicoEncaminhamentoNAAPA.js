import QuestionarioDinamico from '~/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import tipoQuestao from '~/dtos/tipoQuestao';
import styles from './encaminhamento.module.css';

const dadosQuestionarioAtual = [
  {
    id: 1,
    nome: 'Data de abertura da queixa',
    tipoQuestao: tipoQuestao.Data,
    obrigatorio: false,
    ordem: 1,
    resposta: [],
    placeholder: '00/00/0000',
    exibirLabel: true,
  },
  {
    id: 2,
    nome: 'Fluxo, alerta, termo de notificação acionado',
    tipoQuestao: tipoQuestao.Combo,
    obrigatorio: false,
    ordem: 2,
    resposta: [],
    opcaoResposta: [
      { id: 1, nome: 'Alerta' },
      { id: 2, nome: 'Termo' },
    ],
    exibirLabel: true,
  },
  {
    id: 3,
    nome: 'Motivo do encaminhamento',
    tipoQuestao: tipoQuestao.EditorTexto,
    obrigatorio: false,
    ordem: 3,
    resposta: [],
    placeholder: 'Digite o motivo do encaminhamento...',
    exibirLabel: true,
  },
  {
    id: 4,
    nome: 'Trata-se de suspeita de violência',
    tipoQuestao: tipoQuestao.AlertCheckbox,
    obrigatorio: false,
    ordem: 4,
    resposta: [],
    opcaoResposta: [{ id: 1 }],
    observacao:
      'Use esta opção quando existir suspeita de qualquer forma de violência. Ao selecionar, o encaminhamento será sinalizado para análise e acompanhamento prioritário.',
    exibirLabel: true,
  },
  {
    id: 5,
    nome: 'Anexos',
    tipoQuestao: tipoQuestao.Upload,
    obrigatorio: false,
    ordem: 5,
    resposta: [],
    observacao: 'Todos os formatos são suportados no limite de 100mb',
    exibirLabel: true,
  },
];

const dados = {
  questionarioId: 1,
  id: 123,
};

const FormDinamicoEncaminhamentoNAAPA = () => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className={`mb-2 ${styles.title}`}>Acionamento de fluxos</h5>
        <p className="mb-4">Insira as informações de encaminhamento.</p>
        <QuestionarioDinamico
          dados={dados}
          dadosQuestionarioAtual={dadosQuestionarioAtual}
          urlUpload="v1/encaminhamento-aee/upload"
        />
        <div className="mt-4">
          <h6>Anexo de documentos</h6>
          <p className="mb-2">Adicione os arquivos que julgar necessários.</p>
        </div>
      </div>
    </div>
  );
};

export default FormDinamicoEncaminhamentoNAAPA;
