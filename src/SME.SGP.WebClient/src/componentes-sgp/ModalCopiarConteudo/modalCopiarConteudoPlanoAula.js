import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import {
  Button,
  CampoData,
  Colors,
  Grid,
  Loader,
  ModalConteudoHtml,
} from '~/componentes';
import TurmasDropDown from '~/componentes-sgp/TurmasDropDown';
import filtro from '~/redux/modulos/filtro/reducers';
import AbrangenciaServico from '~/servicos/Abrangencia';
import { confirmar, sucesso, erro, erros } from '~/servicos/alertas';
import api from '~/servicos/api';
import PlanoAulaServico from '~/servicos/Paginas/PlanoAula';
import ListaCheckbox from './componentes/ListaCheckbox';
import { Row } from './modalCopiarConteudoPlanoAula.css';

const ModalCopiarConteudoPlanoAula = props => {
  const {
    codigoComponenteCurricular,
    exibirModal,
    setExibirModal,
    setExibirLoaderModal,
    exibirLoaderModal,
    copiar,
    exibirListaCheckboxs,
    executarCopiarPadrao,
    onClickDescartar,
    planoAulaId,
    aposCopiarConteudo,
  } = props;

  const filtro = useSelector(store => store.usuario.turmaSelecionada);
  const [carregando, setCarregando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [alerta, setAlerta] = useState(false);
  const [listaTurmas, setListaTurmas] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [valoresCheckbox, setValoresCheckbox] = useState({
    objetivosAprendizagem: true,
    desenvolvimentoAula: true,
    recuperacaoContinua: false,
    licaoCasa: false,
  });

  useEffect(() => {
    async function buscaTurmas() {
      const { data } = await AbrangenciaServico.buscarTurmas(
        filtro.unidadeEscolar,
        filtro.modalidade,
        '',
        filtro.anoLetivo,
        filtro.consideraHistorico
      );

      if (data) {
        setListaTurmas(
          data
            .filter(x => x.ano === filtro.ano)
            .map(item => ({
              desc: item.nome,
              valor: item.codigo,
              nomeFiltro: item.nome,
            }))
        );
      }
    }
    buscaTurmas();
  }, [filtro.unidadeEscolar, filtro.modalidade, filtro.ano]);

  const adicionarTurma = () => {
    setTurmas([
      ...turmas,
      {
        id: shortid.generate(),
        turmaId: '',
        data: '',
        temErro: false,
        mensagemErro: 'Data já possui conteúdo',
        nomeTurma: '',
      },
    ]);
  };

  const onClickExcluir = item => {
    setTurmas(turmas.filter(x => x.id !== item.id));
  };

  const { anoLetivo } = filtro;

  const onChangeTurma = async (turma, nomeTurma, linha) => {
    if (turma)
      try {
        setCarregando(true);
        const { data, status } = await api.get(
          `v1/calendarios/frequencias/aulas/datas/${anoLetivo}/turmas/${turma}/disciplinas/${codigoComponenteCurricular}`
        );
        setCarregando(false);
        if (data && status === 200) {
          setTurmas(
            turmas.map(x =>
              x.id === linha.id
                ? {
                    ...linha,
                    turmaId: turma,
                    nomeTurma,
                    diasParaHabilitar: data.map(y =>
                      window.moment(y.data).format('YYYY-MM-DD')
                    ),
                  }
                : x
            )
          );
        }
      } catch (error) {
        erro(error);
        setCarregando(false);
      }
  };

  const onChangeData = async (dataSelecionada, linha) => {
    setTurmas(
      turmas.map(x =>
        x.id === linha.id
          ? {
              ...linha,
              data: dataSelecionada,
            }
          : x
      )
    );
  };

  const onChangeCheckbox = (evento, campo) => {
    setValoresCheckbox({
      ...valoresCheckbox,
      [campo]: evento.target.checked,
    });
  };

  const onCloseModal = clicouEmDescartar => {
    if (!carregando) {
      setValoresCheckbox({
        objetivosAprendizagem: true,
        desenvolvimentoAula: true,
        recuperacaoContinua: false,
        licaoCasa: false,
      });
      setTurmas([]);
      setAlerta(false);
      setConfirmado(false);
      setExibirModal(false);
    }
    if (clicouEmDescartar) onClickDescartar();
  };

  const copiarPadrao = async () => {
    setExibirLoaderModal(true);
    const {
      data: dados,
      status: resposta,
    } = await PlanoAulaServico.migrarPlano({
      idsPlanoTurmasDestino: turmas.map(x => ({
        ...x,
        sobreescrever: true,
      })),
      planoAulaId,
      disciplinaId: codigoComponenteCurricular,
      migrarLicaoCasa: valoresCheckbox.licaoCasa,
      migrarRecuperacaoAula: valoresCheckbox.recuperacaoContinua,
      migrarObjetivos: valoresCheckbox.objetivosAprendizagem,
    });
    setExibirLoaderModal(false);
    if (dados || resposta === 200) {
      sucesso('Plano de aula copiado com sucesso!');
      setExibirModal(false);
      return true;
    }

    return false;
  };

  const acaoCopiarConteudo = async () => {
    let copiou = false;
    if (executarCopiarPadrao) {
      copiou = await copiarPadrao();
    } else {
      copiou = await copiar(turmas, valoresCheckbox);
    }

    if (copiou) {
      onCloseModal();
      aposCopiarConteudo();
    }
    return true;
  };

  const onClickSalvar = async () => {
    try {
      const turmasValidas = turmas.filter(
        item => !!item.data && !!item.turmaId
      );

      const dadosValidos = turmasValidas?.length === turmas?.length;

      if (!dadosValidos) {
        erro('Campo(s) obrigatório(s) não preenchido');
        return;
      }
      if (!confirmado) {
        setCarregando(true);
        const { data, status } = await PlanoAulaServico.verificarSeExiste({
          planoAulaTurmaDatas: turmas.map(x => ({
            data: x.data,
            turmaId: x.turmaId,
            disciplinaId: codigoComponenteCurricular,
          })),
        });
        if (data && status === 200) {
          const temErro = data.filter(x => x.existe === true);
          if (temErro.length > 0) {
            temErro.forEach(err => {
              setTurmas(
                turmas.map(x =>
                  x.turmaId === String(err.turmaId)
                    ? {
                        ...x,
                        temErro: true,
                        mensagemErro: 'Data já possui conteúdo',
                      }
                    : x
                )
              );
            });
            setAlerta(true);
          } else {
            await acaoCopiarConteudo();
          }
          setConfirmado(true);
          setCarregando(false);
        }
      }

      if (confirmado) {
        await acaoCopiarConteudo();
      }
    } catch (error) {
      erros(error);
      setExibirLoaderModal(false);
      setExibirModal(true);
      setCarregando(false);
    }
  };

  const validarAntesDeFechar = async () => {
    if (turmas?.length) {
      setExibirModal(false);
      const confirmadoDescartar = await confirmar(
        'Atenção',
        '',
        'Deseja realmente descartar as informações de Copiar conteúdo?'
      );
      if (confirmadoDescartar) {
        onCloseModal();
      } else {
        setExibirModal(true);
      }
    } else {
      onCloseModal();
    }
  };

  return (
    <ModalConteudoHtml
      titulo="Copiar conteúdo"
      visivel={exibirModal}
      onClose={validarAntesDeFechar}
      onConfirmacaoSecundaria={validarAntesDeFechar}
      onConfirmacaoPrincipal={onClickSalvar}
      labelBotaoPrincipal="Confirmar"
      labelBotaoSecundario="Descartar"
      perguntaAtencao={
        alerta &&
        'Os planos de aula de algumas turmas, já possuem conteúdo que será sobrescrito. Deseja continuar?'
      }
      tituloAtencao={alerta && 'Atenção'}
      desabilitarBotaoPrincipal={
        turmas.length < 1 ||
        (turmas.length && turmas.find(item => !item.data)) ||
        carregando
      }
      loader={carregando || exibirLoaderModal}
      fecharAoClicarFora={!carregando && !exibirLoaderModal}
      fecharAoClicarEsc={!carregando && !exibirLoaderModal}
      closable={!carregando && !exibirLoaderModal}
    >
      <Loader loading={carregando || exibirLoaderModal}>
        {turmas.map(linha => (
          <Row key={shortid.generate()} className="row">
            <Grid cols={5}>
              <TurmasDropDown
                ueId={filtro.unidadeEscolar}
                modalidadeId={filtro.modalidade}
                valor={linha.turmaId}
                onChange={(codigoTurma, nomeTurma) =>
                  onChangeTurma(codigoTurma, nomeTurma, linha)
                }
                dados={listaTurmas}
                allowClear={false}
              />
            </Grid>
            <Grid cols={5}>
              <CampoData
                valor={linha.data}
                onChange={data => onChangeData(data, linha)}
                name="dataInicio"
                placeholder="DD/MM/AAAA"
                formatoData="DD/MM/YYYY"
                temErro={linha.temErro}
                mensagemErro={linha.mensagemErro}
                diasParaHabilitar={linha.diasParaHabilitar}
              />
            </Grid>
            <Grid cols={2}>
              <Button
                id={shortid.generate()}
                label="Excluir"
                color={Colors.Roxo}
                border
                className="btnGroupItem"
                onClick={() => onClickExcluir(linha)}
              />
            </Grid>
          </Row>
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            id={shortid.generate()}
            label="Adicionar turma"
            color={Colors.Roxo}
            border
            className="btnGroupItem"
            onClick={adicionarTurma}
          />
        </div>
        {exibirListaCheckboxs && (
          <div style={{ marginTop: '26px' }}>
            <ListaCheckbox
              valores={valoresCheckbox}
              onChange={(evento, campo) => onChangeCheckbox(evento, campo)}
            />
          </div>
        )}
      </Loader>
    </ModalConteudoHtml>
  );
};

ModalCopiarConteudoPlanoAula.propTypes = {
  codigoComponenteCurricular: PropTypes.string,
  exibirModal: PropTypes.bool,
  copiar: PropTypes.func,
  onClickDescartar: PropTypes.func,
  exibirListaCheckboxs: PropTypes.bool,
  setExibirModal: PropTypes.func,
  setExibirLoaderModal: PropTypes.func,
  exibirLoaderModal: PropTypes.bool,
  executarCopiarPadrao: PropTypes.bool,
  planoAulaId: PropTypes.oneOfType([PropTypes.any]),
  aposCopiarConteudo: PropTypes.func,
};

ModalCopiarConteudoPlanoAula.defaultProps = {
  codigoComponenteCurricular: '',
  exibirModal: false,
  copiar: () => null,
  onClickDescartar: () => null,
  exibirListaCheckboxs: false,
  setExibirModal: () => null,
  setExibirLoaderModal: () => null,
  exibirLoaderModal: false,
  executarCopiarPadrao: false,
  planoAulaId: null,
  aposCopiarConteudo: () => null,
};

export default ModalCopiarConteudoPlanoAula;
