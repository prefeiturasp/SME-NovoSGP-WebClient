import ButtonPrimary from '@/components/lib/button/primary';
import ButtonSecundary from '@/components/lib/button/secundary';
import conselhoClasseService from '@/core/services/conselho-classe-service';
import {
  faEdit,
  faSyncAlt,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Base, Loader } from '~/componentes';
import {
  SGP_BUTTON_CANCELAR_EDICAO_PARECER_CONCLUSIVO,
  SGP_BUTTON_SALVAR_EDICAO_PARECER_CONCLUSIVO,
} from '~/constantes/ids/button';
import { setMarcadorParecerConclusivo } from '~/redux/modulos/conselhoClasse/actions';
import { erros, sucesso } from '~/servicos';
import ServicoConselhoClasse from '~/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import { SelectParecerConclusivo } from './SelectParecerConclusivo';
import { IconeEstilizado, LabelParecer } from './marcadorParecerConclusivo.css';

const MarcadorParecerConclusivo = () => {
  const dispatch = useDispatch();

  const [sincronizando, setSincronizando] = useState(false);
  const [exibirLoader, setExibirLoader] = useState(false);
  const [exibirIconeSincronizar, setExibirIconeSincronizar] = useState(false);

  const dadosPrincipaisConselhoClasse = useSelector(
    store => store.conselhoClasse.dadosPrincipaisConselhoClasse
  );
  const {
    conselhoClasseId,
    fechamentoTurmaId,
    alunoCodigo,
    conselhoClasseAlunoId,
    alunoDesabilitado,
  } = dadosPrincipaisConselhoClasse;

  const marcadorParecerConclusivo = useSelector(
    store => store.conselhoClasse.marcadorParecerConclusivo
  );

  const gerandoParecerConclusivo = useSelector(
    store => store.conselhoClasse.gerandoParecerConclusivo
  );

  const bimestreAtual = useSelector(
    store => store.conselhoClasse.bimestreAtual
  );

  const desabilitarCampos = useSelector(
    store => store.conselhoClasse.desabilitarCampos
  );

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const [parecer, setParecer] = useState('');
  const [editandoParecer, setEditandoParecer] = useState(false);
  const [parecerSelecionado, setParecerSelecionado] = useState();

  useEffect(() => {
    const nomeConcatenado = marcadorParecerConclusivo?.emAprovacao
      ? `${
          marcadorParecerConclusivo?.nome || 'Sem parecer'
        } (Aguardando aprovação)`
      : marcadorParecerConclusivo?.nome || 'Sem parecer';
    const nomeParecer =
      Object.keys(marcadorParecerConclusivo).length &&
      `Parecer conclusivo: ${nomeConcatenado}`;

    setParecer(nomeParecer);

    if (marcadorParecerConclusivo?.id) {
      setParecerSelecionado(marcadorParecerConclusivo.id);
    }
  }, [marcadorParecerConclusivo]);

  useEffect(() => {
    setEditandoParecer(false);
  }, [marcadorParecerConclusivo, exibirIconeSincronizar]);

  const montarDescricao = () => {
    if (gerandoParecerConclusivo) {
      return 'Gerando parecer conclusivo';
    }
    return parecer;
  };

  const sincronizar = async () => {
    setSincronizando(true);
    const retorno = await ServicoConselhoClasse.gerarParecerConclusivo(
      conselhoClasseId,
      fechamentoTurmaId,
      alunoCodigo
    )
      .catch(e => erros(e))
      .finally(() => setSincronizando(false));
    if (retorno?.data) {
      if (retorno?.data?.emAprovacao) {
        sucesso(
          'Parecer conclusivo alterado com sucesso. Em até 24 horas será enviado para aprovação e será considerado válido após a aprovação do último nível'
        );
      }
      ServicoConselhoClasse.setarParecerConclusivo(retorno.data);
    }
  };

  useEffect(() => {
    const exibir =
      bimestreAtual?.valor === 'final' &&
      conselhoClasseId &&
      fechamentoTurmaId &&
      alunoCodigo &&
      conselhoClasseAlunoId;

    setExibirIconeSincronizar(exibir);
  }, [bimestreAtual]);

  const onClickCancelarEditarParecer = () => {
    setEditandoParecer(!editandoParecer);
    setParecerSelecionado(marcadorParecerConclusivo?.id || undefined);
  };

  const onClickSalvarEdicaoParecer = async (limparParecer = false) => {
    setExibirLoader(true);

    const params = {
      conselhoClasseId,
      fechamentoTurmaId,
      alunoCodigo,
      parecerConclusivoId: limparParecer ? null : parecerSelecionado,
    };

    const resposta = await conselhoClasseService
      .alterarParecerConclusivo(params)
      .finally(() => setExibirLoader(false));

    if (resposta?.sucesso) {
      sucesso('Parecer alterado com sucesso');
      setEditandoParecer(false);
      dispatch(setMarcadorParecerConclusivo(resposta.dados));
    }
  };

  const onChangeParecer = value => setParecerSelecionado(value);

  if (!alunoDesabilitado && editandoParecer) {
    return (
      <Row
        wrap={false}
        style={{ marginBottom: 10, marginTop: 10, marginLeft: 5 }}
        gutter={[8, 8]}
      >
        <Col xs={24} sm={8} md={12}>
          <SelectParecerConclusivo
            turmaId={turmaSelecionada?.id}
            onChange={onChangeParecer}
            value={parecerSelecionado}
          />
        </Col>
        <Col>
          <ButtonPrimary
            id={SGP_BUTTON_SALVAR_EDICAO_PARECER_CONCLUSIVO}
            onClick={() => onClickSalvarEdicaoParecer()}
            disabled={
              !!marcadorParecerConclusivo?.id &&
              marcadorParecerConclusivo.id === parecerSelecionado
            }
          >
            Salvar
          </ButtonPrimary>
        </Col>
        <Col>
          <ButtonSecundary
            id={SGP_BUTTON_CANCELAR_EDICAO_PARECER_CONCLUSIVO}
            onClick={() => onClickCancelarEditarParecer()}
          >
            Cancelar
          </ButtonSecundary>
        </Col>
      </Row>
    );
  }

  return (
    <>
      {parecer ? (
        <div className="col-m-12 d-flex ml-3 my-3">
          <Tooltip title={marcadorParecerConclusivo?.nome || 'Sem parecer'}>
            <LabelParecer>
              <Loader loading={gerandoParecerConclusivo} tip="">
                <span>{montarDescricao()}</span>
              </Loader>
            </LabelParecer>
          </Tooltip>

          {!desabilitarCampos && exibirIconeSincronizar && (
            <Loader loading={exibirLoader} tip="">
              <div style={{ gap: 16, display: 'flex', flexDirection: 'row' }}>
                <Tooltip
                  key="GERAR"
                  title="Gerar Parecer Conclusivo"
                  getTooltipContainer={trigger => trigger.parentNode}
                >
                  <div>
                    <IconeEstilizado
                      icon={faSyncAlt}
                      onClick={sincronizar}
                      sincronizando={sincronizando}
                    />
                  </div>
                </Tooltip>
                {!alunoDesabilitado && marcadorParecerConclusivo?.id ? (
                  <Tooltip
                    key="EDITAR"
                    title="Editar Parecer Conclusivo"
                    getTooltipContainer={trigger => trigger.parentNode}
                  >
                    <div>
                      <FontAwesomeIcon
                        icon={faEdit}
                        onClick={onClickCancelarEditarParecer}
                        style={{
                          fontSize: 20,
                          color: Base.Azul,
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </Tooltip>
                ) : (
                  <></>
                )}

                {alunoDesabilitado && marcadorParecerConclusivo?.id ? (
                  <Tooltip
                    key="LIMPAR"
                    title="Limpar Parecer Conclusivo"
                    getTooltipContainer={trigger => trigger.parentNode}
                  >
                    <div>
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        onClick={() => onClickSalvarEdicaoParecer(true)}
                        style={{
                          fontSize: 20,
                          color: Base.Vermelho,
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </Tooltip>
                ) : (
                  <></>
                )}
              </div>
            </Loader>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default MarcadorParecerConclusivo;
