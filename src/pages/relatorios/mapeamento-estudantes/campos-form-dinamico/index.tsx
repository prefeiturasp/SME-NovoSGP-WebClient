import Select from '@/components/lib/inputs/select';
import { AbrangenciaTurmaRetornoDto } from '@/core/dto/AbrangenciaTurmaRetorno';
import { OpcaoRespostaSimplesDto } from '@/core/dto/OpcaoRespostaSimplesDto';
import { OpcoesRespostaFiltroRelatorioMapeamentoEstudanteDto } from '@/core/dto/OpcoesRespostaFiltroRelatorioMapeamentoEstudanteDto';
import mapeamentoEstudantesService from '@/core/services/mapeamento-estudantes-service';
import { Col, Form } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useCallback, useEffect, useState } from 'react';
import { OPCAO_TODOS } from '~/constantes';

interface OpcoesRespostaSelectDto {
  name: string;
  label: string;
  options: DefaultOptionType[];
}

export const RelMapeamentoEstudantesCamposFormDinamico: React.FC = () => {
  const [initialValues, setInitialValues] = useState<OpcoesRespostaSelectDto[]>([]);

  const montaOptionsStringPorCampo = (opcoes: string[]) => {
    const newMap = opcoes.map((option) => ({ label: option, value: option }));
    return newMap;
  };

  const montaOptionsPorCampo = (opcoes: OpcaoRespostaSimplesDto[]) => {
    if (!opcoes?.length) return [];

    const newMap = opcoes.map((option) => ({
      label: option?.nome,
      value: option?.id,
    }));
    return newMap;
  };

  const mapearDados = useCallback((params: OpcoesRespostaFiltroRelatorioMapeamentoEstudanteDto) => {
    const options: OpcoesRespostaSelectDto[] = [];

    options.push({
      label: 'Distorção idade/ano/série',
      name: 'opcaoRespostaIdDistorcaoIdadeAnoSerie',
      options: montaOptionsPorCampo(params.opcoesRespostaDistorcaoIdadeAnoSerie),
    });

    options.push({
      label: 'Possui plano AEE',
      name: 'opcaoRespostaIdPossuiPlanoAEE',
      options: montaOptionsPorCampo(params.opcoesRespostaPossuiPlanoAEE),
    });

    options.push({
      label: 'Acompanhado pelo NAAPA',
      name: 'opcaoRespostaIdAcompanhadoNAAPA',
      options: montaOptionsPorCampo(params.opcoesRespostaAcompanhadoNAAPA),
    });

    options.push({
      label: 'Participa do PAP',
      name: 'participaPAP',
      options: [
        { label: 'Sim', value: 1 },
        { label: 'Não', value: 0 },
      ],
    });

    options.push({
      label: 'Programa São Paulo Integral',
      name: 'opcaoRespostaIdProgramaSPIntegral',
      options: montaOptionsPorCampo(params.opcoesRespostaProgramaSPIntegral),
    });

    options.push({
      label: 'Avaliações externas (Prova São Paulo)',
      name: 'opcaoRespostaAvaliacaoExternaProvaSP',
      options: montaOptionsStringPorCampo(params.opcoesRespostaAvaliacoesExternasProvaSP),
    });

    options.push({
      label: 'Hipótese de escrita do estudante',
      name: 'opcaoRespostaHipoteseEscrita',
      options: montaOptionsStringPorCampo(params.opcoesRespostaHipoteseEscritaEstudante),
    });

    options.push({
      label: 'Frequência',
      name: 'opcaoRespostaIdFrequencia',
      options: montaOptionsPorCampo(params.opcoesRespostaFrequencia),
    });

    setInitialValues(options);
  }, []);

  const obterDados = useCallback(async () => {
    const resposta =
      await mapeamentoEstudantesService.obterFiltrosOpcoesRespostaMapeamentoEstudante();

    if (resposta.sucesso) {
      mapearDados(resposta.dados);
    } else {
      setInitialValues([]);
    }
  }, [mapearDados]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  if (!initialValues?.length) return <></>;

  return (
    <>
      {initialValues.map((campo) => {
        if (campo?.name === 'opcaoRespostaHipoteseEscrita') {
          return (
            <Col xs={24} md={12} lg={8} key={campo.name}>
              <Form.Item shouldUpdate style={{ marginBottom: 0 }}>
                {(form) => {
                  const turmas = form.getFieldValue('turmas');
                  let disabled = true;

                  if (turmas?.length) {
                    const todosSelecionado = turmas[0]?.value === OPCAO_TODOS;

                    if (todosSelecionado) {
                      disabled = false;
                    } else {
                      const anosTurmas: string[] = turmas.map(
                        (turma: AbrangenciaTurmaRetornoDto) => turma?.ano,
                      );
                      disabled = !!anosTurmas.find((ano) => Number(ano) > 0 && Number(ano) > 3);
                    }
                  }

                  if (disabled) {
                    const opcaoRespostaHipoteseEscrita = form.getFieldValue(
                      'opcaoRespostaHipoteseEscrita',
                    );

                    if (opcaoRespostaHipoteseEscrita) {
                      form.setFieldValue('opcaoRespostaHipoteseEscrita', undefined);
                    }
                  }

                  return (
                    <Form.Item label={campo.label} name={campo.name}>
                      <Select
                        disabled={disabled}
                        allowClear
                        options={campo.options}
                        placeholder={campo.label}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>
          );
        }

        return (
          <Col xs={24} md={12} lg={8} key={campo.name}>
            <Form.Item label={campo.label} name={campo.name}>
              <Select allowClear options={campo.options} placeholder={campo.label} />
            </Form.Item>
          </Col>
        );
      })}
    </>
  );
};
