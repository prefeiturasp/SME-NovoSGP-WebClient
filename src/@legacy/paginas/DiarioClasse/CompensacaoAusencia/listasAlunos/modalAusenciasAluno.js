import { Col, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import shortid from 'shortid';
import { Colors, Loader, ModalConteudoHtml } from '~/componentes';
import {
  SGP_BUTTON_CANCELAR_MODAL,
  SGP_BUTTON_CONFIRMAR_MODAL,
} from '~/constantes/ids/button';
import Button from '~/componentes/button';
import TransferenciaLista from '~/componentes-sgp/TranferenciaLista/transferenciaLista';
import ServicoCompensacaoAusencia from '~/servicos/Paginas/DiarioClasse/ServicoCompensacaoAusencia';
import { erros } from '~/servicos';
import _ from 'lodash';

const ModalAusenciasAluno = props => {
  const {
    exibirModal,
    dadosAluno,
    onClose,
    onConfirmarEditarCompensacao,
    desabilitar,
    disciplinaId,
    idCompensacaoAusencia,
    turmaCodigo,
    bimestre,
    atualizarValoresAulasCompensadasPorAluno,
  } = props;

  const [dadosEsquerda, setDadosEsquerda] = useState([]);
  const [dadosDireita, setDadosDireita] = useState([]);
  const [idsSelecionadsEsquerda, setIdsSelecionadsEsquerda] = useState([]);
  const [idsSelecionadsDireita, setIdsSelecionadsDireita] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [emEdicao, setEmEdicao] = useState(false);

  const [carregouDados, setCarregouDados] = useState(false);

  const dadosIniciaisListasAusenciasCompensadas =
    dadosAluno?.dadosIniciaisListasAusenciasCompensadas || {
      esquerda: [],
      direita: [],
    };

  const alunoNome = dadosAluno?.nome;

  const codigoAluno = dadosAluno?.id;

  const quantidadeFaltasCompensadas =
    dadosAluno?.quantidadeFaltasCompensadas || 0;

  const habilitarAcoes = !desabilitar;

  const qtdTotalAulasSelecionadas =
    dadosDireita?.length + idsSelecionadsEsquerda?.length;

  const disabilitarBotaoAdicionar =
    quantidadeFaltasCompensadas &&
    qtdTotalAulasSelecionadas > quantidadeFaltasCompensadas;

  const parametrosListaEsquerda = {
    columns: [
      {
        title: 'Ausências',
        dataIndex: 'descricaoAula',
      },
    ],
    titleHeight: '30px',
    dataSource: dadosEsquerda,
    onSelectRow: setIdsSelecionadsEsquerda,
    selectedRowKeys: idsSelecionadsEsquerda,
    selectMultipleRows: habilitarAcoes,
    disabilitarBotaoAdicionar,
  };

  const parametrosListaDireita = {
    columns: [
      {
        title: 'Ausências compensadas',
        dataIndex: 'descricaoAula',
      },
    ],
    title: `Obrigatório compensar ${quantidadeFaltasCompensadas} ausências`,
    titleHeight: '30px',
    dataSource: dadosDireita,
    onSelectRow: setIdsSelecionadsDireita,
    selectedRowKeys: idsSelecionadsDireita,
    selectMultipleRows: habilitarAcoes,
  };

  const obterListaComIdsSelecionados = (list, ids) => {
    return list.filter(item => ids.find(id => String(id) === String(item.id)));
  };

  const obterListaSemIdsSelecionados = (list, ids) => {
    return list.filter(item => !ids.find(id => String(id) === String(item.id)));
  };

  const onClickAdicionar = () => {
    if (idsSelecionadsEsquerda?.length && habilitarAcoes) {
      const novaListaDireita = obterListaComIdsSelecionados(
        dadosEsquerda,
        idsSelecionadsEsquerda
      );

      const novaListaEsquerda = obterListaSemIdsSelecionados(
        dadosEsquerda,
        idsSelecionadsEsquerda
      );

      const listaDireitaParaOrdenar = [...novaListaDireita, ...dadosDireita];

      const listaDireitaOrdenada = listaDireitaParaOrdenar?.length
        ? ServicoCompensacaoAusencia.ordenarDataAusenciaMenorParaMaior(
            listaDireitaParaOrdenar
          )
        : [];

      const novaListaEsquerdaOrdenada = novaListaEsquerda?.length
        ? ServicoCompensacaoAusencia.ordenarDataAusenciaMenorParaMaior(
            novaListaEsquerda
          )
        : [];

      setDadosEsquerda([...novaListaEsquerdaOrdenada]);
      setDadosDireita(listaDireitaOrdenada);

      setIdsSelecionadsEsquerda([]);
      setEmEdicao(true);
    }
  };

  const onClickRemover = () => {
    if (idsSelecionadsDireita?.length && habilitarAcoes) {
      const novaListaEsquerda = obterListaComIdsSelecionados(
        dadosDireita,
        idsSelecionadsDireita
      );

      const novaListaDireita = obterListaSemIdsSelecionados(
        dadosDireita,
        idsSelecionadsDireita
      );

      const listaEsquerdaParaOrdenar = [...novaListaEsquerda, ...dadosEsquerda];

      const listaEsquerdaOrdenada = listaEsquerdaParaOrdenar?.length
        ? ServicoCompensacaoAusencia.ordenarDataAusenciaMenorParaMaior(
            listaEsquerdaParaOrdenar
          )
        : [];

      const novaListaDireitaOrdenada = novaListaDireita?.length
        ? ServicoCompensacaoAusencia.ordenarDataAusenciaMenorParaMaior(
            novaListaDireita
          )
        : [];

      setDadosEsquerda(listaEsquerdaOrdenada);
      setDadosDireita([...novaListaDireitaOrdenada]);

      setIdsSelecionadsDireita([]);
      setEmEdicao(true);
    }
  };

  const limparDadosAoFechar = () => {
    setIdsSelecionadsEsquerda([]);
    setIdsSelecionadsDireita([]);
    setEmEdicao(false);
  };

  const onClickConfirmar = () => {
    if (!desabilitar) {
      const novosDadosIniciaisListasAusenciasCompensadas = {
        esquerda: _.cloneDeep(dadosEsquerda),
        direita: _.cloneDeep(dadosDireita),
      };
      onConfirmarEditarCompensacao(
        dadosDireita,
        novosDadosIniciaisListasAusenciasCompensadas
      );
    }
    limparDadosAoFechar();
  };

  const onCloseModal = () => {
    setDadosEsquerda(
      _.cloneDeep(dadosIniciaisListasAusenciasCompensadas.esquerda)
    );
    setDadosDireita(
      _.cloneDeep(dadosIniciaisListasAusenciasCompensadas.direita)
    );
    onClose();
    limparDadosAoFechar();
  };

  const obterDatasFaltasNaoCompensadas = () => {
    setExibirLoader(true);

    const params = {
      turmaId: turmaCodigo,
      disciplinaId,
      codigoAluno,
      quantidadeCompensar: quantidadeFaltasCompensadas,
      compensacaoId: idCompensacaoAusencia || 0,
      bimestre,
    };
    ServicoCompensacaoAusencia.obterDatasFaltasNaoCompensadas(params)
      .then(resposta => {
        if (resposta?.data?.length) {
          const lista = resposta.data.map((linha, index) => {
            const descricaoDataAula = window
              .moment(linha?.dataAula)
              .format('DD/MM/YYYY');

            const descricaoAula = `${descricaoDataAula} - ${linha?.descricao}`;

            return {
              ...linha,
              id: `${linha?.aulaId}-${linha?.descricao}`,
              descricaoAula,
            };
          });

          const listaOrdenada =
            ServicoCompensacaoAusencia.ordenarDataAusenciaMenorParaMaior(lista);

          const esquerda = listaOrdenada?.filter(item => !item?.sugestao);
          const direita = listaOrdenada?.filter(item => item?.sugestao);

          setDadosEsquerda(esquerda);
          setDadosDireita(direita);

          const novosDadosIniciaisListasAusenciasCompensadas = {
            esquerda: _.cloneDeep(esquerda),
            direita: _.cloneDeep(direita),
          };

          atualizarValoresAulasCompensadasPorAluno(
            dadosDireita,
            novosDadosIniciaisListasAusenciasCompensadas
          );
        }
        setCarregouDados(true);
      })
      .finally(() => setExibirLoader(false))
      .catch(e => erros(e));
  };

  useEffect(() => {
    if (exibirModal && !carregouDados) {
      obterDatasFaltasNaoCompensadas();
    }
  }, [carregouDados, exibirModal]);

  useEffect(() => {
    if (!exibirModal && dadosAluno?.dadosIniciaisListasAusenciasCompensadas) {
      setDadosEsquerda(
        _.cloneDeep(
          dadosAluno?.dadosIniciaisListasAusenciasCompensadas.esquerda
        )
      );
      setDadosDireita(
        _.cloneDeep(dadosAluno?.dadosIniciaisListasAusenciasCompensadas.direita)
      );
    }
  }, [exibirModal, dadosAluno]);

  return exibirModal ? (
    <ModalConteudoHtml
      id={shortid.generate()}
      key="aulas-compensar"
      visivel={exibirModal}
      titulo={alunoNome}
      onClose={onCloseModal}
      esconderBotaoPrincipal
      esconderBotaoSecundario
      width={750}
      closable
      fecharAoClicarFora={false}
      fecharAoClicarEsc={false}
    >
      <Loader loading={exibirLoader}>
        <Row gutter={[16, 16]}>
          <Col>
            <TransferenciaLista
              listaEsquerda={parametrosListaEsquerda}
              listaDireita={parametrosListaDireita}
              onClickAdicionar={onClickAdicionar}
              onClickRemover={onClickRemover}
            />
          </Col>
        </Row>
        <Row
          gutter={[16, 16]}
          style={{ marginTop: '15px' }}
          type="flex"
          justify="end"
        >
          <Col>
            <Button
              id={SGP_BUTTON_CANCELAR_MODAL}
              label="Cancelar"
              color={Colors.Azul}
              border
              onClick={onCloseModal}
            />
          </Col>
          <Col>
            <Button
              id={SGP_BUTTON_CONFIRMAR_MODAL}
              label="Confirmar"
              color={Colors.Roxo}
              onClick={onClickConfirmar}
              disabled={
                !emEdicao || dadosDireita?.length < quantidadeFaltasCompensadas
              }
              border
              bold
            />
          </Col>
        </Row>
      </Loader>
    </ModalConteudoHtml>
  ) : (
    <></>
  );
};

export default ModalAusenciasAluno;
