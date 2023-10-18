/* eslint-disable react/prop-types */
import { Col } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_TURMA } from '~/constantes/ids/select';
import { ModalidadeDTO } from '~/dtos';
import { AbrangenciaServico, erros } from '~/servicos';

const TurmaOcorrencia = props => {
  const { form, onChangeCampos, desabilitar, ueCodigo, ocorrenciaId } = props;

  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaTurmas, setListaTurmas] = useState([]);

  const { anoLetivo, modalidade, semestre } = form.values;

  const ehEJAOuCelp =
    Number(modalidade) === ModalidadeDTO.EJA ||
    Number(modalidade) === ModalidadeDTO.CELP;

  const nomeCampo = 'turmaId';

  const listaTurmasEdicao = form?.initialValues?.turmaId
    ? [
        {
          id: form?.initialValues?.turmaId,
          nomeFiltro: form?.initialValues?.turmaNome,
        },
      ]
    : [];

  const obterTurmas = useCallback(async () => {
    setExibirLoader(true);

    const retorno = await AbrangenciaServico.buscarTurmas(
      ueCodigo,
      modalidade,
      '',
      anoLetivo,
      false
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      const lista = retorno?.data;
      setListaTurmas(lista);
    } else {
      setListaTurmas([]);
    }
  }, [anoLetivo, ueCodigo, modalidade]);

  useEffect(() => {
    if (ocorrenciaId) return;

    if (modalidade) {
      obterTurmas();
    } else {
      setListaTurmas([]);
    }
  }, [modalidade]);

  const disabled =
    !modalidade || (ehEJAOuCelp && !semestre) || desabilitar || !!ocorrenciaId;

  return (
    <Col sm={24} md={12} lg={ehEJAOuCelp ? 8 : 12}>
      <Loader loading={exibirLoader} ignorarTip>
        <SelectComponent
          id={SGP_SELECT_TURMA}
          form={form}
          name={nomeCampo}
          lista={ocorrenciaId ? listaTurmasEdicao : listaTurmas}
          valueOption="id"
          valueText="nomeFiltro"
          label="Turma"
          disabled={disabled}
          placeholder="Turma"
          showSearch
          onChange={() => {
            onChangeCampos();
          }}
        />
      </Loader>
    </Col>
  );
};

export default TurmaOcorrencia;
