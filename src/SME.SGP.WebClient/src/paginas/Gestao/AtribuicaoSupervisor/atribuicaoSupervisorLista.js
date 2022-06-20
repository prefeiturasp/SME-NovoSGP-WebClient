import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '~/componentes';
import Cabecalho from '~/componentes-sgp/cabecalho';
import RotasDto from '~/dtos/rotasDto';
import { AbrangenciaServico, erros } from '~/servicos';
import ServicoResponsaveis from '~/servicos/Paginas/Gestao/Responsaveis/ServicoResponsaveis';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';
import Button from '../../../componentes/button';
import Card from '../../../componentes/card';
import CheckboxComponent from '../../../componentes/checkbox';
import { Colors } from '../../../componentes/colors';
import SelectComponent from '../../../componentes/select';
import DataTable from '../../../componentes/table/dataTable';
import api from '../../../servicos/api';
import history from '../../../servicos/history';

export default function AtribuicaoSupervisorLista() {
  const [uesSemSupervisorCheck, setUesSemSupervisorCheck] = useState(false);
  const [dresSelecionadas, setDresSelecionadas] = useState('');
  const [supervisoresSelecionados, setSupervisoresSelecionados] = useState([]);
  const [listaDres, setListaDres] = useState([]);
  const [listaSupervisores, setListaSupervisores] = useState([]);
  const [listaUes, setListaUes] = useState([]);
  const [ueSelecionada, setUeSelecionada] = useState([]);
  const [listaFiltroAtribuicao, setListaFiltroAtribuicao] = useState([]);
  const [desabilitarSupervisor, setDesabilitarSupervisor] = useState(false);
  const [desabilitarUe, setDesabilitarUe] = useState(false);
  const [tipoResponsavel, setTipoResponsavel] = useState();
  const [listaTipoResponsavel, setListaTipoResponsavel] = useState([]);
  const [carregandoResponsavel, setCarregandoResponsavel] = useState(false);
  const [carregandoLista, setCarregandoLista] = useState(false);
  
  const usuario = useSelector(store => store.usuario);
  const permissoesTela =
    usuario.permissoes[RotasDto.ATRIBUICAO_RESPONSAVEIS_LISTA];

  const obterDres = useCallback(async () => {
    
    const retorno = await AbrangenciaServico.buscarDres().catch(e => erros(e));

    if (retorno?.data?.length) {
      if (retorno.data.length === 1) {
        const dre = retorno.data[0].codigo;
        setDresSelecionadas(dre);
        carregarUes(dre);
        consultarApi(dre,tipoResponsavel,ueSelecionada,supervisoresSelecionados);
      }
      
      setListaDres(retorno.data);
    } else {
      setListaDres([]);
      setDresSelecionadas();
    }
  }, []);

  useEffect(() => {
    obterDres();
  }, [obterDres]);

  useEffect(() => {
    if (permissoesTela) {
      verificaSomenteConsulta(permissoesTela);
    }
  }, []);

  useEffect(() => {
    if (uesSemSupervisorCheck) {
      montaListaUesSemSup(dresSelecionadas);
    } else {
      setSupervisoresSelecionados([]);
      setUeSelecionada('');
      setDesabilitarSupervisor(false);
      setDesabilitarUe(false);
      onChangeDre(dresSelecionadas);
    }
  }, [uesSemSupervisorCheck]);

  const columns = [
    {
      title: 'DRE',
      width: '10%',
      render: () => {
        const dreSelecionada = listaDres?.find?.(
          d => d?.codigo === dresSelecionadas
        );
        return dreSelecionada?.abreviacao;
      },
    },
    {
      title: 'Unidade Escolar',
      dataIndex: 'escola',
      width: '35%',
    },
    {
      title: 'Tipo de responsável',
      dataIndex: 'tipoResponsavel',
      width: '20%',
      render: text => {
        return text || <a className="texto-vermelho-negrito">NÃO ATRIBUIDO</a>;
      },
    },
    {
      title: 'Responsável',
      dataIndex: 'responsavel',
      width: '35%',
      render: text => {
        return text || <a className="texto-vermelho-negrito">NÃO ATRIBUIDO</a>;
      },
    },
  ];

  function onClickRow(row) {
    if (!permissoesTela.podeAlterar) return;

    console.table(row);     
    onClickEditar(row.responsavelId,row.tipoResponsavelId,row.ueid);
  }

  function onClickVoltar() {
    history.push('/');
  }

  function onClickEditar(responsavelId,tipoResponsavelId,codigoUe) {
    if (!permissoesTela.podeAlterar) return;

    var tipoResp = tipoResponsavel ?? tipoResponsavelId;
    let path = RotasDto.ATRIBUICAO_RESPONSAVEIS;
    if (dresSelecionadas) {
      path = `${path}/${dresSelecionadas}`;
      if (responsavelId && tipoResp && codigoUe) {
        path = `${path}/${responsavelId}/${tipoResp}/${codigoUe}`;
      }
      else if (!responsavelId && tipoResp && !codigoUe) {
        path = `${path}/${tipoResp}`;
      }
      else if(!responsavelId && tipoResp && codigoUe){
        path = `${path}/${tipoResp}/${codigoUe}`;
      }
    }

    history.push(path);
  }

  function onClickNovaAtribuicao() {
    if (!permissoesTela.podeIncluir) return;

    if (dresSelecionadas && !tipoResponsavel) {
      history.push(`${RotasDto.ATRIBUICAO_RESPONSAVEIS}/${dresSelecionadas}/`);
    } else if (dresSelecionadas && tipoResponsavel) {
      history.push(
        `${RotasDto.ATRIBUICAO_RESPONSAVEIS}/${dresSelecionadas}/${tipoResponsavel}/`
      );
    } else {
      history.push(RotasDto.ATRIBUICAO_RESPONSAVEIS);
    }
  }

  function onChangeUesSemSup(e) {
    if (e.target.checked) {
      setUesSemSupervisorCheck(true);
    } else {
      setUesSemSupervisorCheck(false);
    }
  }
  async function montaListaUesSemSup(dre) {
    
    setSupervisoresSelecionados([]);
    setUeSelecionada('');
    setDesabilitarSupervisor(true);
    setDesabilitarUe(true);
    consultarApi(dre,tipoResponsavel,ueSelecionada,supervisoresSelecionados);
  }

  const onChangeDre = useCallback(async (dre, changeUe,chamarApi=true) => {
    
    if (!changeUe) {
      setListaSupervisores([]);
      setSupervisoresSelecionados([]);
    }
    setListaUes([]);
    setUeSelecionada('');
    if (dre) {
      if(chamarApi)
        consultarApi(dre,tipoResponsavel,ueSelecionada,supervisoresSelecionados);
    } else {
      setListaFiltroAtribuicao([]);
      setUesSemSupervisorCheck(false);
    }

    setDresSelecionadas(dre);
    if (dre) {
      obterResponsaveis(dre);
      carregarUes(dre);
    }

  }, []);

function montarListaAtribuicao(lista) {
  console.table(lista);        
    if (lista?.length) {
      const dadosAtribuicao = [];           
      lista.forEach(item => {
       dadosAtribuicao.push({
        id : item.id,
        escola: item.ueNome,
        responsavel: item.responsavelId ? item.responsavel : '',
        tipoResponsavel: item.tipoResponsavel,
        tipoResponsavelId: item.tipoResponsavelId,
        ueid : item.ueid
      });
      });
      console.table(dadosAtribuicao);        
      setListaFiltroAtribuicao(dadosAtribuicao);      
    } else {
      setListaFiltroAtribuicao([]);
    }
  }

  async function carregarUes(dre) {
    
    const ues = await api.get(`/v1/abrangencias/false/dres/${dre}/ues`);
    if (ues.data) {
      setListaUes(ues.data);
    } else {
      setListaUes([]);
    }
  }

  async function onChangeSupervisores(sup) {
    
    setUesSemSupervisorCheck(false);
    if (sup && sup.length) {
      setDesabilitarUe(true);
      setUeSelecionada([]);
      setSupervisoresSelecionados(sup);
    } else {
      setSupervisoresSelecionados([]);
      setDesabilitarUe(false);
      setUeSelecionada([]);
      setListaFiltroAtribuicao([]);
    }
    consultarApi(dresSelecionadas,tipoResponsavel,ueSelecionada,sup.toString(),uesSemSupervisorCheck);
  }

  async function onChangeUes(ue) {
    
    if (ue) {
      setDesabilitarSupervisor(true);
      setSupervisoresSelecionados([]);
      setUeSelecionada(ue);
    } else {
      setUeSelecionada('');
      setDesabilitarSupervisor(false);
      onChangeDre(dresSelecionadas, true,false);
    }
    consultarApi(dresSelecionadas,tipoResponsavel,ue,supervisoresSelecionados,uesSemSupervisorCheck);
  }

  const onChangeTipoResponsavel = async valor => {
    
    if(valor==null){
      setUesSemSupervisorCheck(false);
    }
    setSupervisoresSelecionados();
    setListaSupervisores([]);
    setListaFiltroAtribuicao([]);
    setTipoResponsavel(valor);
    consultarApi(dresSelecionadas,valor,ueSelecionada,supervisoresSelecionados,uesSemSupervisorCheck);  
  };

  async function consultarApi(dre,codigoTipo,ue,supervisor){
    setCarregandoLista(true);  
    await api.get('/v1/supervisores/vinculo-lista', {
      params: {
        dreCodigo: dre,
        tipoCodigo: codigoTipo,
        ueCodigo: ue,
        supervisorId: supervisor,
        ueSemResponsavel: uesSemSupervisorCheck
      },
    }).then(dados => {
      montarListaAtribuicao(dados.data);
      setCarregandoLista(false);  
    });
  }
  const obterTipoResponsavel = useCallback(async () => {
    
    const resposta = await ServicoResponsaveis.obterTipoReponsavel().catch(e =>
      erros(e)
    );

    if (resposta?.data?.length) {
      if (resposta?.data?.length === 1) {
        setTipoResponsavel(resposta.data[0].descricao);
      }

      setListaTipoResponsavel(resposta.data);
    } else {
      setListaTipoResponsavel([]);
    }
  }, []);

  useEffect(() => {
    if (dresSelecionadas) {
      obterTipoResponsavel();
    } else {
     setTipoResponsavel();
      setListaTipoResponsavel([]);
    }
  }, [dresSelecionadas, obterTipoResponsavel]);

  const obterResponsaveis = useCallback(
    async dre => {
      
      if (!dre || !tipoResponsavel) return;

      setCarregandoResponsavel(true);
      const resposta = await ServicoResponsaveis.obterResponsaveis(
        dre || dresSelecionadas,
        tipoResponsavel
      )
        .catch(e => erros(e))
        .finally(() =>{
          setCarregandoResponsavel(false);
        });

      if (resposta?.data?.length) {
        const lista = resposta.data.map(item => {
          return {
            ...item,
            descricaoCodigo: `${item?.supervisorNome} - ${item?.supervisorId}`,
          };
        });
        setListaSupervisores(lista);
      } else {
        setListaSupervisores([]);
      }
    },
    [dresSelecionadas, tipoResponsavel]
  );

  useEffect(() => {
    
    if (tipoResponsavel && dresSelecionadas) {
      obterResponsaveis(dresSelecionadas);
    } else {
      setSupervisoresSelecionados();
      setListaSupervisores([]);
    }
  }, [dresSelecionadas, tipoResponsavel, obterResponsaveis]);

  return (
    <>
      <Cabecalho pagina="Atribuição de responsáveis" />
      <Card>
        <div className="col-md-12 d-flex justify-content-end pb-4">
          <Button
            label="Voltar"
            icon="arrow-left"
            color={Colors.Azul}
            border
            className="mr-2"
            onClick={onClickVoltar}
          />
          <Button
            label="Nova Atribuição"
            color={Colors.Roxo}
            border
            bold
            disabled={!permissoesTela?.podeIncluir}
            className="mr-2"
            onClick={onClickNovaAtribuicao}
          />
        </div>

        <div className="col-md-12 pb-2">
          <CheckboxComponent
            className="mb-2"
            label="Exibir apenas UEs sem responsável"
            onChangeCheckbox={onChangeUesSemSup}
            disabled={
              carregandoLista || carregandoResponsavel ||
              !dresSelecionadas ||
              !tipoResponsavel ||
              !permissoesTela?.podeConsultar ||
              supervisoresSelecionados?.length > 0
            }
            checked={uesSemSupervisorCheck}
          />
        </div>
        <div className="col-sm-12 col-md-6 pb-2">
          <SelectComponent
            label="Diretoria Regional de Educação (DRE)"
            name="dres-atribuicao-sup"
            id="dres-atribuicao-sup"
            lista={listaDres}
            valueOption="codigo"
            valueText="nome"
            onChange={onChangeDre}
            valueSelect={dresSelecionadas}
            placeholder="Diretoria Regional de Educação (DRE)"
            disabled={carregandoLista || carregandoResponsavel || listaDres?.length === 1 || !permissoesTela.podeConsultar}
            allowClear={false}
            showSearch
          />
        </div>
        <div className="col-sm-12 col-md-6 pb-2">
          <SelectComponent
            id="SGP_SELECT_TIPO_RESPONSAVEL"
            label="Tipo de responsável"
            lista={listaTipoResponsavel}
            valueOption="codigo"
            valueText="descricao"
            disabled={
              carregandoLista ||
              carregandoResponsavel ||
              !dresSelecionadas ||
              listaTipoResponsavel?.length === 1 ||
              !permissoesTela?.podeConsultar
            }
            onChange={onChangeTipoResponsavel}
            valueSelect={tipoResponsavel}
            placeholder="Tipo de responsável"
            showSearch
          />
        </div>
        <div className="col-md-12 pb-2">
          <Loader loading={carregandoResponsavel} ignorarTip>
            <SelectComponent
              label="Responsável"
              name="supervisores-list"
              id="supervisores-list"
              lista={listaSupervisores}
              valueOption="supervisorId"
              valueText="descricaoCodigo"
              onChange={onChangeSupervisores}
              valueSelect={supervisoresSelecionados}
              multiple
              placeholder="SELECIONE O RESPONSÁVEL"
              disabled={
                carregandoLista ||
                carregandoResponsavel ||
                !tipoResponsavel ||
                desabilitarSupervisor ||
                !permissoesTela.podeConsultar
              }
              showSearch
            />
          </Loader>
        </div>
        <div className="col-sm-12 col-md-6 pb-2">
          <SelectComponent
            label="Unidade Escolar (UE)"
            className="col-md-12"
            name="ues-list"
            id="ues-list"
            lista={listaUes}
            valueOption="codigo"
            valueText="nome"
            onChange={onChangeUes}
            valueSelect={ueSelecionada || []}
            placeholder="Unidade Escolar (UE)"
            disabled={
              carregandoLista || carregandoResponsavel ||  !dresSelecionadas || !permissoesTela.podeConsultar
            }
          />
        </div>

        <div className="col-md-12 pt-4">
          <Loader loading={carregandoLista}>
          <DataTable
            onClickRow={permissoesTela.podeAlterar && onClickRow}
            columns={columns}
            dataSource={listaFiltroAtribuicao}
            semHover
          />
          </Loader>
        </div>
      </Card>
    </>
  );
}
