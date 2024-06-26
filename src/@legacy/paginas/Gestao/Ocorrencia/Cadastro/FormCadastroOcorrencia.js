/* eslint-disable react/prop-types */
import { Col, Row } from 'antd';
import React from 'react';
import AnoLetivoOcorrencia from './campos/anoLetivoOcorrencia';
import DataHoraOcorrencia from './campos/dataHoraOcorrencia';
import DescricaoOcorrencia from './campos/descricaoOcorrencia';
import DreOcorrencia from './campos/dreOcorrencia';
import EnvolvidoNaOcorrencia from './campos/envolvidosNaOcorrencia';
import ModalidadeSemestreOcorrencia from './campos/modalidadeSemestreOcorrencia';
import TipoOcorrencia from './campos/tipoOcorrencia';
import TituloOcorrencia from './campos/tituloOcorrencia';
import TurmaOcorrencia from './campos/turmaOcorrencia';
import UeOcorrencia from './campos/ueOcorrencia';

const FormCadastroOcorrencia = props => {
  const {
    form,
    onChangeCampos,
    desabilitar,
    ocorrenciaId,
    setListaDres,
    listaDres,
    setListaUes,
    listaUes,
    initialValues,
  } = props;

  const { dreId, ueId } = form?.values;

  const dreCodigo = ocorrenciaId
    ? form?.initialValues?.dreCodigo
    : listaDres?.find(d => Number(d?.id) === Number(dreId))?.codigo;

  const ueCodigo = ocorrenciaId
    ? form?.initialValues?.ueCodigo
    : listaUes?.find(d => Number(d?.id) === Number(ueId))?.codigo;

  return (
    <Col span={24}>
      <Row gutter={[16, 16]}>
        {!ocorrenciaId ? (
          <Col sm={24} md={8} lg={4}>
            <AnoLetivoOcorrencia form={form} />
          </Col>
        ) : (
          <></>
        )}
        <Col sm={24} md={24} lg={ocorrenciaId ? 12 : 10}>
          <DreOcorrencia
            form={form}
            onChangeCampos={onChangeCampos}
            desabilitar={desabilitar}
            ocorrenciaId={ocorrenciaId}
            setListaDres={setListaDres}
            listaDres={listaDres}
          />
        </Col>
        <Col sm={24} md={24} lg={ocorrenciaId ? 12 : 10}>
          <UeOcorrencia
            form={form}
            onChangeCampos={onChangeCampos}
            desabilitar={desabilitar}
            setListaUes={setListaUes}
            listaUes={listaUes}
            dreCodigo={dreCodigo}
            ocorrenciaId={ocorrenciaId}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <ModalidadeSemestreOcorrencia
          form={form}
          onChangeCampos={onChangeCampos}
          desabilitar={desabilitar}
          dreCodigo={dreCodigo}
          ueCodigo={ueCodigo}
          ocorrenciaId={ocorrenciaId}
        />
        <TurmaOcorrencia
          form={form}
          onChangeCampos={onChangeCampos}
          desabilitar={desabilitar}
          ueCodigo={ueCodigo}
          ocorrenciaId={ocorrenciaId}
        />
      </Row>
      <Row gutter={[16, 16]}>
        <EnvolvidoNaOcorrencia
          form={form}
          onChangeCampos={onChangeCampos}
          desabilitar={desabilitar}
          ueCodigo={ueCodigo}
        />
      </Row>
      <Row gutter={[16, 16]}>
        <DataHoraOcorrencia
          form={form}
          onChangeCampos={onChangeCampos}
          desabilitar={desabilitar}
        />
        <Col sm={24} md={12}>
          <TipoOcorrencia
            form={form}
            onChangeCampos={onChangeCampos}
            desabilitar={desabilitar}
          />
        </Col>
        <Col sm={24}>
          <TituloOcorrencia
            form={form}
            onChangeCampos={onChangeCampos}
            desabilitar={desabilitar}
          />
        </Col>
        <Col sm={24}>
          <DescricaoOcorrencia
            form={form}
            onChangeCampos={onChangeCampos}
            desabilitar={desabilitar}
            initialValues={initialValues}
          />
        </Col>
      </Row>
    </Col>
  );
};

export default FormCadastroOcorrencia;
