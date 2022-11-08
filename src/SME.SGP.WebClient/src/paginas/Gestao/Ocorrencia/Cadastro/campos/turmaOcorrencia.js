/* eslint-disable react/prop-types */
import { Col } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import { SGP_SELECT_TURMA } from '~/componentes-sgp/filtro/idsCampos';
import { ModalidadeDTO } from '~/dtos';
import { AbrangenciaServico, erros } from '~/servicos';

const TurmaOcorrencia = ({ form, onChangeCampos, desabilitar, ueCodigo }) => {
  const [exibirLoader, setExibirLoader] = useState(false);
  const [listaTurmas, setListaTurmas] = useState([]);

  const { consideraHistorico, anoLetivo, modalidade, semestre } = form.values;

  const ehEJA = Number(modalidade) === ModalidadeDTO.EJA;

  const nomeCampo = 'turmaId';

  const obterTurmas = useCallback(async () => {
    setExibirLoader(true);

    const retorno = await AbrangenciaServico.buscarTurmas(
      ueCodigo,
      modalidade,
      '',
      anoLetivo,
      consideraHistorico
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (retorno?.data?.length) {
      const lista = retorno?.data;
      if (lista?.length === 1) {
        form.setFieldValue(nomeCampo, String(lista[0]?.id));
      }
      setListaTurmas(lista);
    } else {
      setListaTurmas([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anoLetivo, consideraHistorico, ueCodigo, modalidade]);

  useEffect(() => {
    if (modalidade) {
      obterTurmas();
    } else {
      setListaTurmas([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalidade]);

  const disabled =
    !modalidade ||
    listaTurmas?.length === 1 ||
    !listaTurmas?.length ||
    (ehEJA && !semestre) ||
    desabilitar;

  return (
    <Col sm={24} md={12} lg={ehEJA ? 8 : 12}>
      <Loader loading={exibirLoader} ignorarTip>
        <SelectComponent
          id={SGP_SELECT_TURMA}
          form={form}
          name={nomeCampo}
          lista={listaTurmas}
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
