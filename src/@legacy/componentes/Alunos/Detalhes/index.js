import { Card, Divider } from 'antd';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import EstudanteAtendidoAEE from '@/components/sgp/estudante-atendido-aee';
import Button from '~/componentes/button';
import { Base, Colors } from '~/componentes/colors';
import { SGP_BUTTON_IMPRIMIR_DADOS_INDIVIDUAIS } from '~/constantes/ids/button';
import { formatarFrequencia } from '~/utils';
import FotoEstudanteObjectCard from './imagemEstudanteObjectCard';
import {
  Container,
  DadosAluno,
  FrequenciaGlobal,
  TextoStrong,
  DivLinhaItem,
} from './styles';
import EstudanteMatriculadoPAP from '@/components/sgp/estudante-matriculado-pap';

const DetalhesAluno = props => {
  const {
    dados,
    desabilitarImprimir,
    onClickImprimir,
    exibirBotaoImprimir,
    exibirFrequencia,
    exibirResponsavel,
    permiteAlterarImagem,
    exibirCpf,
  } = props;

  const {
    nome,
    numeroChamada,
    dataNascimento,
    codigoEOL,
    dataSituacao,
    frequencia,
    nomeResponsavel,
    tipoResponsavel,
    celularResponsavel,
    dataAtualizacaoContato,
    turma,
    idade,
    documentoCpf,
  } = dados;

  const situacao = dados?.situacao || dados?.situacaoMatricula;

  const numeroLinhas = () => {
    if (
      nomeResponsavel &&
      exibirResponsavel &&
      (exibirBotaoImprimir || exibirFrequencia)
    ) {
      return 6;
    }

    if (!exibirResponsavel) {
      return 12;
    }

    return 8;
  };

  return (
    <Container>
      <Card
        type="inner"
        className="rounded"
        headStyle={{ borderBottomRightRadius: 0 }}
        bodyStyle={{ borderTopRightRadius: 0 }}
      >
        <DadosAluno className="row">
          <section>
            <FotoEstudanteObjectCard
              codigoEOL={codigoEOL}
              permiteAlterarImagem={permiteAlterarImagem}
            />
            <div>
              <DivLinhaItem>
                <TextoStrong>Código EOL:</TextoStrong> {codigoEOL}
              </DivLinhaItem>
              <DivLinhaItem>
                <TextoStrong>Nome completo:</TextoStrong>
                {nome} Nº
                {numeroChamada}
              </DivLinhaItem>

              {dataNascimento && (
                <DivLinhaItem>
                  <TextoStrong>Data de nascimento:</TextoStrong>
                  {moment(dataNascimento).format('L')} ( {idade} anos )
                </DivLinhaItem>
              )}

              {exibirCpf && (
                <DivLinhaItem>
                  <TextoStrong>Documento (CPF):</TextoStrong>
                  {documentoCpf}
                </DivLinhaItem>
              )}
            </div>
          </section>

          {nomeResponsavel && exibirResponsavel && (
            <Divider
              type="vertical"
              style={{ height: 120, borderLeft: '1px solid #DADADA' }}
            />
          )}

          {nomeResponsavel && exibirResponsavel ? (
            <section>
              <div>
                <DivLinhaItem>
                  <TextoStrong>Situação:</TextoStrong> {situacao} em{' '}
                  {dataSituacao ? moment(dataSituacao).format('L') : ''}{' '}
                  {dataSituacao ? moment(dataSituacao).format('LT') : ''}
                </DivLinhaItem>

                {turma && (
                  <DivLinhaItem>
                    <TextoStrong>Turma:</TextoStrong> {turma}
                  </DivLinhaItem>
                )}

                <DivLinhaItem>
                  <TextoStrong> Responsável:</TextoStrong>
                  {nomeResponsavel}{' '}
                  <span
                    style={{ color: Base.CinzaDesabilitado, fontSize: '13px' }}
                  >{` (${tipoResponsavel})`}</span>
                </DivLinhaItem>

                <DivLinhaItem>
                  <TextoStrong>Telefone:</TextoStrong> {celularResponsavel}
                  <span
                    style={{ color: Base.CinzaDesabilitado, fontSize: '13px' }}
                  >{` (Atualizado - ${
                    dataAtualizacaoContato
                      ? moment(dataAtualizacaoContato).format('L')
                      : ''
                  })`}</span>
                </DivLinhaItem>
              </div>
              <div>
                <EstudanteAtendidoAEE show={dados?.ehAtendidoAEE} />
                <EstudanteMatriculadoPAP show={dados?.ehMatriculadoTurmaPAP} />
              </div>
            </section>
          ) : (
            ''
          )}
          {exibirBotaoImprimir || exibirFrequencia ? (
            <section>
              {exibirBotaoImprimir ? (
                <Button
                  icon="print"
                  className="ml-auto mb-4"
                  color={Colors.Azul}
                  border
                  onClick={() => onClickImprimir(dados)}
                  disabled={desabilitarImprimir}
                  id={SGP_BUTTON_IMPRIMIR_DADOS_INDIVIDUAIS}
                />
              ) : (
                ''
              )}
              {exibirFrequencia ? (
                <FrequenciaGlobal>
                  {`Frequência Global: `}
                  {formatarFrequencia(frequencia)}
                </FrequenciaGlobal>
              ) : (
                ''
              )}
            </section>
          ) : (
            ''
          )}
        </DadosAluno>
      </Card>
    </Container>
  );
};

DetalhesAluno.propTypes = {
  dados: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  desabilitarImprimir: PropTypes.oneOfType([PropTypes.bool]),
  onClickImprimir: PropTypes.oneOfType([PropTypes.func]),
  exibirBotaoImprimir: PropTypes.oneOfType([PropTypes.bool]),
  exibirFrequencia: PropTypes.oneOfType([PropTypes.bool]),
  exibirResponsavel: PropTypes.bool,
  permiteAlterarImagem: PropTypes.bool,
};

DetalhesAluno.defaultProps = {
  dados: [],
  desabilitarImprimir: true,
  onClickImprimir: () => {},
  exibirBotaoImprimir: true,
  exibirFrequencia: true,
  exibirResponsavel: true,
  permiteAlterarImagem: true,
};

export default DetalhesAluno;
