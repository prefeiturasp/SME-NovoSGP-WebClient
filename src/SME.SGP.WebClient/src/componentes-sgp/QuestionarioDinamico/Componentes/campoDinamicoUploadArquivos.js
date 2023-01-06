import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { Label, Loader } from '~/componentes';
import UploadArquivos from '~/componentes-sgp/UploadArquivos/uploadArquivos';
import { setArquivoRemovido } from '~/redux/modulos/questionarioDinamico/actions';
import { erros, sucesso } from '~/servicos';
import ColunaDimensionavel from './ColunaDimensionavel/colunaDimensionavel';
import QuestionarioDinamicoFuncoes from '../Funcoes/QuestionarioDinamicoFuncoes';

const CampoDinamicoUploadArquivos = props => {
  const {
    dados,
    desabilitado,
    urlUpload,
    funcaoRemoverArquivoCampoUpload,
    onChange,
  } = props;
  const { form, questaoAtual, label, prefixId } = dados;
  const dispatch = useDispatch();

  const [exibirLoader, setExibirLoader] = useState(false);

  const id = QuestionarioDinamicoFuncoes.gerarId(prefixId, questaoAtual);

  const onRemoveFile = async arquivo => {
    const codigoArquivo = arquivo.xhr;

    if (arquivo.arquivoId) {
      if (
        form &&
        form?.setFieldValue &&
        form?.values?.[questaoAtual?.id]?.length
      ) {
        const dadosAtuais = form?.values?.[questaoAtual?.id];
        const indice = dadosAtuais.findIndex(
          item => arquivo.arquivoId === item.arquivoId
        );

        if (indice !== -1) {
          const novoMap = _.cloneDeep(dadosAtuais);
          novoMap.splice(indice, 1);

          form.setFieldValue(String(questaoAtual?.id), novoMap);
          form.setFieldTouched(String(questaoAtual?.id), true);
          dispatch(setArquivoRemovido(true));
          sucesso(`Arquivo ${arquivo.name} removido com sucesso`);
        }
      }
      onChange();
      return true;
    }
    setExibirLoader(true);
    const resposta = await funcaoRemoverArquivoCampoUpload(
      codigoArquivo
    ).catch(e => erros(e));

    setExibirLoader(false);
    if (resposta && resposta.status === 200) {
      dispatch(setArquivoRemovido(true));
      sucesso(`Arquivo ${arquivo.name} removido com sucesso`);
      onChange();
      return true;
    }
    return false;
  };

  return (
    <ColunaDimensionavel dimensao={questaoAtual?.dimensao}>
      <Loader loading={exibirLoader} tip="Removendo arquivo...">
        <div id={id}>
          {questaoAtual?.nome ? <Label text={label?.props?.text} /> : ''}
          <UploadArquivos
            id={id}
            form={form}
            urlUpload={urlUpload}
            onRemove={onRemoveFile}
            name={String(questaoAtual?.id)}
            onChangeListaArquivos={onChange}
            tiposArquivosPermitidos={questaoAtual.opcionais || ''}
            desabilitarGeral={desabilitado || questaoAtual.somenteLeitura}
            defaultFileList={
              form?.values?.[questaoAtual?.id]?.length
                ? form?.values?.[questaoAtual?.id]
                : []
            }
          />
        </div>
      </Loader>
    </ColunaDimensionavel>
  );
};

CampoDinamicoUploadArquivos.propTypes = {
  dados: PropTypes.oneOfType([PropTypes.object]),
  prefixId: PropTypes.string,
  desabilitado: PropTypes.bool,
  urlUpload: PropTypes.string,
  funcaoRemoverArquivoCampoUpload: PropTypes.func,
  onChange: PropTypes.func,
};

CampoDinamicoUploadArquivos.defaultProps = {
  dados: {},
  prefixId: '',
  desabilitado: false,
  urlUpload: '',
  funcaoRemoverArquivoCampoUpload: () => {},
  onChange: () => {},
};

export default CampoDinamicoUploadArquivos;
