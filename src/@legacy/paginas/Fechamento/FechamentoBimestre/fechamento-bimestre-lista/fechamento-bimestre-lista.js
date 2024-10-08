/* eslint-disable react/prop-types */
import EstudanteAtendidoAEE from '@/components/sgp/estudante-atendido-aee';
import EstudanteMatriculadoPAP from '@/components/sgp/estudante-matriculado-pap';
import { ROUTES } from '@/core/enum/routes';
import { Tooltip } from 'antd';
import * as moment from 'moment';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Colors, Loader, MarcadorTriangulo } from '~/componentes';
import Ordenacao from '~/componentes-sgp/Ordenacao/ordenacao';
import Alert from '~/componentes/alert';
import Button from '~/componentes/button';
import situacaoFechamentoDto from '~/dtos/situacaoFechamentoDto';
import ListaoBotaoAnotacao from '~/paginas/DiarioClasse/Listao/operacoes/listaoTabs/tabFrequencia/lista/componentes/listaoBotaoAnotacao';
import ServicoFechamentoBimestre from '~/servicos/Paginas/Fechamento/ServicoFechamentoBimestre';
import { erros, sucesso } from '~/servicos/alertas';
import { formatarFrequencia } from '~/utils';
import ModalAnotacaoAluno from '../../FechamentoModalAnotacaoAluno/modal-anotacao-aluno';
import FechamentoRegencia from '../fechamanto-regencia/fechamento-regencia';
import BotaoExpandir from './botao-expandir';
import {
  DataFechamentoProcessado,
  Info,
  MarcadorAulas,
  Marcadores,
  SituacaoProcessadoComPendencias,
  TabelaFechamento,
} from './fechamento-bimestre-lista.css';

const FechamentoBimestreLista = props => {
  const {
    dados,
    ehRegencia,
    ehSintese,
    codigoComponenteCurricular,
    turmaId,
    anoLetivo,
    registraFrequencia,
    desabilitarCampo,
  } = props;

  const navigate = useNavigate();

  const [dadosLista, setDadosLista] = useState(
    dados ? dados.alunos : undefined
  );
  const [situacaoFechamento, setSituacaoFechamento] = useState(dados.situacao);
  const [carregandoProcesso, setCarregandoProcesso] = useState(false);
  const [podeProcessarReprocessar] = useState(dados.podeProcessarReprocessar);
  const [periodoAberto] = useState(dados.periodoAberto);
  const [situacaosituacaoNomeFechamento, setSituacaosituacaoNomeFechamento] =
    useState(dados.situacaoNome);
  const [dataFechamento] = useState(dados.dataFechamento);

  const [exibirModalAnotacao, setExibirModalAnotacao] = useState(false);
  const [alunoModalAnotacao, setAlunoModalAnotacao] = useState({});
  const [fechamentoId, setFechamentoId] = useState(0);

  const location = useLocation();

  const alertaSucessoReprocessamento =
    'Solicitação de fechamento realizada com sucesso. Em breve você receberá uma notificação com o resultado do processo.';

  const onClickReprocessarNotasConceitos = async () => {
    const processando =
      await ServicoFechamentoBimestre.reprocessarNotasConceitos(
        dados.fechamentoId
      ).catch(e => erros(e));
    if (processando?.status === 200) {
      setSituacaoFechamento(situacaoFechamentoDto.EmProcessamento);
      setSituacaosituacaoNomeFechamento('Em Processamento');
      sucesso(alertaSucessoReprocessamento);
    }
  };

  const onClickProcessarReprocessarSintese = async () => {
    setCarregandoProcesso(true);
    const { alunos, bimestre } = dados;

    const alunosParaProcessar = alunos.map(aluno => {
      return {
        codigoAluno: aluno.codigoAluno,
        disciplinaId: codigoComponenteCurricular,
        sinteseId: aluno.sinteseId,
      };
    });
    const params = {
      id: dados?.fechamentoId,
      turmaId,
      bimestre,
      disciplinaId: codigoComponenteCurricular,
      notaConceitoAlunos: alunosParaProcessar,
    };
    const processando =
      await ServicoFechamentoBimestre.processarReprocessarSintese([
        params,
      ]).catch(e => erros(e));
    setCarregandoProcesso(false);
    if (processando?.status === 200) {
      setSituacaoFechamento(situacaoFechamentoDto.EmProcessamento);
      setSituacaosituacaoNomeFechamento('Em Processamento');
      sucesso(alertaSucessoReprocessamento);
    }
  };

  const onClickVerPendecias = async () => {
    const { bimestre } = dados;
    navigate({
      pathname: `${ROUTES.PENDENCIAS_FECHAMENTO}/${bimestre}/${codigoComponenteCurricular}`,
      state: { rotaOrigem: location.pathname },
    });
  };

  const onClickAnotacao = aluno => {
    setFechamentoId(dados.fechamentoId);
    setAlunoModalAnotacao(aluno);
    setExibirModalAnotacao(true);
  };

  const onCloseModalAnotacao = (salvou, excluiu) => {
    if (salvou) {
      alunoModalAnotacao.temAnotacao = true;
    } else if (excluiu) {
      alunoModalAnotacao.temAnotacao = false;
    }
    setExibirModalAnotacao(false);
    setAlunoModalAnotacao({});
  };

  return (
    <TabelaFechamento>
      {exibirModalAnotacao ? (
        <ModalAnotacaoAluno
          exibirModal={exibirModalAnotacao}
          onCloseModal={onCloseModalAnotacao}
          fechamentoId={fechamentoId}
          codigoTurma={turmaId}
          anoLetivo={anoLetivo}
          dadosAlunoSelecionado={alunoModalAnotacao}
          desabilitar={
            desabilitarCampo || (!podeProcessarReprocessar && !periodoAberto)
          }
        />
      ) : (
        ''
      )}
      <div className="row pb-4">
        {!periodoAberto ? (
          <div className="col-md-12">
            <Alert
              alerta={{
                tipo: 'warning',
                mensagem:
                  'Apenas é possível consultar este registro pois o período não está em aberto.',
                estiloTitulo: { fontSize: '18px' },
              }}
              className="mb-2"
            />
          </div>
        ) : (
          <></>
        )}
        {dados?.fechamentoId && dataFechamento ? (
          <div className="col-md-12 d-flex justify-content-end">
            <DataFechamentoProcessado>
              <span>{`${situacaosituacaoNomeFechamento} em ${moment(
                dataFechamento
              ).format('L')} às ${moment(dataFechamento).format('LT')}`}</span>
            </DataFechamentoProcessado>
          </div>
        ) : (
          ''
        )}
        <div className="col-md-6 col-sm-12 d-flex justify-content-start">
          <Ordenacao
            className="botao-ordenacao-avaliacao"
            conteudoParaOrdenar={dadosLista}
            ordenarColunaNumero="numeroChamada"
            ordenarColunaTexto="nome"
            retornoOrdenado={retorno => {
              setDadosLista(retorno);
            }}
            desabilitado={!dadosLista?.length}
          />
          {!ehSintese && (
            <Button
              id="btn-reprocessar"
              label="Reprocessar"
              color={Colors.Azul}
              border
              className="mr-2"
              onClick={onClickReprocessarNotasConceitos}
              disabled={
                !podeProcessarReprocessar ||
                (situacaoFechamento !==
                  situacaoFechamentoDto.ProcessadoComPendencias &&
                  situacaoFechamento !==
                    situacaoFechamentoDto.ProcessadoComErro)
              }
            />
          )}
          {ehSintese && (
            <Loader loading={carregandoProcesso} tip="">
              <Button
                label={dados?.fechamentoId ? 'Reprocessar' : 'Processar'}
                color={Colors.Azul}
                border
                className="mr-2"
                onClick={onClickProcessarReprocessarSintese}
                disabled={
                  !(
                    podeProcessarReprocessar &&
                    situacaoFechamento !== situacaoFechamentoDto.EmProcessamento
                  )
                }
              />
            </Loader>
          )}
          <Button
            id="btn-pendencias"
            label="Ver pendências"
            color={Colors.Azul}
            border
            className="mr-2"
            onClick={onClickVerPendecias}
            disabled={
              !podeProcessarReprocessar ||
              situacaoFechamento !==
                situacaoFechamentoDto.ProcessadoComPendencias
            }
          />
        </div>
        <Marcadores className="col-md-6 col-sm-12 d-flex justify-content-end">
          <SituacaoProcessadoComPendencias>
            <span>
              {situacaoFechamento
                ? situacaosituacaoNomeFechamento
                : 'Não executado'}
            </span>
          </SituacaoProcessadoComPendencias>
          <MarcadorAulas className="ml-2">
            <span>Aulas previstas </span>
            <span className="numero">
              {dados && dados.totalAulasPrevistas
                ? dados.totalAulasPrevistas
                : 0}
            </span>
          </MarcadorAulas>
          <MarcadorAulas className="ml-2">
            <span>Aulas dadas </span>
            <span className="numero">
              {dados && dados.totalAulasDadas ? dados.totalAulasDadas : 0}
            </span>
          </MarcadorAulas>
        </Marcadores>
      </div>
      <div className="col-md-12 p-0 container-table">
        <table className="table mb-0" id="table-fechamento-bimestre">
          <thead className="tabela-fechamento-thead" key="thead-fechamento">
            <tr>
              <th
                className="text-center fundo-cinza"
                style={{ minWidth: '250px' }}
                colSpan={2}
              >
                Nome
              </th>
              <th className="text-center fundo-cinza">
                {ehSintese ? 'Síntese' : 'Nota/Conceito'}
              </th>
              <th className="text-center fundo-cinza">Faltas no Bimestre</th>
              <th className="text-center fundo-cinza">Ausências Compensadas</th>
              {registraFrequencia ? (
                <th className="text-center fundo-cinza">Frequência</th>
              ) : (
                ''
              )}
            </tr>
          </thead>
          <tbody>
            {dadosLista && dadosLista.length > 0 ? (
              dadosLista.map((item, index) => {
                const idLinhaRegencia = `fechamento-regencia-${index}`;
                const refLinhaRegencia = React.createRef();

                return (
                  <>
                    <tr>
                      <td
                        className={`text-center ${
                          !item.ativo ? 'fundo-cinza' : ''
                        }`}
                      >
                        {item.numeroChamada}
                        {item.informacao ? (
                          <Tooltip title={item.informacao} placement="top">
                            <Info className="fas fa-circle" />
                          </Tooltip>
                        ) : (
                          ''
                        )}
                      </td>
                      <td className={`${!item.ativo ? 'fundo-cinza' : ''}`}>
                        <div
                          className="d-flex"
                          style={{ justifyContent: 'space-between' }}
                        >
                          <div className=" d-flex justify-content-start align-items-center">
                            {item.nome}
                          </div>
                          <div className=" d-flex justify-content-end align-items-center">
                            <EstudanteAtendidoAEE show={item.ehAtendidoAEE} />
                            <EstudanteMatriculadoPAP
                              show={item?.ehMatriculadoTurmaPAP}
                            />
                            <ListaoBotaoAnotacao
                              permiteAnotacao={
                                Number(situacaoFechamento) !==
                                situacaoFechamentoDto.NaoProcessado
                              }
                              possuiAnotacao={item?.temAnotacao}
                              onClickAnotacao={() => {
                                onClickAnotacao(item);
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td
                        className={`text-center position-relative ,${
                          !item.ativo ? 'fundo-cinza' : ''
                        }`}
                      >
                        {ehSintese ? (
                          item.sintese
                        ) : ehRegencia && item.notas ? (
                          <BotaoExpandir
                            index={index}
                            idLinhaRegencia={idLinhaRegencia}
                            refElement={refLinhaRegencia}
                          />
                        ) : item.notas && item.notas.length > 0 ? (
                          item.notas[0].ehConceito ? (
                            item.notas[0].conceitoDescricao
                          ) : (
                            ServicoFechamentoBimestre.formatarNotaConceito(
                              item.notas[0].notaConceito
                            )
                          )
                        ) : null}

                        {!ehSintese
                          ? item?.notas?.length &&
                            !!item.notas?.find(n => n?.emAprovacao) && (
                              <Tooltip title="Aguardando aprovação">
                                <MarcadorTriangulo />
                              </Tooltip>
                            )
                          : ''}
                      </td>
                      <td
                        className={`text-center ${
                          !item.ativo ? 'fundo-cinza' : ''
                        }`}
                      >
                        {item.quantidadeFaltas}
                      </td>
                      <td
                        className={`text-center ${
                          !item.ativo ? 'fundo-cinza' : ''
                        }`}
                      >
                        {item.quantidadeCompensacoes}
                      </td>
                      {registraFrequencia ? (
                        <td
                          className={`text-center ${
                            !item.ativo ? 'fundo-cinza' : ''
                          }`}
                        >
                          {formatarFrequencia(item?.percentualFrequencia)}
                        </td>
                      ) : (
                        ''
                      )}
                    </tr>
                    {!ehSintese && ehRegencia ? (
                      <FechamentoRegencia
                        dados={item.notas}
                        idRegencia={`fechamento-regencia-${index}`}
                        refElement={refLinhaRegencia}
                      />
                    ) : null}
                  </>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Sem dados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </TabelaFechamento>
  );
};

export default FechamentoBimestreLista;
