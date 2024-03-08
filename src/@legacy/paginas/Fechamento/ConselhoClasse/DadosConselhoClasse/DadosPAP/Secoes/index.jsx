import { Base, CardCollapse, Label, Loader } from '@/@legacy/componentes';
import QuestionarioDinamico from '@/@legacy/componentes-sgp/QuestionarioDinamico/questionarioDinamico';
import { HttpStatusCode } from '@/core/enum/http-status-code';
import { Col, Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { erros } from '~/servicos';
import ServicoConselhoClasse from '~/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';

export const MontarQuestionarioPAPConselhoClasse = ({ bimestre, codigoAluno }) => {
  const usuario = useSelector((store) => store.usuario);
  const { turmaSelecionada } = usuario;

  const [exibirDados, setExibirDados] = useState(false);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [dadosSecoes, setDadosSecoes] = useState([]);

  const exibirCollapsePAP = !!dadosSecoes?.length;

  const obterQuestionario = useCallback(async () => {
    setExibirLoader(true);

    const parametros = {
      codigoTurmaRegular: turmaSelecionada?.turma,
      codigoAluno,
      bimestre,
    };
    const resposta = await ServicoConselhoClasse.obterQuestionarioPAPConselhoClasse(
      parametros,
    ).catch((e) => erros(e));

    if (resposta?.status === HttpStatusCode.Ok && resposta?.data?.length) {
      setDadosSecoes(resposta.data);
    } else {
      setDadosSecoes();
    }

    setExibirLoader(false);
  }, [turmaSelecionada, codigoAluno, bimestre]);

  useEffect(() => {
    if (turmaSelecionada.turma && bimestre && codigoAluno) {
      obterQuestionario();
    } else {
      setDadosSecoes([]);
    }
  }, [turmaSelecionada, bimestre, codigoAluno, obterQuestionario]);

  if (!exibirCollapsePAP) return <></>;

  if (exibirLoader)
    return (
      <div className="col-sm-12 mb-6 mt-4">
        <Loader loading tip="Validando exibição dados Relatório de PAP" />
      </div>
    );

  return (
    <div className="col-sm-12 mb-2">
      <CardCollapse
        titulo="Relatório de PAP"
        configCabecalho={{
          altura: '50px',
          corBorda: Base.AzulBordaCard,
        }}
        onClick={() => setExibirDados(!exibirDados)}
        show={exibirDados}
      >
        {dadosSecoes.map((dados) => {
          const secaoComQuestoesRespondidas = dados?.questoes?.find((questao) => {
            const questaoRespondida = questao?.resposta?.find(
              (resposta) => !!(resposta?.texto || resposta?.opcaoRespostaId),
            );

            return questaoRespondida;
          });

          if (secaoComQuestoesRespondidas?.id) {
            return (
              <Row key={dados?.id}>
                <Label text={dados?.nome} />
                <Col span={24}>
                  <QuestionarioDinamico
                    dados={dados}
                    desabilitarCampos
                    exibirLabel={false}
                    exibirOrdemLabel={false}
                    codigoAluno={codigoAluno}
                    exibirCampoSemValor={false}
                    codigoTurma={turmaSelecionada?.turma}
                    anoLetivo={turmaSelecionada?.anoLetivo}
                    dadosQuestionarioAtual={dados?.questoes}
                    validarCampoObrigatorioCustomizado={() => false}
                  />
                </Col>
              </Row>
            );
          }

          return <></>;
        })}
      </CardCollapse>
    </div>
  );
};
