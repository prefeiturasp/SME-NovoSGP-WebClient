import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Nota from '~/componentes-sgp/inputs/nota';
import {
  setExpandirLinha,
  setNotaConceitoPosConselhoAtual,
} from '~/redux/modulos/conselhoClasse/actions';
import { erro } from '~/servicos/alertas';
import ServicoConselhoClasse from '~/servicos/Paginas/ConselhoClasse/ServicoConselhoClasse';
import { CampoAlerta, CampoCentralizado } from './campoNotaConceito.css';

const CampoNota = props => {
  const {
    id,
    notaPosConselho,
    idCampo,
    codigoComponenteCurricular,
    mediaAprovacao,
    alunoDesabilitado,
    name,
    clicarSetas,
    dadosNotaPosConselho,
    dadosArredondamento,
  } = props;

  const idCamposNotasPosConselho = useSelector(
    store => store.conselhoClasse.idCamposNotasPosConselho[idCampo]
  );

  const notaConceitoPosConselhoAtual = useSelector(
    store => store.conselhoClasse.notaConceitoPosConselhoAtual
  );

  const podeEditarNota = useSelector(
    store => store.conselhoClasse.podeEditarNota
  );

  const desabilitarCampos = useSelector(
    store => store.conselhoClasse.desabilitarCampos
  );

  const dentroPeriodo = useSelector(
    store => store.conselhoClasse.dentroPeriodo
  );

  const expandirLinha = useSelector(
    store => store.conselhoClasse.expandirLinha
  );

  const temLinhaExpandida = expandirLinha && Object.keys(expandirLinha)?.length > 0;

  const desabilitarIconeExpandir =
    temLinhaExpandida && notaConceitoPosConselhoAtual?.ehEdicao;

  const desabilitarCampoQuandoExpandir =
    desabilitarIconeExpandir && !expandirLinha[idCampo];

  const [idNotaPosConselho] = useState(id);
  const [dadosNota] = useState({ notaConceito: notaPosConselho });

  const dispatch = useDispatch();

  const mostrarJustificativa = () => {
    dispatch(setNotaConceitoPosConselhoAtual({}));
    const novaLinha = {};
    novaLinha[idCampo] = true;
    dispatch(setExpandirLinha(novaLinha));
  };

  const setNotaPosConselho = (
    nota,
    ehEdicao,
    justificativa = null,
    auditoria = null
  ) => {
    dispatch(
      setNotaConceitoPosConselhoAtual({
        id: idNotaPosConselho || idCamposNotasPosConselho,
        codigoComponenteCurricular,
        nota,
        ehEdicao,
        justificativa,
        auditoria,
        idCampo,
      })
    );
  };

  const onClickMostrarJustificativa = async () => {
    mostrarJustificativa();
    const dados = await ServicoConselhoClasse.obterNotaPosConselho(
      idNotaPosConselho || idCamposNotasPosConselho
    ).catch(e => erro(e));
    if (dados && dados.data) {
      const { nota, justificativa } = dados.data;
      const auditoria = {
        criadoEm: dados.data.criadoEm,
        criadoPor: dados.data.criadoPor,
        criadoRf: dados.data.criadoRF,
        alteradoPor: dados.data.alteradoPor,
        alteradoEm: dados.data.alteradoEm,
        alteradoRf: dados.data.alteradoRF,
      };
      setNotaPosConselho(nota, false, justificativa, auditoria);
    }
  };

  const desabilitarCampoNota =
    alunoDesabilitado ||
    !podeEditarNota ||
    desabilitarCampos ||
    !dentroPeriodo ||
    desabilitarCampoQuandoExpandir;

  const onChangeNotaConceito = valorNovo => {
    if (
      notaConceitoPosConselhoAtual?.idCampo &&
      notaConceitoPosConselhoAtual?.idCampo !== idCampo &&
      notaConceitoPosConselhoAtual?.ehEdicao
    ) {
      return;
    }
    if (!temLinhaExpandida) {
      mostrarJustificativa();
    }
    setNotaPosConselho(valorNovo, true);
    dadosNotaPosConselho.nota = valorNovo;
  };

  const campoNotaPosConselho = (validaAbaixoMedia = true) => {
    validaAbaixoMedia =
      validaAbaixoMedia && !(idNotaPosConselho || idCamposNotasPosConselho);

    return (
      <>
        <Nota
          ehFechamento
          id={name}
          name={name}
          dadosNota={dadosNota}
          desabilitar={desabilitarCampoNota}
          validaAbaixoMedia={validaAbaixoMedia}
          mediaAprovacaoBimestre={mediaAprovacao}
          notaValorInicial={dadosNota?.notaConceito}
          dadosArredondamento={dadosArredondamento}
          onChangeNotaConceito={onChangeNotaConceito}
          onChangeValorAtualExibicao={onChangeNotaConceito}
          styleContainer={{ padding: '0px' }}
          style={{
            height: '35px',
            width:
              idNotaPosConselho || idCamposNotasPosConselho ? '67px' : '90px',
          }}
          onKeyDown={clicarSetas}
        />
      </>
    );
  };

  return (
    <>
      <CampoCentralizado>
        {idNotaPosConselho || idCamposNotasPosConselho ? (
          <CampoAlerta ehNota>
            {campoNotaPosConselho(false)}
            <div
              className="icone"
              onClick={
                desabilitarIconeExpandir ? null : onClickMostrarJustificativa
              }
            >
              <Tooltip
                title="Ver Justificativa"
                placement="bottom"
                overlayStyle={{ fontSize: '12px' }}
              >
                <i className="fas fa-user-edit" />
              </Tooltip>
            </div>
          </CampoAlerta>
        ) : (
          <CampoCentralizado>{campoNotaPosConselho()}</CampoCentralizado>
        )}
      </CampoCentralizado>
    </>
  );
};

CampoNota.propTypes = {
  id: PropTypes.oneOfType([PropTypes.any]),
  notaPosConselho: PropTypes.oneOfType([PropTypes.any]),
  idCampo: PropTypes.oneOfType([PropTypes.string]),
  codigoComponenteCurricular: PropTypes.oneOfType([PropTypes.any]),
  mediaAprovacao: PropTypes.number,
  alunoDesabilitado: PropTypes.bool,
  clicarSetas: PropTypes.func,
  name: PropTypes.string,
  dadosNotaPosConselho: PropTypes.oneOfType([PropTypes.any]),
  dadosArredondamento: PropTypes.oneOfType([PropTypes.any]),
};

CampoNota.defaultProps = {
  id: 0,
  notaPosConselho: '',
  idCampo: '',
  codigoComponenteCurricular: '',
  mediaAprovacao: 5,
  alunoDesabilitado: false,
  clicarSetas: () => {},
  name: '',
  dadosNotaPosConselho: null,
  dadosArredondamento: null,
};

export default CampoNota;
