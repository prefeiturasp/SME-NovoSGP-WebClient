/* eslint-disable react/prop-types */
import { Col } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Loader, SelectComponent } from '~/componentes';
import {
  SGP_SELECT_MODALIDADE,
  SGP_SELECT_SEMESTRE,
} from '~/constantes/ids/select';
import { ModalidadeDTO } from '~/dtos';
import { AbrangenciaServico, erros, ServicoFiltroRelatorio } from '~/servicos';

const ModalidadeSemestreOcorrencia = props => {
  const {
    form,
    onChangeCampos,
    desabilitar,
    dreCodigo,
    ueCodigo,
    ocorrenciaId,
  } = props;

  const [listaModalidades, setListaModalidades] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);
  const [exibirLoader, setExibirLoader] = useState(false);

  const { anoLetivo, modalidade } = form.values;

  const ehEJA = Number(modalidade) === ModalidadeDTO.EJA;

  const listaModalidadesEdicao = form?.initialValues?.modalidade
    ? [
        {
          valor: form?.initialValues?.modalidade || '',
          descricao: form?.initialValues?.modalidadeNome,
        },
      ]
    : [];

  const listaSemestresEdicao = form?.initialValues?.semestre
    ? [
        {
          valor: form?.initialValues?.semestre || '',
          desc: form?.initialValues?.semestre,
        },
      ]
    : [];

  const obterModalidades = useCallback(async () => {
    setExibirLoader(true);
    const resposta = await ServicoFiltroRelatorio.obterModalidades(
      ueCodigo,
      anoLetivo,
      false
    )
      .catch(e => erros(e))
      .finally(() => setExibirLoader(false));

    if (resposta?.data?.length) {
      const lista = resposta.data;

      setListaModalidades(lista);
    } else {
      form.setFieldValue('modalidade', undefined);
      setListaModalidades([]);
    }

  }, [anoLetivo, ueCodigo]);

  useEffect(() => {
    if (ocorrenciaId) return;

    if (ueCodigo) {
      obterModalidades();
    } else {
      form.setFieldValue('modalidade', undefined);
      setListaModalidades([]);
    }

  }, [ueCodigo]);

  const obterSemestres = useCallback(async () => {
    const retorno = await AbrangenciaServico.obterSemestres(
      false,
      anoLetivo,
      modalidade,
      dreCodigo,
      ueCodigo
    ).catch(e => erros(e));

    if (retorno?.data?.length) {
      const lista = retorno.data.map(periodo => {
        return { desc: periodo, valor: periodo };
      });

      if (lista?.length === 1) {
        form.setFieldValue('semestre', lista[0].valor);
      }

      setListaSemestres(lista);
    } else {
      setListaSemestres([]);
      form.setFieldValue('semestre', undefined);
    }

  }, [anoLetivo, modalidade, dreCodigo, ueCodigo]);

  useEffect(() => {
    if (ocorrenciaId) return;

    if (modalidade && ehEJA) {
      obterSemestres();
    }

  }, [ehEJA, modalidade]);

  return (
    <>
      <Col sm={24} md={12} lg={ehEJA ? 8 : 12}>
        <Loader loading={exibirLoader} ignorarTip>
          <SelectComponent
            id={SGP_SELECT_MODALIDADE}
            label="Modalidade"
            lista={ocorrenciaId ? listaModalidadesEdicao : listaModalidades}
            valueOption="valor"
            valueText="descricao"
            disabled={!ueCodigo || desabilitar || !!ocorrenciaId}
            placeholder="Modalidade"
            name="modalidade"
            form={form}
            onChange={() => {
              onChangeCampos();
              form.setFieldValue('semestre', undefined);
              form.setFieldValue('turmaId', null);
            }}
          />
        </Loader>
      </Col>
      {ehEJA ? (
        <Col sm={24} md={12} lg={8}>
          <SelectComponent
            id={SGP_SELECT_SEMESTRE}
            label="Semestre"
            lista={ocorrenciaId ? listaSemestresEdicao : listaSemestres}
            valueOption="valor"
            valueText="desc"
            disabled={!modalidade || !!ocorrenciaId || listaSemestres?.length === 1}
            placeholder="Selecione o semestre"
            name="semestre"
            form={form}
            onChange={() => {
              onChangeCampos();
              form.setFieldValue('turmaId', null);
            }}
          />
        </Col>
      ) : (
        <></>
      )}
    </>
  );
};

export default ModalidadeSemestreOcorrencia;
