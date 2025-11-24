import React, { useEffect, useState } from 'react';
import { Checkbox, Form, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FileTextOutlined, TeamOutlined, EyeOutlined } from '@ant-design/icons';
import Select from '@/components/lib/inputs/select';
import { DadosTabelaDinamica, Estudante } from './types';

interface ListaSondagemEscritaProps {
  dados: DadosTabelaDinamica | null;
}

const SondagemListaDinamica: React.FC<ListaSondagemEscritaProps & { formListaDinamica: any }> = ({
  dados,
  formListaDinamica,
}) => {
  const mostrarColunaLP = dados?.questao === 'escrita';
  const [opcoesCarregadas, setOpcoesCarregadas] = useState(false);

  // Primeiro carrega as opções (renderiza a tabela)
  useEffect(() => {
    if (dados?.estudantes && dados.estudantes.length > 0) {
      setOpcoesCarregadas(true);
    }
  }, [dados]);

  // Depois seta as respostas no formulário
  useEffect(() => {
    if (opcoesCarregadas && dados?.estudantes) {
      const initialValues: any = {};

      dados.estudantes.forEach((estudante, estudanteIndex) => {
        // Checkbox LP
        initialValues[`lp_${estudanteIndex}`] = estudante.lp;

        // Respostas dos selects - agora setamos o opcaoRespostaId
        estudante.coluna.forEach((coluna, colunaIndex) => {
          const respostaSelecionada = coluna.resposta?.[0];

          // Setamos o valor da opção selecionada (opcaoRespostaId)
          initialValues[`resposta_${estudanteIndex}_${colunaIndex}`] = respostaSelecionada
            ? respostaSelecionada.opcaoRespostaId
            : undefined;

          // Guardamos o id da resposta em um campo oculto para usar no save
          initialValues[`respostaId_${estudanteIndex}_${colunaIndex}`] = respostaSelecionada
            ? respostaSelecionada.id
            : '';
        });
      });

      formListaDinamica.setFieldsValue(initialValues);
    }
  }, [opcoesCarregadas, dados, formListaDinamica]);

  const handleSelectChange = (estudanteIndex: number, colunaIndex: number, value: number) => {
    console.log(`Estudante ${estudanteIndex}, Coluna ${colunaIndex}, Novo valor: ${value}`);
    // Aqui você pode adicionar lógica adicional quando o valor mudar
  };

  const handleCheckboxChange = (estudanteIndex: number, checked: boolean) => {
    console.log(`Estudante ${estudanteIndex}, LP: ${checked}`);
    // Aqui você pode adicionar lógica adicional quando o checkbox mudar
  };

  // Monta as colunas da tabela
  const columns: ColumnsType<Estudante> = [];
  const columnsDinamicas: ColumnsType<Estudante> = [];

  // Coluna LP (Checkbox) - só aparece se questao === 'escrita'
  if (mostrarColunaLP) {
    columns.push({
      title: 'LP',
      key: 'lp',
      width: 60,
      align: 'center',
      fixed: 'left',
      render: (_, _record, index) => (
        <Form.Item name={`lp_${index}`} valuePropName="checked" style={{ margin: 0 }}>
          <Checkbox onChange={(e) => handleCheckboxChange(index, e.target.checked)} />
        </Form.Item>
      ),
    });
  }

  // Coluna Estudante (Nome + Ícones)
  columns.push({
    title: 'Estudante',
    key: 'estudante',
    width: 300,
    fixed: 'left',
    render: (_, record) => (
      <Space direction="vertical" size={0} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 500 }}>
            {record.numero} - {record.nome}
          </span>
          <Space size={4}>
            {record.pap && (
              <Tag color="blue" icon={<FileTextOutlined />} style={{ margin: 0, fontSize: 10 }}>
                PAP
              </Tag>
            )}
            {record.aee && (
              <Tag color="green" icon={<TeamOutlined />} style={{ margin: 0, fontSize: 10 }}>
                AEE
              </Tag>
            )}
            {record.acessibilidade && (
              <Tag color="orange" icon={<EyeOutlined />} style={{ margin: 0, fontSize: 10 }}>
                Acessibilidade
              </Tag>
            )}
          </Space>
        </div>
      </Space>
    ),
  });

  const nomeQuestao = () => {
    switch (dados?.questao) {
      case 'escrita':
        return 'Sistema de escrita';
      case 'reescrita':
        return 'Reescrita';
      case 'producao':
        return 'Produção';
      case 'compreensao':
        return 'Compreensão de textos';
      default:
        return 'Questão';
    }
  };

  // Colunas dinâmicas (Bimestres)
  if (dados?.estudantes?.[0]?.coluna) {
    dados.estudantes[0].coluna.forEach((coluna, colunaIndex) => {
      columnsDinamicas.push({
        title: coluna.descricaoColuna,
        key: `coluna_${colunaIndex}`,
        width: 200,
        align: 'center',
        render: (_, record, estudanteIndex) => {
          const colunaEstudante = record.coluna[colunaIndex];
          const options = colunaEstudante.opcaoResposta
            .sort((a, b) => a.orden - b.orden)
            .map((opcao) => ({
              label: opcao.descricaoOpcao,
              value: opcao.id,
            }));

          const isDisabled = !colunaEstudante.PeriodoBimestreAtivo;

          return (
            <>
              {/* Campo oculto para armazenar o ID da resposta */}
              <Form.Item
                name={`respostaId_${estudanteIndex}_${colunaIndex}`}
                hidden
                initialValue=""
                style={{ margin: 0 }}
              >
                <input type="hidden" />
              </Form.Item>

              {/* Select com as opções de resposta */}
              <Form.Item
                name={`resposta_${estudanteIndex}_${colunaIndex}`}
                style={{ margin: 0 }}
                rules={[{ required: false }]}
              >
                <Select
                  id={`select_${estudanteIndex}_${colunaIndex}`}
                  options={options}
                  onChange={(value) => handleSelectChange(estudanteIndex, colunaIndex, value)}
                  placeholder="Selecione"
                  disabled={isDisabled}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </>
          );
        },
      });
    });
    columns.push({
      title: nomeQuestao(),
      children: [...columnsDinamicas],
    });
  }

  if (!dados || !dados.estudantes || dados.estudantes.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Nenhum dado disponível para exibir.</p>
      </div>
    );
  }

  // Adiciona um índice único para cada estudante
  const dataSourceComIndice = dados.estudantes.map((estudante, index) => ({
    ...estudante,
    uniqueKey: `estudante_${index}_${estudante.numero}`,
  }));

  return (
    <div style={{ marginTop: 16 }}>
      <Form form={formListaDinamica} component={false}>
        <Table
          columns={columns}
          dataSource={dataSourceComIndice}
          rowKey={(record: any) => record.uniqueKey}
          pagination={false}
          scroll={{ x: 'max-content' }}
          bordered
          size="small"
        />
      </Form>
    </div>
  );
};

export default SondagemListaDinamica;
