import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Colors } from '~/componentes';
import { erros, sucesso } from '~/servicos';
import {
  setDadosAtribuicaoResponsavel,
  setPlanoAEEDados,
} from '~/redux/modulos/planoAEE/actions';
import ServicoPlanoAEE from '~/servicos/Paginas/Relatorios/AEE/ServicoPlanoAEE';
import SelectComponent from '~/componentes/select';

const AddResponsavelCadastroPlano = props => {
  const { codigoUeNovo } = props;
  const paramsRota = useParams();

  const [responsavelSelecionado, setResponsavelSelecionado] = useState();
  const [responsavelAlterado, setResponsavelAlterado] = useState(false);

  const dispatch = useDispatch();

  const planoAEEDados = useSelector(store => store.planoAEE.planoAEEDados);

  const typePlanoAEECadastro = useSelector(
    store => store.planoAEE.typePlanoAEECadastro
  );

  const desabilitarCamposPlanoAEE = useSelector(
    store => store.planoAEE.desabilitarCamposPlanoAEE
  );

  const [responsaveisPAAI, setResponsaveisPAAI] = useState([]);

  const obterResponsaveisPAAI = async () => {
    const codigoUe = codigoUeNovo
      ? codigoUeNovo
      : planoAEEDados?.turma?.codigoUE;

    const resposta = await ServicoPlanoAEE.obterResponsavelPlanoPAAI(codigoUe);
    const newRes = { ...resposta };

    for (let el = 0; el < resposta.data.length; el++) {
      const newNomeServidor = `${newRes.data[el].nomeServidor} - ${newRes.data[el].codigoRF}`;

      newRes.data[el].nomeServidor = newNomeServidor;
    }

    if (newRes.data.length === 1) {
      setResponsavelSelecionado(newRes.data[0]);
    }

    setResponsaveisPAAI(newRes.data);
  };

  useEffect(() => {
    obterResponsaveisPAAI();
  }, []);

  const onChangeLocalizador = (codigoResponsavelRF, obj) => {
    const { title } = obj.props;
    if (codigoResponsavelRF && title) {
      const params = {
        codigoRF: codigoResponsavelRF,
        nomeServidor: title,
      };
      dispatch(setDadosAtribuicaoResponsavel(params));
      if (!desabilitarCamposPlanoAEE) setResponsavelSelecionado(params);
    } else {
      dispatch(setDadosAtribuicaoResponsavel());
      setResponsavelSelecionado();
    }

    if (!desabilitarCamposPlanoAEE) setResponsavelAlterado(!!obj);
  };

  const onClickAtribuirResponsavel = async () => {
    const resposta = await ServicoPlanoAEE.atribuirResponsavelPlano().catch(e =>
      erros(e)
    );
    if (resposta?.data) {
      sucesso('Atribuição do responsável realizada com sucesso');
      planoAEEDados.responsavel = {
        ...planoAEEDados.responsavel,
        responsavelRF: responsavelSelecionado?.codigoRF,
        responsavelNome: responsavelSelecionado?.nomeServidor,
      };
      dispatch(setPlanoAEEDados(planoAEEDados));
      setResponsavelAlterado(false);
    }
  };

  const onClickCancelar = () => {
    dispatch(setDadosAtribuicaoResponsavel({}));
    setResponsavelAlterado(false);
    setTimeout(() => {
      if (planoAEEDados?.responsavel) {
        setResponsavelSelecionado({
          codigoRF: planoAEEDados?.responsavel?.responsavelRF,
          nomeServidor: planoAEEDados?.responsavel?.responsavelNome,
        });
      }
    }, 500);
  };

  return (
    <>
      <p>Atribuir responsável:</p>
      <div className="col-md-12 mb-2">
        <SelectComponent
          label="PAAIS DRE"
          valueOption="codigoRF"
          valueText="nomeServidor"
          lista={responsaveisPAAI}
          showSearch
          valueSelect={responsavelSelecionado?.codigoRF}
          className
          onChange={onChangeLocalizador}
          allowClear={false}
          searchValue
          desabilitado={desabilitarCamposPlanoAEE || !paramsRota?.id}
        />
      </div>
      <div className="col-12 d-flex justify-content-end pb-4 mt-2 pr-0">
        <Button
          id="btn-cancelar"
          label="Cancelar"
          color={Colors.Roxo}
          border
          className="mr-3"
          onClick={onClickCancelar}
          disabled={
            desabilitarCamposPlanoAEE ||
            !responsavelAlterado ||
            typePlanoAEECadastro
          }
        />
        <Button
          id="btn-atribuir"
          label="Atribuir responsável"
          color={Colors.Roxo}
          border
          bold
          onClick={onClickAtribuirResponsavel}
          disabled={
            desabilitarCamposPlanoAEE ||
            !responsavelAlterado ||
            (responsavelAlterado && !responsavelSelecionado?.codigoRF) ||
            !responsavelSelecionado?.codigoRF ||
            typePlanoAEECadastro
          }
        />
      </div>
    </>
  );
};

export default AddResponsavelCadastroPlano;
