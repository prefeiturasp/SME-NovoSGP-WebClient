import React from 'react';
import * as moment from 'moment';
import { useSelector } from 'react-redux';
import CardCollapse from '~/componentes/cardCollapse';
import SecaoVersaoPlanoCollapse from '../SecaoVersaoPlano/secaoVersaoPlanoCollapse';
import MontarDadosPorSecao from './DadosSecaoPlano/montarDadosPorSecao';
import ModalErrosPlano from '../ModalErrosPlano/modalErrosPlano';

const SecaoPlanoCollapse = () => {
  const planoAEEDados = useSelector(store => store.planoAEE.planoAEEDados);

  const formateAuditoria = versao => {
    return {
      alteradoEm: versao?.alteradoEm,
      alteradoPor: versao?.alteradoPor,
      alteradoRF: versao?.alteradoRF,
      criadoEm: versao?.criadoEm,
      criadoPor: versao?.criadoPor,
      criadoRF: versao?.criadoRF,
    };
  };

  return (
    <>
      <ModalErrosPlano />
      {planoAEEDados?.questoes?.length ? (
        <CardCollapse
          key="secao-informacoes-plano-collapse-key"
          titulo={
            planoAEEDados?.versoes === null
              ? 'Informações do Plano'
              : `Informações do Plano - v${
                  planoAEEDados?.ultimaVersao?.numero
                } (${moment(planoAEEDados?.ultimaVersao?.criadoEm).format(
                  'DD/MM/YYYY'
                )})`
          }
          show
          indice="secao-informacoes-plano-collapse-indice"
          alt="secao-informacoes-plano-alt"
        >
          <MontarDadosPorSecao
            dados={{ questionarioId: 0 }}
            auditoria={formateAuditoria(planoAEEDados?.ultimaVersao)}
            dadosQuestionarioAtual={planoAEEDados?.questoes}
          />
        </CardCollapse>
      ) : (
        <></>
      )}
      {planoAEEDados?.versoes?.length ? (
        <SecaoVersaoPlanoCollapse
          questionarioId={planoAEEDados?.questionarioId}
          planoId={planoAEEDados?.id}
          versoes={planoAEEDados?.versoes}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default SecaoPlanoCollapse;
