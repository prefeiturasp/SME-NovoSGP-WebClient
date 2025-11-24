// ...existing code...
import QuestionarioDinamico from '~/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import tipoQuestao from '~/dtos/tipoQuestao';

// Exemplo de configuração das questões
const dadosQuestionarioAtual = [
  {
    id: 1,
    nome: 'Data de abertura da queixa',
    tipoQuestao: tipoQuestao.Data,
    obrigatorio: true,
    ordem: 1,
    resposta: [],
  },
  {
    id: 2,
    nome: 'Fluxo, alerta, termo de notificação acionado',
    tipoQuestao: tipoQuestao.Combo,
    obrigatorio: true,
    ordem: 2,
    resposta: [],
    opcaoResposta: [
      { id: 1, nome: 'Alerta' },
      { id: 2, nome: 'Termo' },
      // ...outras opções...
    ],
  },
  {
    id: 3,
    nome: 'Motivo do encaminhamento',
    tipoQuestao: tipoQuestao.EditorTexto,
    obrigatorio: true,
    ordem: 3,
    resposta: [],
  },
  {
    id: 4,
    nome: 'Trata-se de suspeita de violência',
    tipoQuestao: tipoQuestao.Checkbox,
    obrigatorio: false,
    ordem: 4,
    resposta: [],
    opcaoResposta: [{ id: 1, nome: 'Sim' }],
  },
  {
    id: 5,
    nome: 'Anexos',
    tipoQuestao: tipoQuestao.Upload,
    obrigatorio: false,
    ordem: 5,
    resposta: [],
  },
];

const dados = {
  questionarioId: 1,
  id: 123,
  // ...outros dados necessários...
};

const FormDinamicoEncaminhamentoNAAPA = () => {
  return (
    <>
      <QuestionarioDinamico
        dados={dados}
        dadosQuestionarioAtual={dadosQuestionarioAtual}
        urlUpload="/api/upload"
        // ...outros props necessários...
      />
    </>
  );
};
// ...existing code...

export default FormDinamicoEncaminhamentoNAAPA;
