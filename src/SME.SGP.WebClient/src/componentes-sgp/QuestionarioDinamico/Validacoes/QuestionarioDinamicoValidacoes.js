import * as Yup from 'yup';
import * as moment from 'moment';
import tipoQuestao from '~/dtos/tipoQuestao';
import { momentSchema } from '~/componentes/campoData/campoData';

class QuestionarioDinamicoValidacoes {
  obterValidationSchema = (dadosQuestionarioAtual, form) => {
    if (dadosQuestionarioAtual?.length && form?.state?.values) {
      const camposComValidacao = {};

      let arrayCampos = [];

      const camposValidar = form?.state?.values;
      if (camposValidar && Object.keys(camposValidar)?.length) {
        arrayCampos = Object.keys(camposValidar);
      }

      const montaValidacoes = questaoAtual => {
        if (questaoAtual?.opcaoResposta?.length) {
          questaoAtual.opcaoResposta.forEach(opcaoAtual => {
            if (opcaoAtual?.questoesComplementares?.length) {
              opcaoAtual.questoesComplementares.forEach(q => {
                montaValidacoes(q);
              });
            }
          });
        }

        const temCampoEmTela = arrayCampos.find(
          questaoId => questaoId === String(questaoAtual.id)
        );

        if (temCampoEmTela) {
          if (questaoAtual.obrigatorio) {
            switch (questaoAtual.tipoQuestao) {
              case tipoQuestao.Periodo:
                camposComValidacao[questaoAtual.id] = Yup.object()
                  .test(
                    'validarObrigatoriedadePeriodoInicioFim',
                    'OBRIGATORIO',
                    function validar() {
                      const { periodoInicio, periodoFim } = this.parent[
                        questaoAtual.id
                      ];

                      let ehValido = true;
                      if (!periodoInicio || !periodoFim) {
                        ehValido = false;
                      }
                      return ehValido;
                    }
                  )
                  .test(
                    'validarPeriodoInicioMaiorQueFim',
                    'PERIODO_INICIO_MAIOR_QUE_FIM',
                    function validar() {
                      const { periodoInicio, periodoFim } = this.parent[
                        questaoAtual.id
                      ];

                      let ehValido = true;
                      if (periodoInicio && periodoFim) {
                        const inicioMaiorQueFim = moment(
                          periodoInicio.format('YYYY-MM-DD')
                        ).isAfter(periodoFim.format('YYYY-MM-DD'));

                        if (inicioMaiorQueFim) {
                          ehValido = false;
                        }
                      }
                      return ehValido;
                    }
                  );
                break;
              case tipoQuestao.Data:
                camposComValidacao[questaoAtual.id] = momentSchema.required(
                  'Campo obrigatório'
                );
                break;
              default:
                camposComValidacao[questaoAtual.id] = Yup.string()
                  .nullable()
                  .required('Campo obrigatório');
                break;
            }
          } else {
            switch (questaoAtual.tipoQuestao) {
              case tipoQuestao.Numerico:
                if (questaoAtual.tamanho) {
                  camposComValidacao[questaoAtual.id] = Yup.string()
                    .nullable()
                    .min(
                      questaoAtual.tamanho,
                      `Preencher com ${questaoAtual.tamanho} caracteres`
                    );
                }
                break;

              default:
                break;
            }
          }
        }
      };

      if (arrayCampos?.length) {
        dadosQuestionarioAtual.forEach(questaoAtual => {
          montaValidacoes(questaoAtual);
        });

        return Yup.object().shape(camposComValidacao);
      }
    }
    return {};
  };
}

export default new QuestionarioDinamicoValidacoes();
