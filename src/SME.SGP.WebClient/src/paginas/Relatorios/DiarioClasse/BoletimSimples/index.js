import React, { useEffect, useState } from 'react';

import { Loader, Card, ButtonGroup, ListaPaginada } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';

import history from '~/servicos/history';

import Filtro from './componentes/Filtro';
import ServicoBoletimSimples from '~/servicos/Paginas/Relatorios/DiarioClasse/BoletimSimples/ServicoBoletimSimples';
import { sucesso, erro, confirmar } from '~/servicos/alertas';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import modalidade from '~/dtos/modalidade';

import { EstiloModal } from './boletimSimples.css';
import { ModalidadeDTO } from '~/dtos';

const BoletimSimples = () => {
  const [loaderSecao] = useState(false);
  const [somenteConsulta] = useState(false);
  const [clicouBotaoGerar, setClicouBotaoGerar] = useState(false);
  const [desabilitarBotaoGerar, setDesabilitarBotaoGerar] = useState(false);
  const [filtrou, setFiltrou] = useState(false);
  const [cancelou, setCancelou] = useState(false);
  const estadoInicial = {
    anoLetivo: '',
    modalidade: '',
    semestre: '',
    dreCodigo: '',
    ueCodigo: '',
    turmaCodigo: '',
    consideraHistorico: false,
    opcaoEstudanteId: '',
    modelo: '',
  };
  const [filtro, setFiltro] = useState(estadoInicial);

  const [itensSelecionados, setItensSelecionados] = useState([]);

  const onSelecionarItems = items => {
    setItensSelecionados([...items.map(item => String(item.codigo))]);
    setClicouBotaoGerar(false);
  };

  const [selecionarAlunos, setSelecionarAlunos] = useState(false);

  const onChangeFiltro = valoresFiltro => {
    setFiltro({
      anoLetivo: valoresFiltro.anoLetivo,
      modalidade: valoresFiltro.modalidadeId,
      dreCodigo: valoresFiltro.dreCodigo,
      ueCodigo: valoresFiltro.ueCodigo,
      turmaCodigo: valoresFiltro.turmasId,
      semestre:
        String(valoresFiltro.modalidadeId) === String(modalidade.EJA)
          ? valoresFiltro.semestre
          : 0,
      consideraHistorico: valoresFiltro.consideraHistorico,
      opcaoEstudanteId: valoresFiltro.opcaoEstudanteId,
      modelo: valoresFiltro.modeloBoletimId,
    });
    setItensSelecionados([]);
    setSelecionarAlunos(
      valoresFiltro.turmasId && valoresFiltro.opcaoEstudanteId === '1'
    );
    setClicouBotaoGerar(false);
    setFiltrou(true);
  };

  const onClickVoltar = () => {
    history.push('/');
  };

  const onClickCancelar = () => {
    setCancelou(true);
    setFiltro(estadoInicial);
  };

  const onClickBotaoPrincipal = async () => {
    let confirmou = false;

    if (filtro.modelo === '2') {
      confirmou = await confirmar(
        'Modelo de boletim detalhado',
        'O modelo de boletim detalhado vai gerar pelo menos uma página para cada estudante. Deseja continuar?',
        '',
        'Cancelar',
        'Continuar'
      );
    }

    if (!confirmou) {
      setClicouBotaoGerar(true);
      const resultado = await ServicoBoletimSimples.imprimirBoletim({
        ...filtro,
        alunosCodigo: itensSelecionados,
      });
      if (resultado.erro)
        erro('Não foi possível solicitar a impressão do Boletim');
      else
        sucesso(
          'Solicitação de geração do relatório gerada com sucesso. Em breve você receberá uma notificação com o resultado.'
        );
    }
  };

  const colunas = [
    {
      title: 'Número',
      dataIndex: 'numeroChamada',
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
    },
  ];

  useEffect(() => {
    const temSemestreOuNaoEja =
      String(filtro?.modalidade) !== String(ModalidadeDTO.EJA) ||
      filtro?.semestre;
    const ehInfantil =
      String(filtro.modalidade) === String(modalidade.INFANTIL);
    const temEstudanteSelecionados =
      selecionarAlunos && !itensSelecionados?.length;

    const desabilitar =
      ehInfantil ||
      temEstudanteSelecionados ||
      !filtro?.modalidade ||
      !filtro?.turmaCodigo?.length ||
      !filtro?.opcaoEstudanteId ||
      !temSemestreOuNaoEja ||
      !filtro?.modelo ||
      clicouBotaoGerar;

    setDesabilitarBotaoGerar(desabilitar);
  }, [filtro, itensSelecionados, selecionarAlunos, clicouBotaoGerar, cancelou]);

  return (
    <>
      <EstiloModal />
      <AlertaModalidadeInfantil
        exibir={String(filtro.modalidade) === String(modalidade.INFANTIL)}
        validarModalidadeFiltroPrincipal={false}
      />
      <Cabecalho pagina="Impressão de Boletim" classes="mb-2" />
      <Loader loading={loaderSecao}>
        <Card mx="mx-0">
          <ButtonGroup
            somenteConsulta={somenteConsulta}
            permissoesTela={{
              podeAlterar: true,
              podeConsultar: false,
              podeExcluir: false,
              podeIncluir: filtro.turmaCodigo,
            }}
            temItemSelecionado={itensSelecionados && itensSelecionados.length}
            onClickVoltar={onClickVoltar}
            onClickCancelar={onClickCancelar}
            onClickBotaoPrincipal={onClickBotaoPrincipal}
            desabilitarBotaoPrincipal={desabilitarBotaoGerar}
            botoesEstadoVariavel={false}
            labelBotaoPrincipal="Gerar"
            modoEdicao
            paddingBottom="8px"
          />
          <Filtro
            onFiltrar={onChangeFiltro}
            filtrou={filtrou}
            setFiltrou={setFiltrou}
            cancelou={cancelou}
            setCancelou={setCancelou}
          />
          {!!filtro?.turmaCodigo?.length && selecionarAlunos && (
            <div className="col-md-12 pt-4 py-0 px-0">
              <ListaPaginada
                id="lista-alunos"
                url="v1/boletim/alunos"
                idLinha="codigo"
                colunaChave="codigo"
                colunas={colunas}
                filtro={filtro}
                paramArrayFormat="repeat"
                selecionarItems={onSelecionarItems}
                temPaginacao={false}
                multiSelecao
                filtroEhValido
              />
            </div>
          )}
        </Card>
      </Loader>
    </>
  );
};

export default BoletimSimples;
