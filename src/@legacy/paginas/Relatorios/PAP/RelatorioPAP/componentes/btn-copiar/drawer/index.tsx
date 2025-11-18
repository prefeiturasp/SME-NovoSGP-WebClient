import ButtonPrimary from '@/components/lib/button/primary';
import { AlunoDadosBasicosDto } from '@/core/dto/AlunoDadosBasicosDto';
import { CopiarSecaoDto } from '@/core/dto/CopiarPapDto';
import { CopiarPapEstudantesDto } from '@/core/dto/CopiarPapEstudantesDto';
import { CopiarPapDto } from '@/core/dto/CopiarSecaoDto';
import { TurmaSelecionadaDTO } from '@/core/dto/TurmaSelecionadaDto';
import { HttpStatusCode } from '@/core/enum/http-status-code';
import { useAppDispatch, useAppSelector } from '@/core/hooks/use-redux';
import relatorioPapService from '@/core/services/relatorio-pap-service';
import { Checkbox, Col, Row } from 'antd';
import _, { cloneDeep } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Label, Loader } from '~/componentes';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import { DrawerContainer } from '~/paginas/NAAPA/Encaminhamento/Cadastro/componentes/drawer/styles';
import { setEstudantesRelatorioPAP } from '~/redux/modulos/relatorioPAP/actions';
import { confirmar, erro, erros, sucesso } from '~/servicos';
import ServicoRelatorioPAP from '~/servicos/Paginas/Relatorios/PAP/RelatorioPAP/ServicoRelatorioPAP';
import { ListaEstudantesPAP } from './lista-estudantes';
import { SelectTurmasRelatorioPAP } from './select-turma-pap';

interface DrawerCopiarPAPProps {
  onCloseDrawer: () => void;
}
export const DrawerCopiarPAP: React.FC<DrawerCopiarPAPProps> = ({ onCloseDrawer }) => {
  const dispatch = useAppDispatch();
  const usuario = useAppSelector((store) => store.usuario);

  const turmaSelecionada = usuario?.turmaSelecionada as TurmaSelecionadaDTO;

  const dadosSecoesRelatorioPAP = useAppSelector(
    (store) => store.relatorioPAP?.dadosSecoesRelatorioPAP as any,
  );

  const estudanteSelecionadoRelatorioPAP = useAppSelector(
    (store) => store.relatorioPAP?.estudanteSelecionadoRelatorioPAP as any,
  );

  const periodoSelecionadoPAP = useAppSelector(
    (store) => store.relatorioPAP?.periodoSelecionadoPAP as any,
  );

  const estudantesRelatorioPAP = useAppSelector(
    (store) => store.relatorioPAP?.estudantesRelatorioPAP as AlunoDadosBasicosDto[],
  );

  const [exibirLoader, setExibirLoader] = useState<boolean>(false);
  const [listaQuestoes, setListaQuestoes] = useState<any>();
  const [turmaPAPSelecionada, setTurmaPAPSelecionada] = useState<string>(turmaSelecionada?.turma);
  const [estudantesSelecionadosCopiar, setEstudantesSelecionadosCopiar] = useState<
    AlunoDadosBasicosDto[]
  >([]);

  const alunoCodigo = estudanteSelecionadoRelatorioPAP?.codigoEOL;

  const atualizarEstudantesAposCopiar = useCallback(() => {
    if (turmaPAPSelecionada === turmaSelecionada?.turma) {
      const estudantesAtualizados = cloneDeep(estudantesRelatorioPAP);

      estudantesAtualizados.forEach((estudante) => {
        const estudanteCopiado = estudantesSelecionadosCopiar.find(
          (item) => item?.codigoEOL === estudante?.codigoEOL,
        );
        if (estudanteCopiado) {
          estudante.processoConcluido = true;
        }
        dispatch(setEstudantesRelatorioPAP([...estudantesAtualizados]));
      });
    }
  }, [
    dispatch,
    turmaPAPSelecionada,
    turmaSelecionada,
    estudantesRelatorioPAP,
    estudantesSelecionadosCopiar,
  ]);

  const onClickCopiar = useCallback(async () => {
    if (!turmaPAPSelecionada) {
      erro('Obrigatório selecionar a turma que deseja vincular ao novo registro');
      return;
    }

    if (!listaQuestoes?.length) {
      erro('Obrigatório selecionar o(s) campos que deseja vincular ao novo registro');
      return;
    }

    if (!estudantesSelecionadosCopiar?.length) {
      erro('Obrigatório selecionar pelo menos um estudante que deseja vincular ao novo registro');
      return;
    }

    const estudanteSelecionadoTemRegistro = estudantesSelecionadosCopiar.find(
      (estudante) => estudante?.processoConcluido,
    );

    if (estudanteSelecionadoTemRegistro) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Há estudantes selecionados que já possuem conteúdo, ao continuar o conteúdo será sobrescrito.',
      );
      if (!confirmou) return;
    }

    const estudantes: CopiarPapEstudantesDto[] = estudantesSelecionadosCopiar.map((estudante) => ({
      alunoCodigo: estudante?.codigoEOL,
      alunoNome: estudante?.nome,
    }));

    const questaoClonadas = cloneDeep(listaQuestoes);
    const questoesSelecionadas = questaoClonadas.filter((questao: any) => !!questao?.selecionada);
    const secoes: CopiarSecaoDto[] = _(questoesSelecionadas)
      .groupBy((x) => x.secaoId)
      .map((questoes, secaoId) => ({ secaoId, questoes }))
      .map((secao) => ({
        secaoId: Number(secao.secaoId),
        questoesIds: secao.questoes.map((questao) => questao.id),
      }))
      .value();

    const params: CopiarPapDto = {
      codigoAlunoOrigem: alunoCodigo,
      codigoTurmaOrigem: turmaSelecionada?.turma,
      codigoTurma: turmaPAPSelecionada,
      periodoRelatorioPAPId: periodoSelecionadoPAP?.periodoRelatorioPAPId,
      estudantes,
      secoes,
    };

    setExibirLoader(true);

    const resposta = await relatorioPapService.copiar(params);
    if (resposta.sucesso) {
      sucesso('Registro copiado com sucesso');
      atualizarEstudantesAposCopiar();
      onCloseDrawer();
    }

    setExibirLoader(false);
  }, [
    alunoCodigo,
    listaQuestoes,
    onCloseDrawer,
    turmaSelecionada,
    turmaPAPSelecionada,
    periodoSelecionadoPAP,
    estudantesSelecionadosCopiar,
    atualizarEstudantesAposCopiar,
  ]);

  const onClose = () => {
    if (exibirLoader) return;
    onCloseDrawer();
  };

  const obterQuestionarios = useCallback(async () => {
    const parametros = {
      turmaCodigo: turmaSelecionada?.turma,
      alunoCodigo,
      periodoRelatorioPAPId: periodoSelecionadoPAP?.periodoRelatorioPAPId,
    };

    const promises: any = [];

    dadosSecoesRelatorioPAP.secoes.forEach((secao: any) => {
      if (secao?.questionarioId && alunoCodigo && secao?.nomeComponente !== 'SECAO_FREQUENCIA') {
        const promise = ServicoRelatorioPAP.obterQuestionario({
          ...parametros,
          questionarioId: secao?.questionarioId,
          papSecaoId: secao?.papSecaoId,
        })
          .then((resposta) => {
            if (resposta?.status === HttpStatusCode.Ok && resposta?.data?.length) {
              return {
                secaoId: secao?.id,
                questoes: resposta.data,
              };
            }
            return undefined;
          })
          .catch((e: any) => erros(e));

        promises.push(promise);
      }
    });

    Promise.all(promises).then((respostas) => {
      const questoes: any = [];
      respostas.forEach((resposta) => {
        if (resposta?.secaoId) {
          resposta.questoes.forEach((questao: any, index: number) => {
            let marginLeft = 0;
            if (index > 0) {
              marginLeft = 18;
            }
            questoes.push({
              ...questao,
              marginLeft,
              secaoId: resposta?.secaoId,
              selecionada: !!questao?.obrigatorio,
            });
          });
        }
      });

      setListaQuestoes(questoes);
    });
  }, [dadosSecoesRelatorioPAP, turmaSelecionada, periodoSelecionadoPAP, alunoCodigo]);

  useEffect(() => {
    if (dadosSecoesRelatorioPAP?.secoes?.length) {
      obterQuestionarios();
    }
  }, [dadosSecoesRelatorioPAP, obterQuestionarios]);

  const selecionarQuestao = (questaoSelecionada: any) => {
    setListaQuestoes((listaAtual: any) => {
      const novaLista = listaAtual.map((questao: any) => {
        if (questao?.id === questaoSelecionada?.id) {
          questao.selecionada = !questao?.selecionada;
        }

        return questao;
      });
      return novaLista;
    });
  };

  useEffect(() => {
    setEstudantesSelecionadosCopiar([]);
  }, [turmaPAPSelecionada]);

  return (
    <Col xs={24}>
      <DrawerContainer
        width="50%"
        zIndex={1100}
        onClose={onClose}
        title="Copiar conteúdo"
        open
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <Row gutter={16} justify="end">
            <Col>
              <BotaoVoltarPadrao onClick={() => onClose()} />
            </Col>
            <Col>
              <ButtonPrimary onClick={() => onClickCopiar()}>Copiar</ButtonPrimary>
            </Col>
          </Row>
        }
      >
        <Loader loading={exibirLoader}>
          <Row gutter={[16, 32]}>
            <Col xs={24}>
              <Label text="Selecione a turma que deseja vincular ao novo registro" />
              <SelectTurmasRelatorioPAP
                defaultValue={turmaSelecionada?.turma}
                value={turmaPAPSelecionada}
                onChange={setTurmaPAPSelecionada}
              />
            </Col>
            <Col xs={24}>
              <Label text="Selecione os campos que deseja vincular ao novo registro" />
              {listaQuestoes?.map((questao: any) => {
                const obrigatorio = !!questao?.obrigatorio;
                return (
                  <Row
                    gutter={16}
                    key={questao?.id}
                    wrap={false}
                    style={{ marginLeft: questao?.marginLeft || 0 }}
                  >
                    <Col>
                      <Checkbox
                        disabled={obrigatorio}
                        checked={questao?.selecionada}
                        onChange={() => selecionarQuestao(questao)}
                      />
                    </Col>
                    <Col style={{ width: '100%' }}>
                      <div style={{ width: '100%' }}>
                        <Label isRequired={obrigatorio} text={questao?.nome} />
                      </div>
                    </Col>
                  </Row>
                );
              })}
            </Col>
            <Col xs={24}>
              <Label text="Selecione o(s) estudante(s) que deseja vincular ao novo registro" />
              <ListaEstudantesPAP
                turmaPAP={turmaPAPSelecionada}
                estudantesSelecionadosCopiar={estudantesSelecionadosCopiar}
                setEstudantesSelecionadosCopiar={setEstudantesSelecionadosCopiar}
              />
            </Col>
          </Row>
        </Loader>
      </DrawerContainer>
    </Col>
  );
};
