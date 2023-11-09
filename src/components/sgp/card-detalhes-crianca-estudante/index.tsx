import React from 'react';

import { Base } from '@/@legacy/componentes';
import { AlunoReduzidoDto } from '@/core/dto/AlunoReduzidoDto';
import { EnderecoRespostaDto } from '@/core/dto/EnderecoRespostaDto';
import { TelefonesDto } from '@/core/dto/TelefonesDto';
import { TipoTelefone } from '@/core/enum/tipo-telefone-enum';
import { Colors } from '@/core/styles/colors';
import { formatarData, formatarDataHora } from '@/core/utils/functions/index';
import { Card, Col, Divider, Row, Typography } from 'antd';
import { formatarFrequencia } from '~/utils';

const { Title, Text } = Typography;

type CardDetalhesCriancaEstudanteProps = {
  dados?: AlunoReduzidoDto;
  titulo?: string;
  loading?: boolean;
};

const CardDetalhesCriancaEstudante: React.FC<CardDetalhesCriancaEstudanteProps> = ({
  dados,
  titulo,
  loading = false,
}) => {
  const nome = dados?.nome || '';
  const numeroChamada = dados?.numeroAlunoChamada || '';
  const tipoResponsavel = dados?.tipoResponsavel || '';
  const nomeResponsavel = dados?.nomeResponsavel || '';
  const celularResponsavel = dados?.celularResponsavel || '';
  const dataAtualizacaoContato = dados?.dataAtualizacaoContato || '';

  const dadosAlunoCard = [
    {
      titulo: 'Detalhes de nascimento:',
      valor: formatarData(dados?.dataNascimento),
    },
    {
      titulo: 'Código EOL:',
      valor: dados?.codigoAluno,
    },
    {
      titulo: 'Situação:',
      valor: dados?.situacao + ' ' + formatarDataHora(dados?.dataSituacao),
    },
  ];

  const obterLabelTelefoneFiliacao = (telefone: TelefonesDto) => {
    let label = 'Telefone';
    if (telefone.tipoTelefone) {
      label = `${label} ${TipoTelefone[telefone.tipoTelefone]}`;
    }
    return `${label}:`;
  };

  const obterLabelEndereco = () => {
    const dadosEndereco: EnderecoRespostaDto | undefined =
      dados?.dadosResponsavelFiliacao?.endereco;

    let labelEndereco = '';

    if (dadosEndereco?.logradouro) {
      labelEndereco = `${labelEndereco} ${dadosEndereco.logradouro}`;
    }
    if (dadosEndereco?.nro) {
      labelEndereco = `${labelEndereco}, ${dadosEndereco.nro}`;
    }
    if (dadosEndereco?.complemento) {
      labelEndereco = `${labelEndereco}, ${dadosEndereco.complemento} -`;
    }
    if (dadosEndereco?.bairro) {
      labelEndereco = `${labelEndereco} ${dadosEndereco.bairro} -`;
    }
    if (dadosEndereco?.CEP) {
      labelEndereco = `${labelEndereco} ${dadosEndereco.CEP} -`;
    }
    if (dadosEndereco?.nomeMunicipio) {
      labelEndereco = `${labelEndereco} ${dadosEndereco?.nomeMunicipio}`;
    }

    return labelEndereco;
  };

  return (
    <>
      <Card type={titulo ? 'inner' : undefined} title={titulo} loading={loading}>
        <Row align="middle" wrap={false} justify="space-between">
          <Col xs={12}>
            <Row justify="space-between" wrap={false}>
              <Col>
                <Title level={5}>{nome + ' ' + 'Nº' + numeroChamada}</Title>
                {dadosAlunoCard.map((dado, index) => {
                  return (
                    <Row key={index}>
                      <Text strong>{dado.titulo}</Text>
                      <Text style={{ marginLeft: 4 }}>{dado.valor}</Text>
                    </Row>
                  );
                })}
              </Col>
              <Divider type="vertical" style={{ borderColor: Colors.TEXT, height: 100 }} />
            </Row>
          </Col>
          <Col xs={12}>
            {nomeResponsavel ? (
              <>
                <Row>
                  <Text strong>Responsável:</Text>
                  <Text style={{ marginLeft: 4 }}>
                    {nomeResponsavel}
                    <span
                      style={{ color: Base.CinzaDesabilitado, fontSize: '13px' }}
                    >{` (${tipoResponsavel})`}</span>
                  </Text>
                </Row>
                <Row>
                  <Text strong>Telefone:</Text>
                  <Text style={{ marginLeft: 4 }}>{}</Text>
                </Row>
                <Row>
                  <Text strong>Telefone:</Text>
                  <Text style={{ marginLeft: 4 }}>
                    {celularResponsavel}
                    <span
                      style={{ marginLeft: 4, color: Base.CinzaDesabilitado, fontSize: '13px' }}
                    >
                      {` (Atualizado - ${
                        dataAtualizacaoContato ? formatarData(dataAtualizacaoContato) : ''
                      })`}
                    </span>
                  </Text>
                </Row>
              </>
            ) : (
              <></>
            )}
            <Row>
              <Text strong>Frequência global:</Text>
              <Text style={{ marginLeft: 4 }}>{formatarFrequencia(dados?.frequencia)}</Text>
            </Row>
          </Col>
        </Row>
      </Card>
      {!loading ? (
        <Col style={{ margin: 16 }}>
          <Row align="middle">
            <Col sm={24} md={12}>
              <Row>
                <Text strong>Nome da filiação 1:</Text>
                <Text style={{ marginLeft: 4 }}>
                  {dados?.dadosResponsavelFiliacao.nomeFiliacao1}
                </Text>
              </Row>
              <Col>
                {dados?.dadosResponsavelFiliacao.telefonesFiliacao1?.map((item, index) => {
                  return (
                    <Col key={index}>
                      <Text strong>{obterLabelTelefoneFiliacao(item)}</Text>
                      <Text style={{ marginLeft: 4 }}>{item?.numero}</Text>
                    </Col>
                  );
                })}
              </Col>
            </Col>
            <Col sm={24} md={12}>
              <Row>
                <Text strong>Nome da filiação 2:</Text>
                <Text style={{ marginLeft: 4 }}>
                  {dados?.dadosResponsavelFiliacao.nomeFiliacao1}
                </Text>
              </Row>
              <Col>
                {dados?.dadosResponsavelFiliacao.telefonesFiliacao1?.map((item, index) => {
                  return (
                    <Col key={index}>
                      <Text strong>{obterLabelTelefoneFiliacao(item)}</Text>
                      <Text style={{ marginLeft: 4 }}>{item?.numero}</Text>
                    </Col>
                  );
                })}
              </Col>
            </Col>
          </Row>
          <Row>
            <Text strong>Endereço: </Text>
            <Text style={{ marginLeft: 4 }}>{obterLabelEndereco()}</Text>
          </Row>
        </Col>
      ) : (
        <></>
      )}
    </>
  );
};

export default CardDetalhesCriancaEstudante;
