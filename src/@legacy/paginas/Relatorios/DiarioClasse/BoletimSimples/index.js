import React, { useEffect, useState } from 'react';

import { Loader, Card, ButtonGroup, ListaPaginada } from '~/componentes';
import { Cabecalho } from '~/componentes-sgp';
import Filtro from './componentes/Filtro';
import ServicoBoletimSimples from '~/servicos/Paginas/Relatorios/DiarioClasse/BoletimSimples/ServicoBoletimSimples';
import { sucesso, erro, confirmar } from '~/servicos/alertas';
import AlertaModalidadeInfantil from '~/componentes-sgp/AlertaModalidadeInfantil/alertaModalidadeInfantil';
import { ModalidadeEnum } from '@/core/enum/modalidade-enum';

import { SGP_BUTTON_GERAR } from '~/constantes/ids/button';
import { useNavigate } from 'react-router-dom';

const BoletimSimples = () => {
  const navigate = useNavigate();

  const [loaderSecao] = useState(false);
  const [somenteConsulta] = useState(false);
  const [clicouBotaoGerar, setClicouBotaoGerar] = useState(false);
  const [desabilitarBotaoGerar, setDesabilitarBotaoGerar] = useState(false);
  const [filtrou, setFiltrou] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
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
    quantidadeBoletimPorPagina: '',
    filtroEhValido: true,
  };
  const [filtro, setFiltro] = useState(estadoInicial);

  const [itensSelecionados, setItensSelecionados] = useState([]);

  const onSelecionarItems = items => {
    setItensSelecionados([...items.map(item => String(item.codigo))]);
    setClicouBotaoGerar(false);
  };

  const [selecionarAlunos, setSelecionarAlunos] = useState(false);

  const onChangeFiltro = (valoresFiltro, naoLimparItensSelecionados) => {
    setFiltro({
      anoLetivo: valoresFiltro.anoLetivo,
      modalidade: valoresFiltro.modalidadeId,
      dreCodigo: valoresFiltro.dreCodigo,
      ueCodigo: valoresFiltro.ueCodigo,
      turmaCodigo: valoresFiltro.turmasId,
      semestre:
        Number(valoresFiltro.modalidadeId) === ModalidadeEnum.EJA ||
        Number(valoresFiltro.modalidadeId) === ModalidadeEnum.CELP
          ? valoresFiltro.semestre
          : 0,
      consideraHistorico: valoresFiltro.consideraHistorico,
      opcaoEstudanteId: valoresFiltro.opcaoEstudanteId,
      quantidadeBoletimPorPagina: valoresFiltro.quantidadeBoletimPorPagina,
      filtroEhValido: !naoLimparItensSelecionados,
      consideraInativo: valoresFiltro?.imprimirEstudantesInativos,
    });
    if (!naoLimparItensSelecionados) {
      setItensSelecionados([]);
    }
    setSelecionarAlunos(
      valoresFiltro.turmasId && valoresFiltro.opcaoEstudanteId === '1'
    );
    setClicouBotaoGerar(false);
    setFiltrou(true);
  };

  const onClickVoltar = () => {
    navigate('/');
  };

  const onClickCancelar = async () => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Deseja realmente cancelar as alterações?'
      );

      if (confirmou) {
        setCancelou(true);
        setModoEdicao(false);
      }
    }
  };

  const onClickBotaoPrincipal = async () => {
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
      (Number(filtro?.modalidade) !== ModalidadeEnum.EJA &&
        Number(filtro?.modalidade) !== ModalidadeEnum.CELP) ||
      filtro?.semestre;
    const ehInfantil = Number(filtro.modalidade) === ModalidadeEnum.INFANTIL;
    const temEstudanteSelecionados =
      selecionarAlunos && !itensSelecionados?.length;

    const desabilitar =
      ehInfantil ||
      temEstudanteSelecionados ||
      !filtro?.modalidade ||
      !filtro?.turmaCodigo?.length ||
      !filtro?.opcaoEstudanteId ||
      !temSemestreOuNaoEja ||
      !filtro?.quantidadeBoletimPorPagina ||
      clicouBotaoGerar;

    setDesabilitarBotaoGerar(desabilitar);
  }, [filtro, itensSelecionados, selecionarAlunos, clicouBotaoGerar, cancelou]);

  return (
    <>
      <AlertaModalidadeInfantil
        exibir={Number(filtro.modalidade) === ModalidadeEnum.INFANTIL}
        validarModalidadeFiltroPrincipal={false}
      />
      <Loader loading={loaderSecao}>
        <Cabecalho pagina="Impressão de Boletim">
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
            idBotaoPrincipal={SGP_BUTTON_GERAR}
            modoEdicao={modoEdicao}
          />
        </Cabecalho>
        <Card>
          <Filtro
            cancelou={cancelou}
            filtrou={filtrou}
            setFiltrou={setFiltrou}
            setCancelou={setCancelou}
            onFiltrar={onChangeFiltro}
            setModoEdicao={setModoEdicao}
          />
          {!!filtro?.turmaCodigo?.length && selecionarAlunos && (
            <div className="col-md-12 pt-4">
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
                filtroEhValido={filtro?.filtroEhValido}
              />
            </div>
          )}
        </Card>
      </Loader>
    </>
  );
};

export default BoletimSimples;
